// Per-IP rate limiter shared by every Connect serverless endpoint.
// Extracted unchanged from connect/api/request-call.js (Phase 7 §10.4
// item 3) so it has one home instead of being re-duplicated per handler.
//
// STUB - this in-memory Map doesn't actually enforce limits across
// Vercel's stateless, per-instance serverless runtime (security-audit
// report, Critical #1): each warm lambda instance gets its own Map, so
// an attacker spread across instances isn't limited. The real fix is a
// Upstash Redis-backed sliding-window limiter, landing in Prompt 7.6
// (plan.md §10.3 item 1). Left as-is here since this extraction is a
// pure move, not a behavior change.

const HOURLY_LIMIT = 3;
const DAILY_LIMIT = 10;
const ipBuckets = new Map();

export function checkRateLimit(ip) {
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
