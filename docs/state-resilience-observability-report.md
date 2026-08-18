# State Resilience, Network, & Observability — Trade Funding Site

## State Management & Network

### Finding 1 — No retry/exponential backoff on network calls (form submission and form-token fetch)
**Severity: Medium.** Checked every `fetch()` call in `connect/scripts/form.js` and `connect/scripts/calculator.js` — none implement retry logic. `connect/scripts/form.js:131-146`, the actual submit call to `/api/request-call`, makes one attempt; on any failure (`!res.ok` or a thrown network error) it re-enables the button and shows `alert('Sorry — something went wrong. Please email support@tradefunding.com.au directly.')`. The same pattern applies to `fetchFormToken()` (lines 19-34).

**Attack/impact vector:** this isn't a security bug, but it is a real conversion-rate risk: a transient network blip or a cold-start delay on the Vercel function (the kind of thing exponential backoff exists to smooth over) currently sends a paying lead straight to "email us instead," on the very form whose entire purpose is capturing that lead without friction.

**Fix:** wrap both fetch calls in a small retry helper (2–3 attempts, short exponential backoff — e.g. 300ms/900ms) before falling back to the "email us" message, being careful not to retry in a way that could trigger the server's honeypot/timing checks (`_lib/form-token.js`'s `TOKEN_MIN_AGE_MS`/`TOKEN_MAX_AGE_MS` — a naive immediate-retry loop on `fetchFormToken` could plausibly interact with the 3-second minimum-age check if not accounted for).

### Finding 2 — Mutation locking on submit is correctly implemented (positive control)
`connect/scripts/form.js:104-106` disables the submit button and swaps its label to "Sending…" immediately on submit, before the network call starts, and only re-enables it in the catch/error path — this correctly prevents duplicate submissions from a double-click or an impatient re-tap. No fix needed.

### Finding 3 — No offline fallback / service worker anywhere in the codebase
**Severity: Low (expected at this phase, but worth stating explicitly).** Confirmed via full-repo search: no `sw.js`, no `manifest.json`, no `navigator.serviceWorker` reference anywhere. For a lead-generation site (not an app users expect to work offline), this is a reasonable current state, not a defect — flagging it here only so it's an explicit, acknowledged decision rather than an unnoticed gap, and so it's on the list to revisit if Phase 8's Next.js app adds PWA capabilities.

### Finding 4 — No optimistic UI patterns exist, and none are currently needed
Checked for optimistic-update patterns (updating UI before server confirmation, with rollback on rejection) — none exist. Every interactive surface I found (the request-call form, the ROI calculator) either computes purely client-side with no server round-trip (the calculator) or waits for a real server response before changing UI state (the form, correctly, per Finding 2). This guardrail doesn't currently apply because there's no "micro-action" UI (likes, saves, toggles) that would benefit from optimistic updates — no fix needed, just confirming the guardrail was checked.

### Finding 5 — Local persistence: versioned correctly where it's used (positive control)
`connect/scripts/calculator.js:56-58` explicitly cleans up superseded `sessionStorage` keys:
```js
sessionStorage.removeItem('tf-vl-calc-v1');
sessionStorage.removeItem('tf-vl-calc-v2');
sessionStorage.removeItem('tf-vl-calc-v3');
```
This is exactly the versioned-schema discipline the guardrail asks for — whoever wrote this was already cleaning up after itself across schema versions rather than letting stale keys accumulate or cause a shape mismatch on load. No fix needed; worth calling out as a pattern to keep following as new persisted state gets added elsewhere in the site.

## Observability & Error Handling

### Finding 6 — No client-side error boundary equivalent, and no global error handler
**Severity: Medium.** There's no React/Vue in this phase, so a literal "error boundary" doesn't apply yet — but the equivalent for vanilla JS (a `window.addEventListener('error', ...)` / `window.addEventListener('unhandledrejection', ...)` global handler) also doesn't exist anywhere in the repo. Every script (`main.js`, `form.js`, `calculator.js`) is a self-contained IIFE with no shared top-level catch, so an unexpected DOM-shape mismatch (e.g., a missing element ID after a future markup edit) throws silently into the console with no user-facing fallback and no record of it having happened.
**Fix:** add a minimal shared `shared/scripts/error-handler.js` that at least logs unhandled errors/rejections in a structured way (a stepping stone toward Finding 7 below), and load it sitewide alongside `consent.js`.

### Finding 7 — No centralized telemetry/RUM (Sentry, Datadog, or equivalent)
**Severity: Medium.** Confirmed via full-repo search for `sentry`, `datadog`, `Sentry`, `window.onerror`, `unhandledrejection` — zero matches outside this report. There is currently no way to know, in production, whether the request-call form is silently failing for a subset of users, whether a JS error is breaking the hero invoice-cycling animation on some browser, or what the real-world Web Vitals (LCP/INP/CLS) look like — all of which matters more once Finding 1 (Performance report) and Finding 1 (Security report — missing CSP) are fixed, since telemetry is how you'd confirm those fixes actually landed in production.
**Fix:** stand up a lightweight RUM integration (Sentry's free tier is a reasonable default given the current scale) before this ships to production traffic, wired to capture at minimum: unhandled JS errors, unhandled promise rejections, and the three Core Web Vitals. This can be added incrementally per channel and doesn't require Phase 8's Next.js migration to happen first.

### Finding 8 — PII redaction: not yet applicable, but worth locking in now before telemetry is added
**Severity: Low (forward-looking).** There is no analytics/logging pipeline yet (Finding 7), so there's nothing to audit for PII leakage today — the only place personal data currently flows is the two email/Slack notification templates in `connect/api/request-call.js`, which are sent directly to the business's own inbox (`support@tradefunding.com.au`) and Slack channel, which is the intended, consented destination for that data, not a leak. **Recommendation, not a finding:** when Finding 7's RUM integration is added, explicitly configure it to scrub form fields (name/email/phone/business) from any error context or session-replay feature before it's turned on — Sentry and most RUM tools capture DOM/form state by default unless told not to, and this form collects exactly the kind of contact PII that shouldn't end up in a third-party telemetry dashboard.

### Finding 9 — Graceful fallbacks: partially covered
The request-call form has an explicit, user-visible failure fallback (Finding 1's "email us directly" message) — good. However, there's no equivalent fallback if the *page itself* fails to load a component correctly (e.g., if `main.js` throws before wiring up the mobile-nav hamburger, there's no visible sign to the user that the hamburger button is now non-functional — it just silently doesn't respond). This ties back to Finding 6: a global error handler would at least allow logging this class of failure even if a user-facing fallback isn't built for every single component.

## Summary table

| # | Finding | Severity |
|---|---|---|
| 1 | No retry/backoff on form network calls | Medium |
| 2 | Mutation locking on form submit | ✅ Good, no fix needed |
| 3 | No offline fallback / service worker | Low — expected at this phase |
| 4 | No optimistic UI (none currently needed) | — N/A |
| 5 | `sessionStorage` key versioning in calculator | ✅ Good, no fix needed |
| 6 | No global JS error handler | Medium |
| 7 | No RUM/telemetry (Sentry/Datadog) anywhere | Medium |
| 8 | PII redaction — not yet applicable, plan ahead of Finding 7 | Low |
| 9 | Graceful fallback only covers the form, not silent component failures | Low–Medium |
