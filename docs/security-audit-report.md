# Security Vulnerability Audit — Trade Funding Website

**Scope reviewed:** `tradefunding-website-2/` (commercial, connect, personal-and-property channels, plus the two Vercel serverless functions in `connect/api/`)
**Reviewer role:** Senior Security Engineer
**Date of review:** 2026-08-18

## 0. Context and honest framing

This is a **static HTML/CSS/JS marketing site** with exactly two server-side endpoints (`connect/api/form-token.js` and `connect/api/request-call.js`, both Vercel serverless functions). There is **no database, no user authentication, no session system, and no server-rendered templating** anywhere in the reviewed tree. This materially changes the shape of the audit:

- Classic **SQL/NoSQL injection** does not apply — there is no query layer, ORM, or database driver anywhere in the codebase (confirmed: no `pg`, `mongodb`, `mysql`, `prisma`, `knex`, or raw SQL/query-string construction in any file).
- Classic **IDOR** (Insecure Direct Object Reference) does not apply in the traditional sense — there are no numeric/UUID resource identifiers, user records, or `GET /resource/:id` patterns to manipulate. The closest analog (form-token replay) is covered below.
- **Authentication bypass** does not apply — there is no login system. `commercial/broker-portal.html` explicitly stubs out an "Aggregator login" section as `[BLOCKED - NEEDS: aggregator-login details for app.tradefunding.com.au]`, i.e., that surface doesn't exist yet.

I am not going to invent injection/IDOR/auth findings that don't exist in this codebase — doing so would waste your remediation budget on non-issues and bury the real, exploitable problems below. The real issues are: **the anti-abuse model can be trivially bypassed by anything that isn't a browser**, **rate limiting is non-functional in the serverless runtime it's deployed to**, **PII is exposed via a GET-method form with no `action`**, and **two production forms silently discard user data**.

---

## Finding 1 — Anti-abuse "same-origin" check is not a real trust boundary and can be forged by any HTTP client

**Severity: High**

### Quote

`connect/api/request-call.js`, lines 174–180:
```js
// Same-origin enforcement — drop submissions from other domains
const origin = req.headers['origin'] || '';
const referer = req.headers['referer'] || '';
const fromAllowed = ALLOWED_ORIGINS.has(origin) ||
  [...ALLOWED_ORIGINS].some(o => referer.startsWith(o + '/') || referer === o);
if (!fromAllowed) {
  return res.status(403).json({ error: 'forbidden' });
}
```
The identical pattern is repeated in `connect/api/form-token.js`, lines 26–32.

### Attack Vector

`Origin` and `Referer` are **plain HTTP request headers**. Browsers prevent *JavaScript running on another origin* from forging them in a cross-site fetch, which is the only threat model this code actually defends against (basic browser-based CSRF from a third-party page). But this check is trivially defeated by anything that isn't a same-origin browser fetch, e.g.:

```bash
curl -X POST https://connect.tradefunding.com.au/api/form-token \
  -H "Origin: https://connect.tradefunding.com.au" \
  -H "Referer: https://connect.tradefunding.com.au/"

curl -X POST https://connect.tradefunding.com.au/api/request-call \
  -H "Origin: https://connect.tradefunding.com.au" \
  -H "Content-Type: application/json" \
  -d '{"name":"a a","business":"b b","email":"x@x.com","phone":"04000000","sell":"stuff","form_token":"<token from step 1>"}'
```
Both headers are attacker-controlled outside of a browser context, so a scripted attacker can obtain a valid `form_token` and then submit the form endpoint directly, with the "same-origin enforcement" providing zero resistance. The token endpoint (`form-token.js`) is protected by exactly the same forgeable check, so it cannot be used to establish real trust either.

**Net effect:** every other control that assumes "this request came from our page" (the honeypot, the 3-second minimum age, the token itself) is downstream of a check that a scripted client defeats for free. This doesn't expose data, but it means the form's entire anti-spam/anti-abuse design provides much less protection than the code comments ("proves submission came from a real page load", "not a direct API hit") suggest — which matters because Finding 2 below removes the one control (rate limiting) that would otherwise have contained scripted abuse.

### The Fix

Origin/Referer checks are a reasonable *first* filter (they do stop the laziest scrapers and browser-based cross-site abuse) but should not be relied on as the primary anti-abuse control. Pair them with a real challenge that isn't just a header:

