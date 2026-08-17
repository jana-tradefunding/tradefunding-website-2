// Issues a short-lived signed token for the request-call form.
// Token format: `<timestamp>.<nonce>.<hmac>` (base64url-safe)
// Token must be presented back in /api/request-call to prove the submission
// came from a real page load (not a direct API hit).

import crypto from 'node:crypto';

const ALLOWED_ORIGINS = new Set([
  'https://connect.tradefunding.com.au',
  'https://vendor-landing-ruby.vercel.app'
]);

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method_not_allowed' });
  }

  const secret = process.env.FORM_TOKEN_SECRET;
  if (!secret) {
    console.error('FORM_TOKEN_SECRET not configured');
    return res.status(500).json({ error: 'misconfigured' });
  }

  // Origin check — token endpoint only callable from our site
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  const fromAllowed = ALLOWED_ORIGINS.has(origin) ||
    [...ALLOWED_ORIGINS].some(o => referer.startsWith(o + '/') || referer === o);
  if (!fromAllowed) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const timestamp = Date.now();
  const nonce = crypto.randomBytes(12).toString('base64url');
  const payload = `${timestamp}.${nonce}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  const token = `${payload}.${hmac}`;

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ token });
}
