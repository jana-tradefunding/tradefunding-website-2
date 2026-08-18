// Cloudflare Turnstile server-side verification, shared by every Connect
// serverless endpoint that needs a real anti-abuse check — not just a
// spoofable header (Phase 7 §10.3 item 2, security-audit Finding 1,
// High). Runs alongside — not instead of — the Origin/Referer check in
// origin-check.js: Origin/Referer are attacker-controlled outside a
// browser context, so that check alone stops nothing from a scripted
// client (see Finding 1's curl example). Turnstile validates
// server-side with a secret the attacker never sees.
//
// Requires TURNSTILE_SECRET_KEY — see connect/.env.example.
//
// FRONT-END FOLLOW-UP NOT DONE BY THIS CHANGE: connect/index.html's
// request-call form has no Turnstile widget/script yet, so no real
// turnstile_token is ever produced client-side. Until that widget is
// added (with a Turnstile Site Key — public, not a secret, embedded
// directly in the widget markup) and scripts/form.js is wired to send
// its token, every call into this module gets an empty token and fails
// closed. Do not deploy this backend change ahead of that front-end
// change — it will silently reject all real form-token and
// request-call submissions.

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstileToken(token, { secret, remoteIp } = {}) {
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY not configured');
    return false;
  }
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body });
    if (!res.ok) return false;
    const data = await res.json();
    return data.success === true;
  } catch (err) {
    console.error('Turnstile verification request failed', err);
    return false;
  }
}
