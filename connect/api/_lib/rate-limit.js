// Per-IP rate limiter shared by every Connect serverless endpoint.
// Extracted unchanged from connect/api/request-call.js (Phase 7 §10.4
// item 3) so it has one home instead of being re-duplicated per handler.
//
// Upstash Redis-backed sliding-window limiter (Phase 7 §10.3 item 1,
// security-audit Finding 2, Critical). Replaces the old in-memory Map,
// which didn't enforce limits across Vercel's stateless, per-instance
// serverless runtime — each warm lambda instance got its own Map, so
// an attacker spread across instances (or triggering cold starts)
// wasn't limited. Every instance now shares the same counts via Redis.
//
// Requires UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN — see
// connect/.env.example.

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const hourlyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'connect:rate-limit:hour',
});

const dailyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 d'),
  prefix: 'connect:rate-limit:day',
});

export async function checkRateLimit(ip) {
  const [hourly, daily] = await Promise.all([
    hourlyLimiter.limit(ip),
    dailyLimiter.limit(ip),
  ]);
  return hourly.success && daily.success;
}
