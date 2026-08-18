// Signed short-lived token issuance/verification shared by every Connect
// serverless endpoint. Extracted from connect/api/form-token.js (issuance)
// and connect/api/request-call.js (verification) - Phase 7 §10.4 item 3.
// Token format: `<timestamp>.<nonce>.<hmac>` (base64url-safe). Token must
// be presented back to /api/request-call to prove the submission came
// from a real page load (not a direct API hit).

import crypto from 'node:crypto';

const TOKEN_MIN_AGE_MS = 3000;             // submissions under 3s = bot
const TOKEN_MAX_AGE_MS = 30 * 60 * 1000;   // tokens expire after 30 min

export function issueToken(secret) {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(12).toString('base64url');
  const payload = `${timestamp}.${nonce}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${hmac}`;
}

export function verifyToken(token, secret) {
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