```js
// request-call.js — add a real proof-of-work / CAPTCHA style check
// in addition to (not instead of) the existing origin check.
import { verifyTurnstileToken } from './lib/turnstile.js'; // or hCaptcha/reCAPTCHA

// ... inside handler, after the existing origin check:
const captchaOk = await verifyTurnstileToken(payload.turnstile_token, {
  secret: process.env.TURNSTILE_SECRET_KEY,
  remoteIp: ip
});
if (!captchaOk) {
  return res.status(403).json({ error: 'captcha_failed' });
}
```
Cloudflare Turnstile (free, privacy-respecting, no user-facing puzzle in the common case) is a good fit here — it validates server-side with a secret the attacker never sees, unlike a header they can simply copy. Keep the existing origin/token/honeypot checks as cheap pre-filters; add Turnstile as the control that actually can't be forged from a script.

---

## Finding 2 — Rate limiting is implemented as an in-process `Map` and will not work in the serverless environment it's deployed to

**Severity: Critical**

### Quote

`connect/api/request-call.js`, lines 17–21 and 48–62:
```js
const HOURLY_LIMIT = 3;
const DAILY_LIMIT = 10;
// ...
const ipBuckets = new Map();
// ...
function checkRateLimit(ip) {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const DAY = 24 * HOUR;
  let bucket = ipBuckets.get(ip);
  if (!bucket) {
    bucket = { hour: { count: 0, resetAt: now + HOUR }, day: { count: 0, resetAt: now + DAY } };
  }
  // ...
  ipBuckets.set(ip, bucket);
  return bucket.hour.count <= HOURLY_LIMIT && bucket.day.count <= DAILY_LIMIT;
}
```
Confirmed via `connect/vercel.json` and `connect/package.json` that this deploys as standard Vercel serverless functions (no `runtime: edge`, no persistent server process, no external store such as Redis/Upstash/KV referenced anywhere in the codebase).

### Attack Vector

Vercel serverless functions are **stateless and ephemeral per invocation** — module-level state like `ipBuckets` only persists for the lifetime of a warm container instance, and Vercel routes traffic across many concurrent/regional instances with no guaranteed affinity between requests from the same IP. In practice this means:

1. An attacker sending requests in parallel (or from multiple regions, or simply enough volume to trigger new container spin-up) will hit many different in-memory `Map` instances, each starting its count at zero. The "3 per hour / 10 per day" limit is enforced **per container instance**, not per IP globally — it does not actually cap abuse at 3/10.
2. Any cold start (deploys, low traffic causing container recycling, scale-to-zero) resets the counter to zero for that IP.
3. Combined with Finding 1 (the origin check is forgeable), this means a scripted attacker can send unlimited `POST /api/request-call` requests, each triggering a real `Resend` email send and a real Slack webhook post — this is a **direct cost/spam vector**: the attacker can exhaust your Resend sending quota, spam your sales Slack channel, and/or use the endpoint as an open relay to send arbitrary attacker-controlled HTML (escaped, so not XSS against you, but the content is attacker-controlled) to `support@tradefunding.com.au` at volume.

### The Fix

Move rate limiting to a shared, external store — this is the standard fix for rate limiting on any serverless/edge platform:

```js
// api/request-call.js
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN
const hourlyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h'),
  prefix: 'rc:hour'
});
const dailyLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 d'),
  prefix: 'rc:day'
});

async function checkRateLimit(ip) {
  const [hourly, daily] = await Promise.all([
    hourlyLimiter.limit(ip),
    dailyLimiter.limit(ip)
  ]);
  return hourly.success && daily.success;
}

// in handler:
if (!(await checkRateLimit(ip))) {
  return res.status(429).json({ error: 'rate_limited' });
}
```
Upstash's Redis has a generous free tier and a REST API that works cleanly from Vercel's serverless runtime with no connection-pooling concerns. If you'd rather not add a new dependency/service, Vercel's own KV product (built on the same Upstash backend) works as a drop-in alternative.

---

## Finding 3 — Broker Portal lead form submits PII via unencrypted GET, exposing it in the URL, browser history, and server logs

**Severity: Medium**

### Quote

