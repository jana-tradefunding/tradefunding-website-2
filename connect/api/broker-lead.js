// Trade Funding Commercial — Broker Portal "Partner with us" form handler
// Sends enquiry to support@tradefunding.com.au via Resend + Slack webhook.
// Mirrors connect/api/request-call.js's anti-abuse stack exactly (plan.md
// 8.5, security-audit-report.md Finding 5) — reuses the same shared _lib/
// modules rather than re-implementing them (CLAUDE.md rule 21).
// sendEmail/sendSlack below are duplicated from request-call.js for now;
// extracting both into _lib/notify.js is Phase 8.6, immediately after this.
// Env vars required: same as request-call.js — see connect/.env.example.

import { fromAllowedOrigin } from './_lib/origin-check.js';
import { verifyToken } from './_lib/form-token.js';
import { checkRateLimit } from './_lib/rate-limit.js';
import { verifyTurnstileToken } from './_lib/turnstile.js';
import { escapeHtml } from './_lib/html-escape.js';

const MAX_BODY_BYTES = 4096;

const TRIM_MAX = 500;
function trim(v) {
  return String(v || '').trim().slice(0, TRIM_MAX);
}

function validate(payload) {
  const errors = [];
  const name = trim(payload.name);
  const business = trim(payload.business);
  const email = trim(payload.email);
  const phone = trim(payload.phone);

  if (name.length < 2) errors.push('name');
  if (business.length < 2) errors.push('business');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
  if (!/^[\d\s+()\-]{8,}$/.test(phone)) errors.push('phone');

  return { errors, clean: { name, business, email, phone } };
}

async function sendEmail({ clean, config }) {
  if (!config.resendApiKey) throw new Error('RESEND_API_KEY not configured');

  const to = config.leadEmailTo;
  const from = config.leadEmailFrom;

  const html = `
    <h2 style="font-family:system-ui,sans-serif;color:#001D43;">New Broker Portal enquiry</h2>
    <table cellpadding="6" style="font-family:system-ui,sans-serif;border-collapse:collapse;">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(clean.name)}</td></tr>
      <tr><td><strong>Business / Brokerage</strong></td><td>${escapeHtml(clean.business)}</td></tr>
      <tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(clean.email)}">${escapeHtml(clean.email)}</a></td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(clean.phone)}</td></tr>
    </table>
    <p style="color:#666;font-size:12px;margin-top:24px;">Source: tradefunding.com.au/broker-portal</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: clean.email,
      subject: `New Broker Portal enquiry: ${clean.name} (${clean.business})`,
      html
    })
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend failed: ${res.status} ${body}`);
  }
}

async function sendSlack({ clean, config }) {
  if (!config.slackWebhookUrl) return; // optional — don't fail if Slack not configured

  const text = [
    `*New Broker Portal enquiry*`,
    `*Name:* ${clean.name}`,
    `*Business:* ${clean.business}`,
    `*Email:* ${clean.email}`,
    `*Phone:* ${clean.phone}`,
    `_Source: tradefunding.com.au/broker-portal_`
  ].join('\n');

  await fetch(config.slackWebhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
}

export default async function handler(req, res) {
  const config = {
    resendApiKey: process.env.RESEND_API_KEY,
    leadEmailTo: process.env.LEAD_EMAIL_TO || 'support@tradefunding.com.au',
    leadEmailFrom: process.env.LEAD_EMAIL_FROM || 'Trade Funding Connect Enquiries <noreply@tradefunding.au>',
    slackWebhookUrl: process.env.SLACK_WEBHOOK_URL
  };

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  // Block obvious non-browser traffic
  const ua = req.headers['user-agent'] || '';
  if (!ua || ua.length < 10) {
    return res.status(403).json({ error: 'forbidden' });
  }

  // Same-origin enforcement — drop submissions from other domains
  if (!fromAllowedOrigin(req)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';

  // Turnstile — real anti-abuse check the Origin/Referer check above
  // can't provide on its own (security-audit Finding 1, High)
  const captchaOk = await verifyTurnstileToken((req.body || {}).turnstile_token, {
    secret: process.env.TURNSTILE_SECRET_KEY,
    remoteIp: ip
  });
  if (!captchaOk) {
    return res.status(403).json({ error: 'captcha_failed' });
  }

  // Body size guard — Vercel parses JSON already, but check payload shape isn't oversized
  const rawSize = JSON.stringify(req.body || {}).length;
  if (rawSize > MAX_BODY_BYTES) {
    return res.status(413).json({ error: 'payload_too_large' });
  }

  if (!(await checkRateLimit(ip))) {
    return res.status(429).json({ error: 'rate_limited' });
  }

  const payload = req.body || {};

  // Honeypot — bots fill hidden fields
  if (trim(payload.hp_token)) {
    return res.status(200).json({ ok: true }); // silent success for bots
  }

  // Form-token check — proves submission came from a real page load
  const secret = process.env.FORM_TOKEN_SECRET;
  if (!secret) {
    console.error('FORM_TOKEN_SECRET not configured');
    return res.status(500).json({ error: 'misconfigured' });
  }
  const tokenCheck = verifyToken(payload.form_token, secret);
  if (!tokenCheck.valid) {
    // Silent 200 for too-fast / expired so attackers can't probe limits
    if (tokenCheck.reason === 'too_fast' || tokenCheck.reason === 'expired') {
      return res.status(200).json({ ok: true });
    }
    return res.status(403).json({ error: 'invalid_token' });
  }

  const { errors, clean } = validate(payload);
  if (errors.length) {
    return res.status(400).json({ error: 'validation_failed', fields: errors });
  }

  try {
    await sendEmail({ clean, config });
    await sendSlack({ clean, config }).catch(err => console.error('Slack notify failed', err));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Broker Portal form submission failed', err);
    return res.status(500).json({ error: 'send_failed' });
  }
}
