# Architecture & Project Structure Review — Trade Funding Website

**Scope reviewed:** full repository tree (`commercial/`, `connect/`, `personal-and-property/`, `_internal/`, `docs/`, root-level config)
**Reviewer role:** Senior Software Architect
**Date of review:** 2026-08-18

## 0. Context that shapes this review

`CLAUDE.md` at the repo root is unusually candid about where this project is in its lifecycle, and I've taken it at face value rather than reviewing this as if it were meant to be its final architecture: this is **Phase 6 of a planned migration** from three independently-hand-built static HTML sites (`commercial/`, `connect/` — formerly a separate product called "Fundit" — and the not-yet-fully-built `personal-and-property/`) into **one Next.js + Payload CMS app with sub-path routing**. Several of the issues below are explicitly *already known and tracked* in `CLAUDE.md` and `docs/plan.md` (e.g., rule 14's "two-tier header" regression, rule 17's space-in-folder-name issue). I've flagged those briefly for completeness but focused most of my depth on issues that are **not** yet tracked in those docs, since you already have a process for the tracked ones.

With that framing: 62 HTML files (43 commercial, 8 connect, 11 personal-and-property), three independent CSS systems, two serverless functions, and zero build tooling. Here is the honest state of it.

---

## 1. Separation of concerns

### 1.1 — `commercial/` is silently doing double duty as both a page channel *and* the shared design-system host for the other two channels

**Files:** `personal-and-property/index.html`, `connect/index.html` both contain:
```html
<link rel="stylesheet" href="/commercial/shared-styles.css">
```
and `personal-and-property/styles/main.css` opens with an explicit comment confirming this is intentional:
```css
/* Page-specific stylesheet. Loaded ALONGSIDE /commercial/shared-
   styles.css (header/footer/ChannelSwitcher/button/container chrome
   already defined there - not redefined here, per CLAUDE.md rule 14
   and buildspec.md §10). ... */
```

This means `commercial/` is not a peer of `connect/` and `personal-and-property/` — it's their dependency. A change to `commercial/shared-styles.css` (a 1,001-line file) for a Commercial-channel-specific reason can silently break Connect and Personal & Property's header, footer, `ChannelSwitcher`, buttons, and containers, with no compiler, type system, or CI check to catch it. The three "channels" look like siblings in the folder tree but are not siblings in the dependency graph, and nothing in the file structure signals that.

**Recommendation:** Extract the shared chrome into its own top-level, channel-agnostic location before or during the Phase 7 migration — e.g. `shared/styles/chrome.css` — so the directory structure honestly reflects the dependency graph. This also directly serves `CLAUDE.md` rule 8 ("Keep the ACL/legal disclosure componentized once") and rule 14 (header/footer must be byte-for-byte identical) — right now those rules are enforced by developer discipline and a manual diff step ("Diff against the canonical component after touching any page"), not by the file structure itself.

### 1.2 — Business logic (loan repayment math) lives inside a DOM-manipulation file with no separation from rendering

**File:** `commercial/product-page.js`, lines 110–133 (`calcMonthly()`):
```js
function calcMonthly() {
  var P = getAmount();
  var annualRate = parseFloat(rateEl.value) || 0;
  var months = parseInt(termEl.value, 10) || 12;
  if (mode === 'APR') {
    var r = annualRate / 100 / 12;
    var n = months;
    var M;
    if (r === 0) { M = n > 0 ? P / n : 0; }
    else { M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1); }
    return { monthly: M, total: M * n, interest: M * n - P };
  } else {
    var R = annualRate / 100;
    var T = months / 12;
    var N = months;
    var total = P + P * R * T;
    var monthly = N > 0 ? total / N : 0;
    return { monthly: monthly, total: total, interest: total - P };
  }
}
```
This is genuine financial-domain logic (amortization math, APR vs. flat-rate/ASR calculation) reading directly from DOM elements (`rateEl.value`, `termEl.value`) via module-scoped closures, with no separation between "compute the repayment" and "read the slider." Compare this to `connect/scripts/calculator.js`, which gets this right — its `compute({quotes, avgValue, currentConv, uplift})` function (lines 5–14) is a pure function that takes plain arguments and returns a plain object, completely decoupled from the DOM; the DOM-reading happens separately in `readInputs()` (lines 94–101).