`commercial/broker-portal.html`, line 590 (form) through line 606 (submit button):
```html
<form class="bp-form">
  <h3 class="bp-form__title">Partner with us</h3>
  ...
  <input class="bp-form__input" type="text" id="bp-name" name="name" required>
  ...
  <input class="bp-form__input" type="email" id="bp-email" name="email" required>
  ...
  <input class="bp-form__input" type="tel" id="bp-phone" name="phone" required>
  ...
  <button type="submit" class="bp-form__submit">Partner with us &rarr;</button>
</form>
```
No `action` and no `method` attribute is set, and grepping the page and its script include (`/commercial/product-page.js`) confirms there is **no JavaScript submit handler attached to `.bp-form`** — `product-page.js` only wires up the comparison switcher, calculator, download gate, and FAQ accordion (see Finding 5).

### Attack Vector

An HTML `<form>` with no `method` attribute defaults to `method="GET"`, and no `action` defaults to submitting to the current page URL. When a broker fills this in and clicks submit, the browser will **serialize name, email, and phone number into the URL query string** and navigate to something like:
```
https://tradefunding.com.au/commercial/broker-portal.html?name=Jane+Smith&business=Acme+Brokers&email=jane%40acmebrokers.com.au&phone=0412345678
```
This is a real information-exposure issue even though there's no backend to receive it:
- The PII lands in the **browser's local history** in plaintext.
- If any analytics/tag-manager script captures full URLs (common on marketing sites), the PII is exfiltrated to that third party's logs.
- It will appear in the `Referer` header of any subsequent outbound request/resource load from that page (e.g., to a CDN, font host, or analytics beacon), leaking it to those third parties.
- It will appear in **server/CDN access logs** in plaintext.
- None of it is actually delivered anywhere useful — the broker believes they submitted a lead, but nothing happens server-side (see Finding 5).

### The Fix

Wire this form to the existing, already-hardened `connect/api/request-call.js` pattern (or a same-shaped `/api/broker-lead` endpoint), and force POST:

