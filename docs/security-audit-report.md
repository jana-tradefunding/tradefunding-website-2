# Security & SecOps Vulnerability Audit — Trade Funding Site

**Scope:** `commercial/`, `connect/`, `personal-and-property/`, `shared/` (static HTML + Vercel serverless functions in `connect/api/`). No database layer exists yet (Payload/Postgres is a future phase per `CLAUDE.md`), so SQL/NoSQL injection is not applicable today — noted below and flagged as a forward-looking item for Phase 8.

Note: this repo already contains a prior `docs/security-audit-report.md` whose findings (Turnstile, Redis-backed rate limiting, HMAC form tokens, origin checks) have visibly been implemented in `connect/api/`. This report re-audits the *current* code rather than assuming the old report is still accurate, and calls out what's already fixed so it isn't re-flagged.

---

## Finding 1 — No Content-Security-Policy header anywhere in the codebase
**Severity: High**

**Quote:**
`connect/vercel.json` (the only header configuration file in the entire repo):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```
`commercial/` and `personal-and-property/` have **no `vercel.json`, `_headers`, or equivalent at all** — I searched the full tree (`find . -iname vercel.json -o -iname _headers -o -iname netlify.toml`) and only `connect/vercel.json` exists.

**Attack Vector:** Without a CSP, any injected `<script>` tag (via a stored-XSS bug, a compromised third-party script, or a supply-chain compromise of a CDN dependency) executes with full page privileges — it can read cookies, exfiltrate form data before it reaches your own `/api/request-call` endpoint, or rewrite the DOM to phish loan applicants. Commercial and Personal & Property are completely unprotected since they have zero security headers of any kind; Connect has clickjacking/MIME-sniffing protection but no script-origin restriction.

**The Fix:** Add a `headers` block to a `vercel.json` at the repo root (once Phase 8's single Next.js app exists) or, until then, to each channel's own config. Example CSP appropriate for this stack (no build-time bundler, some inline `<style>` blocks, Resend/Turnstile/Upstash as the only external services):
```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
}
```
`style-src 'unsafe-inline'` is unfortunately required today because of the many inline `<style>` blocks (see Report 3, §"Inline `<style>` per page") — tightening that is a follow-on refactor, not a blocker for shipping a CSP now. Also add `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` sitewide, since it's currently absent everywhere including Connect.

---

## Finding 2 — Personal & Property channel has no cookie-consent banner (Privacy/Compliance)
**Severity: High**

**Quote:** `shared/scripts/consent.js` is the single canonical consent implementation (confirmed correct and well-built — cookie-based, `SameSite=Lax`, shared across subdomains, gates `window.loadAnalytics()` behind explicit "Accept all"). But diffing every HTML page against script inclusion:
```
personal-and-property/about.html
personal-and-property/apply.html
personal-and-property/commercial-property-finance.html
personal-and-property/construction-loans.html
personal-and-property/debt-consolidation.html
personal-and-property/index.html
personal-and-property/investment-property-loans.html
personal-and-property/owner-occupied-home-loans.html
personal-and-property/personal-loans.html
personal-and-property/refinancing.html
personal-and-property/smsf-loans.html
```
— **none of these 11 real pages** load `/shared/scripts/consent.js`. 48 of the other 55 real pages (Commercial + Connect) do.

**Attack Vector:** This isn't an exploit so much as a live compliance gap: if any analytics/tracking script is later wired to `window.loadAnalytics()` (which `commercial/privacy.html` and `connect/privacy.html` already reference GA/gtag-style language for), Personal & Property visitors get tracked with zero consent gate — a GDPR/CCPA violation the moment that channel goes live with analytics attached, and a channel-wide gap even without analytics since no consent UI is shown at all.

**The Fix:** Add the standard script include to all 11 Personal & Property pages (same tag used elsewhere):
```html
<script src="/shared/scripts/consent.js" defer></script>
```
Given only 3 of 66 pages use the automated include-sync system (see Report 3, Finding 1), this needs to be either (a) manually added to all 11 files now, or (b) done properly by first fixing the include-sync coverage gap so this class of omission can't recur.

---

## Finding 3 — Turnstile is server-enforced but has no front-end widget, so the Connect form is either broken or (if deployed with the old client) silently degraded
**Severity: Medium**

**Quote:** `connect/api/_lib/turnstile.js`, lines 12–20 (comment in the code itself):
```js
// FRONT-END FOLLOW-UP NOT DONE BY THIS CHANGE: connect/index.html's
// request-call form has no Turnstile widget/script yet, so no real
// turnstile_token is ever produced client-side. Until that widget is
// added ... every call into this module gets an empty token and fails
// closed. Do not deploy this backend change ahead of that front-end
// change — it will silently reject all real form-token and
// request-call submissions.
```
Confirmed independently: `connect/scripts/form.js` (the actual submit handler) never references `turnstile_token`, and `connect/index.html`'s form markup has no Turnstile widget div or the `challenges.cloudflare.com` script tag.

**Attack Vector:** Not attacker-facing today — the practical risk is the opposite of a vulnerability: if this backend is deployed as-is, `verifyTurnstileToken` (`_lib/turnstile.js` line 29: `if (!token) return false;`) will reject every single real customer submission with a silent `403 captcha_failed`, since `req.body.turnstile_token` will always be undefined. This is a "ships broken" risk, not a security hole, but it's flagged here because it's exactly the kind of half-finished security control that gets someone to "fix" it by weakening the check (e.g., `if (!token) return true;`) under launch pressure — which *would* reopen the abuse vector Finding 1 in the prior audit was trying to close.
**The Fix:** Before this backend ships, add the Turnstile widget to `connect/index.html` and wire `scripts/form.js` to read the widget's response token into the `turnstile_token` field of the POST body (and the same for the `/api/form-token` GET call's query string). Do not relax the `if (!token) return false;` check as a workaround.

---

## Finding 4 — Client-side-only validation regex is duplicated, not shared, between client and server
**Severity: Low**

**Quote:**
`connect/api/request-call.js` line 37: `if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email');`
`connect/scripts/form.js` line 44: `email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email',`