**Impact:** `calcMonthly()` cannot be unit-tested without a DOM (jsdom or a browser), cannot be reused if the calculator needs to appear in a second place on the page, and any future change to the amortization formula (e.g., to fix a rounding edge case, or to support a third rate mode) has to be manually verified in a browser rather than covered by a fast unit test — for a calculation that directly produces the numbers a prospective borrower sees and might act on.

**Recommendation:** Refactor to mirror `calculator.js`'s pattern:
```js
// pure, testable — no DOM references
function calcMonthly({ principal, annualRatePct, months, mode }) {
  if (mode === 'APR') {
    const r = annualRatePct / 100 / 12;
    if (r === 0) return { monthly: months > 0 ? principal / months : 0, total: principal, interest: 0 };
    const monthly = principal * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    return { monthly, total: monthly * months, interest: monthly * months - principal };
  }
  const total = principal + principal * (annualRatePct / 100) * (months / 12);
  const monthly = months > 0 ? total / months : 0;
  return { monthly, total, interest: total - principal };
}

// separate, DOM-only glue
function updateCalc() {
  const result = calcMonthly({
    principal: getAmount(),
    annualRatePct: parseFloat(rateEl.value) || 0,
    months: parseInt(termEl.value, 10) || 12,
    mode
  });
  resultEl.textContent = fmt(result.monthly) + '/mo';
  // ...
}
```
This one change makes the amortization math independently unit-testable with the `vitest` setup recommended in `dependency-risk-report.md`, without touching anything else in the file.

### 1.3 — Two production forms have no logic layer at all connecting user input to an outcome (already covered in depth in `security-audit-report.md` Finding 5, cross-referenced here as an architecture problem, not just a security one)

`commercial/contact.html`'s form (`action="#"`) and the download-gate email capture in `product-page.js` (lines 217–232) have no service layer, no API call, and no persistence — "submit" is a dead end. Architecturally, this is a missing layer, not a bug in an existing one: there is no `submitLead()`-shaped function anywhere in `commercial/` analogous to `connect/scripts/form.js`'s `fetch(FORM_ENDPOINT, ...)` call. The pattern exists one folder over and simply wasn't applied here yet.

---

## 2. Business logic mixed with infrastructure, routing, or UI

### 2.1 — Rate limiting, token verification, validation, and email templating all live in one 228-line handler function

**File:** `connect/api/request-call.js` — the exported `handler` (lines 161–228) is the single entry point for: HTTP method routing, bot/UA filtering, origin enforcement, body-size guarding, IP-based rate limiting, honeypot checking, token verification, field validation, email sending, and Slack notification, each inline rather than composed from a pipeline. The supporting functions (`verifyToken`, `checkRateLimit`, `validate`, `sendEmail`, `sendSlack`) are at least extracted to module-level functions, which is good practice and better than many equivalent projects — but they're all still colocated in one file with no boundary between "HTTP layer" and "domain layer."

**Why this matters at this project's scale:** today, one file, one reviewer, no problem. But this file is the template `CLAUDE.md` and the broker-portal/contact-form fixes will presumably copy from as more channels get real backend forms (broker lead form, contact form, download-gate form — three more forms per Finding 5 wiring). If each new endpoint copies this file's structure, you'll have four or five near-duplicate 200+ line handlers, each with its own copy of `verifyToken`, `checkRateLimit`, `escapeHtml`, and the origin-check logic — a maintenance and drift risk (a security fix, like the Turnstile addition recommended in the security report, would need to be applied identically in every copy).