```html
<form class="bp-form" id="broker-lead-form" method="post">
  ...
</form>
```
```js
// commercial/broker-lead-form.js (new file, mirrors connect/scripts/form.js)
(function () {
  'use strict';
  const form = document.getElementById('broker-lead-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: form.querySelector('#bp-name').value.trim(),
      business: form.querySelector('#bp-business').value.trim(),
      email: form.querySelector('#bp-email').value.trim(),
      phone: form.querySelector('#bp-phone').value.trim()
    };
    const res = await fetch('/api/broker-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) { /* surface error to user */ return; }
    /* show success state */
  });
})();
```
Until a real endpoint exists, at minimum set `method="post" action="mailto:..."` is **not** an acceptable interim fix (mail clients handle this inconsistently and it still isn't private); disable the submit button with a "coming soon" state instead of shipping a form that silently misfires (see Finding 5 for the broader pattern).

---

## Finding 4 — `FORM_TOKEN_SECRET` absence is only checked at request time, and a shared secret with no rotation story is a single point of failure

**Severity: Low**

### Quote

`connect/api/form-token.js`, lines 19–23:
```js
const secret = process.env.FORM_TOKEN_SECRET;
if (!secret) {
  console.error('FORM_TOKEN_SECRET not configured');
  return res.status(500).json({ error: 'misconfigured' });
}
```

### Attack Vector

This isn't exploitable today, but it's a latent operational-security gap: there is no secret rotation mechanism, and if `FORM_TOKEN_SECRET` is ever weak, reused across environments (e.g., the same value in preview and production Vercel environments), or leaked via a misconfigured log/error-tracking integration, an attacker who obtains it can mint valid tokens offline indefinitely, fully defeating the token check with no way to detect misuse (HMAC verification succeeds silently for any timestamp/nonce the attacker chooses within the 30-minute window).

### The Fix

- Confirm `FORM_TOKEN_SECRET` is generated per-environment (the `.env.example` comment already correctly suggests `openssl rand -hex 32` — verify this was actually followed and isn't a placeholder value in Vercel's dashboard).
- Add a `kid` (key ID) prefix to the token so the secret can be rotated without breaking in-flight tokens:
```js
const KEY_VERSION = 'v1';
const hmac = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
const token = `${KEY_VERSION}.${payload}.${hmac}`;
```
This lets you introduce `FORM_TOKEN_SECRET_V2` in the future and verify against whichever version prefix is present, rather than having a single secret with no migration path.

---

## Finding 5 — Two production forms silently discard user input with no backend, misleading users into believing their submission succeeded

**Severity: Medium (trust/data-integrity issue, not a classic "vulnerability" — flagged because it actively misleads users and is adjacent to security posture)**

### Quote

`commercial/contact.html`, lines 249–253 (comment is the codebase's own admission):
```html
<!-- Static HTML phase (Phase 5) - no backend yet. The real submission
     endpoint (Payload/Next.js API route) is a Phase 6 concern, not
     built here. action/method below are placeholders only. -->
<form action="#" method="post">
```
and `commercial/product-page.js`, lines 217–232 (the "download gate" fakes a delivered result client-side only):
```js
downloadSubmit.addEventListener('click', function () {
  var emailInput = downloadForm.querySelector('input[type="email"], input[name="email"]');
  if (!emailInput) return;
  var email = emailInput.value.trim();
  if (email.indexOf('@') === -1) { emailInput.style.borderColor = '#FF5D5C'; return; }
  emailInput.style.borderColor = '';
  downloadForm.classList.remove('is-visible');
  if (downloadSuccess) {
    downloadSuccess.textContent = 'Sent to ' + email;
    downloadSuccess.classList.add('is-visible');
  }
});
```

### Attack Vector

Not an attacker-exploitable vulnerability in the traditional sense, but worth flagging in a pre-launch security review because it's a **false sense of successful data submission** presented to real users:

- `contact.html`'s form has `action="#"`, which means clicking submit does nothing except reload/scroll the current page — no request is sent anywhere, no email reaches `support@tradefunding.com.au`, and the user sees no error.
- The comparison-report download gate in `product-page.js` validates only that the string contains an `@`, then unconditionally displays `"Sent to " + email` — **no request is ever made**, the report is never sent, and the email address the "lead" typed in is discarded entirely (not stored, not emailed, not logged).

If this ships to production as-is, every visitor who fills out the homepage contact form or requests the comparison-report download will believe they've reached a human, when in fact the business receives nothing. This is a real business risk (silent lead loss) that a security/production-readiness review should catch before launch, since it's functionally identical to a broken trust boundary — the user's data appears to go somewhere safe and doesn't.

### The Fix

Do not launch with either of these in this state. Options, in order of effort:
1. **Wire both to the existing hardened endpoint pattern** (`connect/api/request-call.js` as the template) before launch.
2. If Phase 7 (Payload CMS conversion, per `CLAUDE.md`) is genuinely imminent and these are meant to stay stubs briefly, **disable the submit button and show "Coming soon — email us directly at hello@tradefunding.com.au"** rather than presenting a working-looking form that does nothing. A few lines:
```html
<button type="submit" class="form-submit" disabled title="Online submission coming soon — email hello@tradefunding.com.au">
  Send message
</button>
```

---

## Summary Table

| # | Finding | Severity | File(s) |
|---|---|---|---|
| 1 | Origin/Referer "same-origin" check is forgeable by non-browser clients | High | `connect/api/request-call.js`, `connect/api/form-token.js` |
| 2 | In-memory rate limiting doesn't work across serverless instances | Critical | `connect/api/request-call.js` |
| 3 | Broker Portal form submits PII via GET with no action/handler | Medium | `commercial/broker-portal.html` |
| 4 | No secret rotation story for `FORM_TOKEN_SECRET` | Low | `connect/api/form-token.js` |
| 5 | Two production forms silently discard user submissions | Medium | `commercial/contact.html`, `commercial/product-page.js` |

**Not found (and not fabricated for this report):** SQL/NoSQL injection (no database layer exists), authentication bypass (no auth system exists), classic IDOR (no addressable user resources exist), `eval`/`new Function` usage, hardcoded secrets in source or git history (git history was checked directly, no leaked keys found), and unescaped user input rendered into HTML (the one place user input reaches HTML — the email template in `sendEmail()` in `request-call.js` — correctly runs every field through `escapeHtml()` before interpolation).

**Priority order for remediation before launch:** Finding 2 (Critical — fix before launch, this is your actual DoS/cost exposure), then Finding 1 (add Turnstile/hCaptcha), then Finding 5 (both broken forms — reputational/business risk), then Finding 3, then Finding 4.