Both the phone and email regexes are copy-pasted verbatim between the client validator and the server validator instead of sharing one source of truth.

**Attack Vector:** Not directly exploitable — the server-side copy is what actually matters, and it does correctly re-validate everything (this is good practice, not a flaw). The risk is purely maintenance drift: a future edit to accept international phone numbers or a stricter email check made in one file and not the other will produce inconsistent UX (client says valid, server rejects, or vice versa) rather than a security hole.
**The Fix:** Extract both regexes into a small shared module analogous to `connect/api/_lib/html-escape.js`, importable from both the serverless handler (ESM) and, via a `<script type="module">` or a simple duplicated-but-generated constant, the client script. Given the project's own precedent of extracting shared logic into `_lib/` (see the extraction history documented in `_lib/form-token.js`'s header comment), this is a natural next extraction.

---

## Finding 5 — Inconsistent, sometimes-missing security header baseline across channels
**Severity: Medium**

**Quote:** See Finding 1 — only `connect/vercel.json` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. `commercial/` and `personal-and-property/` inherit whatever Vercel's zero-config defaults are (none of the above).

**Attack Vector:** `X-Frame-Options: SAMEORIGIN` missing on Commercial and Personal & Property means those channels — which host the actual loan-application forms (`commercial/apply.html`, `personal-and-property/apply.html`) — can be iframed by a third-party site for a clickjacking attack that tricks a user into submitting a loan application or clicking a CTA they didn't intend to.
**The Fix:** Copy the same four headers from `connect/vercel.json` into equivalent config for the other two channels now, and consolidate into one root-level config in Phase 8 so this can't drift again (see Report 3 for the broader "one canonical source, no propagation gaps" problem).

---

## Finding 6 — Company address / contact-info placeholder still live on the majority of pages
**Severity: Low (compliance, not exploit)**

**Quote:** `personal-and-property/index.html:346` and 58 other files:
```html
<div class="footer__contact-item">&#128205; <!-- 🔴 BLOCKED - NEEDS: confirmed company address (plan.md §1) --> [BLOCKED - NEEDS: confirmed address]</div>
```
By contrast, `commercial/credit-guide.html:211` and `commercial/terms.html:321` **already** show a real, filled-in address: `Level 8, 387 George Street, Sydney, NSW, 2000`. That fix has not been propagated to the other 59 occurrences (see Report 3 for why the propagation mechanism doesn't reach most files) or to the footer's own contact block in `commercial/credit-guide.html:298`, which is already correct — but Connect's and Personal & Property's footers, and Commercial's `privacy.html:369`, are not.

**Attack Vector:** Not an exploit, but a real compliance exposure: an ASIC-licensed credit provider (`ACL 387856`) displaying `[BLOCKED - NEEDS: confirmed address]` in a public footer/T&Cs is a genuine regulatory-disclosure gap if this ships to production as-is.
**The Fix:** Get the confirmed office address from Matt/the business (per `CLAUDE.md` rule 4, label it specifically **"Office Address"**, not "Registered Address") and do a global find/replace of the placeholder string across all 59 remaining occurrences — ideally through the include-sync mechanism once its coverage gap (Report 3, Finding 1) is fixed, so it only needs setting once.

---

## Finding 7 (Positive control — no fix needed, noted for completeness) — Anti-abuse stack on `/api/request-call` is solid
`connect/api/request-call.js` combines, in order: method check → UA sanity check → Origin/Referer allow-list (`_lib/origin-check.js`) → Turnstile server verification → body-size cap (4096 bytes) → Upstash sliding-window rate limit (3/hour, 10/day per IP, correctly Redis-backed so it works across serverless instances — `_lib/rate-limit.js`) → honeypot field → HMAC form-token with `crypto.timingSafeEqual` constant-time comparison and a 3-second minimum / 30-minute maximum age window (`_lib/form-token.js`) → server-side field validation → HTML-escaping on every interpolated value before it goes into the notification email (`_lib/html-escape.js`). This is a well-layered design and none of it needs remediation. The only gap is Finding 3 above (missing front-end Turnstile widget).

---

## Summary table

| # | Finding | Severity |
|---|---|---|
| 1 | No CSP / HSTS anywhere in the repo | High |
| 2 | Personal & Property has zero cookie-consent coverage | High |
| 3 | Turnstile server check has no front-end widget wired up | Medium |
| 4 | Duplicated (not shared) validation regexes, client vs server | Low |
| 5 | Security headers only exist for Connect, not Commercial/P&P | Medium |
| 6 | Address placeholder still live on 59 of 66 pages | Low |
| 7 | Request-call anti-abuse stack | ✅ No issue — well-built |

**Not applicable today:** SQL/NoSQL injection, auth bypass, IDOR — there is no database and no authentication system in this snapshot (confirmed: `broker-portal.html`'s "Aggregator login" section is explicitly stubbed as `[BLOCKED - NEEDS: aggregator-login details]`, i.e., doesn't exist yet). Re-run this section of the audit once Phase 8's Payload/Postgres backend and any login surface exist.