**Recommendation:** Before the second form-handling endpoint is built, extract a small shared library, e.g. `connect/api/_lib/`:
```
connect/api/_lib/
  origin-check.js     // fromAllowedOrigin(req, allowedOrigins)
  form-token.js        // issueToken(secret), verifyToken(token, secret)
  rate-limit.js        // checkRateLimit(ip) — swap to the Upstash-backed version from the security report here, once, in one place
  html-escape.js        // escapeHtml(s)
```
Each new endpoint (`api/broker-lead.js`, `api/contact.js`) then imports these instead of re-implementing them, and the Turnstile/Upstash fixes from the security report only need to land in one place.

### 2.2 — Analytics/consent logic is split across two independent, incompatible implementations for the same concern

**Files:** `connect/scripts/main.js`, lines 104–127, uses `localStorage` with key `tf-connect-cookie-consent`:
```js
const STORAGE_KEY = 'tf-connect-cookie-consent';
// ...
try { existing = localStorage.getItem(STORAGE_KEY); } catch(e){}
```
`commercial/cookie-consent.js`, lines 1–26, uses a `document.cookie` with a **different** key, `blc_cookie_consent` (note: "BLC" appears to be a legacy/internal codename, per the `_internal/_DO-NOT-DEPLOY-design-baseline/` naming and `docs/` references — this leftover name in a production cookie key is itself worth cleaning up):
```js
var COOKIE_NAME = 'blc_cookie_consent';
if (document.cookie.indexOf(COOKIE_NAME + '=accepted') !== -1 || ...) { return; }
```

**Impact:** a visitor who accepts/declines cookies on the Connect channel and then navigates to the Commercial channel (which, per the `ChannelSwitcher` requirement in `CLAUDE.md` rule 13, is always one click away) will be shown the cookie banner **again**, because the two channels check entirely different storage mechanisms with different keys. This isn't just a UX papercut — if either channel's analytics loading (`loadAnalytics()`, referenced but not shown in the reviewed files) is gated on consent, an inconsistency here risks either annoying repeat prompts or, worse, analytics firing on one channel without an equivalent consent check on the other.

**Recommendation:** Consolidate to one consent mechanism (cookie is the better choice of the two here, since it's readable server-side too if Phase 7's Next.js middleware ever needs it) with one shared key, extracted to the same shared-chrome location recommended in 1.1.

### 2.3 — `sitemap.xml` and `robots.txt` are hand-maintained per channel with no generation step

