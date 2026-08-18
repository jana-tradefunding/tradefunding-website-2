// Same-origin enforcement shared by every Connect serverless endpoint.
// Extracted from connect/api/form-token.js and connect/api/request-call.js
// (Phase 7 §10.4 item 3) - identical logic was previously duplicated in
// both files.

const ALLOWED_ORIGINS = new Set([
  'https://connect.tradefunding.com.au',
  'https://vendor-landing-ruby.vercel.app',
  // Commercial's real production origin (plan.md 8.5 / broker-lead.js) —
  // needed now that /api/form-token and /api/broker-lead are called from
  // commercial/broker-portal.html too. Commercial's own canonical tags are
  // inconsistent between bare and www (5 pages vs 8) — both included.
  'https://tradefunding.com.au',
  'https://www.tradefunding.com.au'
]);

export function fromAllowedOrigin(req) {
  const origin = req.headers['origin'] || '';
  const referer = req.headers['referer'] || '';
  return ALLOWED_ORIGINS.has(origin) ||
    [...ALLOWED_ORIGINS].some(o => referer.startsWith(o + '/') || referer === o);
}
