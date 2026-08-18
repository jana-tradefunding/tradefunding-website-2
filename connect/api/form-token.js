// Issues a short-lived signed token for the request-call form.
// Token format: `<timestamp>.<nonce>.<hmac>` (base64url-safe)
// Token must be presented back in /api/request-call to prove the submission
// came from a real page load (not a direct API hit).

import { fromAllowedOrigin } from './_lib/origin-check.js';
import { issueToken } from './_lib/form-token.js';

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
  if (!fromAllowedOrigin(req)) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const token = issueToken(secret);

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({ token });
}