**Files:** `commercial/sitemap.xml`, `commercial/robots.txt`, `connect/robots.txt` (no `connect/sitemap.xml` found). Git history (`git log --oneline`) shows a commit explicitly titled *"add missing robots meta, regenerate sitemap.xml sitewide"* — confirming these have already drifted out of sync at least once. With 43 commercial + 8 connect + 11 personal-and-property HTML files and growing, a hand-maintained sitemap is a recurring source of the exact class of bug that commit fixed, and will keep recurring until routes are generated rather than hand-listed (this is a natural side-effect of the planned Next.js migration, worth calling out explicitly as a Phase 7 acceptance criterion rather than assuming it'll be handled).

---

## 3. Tight coupling that will make testing difficult

### 3.1 — Every interactive script is an IIFE that queries the DOM by ID at module load time, with no dependency injection seam

**Files:** `connect/scripts/form.js`, `connect/scripts/calculator.js`, `connect/scripts/main.js`, `commercial/product-page.js`, `commercial/cookie-consent.js` — all five follow the same shape:
```js
(function(){
  'use strict';
  const form = document.getElementById('request-call-form');
  if(!form) return;
  // ... all logic nested inside this closure, referencing `form`, `document`, `window` directly
})();
```
This is a reasonable, defensible pattern for a static-HTML-plus-vanilla-JS site with no build step — I'm not suggesting a rewrite. But it does mean **none of these five files can currently be unit-tested without a full DOM environment** (jsdom, Playwright, etc.), because every function closes over `document.getElementById(...)` results captured at the top of the IIFE rather than receiving them as parameters. `connect/scripts/calculator.js` is the partial exception — its `compute()` function (line 5) is already extracted as a pure, DOM-free function outside the IIFE, which is exactly the pattern that makes the other four files' core logic (token verification client-side logic in `form.js`, the amortization math in `product-page.js` covered in 1.2, the cookie-consent decision logic) currently untestable without a browser.

**Recommendation:** As each file gets touched going forward, extract the pure decision/computation logic (validation rules, consent-key logic, amortization math) to standalone functions at module scope, outside the IIFE, following `calculator.js`'s own precedent — this is a low-effort, incremental change (not a rewrite) that would let the `vitest` setup recommended in the dependency report actually cover the business logic that matters (form validation regexes, rate math, token age checks) without needing jsdom.

### 3.2 — The two serverless functions read configuration from `process.env` directly inside the request-handling path, with no injectable config seam

**File:** `connect/api/request-call.js`, e.g. line 98 (`const apiKey = process.env.RESEND_API_KEY;`) and line 139 (`const url = process.env.SLACK_WEBHOOK_URL;`) — reading environment variables at call time deep inside `sendEmail()`/`sendSlack()` rather than at the handler's entry point means any future test of `handler()` needs to either mutate real process env vars (fragile, order-dependent test pollution risk) or mock the global `fetch` and hope no other env-var read sneaks in. A small refactor — reading all required env vars once at the top of `handler()` and passing them down as a plain config object — would make this straightforward to test with `vitest`'s `vi.fn()` mocking without any process-env gymnastics.

---

## 4. Folders/files that will become bottlenecks as this scales

### 4.1 — `commercial/shared-styles.css` (1,001 lines) and `commercial/product-styles.css` (3,150 lines) — two large, single-file stylesheets with no component boundaries

At 3,150 lines, `product-styles.css` is the largest single file in the codebase by a wide margin, and per 1.1 above, `shared-styles.css` is a cross-channel dependency. Neither has any internal sectioning enforced beyond comments — there's no CSS Modules, no scoping, no build step to catch an accidental global class-name collision between, say, a `.pc-calc` rule meant for the product-comparison calculator and a similarly-named rule added later for the Personal & Property calculator. As more product pages get added (there are already comparison pages, calculator pages, and guide pages under `commercial/guides/`), this file will keep growing linearly with every new page type, and merge conflicts on it will become increasingly likely with more than one person working on styling concurrently.

**Recommendation:** This is explicitly a Phase 7 (Next.js) concern per `buildspec.md`/`tokens.md`, and I'd treat it that way rather than recommending a mid-flight refactor of the static CSS now — but I'd flag it as a specific, named acceptance criterion for that migration ("no single CSS file over ~500 lines; component-scoped styles only") rather than letting the existing files get copy-pasted forward into the new app structure as-is, which is a real risk given rule 14's requirement that header/footer markup stay "byte-for-byte identical."

### 4.2 — `commercial/components/` exists but is not a real component system — it's reference HTML that has to be manually re-copied into 62 files

**Files:** `commercial/components/navbar.html` (9,932 bytes), `commercial/components/footer.html` (4,166 bytes), `commercial/components/how-it-works.html` (21,139 bytes). `CLAUDE.md` rule 14 makes the manual nature of this explicit: *"Header and footer markup must otherwise be byte-for-byte identical across every page ... Diff against the canonical component after touching any page."* This is a "component" in name only — there's no include mechanism, no templating, no build step that actually enforces the 62 HTML files stay in sync with these three source files. Rule 19 in `CLAUDE.md` documents a real incident from this exact gap: *"contact.html at the repo root was missed by an earlier propagation pass."* This will keep happening, predictably, at the current file count, and will get worse as more pages are added before Phase 7 lands.

**Recommendation:** This is the single highest-value near-term investment available, and it doesn't require waiting for the full Next.js migration: a simple build-time include step (even something as minimal as a Node script using `posthtml-include` or a five-line custom script that replaces `<!-- include:navbar -->` markers with the canonical file's contents at `git commit`/CI time) would convert "diff against canonical component by hand" into "impossible to drift, because it's generated." Given `connect/package.json` already declares `"type": "module"` and Node 20+, this is a same-day addition that meaningfully de-risks every future page addition between now and Phase 7.

