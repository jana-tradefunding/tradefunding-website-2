// Same-origin enforcement shared by every Connect serverless endpoint.
// Extracted from connect/api/form-token.js and connect/api/request-call.js
// (Phase 7 §10.4 item 3) - identical logic was previously duplicated in
// both files.

const ALLOWED_ORIGINS = new Set([
  'https://connect.tradefunding.com.au',
  'https://vendor-landing-ruby.vercel.app'
]);

export function fromAllowedOrigin(req) {
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  return ALLOWED_ORIGINS.has(origin) ||
    [...ALLOWED_ORIGINS].some(o => referer.startsWith(o + '/') || referer === o);
}
