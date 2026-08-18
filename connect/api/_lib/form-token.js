// Signed short-lived token issuance/verification shared by every Connect
// serverless endpoint. Extracted from connect/api/form-token.js (issuance)
// and connect/api/request-call.js (verification) - Phase 7 §10.4 item 3.
// Token format: `<key-version>.<timestamp>.<nonce>.<hmac>` (base64url-safe).
// Token must be presented back to /api/request-call (or /api/broker-lead)
// to prove the submission came from a real page load (not a direct API
// hit).
//
// The key-version prefix (Phase 7 §10.3 item 5, security-audit Finding 4,
// Low) exists so FORM_TOKEN_SECRET can be rotated without breaking
// in-flight tokens: when that day comes, introduce FORM_TOKEN_SECRET_V2,
// bump CURRENT_KEY_VERSION to 'v2', and have verifyToken accept 'v1'
// tokens against the old secret for up to TOKEN_MAX_AGE_MS past the
// cutover before dropping v1 support. Not built out yet since there's
// only one secret/version today - no rotation to migrate between.

import crypto from 'node:crypto';

const CURRENT_KEY_VERSION = 'v1';
const TOKEN_MIN_AGE_MS = 3000;             // submissions under 3s = bot
const TOKEN_MAX_AGE_MS = 30 * 60 * 1000;   // tokens expire after 30 min

export function issueToken(secret) {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(12).toString('base64url');
  const payload = `${timestamp}.${nonce}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${CURRENT_KEY_VERSION}.${payload}.${hmac}`;
}

export function verifyToken(token, secret) {
  if (typeof token !== 'string' || !token) return { valid: false, reason: 'missing' };
  const parts = token.split('.');
  if (parts.length !== 4) return { valid: false, reason: 'malformed' };
  const [keyVersion, timestampStr, nonce, providedHmac] = parts;

  if (keyVersion !== CURRENT_KEY_VERSION) {
    return { valid: false, reason: 'unsupported_key_version' };
  }

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
