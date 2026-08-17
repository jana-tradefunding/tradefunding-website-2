# Build Spec — Trade Funding: HTML → Next.js + Payload CMS → Vercel

**Status: v5 — notes that Phase 5 (page production) ran before the header fix, so the two-tier bug propagated into 62 of 66 HTML files, not just the original set; §11 updated accordingly.** `plan.md` explains *what* and *why*; this explains *how to build it*. `Master Information Architecture & Sitemap.md` is the canonical source of truth for URLs, collection modeling, and routing — this file translates it into concrete build tasks and should never contradict it. If the two ever disagree, the IA doc wins and this file needs updating.

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

These rules apply specifically to the 30+ static HTML pages produced in Phase 5, before the Payload/Next.js conversion in Phase 6 — they exist because a raw multi-folder HTML build breaks in ways a Next.js app wouldn't.

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
