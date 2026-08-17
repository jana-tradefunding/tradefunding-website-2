// Trade Funding Connect vendor-landing — Request-a-call form handler
// Sends enquiry to support@tradefunding.com.au via Resend + Slack webhook.
// Env vars required:
//   RESEND_API_KEY        — Resend API key (re: vendor-portal)
//   FORM_TOKEN_SECRET     — HMAC signing key for /api/form-token
//   SLACK_WEBHOOK_URL     — Incoming webhook for the Trade Funding Connect enquiries channel
//   LEAD_EMAIL_TO         — Defaults to support@tradefunding.com.au
//   LEAD_EMAIL_FROM       — Defaults to "Trade Funding Connect Enquiries <noreply@tradefunding.au>"

import crypto from 'node:crypto';

const ALLOWED_ORIGINS = new Set([
  'https://connect.tradefunding.com.au',
  'https://vendor-landing-ruby.vercel.app'
]);
const MAX_BODY_BYTES = 4096;
const HOURLY_LIMIT = 3;
const DAILY_LIMIT = 10;
const TOKEN_MIN_AGE_MS = 3000;             // submissions under 3s = bot
const TOKEN_MAX_AGE_MS = 30 * 60 * 1000;   // tokens expire after 30 min
const ipBuckets = new Map();

function verifyToken(token, secret) {
  if (typeof token !== 'string' || !token) return { valid: false, reason: 'missing' };
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'malformed' };
  const [timestampStr, nonce, providedHmac] = parts;
  const timestamp = Number(timestampStr);
  if (!Number.isFinite(timestamp)) return { valid: false, reason: 'malformed' };

  const expected = crypto.createHmac('sha256', secret)
    .update(`${timestampStr}.${nonce}`)
    .digest('base64url');

  // Constant-time compare to avoid timing attacks
  const a = Buffer.from(providedHmac);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return { valid: false, reason: 'bad_signature' };
  }

  const age = Date.now() - timestamp;
  if (age < TOKEN_MIN_AGE_MS) return { valid: false, reason: 'too_fast' };
  if (age > TOKEN_MAX_AGE_MS) return { valid: false, reason: 'expired' };
  return { valid: true };
}

function checkRateLimit(ip) {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  let bucket = ipBuckets.get(ip);
  if (!bucket) {
    bucket = { hour: { count: 0, resetAt: now + HOUR }, day: { count: 0, resetAt: now + DAY } };
  }
  if (now > bucket.hour.resetAt) { bucket.hour.count = 0; bucket.hour.resetAt = now + HOUR; }
  if (now > bucket.day.resetAt) { bucket.day.count = 0; bucket.day.resetAt = now + DAY; }
  bucket.hour.count += 1;
  bucket.day.count += 1;
  ipBuckets.set(ip, bucket);
  return bucket.hour.count <= HOURLY_LIMIT && bucket.day.count <= DAILY_LIMIT;
}

function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

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
  const sell = trim(payload.sell);
  const volume = trim(payload.volume);
  const message = trim(payload.message);

  if (name.length < 2) errors.push('name');
  if (business.length < 2) errors.push('business');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');
  if (!/^[\d\s+()\-]{8,}$/.test(phone)) errors.push('phone');
  if (sell.length < 2) errors.push('sell');

  return { errors, clean: { name, business, email, phone, sell, volume, message } };
}

async function sendEmail({ clean }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');

  const to = process.env.LEAD_EMAIL_TO || 'support@tradefunding.com.au';
  const from = process.env.LEAD_EMAIL_FROM || 'Trade Funding Connect Enquiries <noreply@tradefunding.au>';

  const html = `
    <h2 style="font-family:system-ui,sans-serif;color:#001D43;">New Trade Funding Connect enquiry</h2>
    <table cellpadding="6" style="font-family:system-ui,sans-serif;border-collapse:collapse;">
      <tr><td><strong>Name</strong></td><td>${escapeHtml(clean.name)}</td></tr>
      <tr><td><strong>Business</strong></td><td>${escapeHtml(clean.business)}</td></tr>
      <tr><td><strong>Email</strong></td><td><a href="mailto:${escapeHtml(clean.email)}">${escapeHtml(clean.email)}</a></td></tr>
      <tr><td><strong>Phone</strong></td><td>${escapeHtml(clean.phone)}</td></tr>
      <tr><td><strong>What they sell</strong></td><td>${escapeHtml(clean.sell)}</td></tr>
      <tr><td><strong>Monthly volume</strong></td><td>${escapeHtml(clean.volume || '—')}</td></tr>
      <tr><td valign="top"><strong>Message</strong></td><td>${escapeHtml(clean.message || '—').replaceAll('\n', '<br/>')}</td></tr>
    </table>
    <p style="color:#666;font-size:12px;margin-top:24px;">Source: connect.tradefunding.com.au</p>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: clean.email,
      subject: `New Trade Funding Connect enquiry: ${clean.name} (${clean.business})`,
      html
    })
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Resend failed: ${res.status} ${body}`);
  }
}

async function sendSlack({ clean }) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return; // optional — don't fail if Slack not configured

  const text = [
    `*New Trade Funding Connect enquiry*`,
    `*Name:* ${clean.name}`,
    `*Business:* ${clean.business}`,
    `*Email:* ${clean.email}`,
    `*Phone:* ${clean.phone}`,
    `*Sells:* ${clean.sell}`,
    `*Monthly volume:* ${clean.volume || '—'}`,
    clean.message ? `*Message:* ${clean.message}` : null,
    `_Source: connect.tradefunding.com.au_`
  ].filter(Boolean).join('\n');

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
}

export default async function handler(req, res) {
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
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  const fromAllowed = ALLOWED_ORIGINS.has(origin) ||
    [...ALLOWED_ORIGINS].some(o => referer.startsWith(o + '/') || referer === o);
  if (!fromAllowed) {
    return res.status(403).json({ error: 'forbidden' });
  }

  // Body size guard — Vercel parses JSON already, but check payload shape isn't oversized
  const rawSize = JSON.stringify(req.body || {}).length;
  if (rawSize > MAX_BODY_BYTES) {
    return res.status(413).json({ error: 'payload_too_large' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (!checkRateLimit(ip)) {
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
    await sendEmail({ clean });
    await sendSlack({ clean }).catch(err => console.error('Slack notify failed', err));
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Form submission failed', err);
    return res.status(500).json({ error: 'send_failed' });
  }
}