### 4.3 — `_internal/_DO-NOT-DEPLOY-design-baseline/` is excluded from Vercel deploys but still lives inside the repo actively being worked in

**File:** `.vercelignore` correctly excludes `_internal/` from the deployed output, and `CLAUDE.md` rule 2 is explicit that this folder is reference-only. This is a reasonable interim choice, not a bug — but it's worth flagging as a bottleneck-in-waiting: the folder contains a near-complete duplicate `shared-styles.css` (1,136 lines, vs. 1,001 in the real `commercial/shared-styles.css`) and full-page HTML mockups, which means anyone new to the repo has two `shared-styles.css` files to potentially confuse, and the design-baseline copy will keep drifting from the real one (it already has 135 more lines) with no mechanism keeping them in sync — which is fine only for as long as everyone remembers rule 2's intent. I'd recommend moving this out of the git repo entirely (Figma, a separate design-reference repo, or a docs site) once its reference value is exhausted, rather than leaving a second copy of every channel's markup sitting in the same repo indefinitely.

---

## 5. Anti-patterns / deviations from stack conventions

### 5.1 — No templating layer for a 62-page static HTML site is itself the core anti-pattern, and it's already acknowledged as such

This isn't a new observation — `CLAUDE.md`'s entire framing ("Converting three channels ... into one Next.js + Payload CMS app") is the project's own acknowledgment that hand-written, hand-copied static HTML doesn't scale past this point, and Phase 6 is explicitly titled "Build Quality & Architecture Fix Pass" in anticipation of exactly these issues. I'm not flagging this as something you don't already know; I'm flagging it so this report gives you a concrete, current-state baseline (4.1, 4.2, 5.2, 5.3) to check the Phase 7 migration's acceptance criteria against, rather than relying on tribal knowledge of "what's currently wrong."

### 5.2 — Cache-busting via manually incremented query strings is error-prone and already inconsistent

**File:** `connect/index.html`: `<link rel="stylesheet" href="/connect/styles/main.css?v=20260811-1"/>` — a manually maintained date-stamp query parameter for cache-busting. This only works if every single reference to `main.css` across all 8 Connect pages is updated in lockstep every time the CSS changes; I did not find evidence of a script or build step enforcing that, which means it's plausible (and, given the propagation-miss incidents already documented in `CLAUDE.md` rule 19, likely) that some pages are currently serving a stale cached CSS version after any deploy where this manual bump was missed on some files. `commercial/` and `personal-and-property/` stylesheets have no cache-busting parameter at all, so this technique isn't even applied consistently across channels.

**Recommendation:** A Vercel-native `Cache-Control` header strategy (short TTL + `stale-while-revalidate`, or content-hashed filenames from a real build step) removes the need for manual version bumping entirely, and is the standard approach once Phase 7's Next.js build pipeline exists — worth confirming it's in that plan rather than assuming the current manual pattern will be carried forward.

### 5.3 — Security headers are configured for one-eighth of the site

**File:** `connect/vercel.json` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, and `Permissions-Policy` headers for all `connect/*` routes. No equivalent `vercel.json` exists for `commercial/` or `personal-and-property/` (confirmed: `find . -name vercel.json` returns only the one file). Given `CLAUDE.md` rule 3 states this is headed toward **one Vercel project, sub-path routing**, this is a good sign that the eventual single `vercel.json` at the new app's root will apply headers site-wide by construction — but in the interim, if `commercial/` or `personal-and-property/` are ever deployed as separate Vercel projects (even temporarily, during migration), they'll ship without these headers unless someone remembers to copy them over, which is the same class of manual-propagation risk as 4.2 and rule 19.

