# Build Spec — Trade Funding: HTML → Next.js + Payload CMS → Vercel

**Status: v8 — adds §14, the technical companion to plan.md's new Phase 8 (Final Pre-Deployment Fix Pass). The Payload/Vercel conversion is renumbered Phase 9 throughout.** `plan.md` explains *what* and *why*; this explains *how to build it*. `Master Information Architecture & Sitemap.md` is the canonical source of truth for URLs, collection modeling, and routing — this file translates it into concrete build tasks and should never contradict it. If the two ever disagree, the IA doc wins and this file needs updating.

---

## 1. Stack (unchanged from v1)

- **Framework:** Next.js (App Router), TypeScript.
- **CMS:** Payload CMS 3.x, installed in the same Next.js app.
- **Database:** Postgres (Vercel Postgres or Neon) via Payload's Postgres adapter.
- **Media storage:** Payload's Vercel Blob storage adapter — migrate `commercial/assets/**`, `connect/branding/**`, and whatever Personal & Property assets get produced into Blob storage, not committed to the repo long-term.
- **Styling:** Keep the existing CSS approach (`shared-styles.css`, `product-styles.css`, `connect/styles/main.css`) extracted into the token system defined in `tokens.md`, rather than a Tailwind rewrite.
- **Hosting:** **One Vercel project** (see §7 — this is a change from v1's three-project assumption).

---

## 2. Architecture — one app, sub-path routing (REPLACES v1's three-subdomain model)

Per `Master Information Architecture & Sitemap.md` §1/§11: Commercial, Connect, and Personal & Property are **three Next.js route groups in one app, on one Vercel project, sharing one Payload backend** — not three subdomains, not three separate deployments.

```
/site
  /app
    /(commercial)          → resolves at / (root)
    /connect                → resolves at /connect/*
    /personal-and-property → resolves at /personal-and-property/*
  /collections
  /globals
  /components
    ChannelSwitcher.tsx
    Header.tsx
    Footer.tsx
    ...
  /payload.config.ts
```

- Shared components — header shell (channel-switcher-aware), footer, legal globals — live outside all three route groups and are composed into each channel's layout. This is what makes all three read as *channels of one platform* rather than three bolted-together sites.
- Each route group applies its own accent theme (from `tokens.md`) and its own nav state, but shares the same underlying component library.
- Switching channels via `ChannelSwitcher` is a same-origin route change (`/` ↔ `/connect/` ↔ `/personal-and-property/`), never a cross-domain redirect. This preserves one domain's accumulated SEO authority across all three channels — the reason this replaced the original subdomain idea.

### `ChannelSwitcher` component spec (updated — single strip, always-three-visible; overrides earlier two-tier-implying spec)

- **Renders inside the single header strip, alongside the logo and primary nav — never as a separate tier/utility bar above or below it.** One row: logo (left) → Products / Why Us / Resources / Partners (center) → `ChannelSwitcher` (right, compact segmented control or dropdown). 🔴 **Correction, and updated scope:** an earlier version of this spec described the switcher as a "top-bar control... outside the main product-navigation row," which was ambiguous enough to produce a real two-tier header (a `.utility-bar` strip on top, a separate `.navbar` strip below). That interpretation is now explicitly wrong — there is exactly one header strip. **Because Phase 5 (page production) ran before this fix, the two-tier structure has since been copied into 62 of 66 HTML files** (Commercial, Connect, and Personal & Property alike) — the fix now needs to touch the canonical component *and* re-propagate across all affected files, not just correct one source file. See `prompts.md` Prompt 5-fix.
- **Always shows all three channels, on every page, regardless of which one is current:** Home icon + "Home" text (Commercial — never the word "Commercial"), **Connect**, **Personal & Property**. This overrides the earlier spec, which only showed the two *other* channels and hid the current one — that approach doesn't hold up well across a 30+ page raw-HTML build where the switcher itself needs to look and behave identically on every page.
- **Active state (required):** the current channel gets a distinct `.active` CSS treatment — underline, bold text, or a background/border tinted to that channel's own accent color from `tokens.md` (skyblue for Commercial, gold for Connect, peach for Personal & Property). This is what tells the visitor where they are, now that all three are always visible.
- Icon-plus-label on desktop, icon-only on mobile, for all three entries.
- Contrast: verify all three entries (active and inactive states) against each channel's own background — Commercial's light background, Connect's gold-dominant hero, Personal & Property's peach-dominant hero — not just a single "home page" case.

---

## 3. Payload Collections & Globals (terminology aligned to the IA doc's `parent` field, replacing v1's `category` field)

### Collections

**`pages`** (Product Pages)
- `title`, `slug` (exact match to the flat URL in the IA doc — no auto-slugify)
- `channel` (select: commercial / connect / personal-and-property)
- `parent` (relationship — conceptual grouping only, e.g. "Business Loans," "Trade Finance," "Connect," "Personal & Property," "Guides & Resources." **Drives breadcrumbs and nav-grouping only — has no effect on the URL**, per IA §11.)
- `hero` (group: eyebrow, headline, subhead, CTA link/label)
- `seo` (group: metaTitle, metaDescription, canonicalUrl, noindex toggle)
- `body` (rich text / layout builder blocks — see §3 Blocks)
- `redirectFrom` (array of legacy slugs that 301 here — see §4)

**`guides`** — same shape as `pages`, `parent: "Guides & Resources"`, already flat under `/guides/*`.

**`teamMembers`**, **`lenderLogos`**, **`testimonials`** — unchanged from v1.

### Globals

**`header`** (single global, channel-switcher-aware — not per-channel, since all three channels share one header shell per IA §11)
**`FooterLegal`** (single global: ACL number, AFCA badge, Credit Guide/Terms/Privacy links — one instance powering all three channels' footers, per the locked "componentize once" decision)
**`siteSettings`** — company name, contact details. 🔴 Address field stays empty with a required-before-publish validation, per the standing "don't guess" rule — this blocker is scheduled for resolution at Phase 3 kickoff (see `plan.md` §1), not chased immediately.

### Blocks

Unchanged from v1: `ProductComparisonTable`, `CalculatorEmbed`, `LenderLogoStrip`, `FAQAccordion`, `CTABanner`, `GuideCTA`, `TrustProofPoints`.

### Breadcrumbs

Computed from the `parent` relationship field, rendered via a shared breadcrumb component (no CMS SEO plugin — there's no WordPress/Yoast/RankMath layer in this stack). Examples straight from the IA doc: `Home > Business Loans > Invoice Finance`, `Home > Business Loans > Trade Finance > Export Finance`, `Home > Connect > For Vendors`, `Home > Personal & Property > Investment Property Loans`.

---

## 4. URL preservation & redirects (updated with the Duplicate Resolution Log)

`Master Information Architecture & Sitemap.md` §9 ("Duplicate Resolution — Consolidated Log") is now the single confirmed source of truth for every cross-asset conflict — treat it as the migration checklist, not just reference:

- `apply.html` wins over `trade-funding-website-application.html` → 301 to `/apply/`, no content merge needed (strict subset).
- `invoice-finance.html` wins over `debtor-finance.html` → keep `/invoice-finance/` only; merge unique whole-ledger content in before retiring `debtor-finance.html`, then 301.
- `best-line-of-credit.html` and `business-line-of-credit-guide.html` — **both kept**, roles differentiated (listicle vs. pillar guide) — not a redirect case.
- `equipment-calculator.html` is the canonical standalone tool; `lease-vs-buy.html`'s embedded calculator is a shared component instance of the same logic, not a separate build.
- `/resources/` → `/guides/` (renamed hub) — 301.
- Core `/about/`, `/apply/`, `/contact/` all win over their Connect-specific equivalents by architecture (shared component / parameterized entry point / query-param routing), not by redirect — see IA §6.

Redirects live in the Vercel/Next.js redirects config, not a CMS redirect plugin.

---

## 5. Connect — concrete re-skin task list (from the hit list, validated against `design baseline/connect.html`)

Connect moves to `/connect/*` as a sub-path route group (not a subdomain). Rename pass: remove every remaining "Fundit" reference, including in `connect/README.md`.

**Color/contrast fixes required on the real `connect/index.html`** (do not just copy `design baseline/connect.html` — replicate its *decisions* into the real file, since the baseline folder itself is out of scope for the build):
1. Replace fake off-token colors `#EAB308` / `#FACC15` with the real `--gold` / `--gold-soft` tokens from `tokens.md`.
2. Flip hero, commission strip, and legacy CTA from navy-dominant/gold-accent to **gold-dominant/navy-accent** — backgrounds, text, buttons, card panel, and badges all swap roles.
3. Fix low-contrast gold-as-text spots (step numbers, FAQ plus-icon, inline eyebrow labels) to navy. Re-check the ≥4.5:1 contrast ratio from `connect/docs/design-spec.md` §12 wherever navy-on-dark becomes navy-on-gold.
4. Add a dark-on-light navbar override (logo, nav links, hamburger, `ChannelSwitcher`) so nav elements stay visible against the now-light gold hero.
5. Fix logo paths to `logo-navy.png` / `logo-white.png`.
6. No peach anywhere in the Connect build — it's reserved for Personal & Property.

**CTA/copy:** "Become a Partner" is the sole primary CTA sitewide across Connect, replacing the old two-path pattern (`design-spec.md`'s "Request a call" / "Register your business") — reconcile these into supporting actions, not competitors.

**Audience framing — RESOLVED (was previously flagged as a conflict).** `connect/docs/design-spec.md` §2 described a broader audience ("trades... stock/supplies wholesalers"), while the newer meeting notes narrowed it to B2B equipment sellers and professional-services firms. The returned Executive Questionnaire (`docs/Executive Questionnaire for Personal and Property and Connect.docx`, Connect Q7) confirms the narrower framing directly: **"B2B providers (equipment of any kind, sold B2B, and/or professional services)"** — explicitly not retail/healthcare. Treat the design-spec's broader wording as superseded; apply the confirmed narrower audience in all Phase 3 Connect copy. See `plan.md` §5.2 for the full extracted questionnaire input.

Keep `api/form-token.js` and `api/request-call.js` functionally as-is, ported into `/app/api/` routes rather than rewritten from scratch. Keep the Cashper mascot wherever it currently appears — explicit "never remove" instruction.

---

## 6. Personal & Property — concrete build task list

This is genuinely net-new, not a conversion. Structure and page list come from `Master Information Architecture & Sitemap.md` §7 (home + 8 loan-type pages + apply + about, all under `/personal-and-property/*`). Actual page copy is **not** invented from the design-baseline reference — it depends on the Executive Questionnaire content once supplied.

**`design baseline/personal-and-property.html` is a color/button reference only** — apply these decisions to the real build, don't copy the file:
1. Replace fake orange (`#F97316` family) with real `--peach` / `--peach-soft` tokens.
2. Hero: peach-dominant background/text/buttons/trust icons, navy accent.
3. Hero card panel: white surface with navy ink (not a colored panel).
4. Product-card icons: navy, for legibility against peach.

**Flagged, unresolved cross-channel overlap:** `/personal-and-property/commercial-property-finance/` needs a cross-check against `/second-mortgage/` and `/self-employed-home-loan/` (Commercial channel, §3.6) once both channels have final copy — don't resolve this silently, flag it.

**Channel placement decision needed (hit-list item 43):** `self-employed-home-loan.html` currently sits in the Commercial product taxonomy as a category outlier (property/consumer lending inside an otherwise commercial-lending set). With Personal & Property now standing up, Claude Code should decide — and document the reasoning for — whether this becomes a cross-link between channels or an eventual migration into Personal & Property. Don't decide silently; note the call made and why.

---

## 7. GoogleReviews Component (unchanged in spec from v1; blocker timing updated)

Same requirements as before — responsive, `next/script` `strategy="lazyOnload"`, SSR-safe, homepage-only (Commercial), doesn't compete with the "Compare Report" CTA, honest fallback linking to the real Google listing rather than a fabricated number. The 🔴 blocker (actual current review count, real widget script/API key) is **explicitly scheduled for Phase 3 kickoff now** (see `plan.md` §1) rather than being chased before the component is even scaffolded — build the component with clearly marked TODOs in the meantime.

---

## 8. Deployment (REWRITTEN — one project, not three)

- **One Vercel project**, one Next.js app, sub-path routing (`/`, `/connect/*`, `/personal-and-property/*`) — this replaces v1's three-projects/three-subdomains plan entirely.
- Payload admin + API run inside the same app (Payload's Next.js integration), not a separate deployment.
- Reuse `connect/vercel.json`'s existing security-header and clean-URL config as the baseline, merged into the single project's `vercel.json`.
- Environment variables: extend `connect/.env.example` as the shared template (form-token secret, email/Slack webhook, Payload DB connection string, Blob storage token, Google Reviews widget key once supplied).
- Redirects (§4 above) configured once, sitewide, in this single project's Vercel/Next.js redirects config.
- Do not run an actual production deploy without explicit confirmation in chat first, every time.

---

## 9. SEO carry-over (unchanged from v1)

- Reuse `commercial/sitemap.xml` / `commercial/robots.txt` as the starting point; regenerate dynamically from the `pages`/`guides` collections once migrated.
- Pre-fill every migrated page's `seo.metaTitle`/`metaDescription` from the existing HTML's `<title>`/meta description, cross-checked against `SEO_Audit_Report.md` and `SEO Roadmap.md` for already-identified fixes to apply during migration.
- All Phase 3 copy work must run against `SEO_Audit_Report.md`'s comments as explicit guardrails — see the updated `prompts.md` Prompt 3 for how this is operationalized as a checklist rather than background reading.

---

## 10. Static-HTML build hygiene (NEW — for the Phase 5 raw-HTML build, before Next.js exists)

These rules apply specifically to the 60+ static HTML pages produced in Phase 5, before the Payload/Next.js conversion in Phase 9 — they exist because a raw multi-folder HTML build breaks in ways a Next.js app wouldn't.

- **Header/footer parity:** `commercial/components/navbar.html` and `commercial/components/footer.html` are the single canonical markup source. Every page on every channel includes this exact markup — same wrapper `div`s, same classes, same padding — never a hand-copied variant. A single missing wrapper causes a visible layout jump between pages.
- **Root-relative paths only:** every `href` and `src` — nav links, footer links, CSS `<link>` tags, images — must be root-relative (`/connect/about.html`, `/commercial/assets/logo-navy.png`), never relative (`../assets/logo.png`, bare `about.html`). Relative paths resolve differently depending on folder depth and will silently break for any page more than one folder deep, even though they look fine from the homepage.
- **Em-dash replacement:** replace `—` with a **spaced hyphen** (` - `), not a bare hyphen jammed between words — bare hyphens can visually squish adjacent words together.
- **No spaces in folder or file names**, anywhere in the site tree — Vercel routing breaks on them. See Phase 5.5 for the specific `personal and property/` duplicate this rule catches.

---

## 11. Phase 5.5 — Cleanup spec (companion to plan.md §8)

Concrete technical detail for the cleanup phase between HTML production and Payload conversion:

- **Confirm gone** — `personal and property/` (the space-containing duplicate of `personal-and-property/`) is no longer present as of the latest zip. Re-verify at the start of this phase in case it reappears.
- **Delete**, after confirming redirects are documented per §4 above: `commercial/debtor-finance.html`, `commercial/trade-funding-website-application.html` (both still present as of the latest zip), and `commercial/resources.html` (only once its content is fully absorbed into the `/guides/` hub, already built in Phase 5).
- **Audit, don't blind-delete:** unreferenced CSS rules, orphaned images, unused JS — flag candidates in `cleanup-report.md` for confirmation before removing anything not explicitly named above.
- **Re-run the header/footer parity check** (§10) across every page as a gate before Phase 6 starts.
- Output: `docs/cleanup-report.md`, listing what was deleted and why, what's flagged but unconfirmed, and any path/header issues found and fixed.

---

## 12. Phase 6 — Build Quality & Architecture Fix Pass (NEW, companion to plan.md §9)

Technical detail for each fix area — full rationale lives in `plan.md` §9:

- **`contact.html`:** relocate from repo root to `commercial/contact.html`; update every inbound link (Personal & Property pages currently link to it) to the new root-relative path; rebuild its header using the corrected single-strip component.
- **Trust bar:** a persistent, sitewide element (rating/reviews/ACL/AFCA/lender-count) rendered above the header row on every page — same markup/CSS everywhere, pinned via normal document flow (not `position: fixed` unless the header itself is also fixed — don't mix fixed and static positioning between the trust bar and the nav row, that's how bars silently overlap or hide content).
- **Deploy-root hygiene:** relocate `design baseline/` and `connect/tests/calculator-test.html` to a folder excluded from Vercel's build output (`.vercelignore` or equivalent) rather than just renaming in place.
- **Inline styles → tokens:** a mechanical find-and-replace pass, file by file, converting inline `style="color: #54B4F6"`-type declarations into class references (`.icon--sky`) defined once in a shared stylesheet driven by `tokens.md` values — no visual change expected, just markup cleanup.
- **Accessibility landmarks:** `<header>`/`<main>` wrap at the canonical component/template level (same principle as the header-parity rule in §10) so the fix propagates the same way any other header change does.
- **`sitemap.xml`:** regenerate from an actual directory listing of live pages rather than hand-maintaining it further, to prevent this kind of drift recurring.
- **Templating decision (9.3):** if the team chooses option (a) — adopt a templating layer — do this *before* any further Phase 5-style raw HTML production, since it changes how header/footer changes propagate from here on. If the team chooses option (b) — treat Phase 6 as the last raw-HTML pass — proceed to Phase 7 (pre-migration remediation, §13) once `docs/fix-report.md` is complete, then Phase 8 (final fix pass, §14), then Phase 9.

---

## 13. Phase 7 — Pre-Migration Remediation (companion to plan.md §10)

Technical detail for each fix area — full rationale and priority order live in `plan.md` §10.

**Address/email (10.1):** two content spots per file, four total — `commercial/credit-guide.html` and `commercial/terms.html` each have a body-content placeholder and a separate footer placeholder. A single find-and-replace across all HTML files for `hello@tradefunding.com.au` → `support@tradefunding.com.au` covers the 51 affected files (Connect needs none — already consistent).

**Nav wording (10.2):** a label-only change on the existing four-slot header structure built in Phase 6 — no new dropdown logic, no new destination URLs except the new "Compare Options" mapping, which should be confirmed before wiring.

**Security fixes (10.3), technical notes:**
- Rate limiting → `@upstash/ratelimit` + `@upstash/redis`, `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` env vars, sliding-window limiter per IP, separate hourly/daily buckets as today but backed by shared external state instead of a per-instance `Map`.
- Turnstile: `TURNSTILE_SECRET_KEY` env var, verify server-side inside the existing origin-check flow, not replacing it.
- New endpoints needed: `/api/broker-lead` (Broker Portal form), a real endpoint for `commercial/contact.html`, and a real (or explicitly disabled) path for the comparison-report download gate — all should import from the shared `_lib/` (see architecture fix below) rather than re-implementing origin-check/token/rate-limit/escape logic.
- Token rotation: `KEY_VERSION` prefix (`v1.{payload}.{hmac}`) so `FORM_TOKEN_SECRET_V2` can be introduced later without breaking in-flight tokens.

**Architecture fixes (10.4), technical notes:**
- HTML-include step: a Node script (matches `connect/package.json`'s existing `"type": "module"`, Node 20+ — no new runtime dependency needed) that replaces `<!-- include:navbar -->`-style markers with canonical file contents at commit/CI time. Wire this in before doing any further manual page edits, since it changes how every subsequent header/footer change gets applied.
- Shared chrome CSS: new `shared/styles/chrome.css`, referenced by all three channels; `commercial/shared-styles.css` keeps only genuinely Commercial-specific rules after the split.
- `connect/api/_lib/`: `origin-check.js` (`fromAllowedOrigin(req, allowedOrigins)`), `form-token.js` (`issueToken`/`verifyToken`), `rate-limit.js` (the Upstash-backed limiter, in one place), `html-escape.js` (`escapeHtml`). Every new and existing endpoint imports from here going forward.
- Cookie consent: one shared cookie key (recommend retiring both `tf-connect-cookie-consent` and `blc_cookie_consent` in favor of a new, non-legacy-named key, e.g. `tf_cookie_consent`), implemented once in `shared/scripts/consent.js`.
- `calcMonthly()` and `request-call.js` refactors: pure-function extraction only, no behavior change — these exist specifically to make 10.5's test suite possible.

**Dependency fixes (10.5), technical notes:** exact `connect/package.json` diff from the dependency report:
```json
{
  "name": "vendor-landing",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "devDependencies": {
    "vitest": "^2.1.0",
    "eslint": "^9.13.0"
  },
  "scripts": {
    "test": "vitest run",
    "lint": "eslint ."
  }
}
```
No production dependencies added. Re-audit this file (and the new one that appears once Phase 9's Payload/Next.js scaffold exists) with the same five-category dependency analysis before Phase 9's first production deploy. ⚠️ **This §13 block was never actually executed** — see §14 (Phase 8 §11.9) for the follow-through.

---

## 14. Phase 8 — Final Pre-Deployment Fix Pass (companion to plan.md §11)

Technical detail for each fix area — full rationale and priority order live in `plan.md` §11.

**8.1 — Include-sync + hero/header overlap:**
- Convert 63 pages to the `<!-- include:start src="/commercial/components/navbar.html" --> ... <!-- include:end -->` marker pattern already proven in `commercial/business-loans.html`, `connect/for-vendors.html`, `personal-and-property/personal-loans.html`. Run `node connect/scripts/build-includes.mjs` to re-inline after adding markers to each file, then `--check` to confirm.
- Wire `npm run build:includes:check` into `.git/hooks/pre-commit` (or a CI step, if one exists/gets added — none does currently) so drift fails the build.
- Hero padding fix: `.hero { padding: calc(var(--utility-bar-height, 37px) + 80px + 32px) 0 0; }` on Commercial; verify Connect's `padding:clamp(64px,8vw,112px) 0 ...` and Personal & Property's `.pp-hero` equivalent both clear the same stack height, especially at mobile widths where the switcher may wrap.

**8.2 — Branding/visual cleanup:** all propagation-dependent, so sequence after 8.1. Emoji removal is a pure deletion (no replacement markup needed) in both `navbar.html` (20 `dd-icon` spans) and the three footer components (3 emoji entities each). Casper fix is a one-line class swap. Products page: reuse `business-loans.html`'s existing include-sync wiring and category-grouping markup as the starting template. Address propagation: the footer instances ride the include-sync fix; the two non-footer body-content instances (per Security Finding 6's file list) need a direct find-and-replace.

**8.3 — Animation/a11y polish:** P&P hero reveal classes — copy Connect's exact stagger pattern (`reveal delay-1` through `delay-5`) onto the six `.pp-hero__*` elements listed in plan.md §11.3. Dropdown a11y — add `aria-expanded="false"` to the trigger, toggle to `"true"` on click/focus, add a click-outside/`Escape`-key close handler; keep the existing `:hover` CSS as a progressive enhancement for mouse users rather than removing it. Touch targets — `@media (max-width: 640px) { .channel-switch__option { min-height: 44px; padding: 12px 10px; } }`, adjusting existing padding values rather than only adding `min-height` (a `min-height` alone won't help if internal padding still visually crowds the tap target).

**8.4 — CSP/HSTS:** add to `connect/vercel.json`'s existing `headers` array as two more objects in the same `headers` list for the `/(.*)"` source; create equivalent `vercel.json` files at `commercial/` and `personal-and-property/` roots if those are ever deployed as separate projects before Phase 9, otherwise this is moot once Phase 9's single `vercel.json` exists — do the per-channel version now regardless, since Phase 8 is explicitly the last pass before *some* deployment, even if Phase 9 later consolidates it.

**8.5 — Consent + Turnstile:** consent script tag is identical across all 11 P&P pages — a single find-and-replace once include-sync (8.1) covers them, or a direct edit now if simpler given there are only 11. Turnstile: add the widget script (`https://challenges.cloudflare.com/turnstile/v0/api.js`) and a `<div class="cf-turnstile" data-sitekey="...">` to Connect's request-call form; in `scripts/form.js`, read `document.querySelector('.cf-turnstile')`'s response (via the Turnstile JS callback or reading the hidden input it injects) into the `turnstile_token` field of both the token-fetch query string and the submit POST body.

**8.6 — Shared regex + notify.js:** `connect/api/_lib/validation.js` exporting `EMAIL_RE`/`PHONE_RE` (or validator functions), imported by `request-call.js` server-side; client-side, either duplicate the literal regex with a comment pointing at the shared source (simplest, given no bundler exists to actually share an ESM module with a plain `<script>` tag) or convert `form.js` to `<script type="module">` if that's an acceptable change — flag which approach before implementing, since it's a real choice, not just extraction. `_lib/notify.js` exports `renderLeadEmail(fields)` / `renderSlackMessage(fields)`, parameterized so a future `broker-lead` handler can reuse them with different field sets.

**8.7 — Performance/SEO:** image dimension pass is a good candidate for a one-off Node script (`scripts/add-image-dims.mjs`, read each referenced image with a lightweight dimension-reader, inject `width`/`height` into the matching `<img>` tag) rather than 73+ manual edits — consider keeping this script in the repo since new images will keep needing it. WebP conversion likewise scripted (`sharp` or `squoosh-cli` as a one-time devDependency, not a runtime one). OG/sitemap/robots fixes are straightforward per-file additions using Connect's existing files as the template.

**8.8 — Resilience/observability:** retry helper as a small `withRetry(fn, {attempts: 3, baseDelayMs: 300})` utility in `connect/scripts/` (or `shared/scripts/`, since P&P/Commercial may eventually need it too), wrapping the two `fetch()` calls in `form.js`. Global error handler and Sentry init both belong in `shared/scripts/`, loaded on every page — Sentry's `beforeSend`/`beforeBreadcrumb` hooks are the mechanism for the PII-scrubbing requirement, not a manual filter written from scratch.

**8.9 — Dependency/process hygiene + CSS consolidation:** the exact devDependency block is already specified in §13 above — just actually run it this time, plus `npm install && git add connect/package-lock.json`. For the CSS consolidation, `commercial/index.html`'s 4 `<style>` blocks should merge into 1, with the "LIGHT HERO OVERRIDES (preview variant)" block's rules renamed to a `.hero--light-preview` modifier class and the markup that currently relies on the cascade order updated to include that class explicitly, rather than relying on document-order override.

**8.10 — Closing QA:** `docs/phase8-report.md` should reference the six source report filenames directly (`architecture-review-report.md`, `dependency-risk-report.md`, `performance-seo-report.md`, `security-audit-report.md`, `state-resilience-observability-report.md`, `ui-ux-a11y-report.md`) and, for each, list which findings were fixed in this phase versus explicitly deferred to Phase 9 with the reason from plan.md §11.10's final bullet.