**Recommendation:** If any interim deploy of `commercial/` or `personal-and-property/` happens before the Phase 7 consolidation, copy `connect/vercel.json`'s `headers` block to a matching `vercel.json` at that deploy's root as a pre-launch checklist item.

---

## Proposed near-term structure (before Phase 7, low-effort, high-leverage)

```
tradefunding-website-2/
├── shared/                      # NEW — extracted from commercial/, see 1.1
│   ├── styles/chrome.css        # header/footer/ChannelSwitcher/buttons/containers
│   ├── components/              # navbar.html, footer.html — now genuinely shared
│   └── scripts/consent.js       # NEW — single cookie-consent implementation, see 2.2
├── commercial/                  # channel-specific only, no longer a shared-infra host
│   ├── product-styles.css       # candidate for splitting once >500 lines, see 4.1
│   └── ...
├── connect/
│   ├── api/
│   │   ├── _lib/                 # NEW — see 2.1
│   │   │   ├── origin-check.js
│   │   │   ├── form-token.js
│   │   │   ├── rate-limit.js      # Upstash-backed, per security-audit-report.md Finding 2
│   │   │   └── html-escape.js
│   │   ├── form-token.js
│   │   └── request-call.js
│   └── ...
├── personal-and-property/
└── ...
```

This keeps the current static-HTML-plus-Vercel-functions approach fully intact (no premature framework adoption) while fixing the specific coupling and duplication issues found above, and gives the eventual Phase 7 Next.js migration a cleaner starting point — the `shared/` extraction in particular maps almost directly onto what a Next.js route-group layout would need anyway.

---

## Summary Table

| # | Issue | Category | Files |
|---|---|---|---|
| 1.1 | `commercial/` is a hidden shared-infra dependency for other channels | Separation of concerns | `commercial/shared-styles.css`, both other channels |
| 1.2 | Amortization math coupled to DOM reads | Separation of concerns | `commercial/product-page.js` |
| 1.3 | No logic layer behind two production forms | Separation of concerns | `commercial/contact.html`, `product-page.js` |
| 2.1 | One 228-line handler mixes HTTP/domain/infra concerns | Business logic mixed with infra | `connect/api/request-call.js` |
| 2.2 | Two incompatible cookie-consent implementations | Business logic mixed with infra | `connect/scripts/main.js`, `commercial/cookie-consent.js` |
| 2.3 | Hand-maintained sitemap/robots, already drifted once | Business logic mixed with infra | `commercial/sitemap.xml`, `robots.txt` files |
| 3.1 | All interactive scripts are untestable IIFEs closing over the DOM | Testing / coupling | all `scripts/*.js`, `product-page.js` |
| 3.2 | `process.env` read deep inside call stack | Testing / coupling | `connect/api/request-call.js` |
| 4.1 | Two very large, unscoped CSS files | Scaling bottleneck | `shared-styles.css`, `product-styles.css` |
| 4.2 | "Components" are manually re-copied, not templated | Scaling bottleneck | `commercial/components/*` |
| 4.3 | Design-baseline duplicate already drifting from real CSS | Scaling bottleneck | `_internal/_DO-NOT-DEPLOY-design-baseline/` |
| 5.1 | No templating layer for 62 static pages | Anti-pattern | whole repo (already tracked in `CLAUDE.md`) |
| 5.2 | Manual cache-busting query strings, inconsistently applied | Anti-pattern | `connect/index.html` and others |
| 5.3 | Security headers configured for 1 of 3 channels | Anti-pattern | `connect/vercel.json` only |

**Bottom line:** the codebase is in a coherent, better-than-average state *for a hand-built static site mid-migration* — the Connect channel in particular (form validation, HMAC tokens, pure `compute()` function) shows good instincts that just haven't been applied consistently to the other two channels yet. The highest-leverage fix available before Phase 7 lands is 4.2 (a minimal HTML-include build step) — it directly eliminates the recurring propagation-miss failure mode that `CLAUDE.md` itself documents happening at least twice already (rules 17 and 19).
