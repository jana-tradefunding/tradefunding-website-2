# Build Spec — Trade Funding Homepage-First Rebuild

**Status: v8.** Two locked decisions this revision, both confirmed against the actual repo (`ui-mockups.zip`), not just the brief: **Option A** — Commercial products, guides, tools, and Compare are nested under `/commercial/`, reversing the earlier flat-at-root default. **No `/site/` wrapper folder** — the static build lives directly at the true repo root, alongside the Payload app's own folders (untouched since Phase 0) and `docs/`, `branding/`, `oldsite/`, `ui-mockups/`, `qa/`. Personal & Property's real folder is hyphenated `/personal-and-property/` — corrects every prior mention of `personalandproperty`. **No build script exists or is planned** — the site is hand-authored static HTML, decided in prior sessions; §2 explains what replaces the manifest-driven approach this doc used to describe. If this ever contradicts `plan.md`, `plan.md` wins.

---

## 1. Stack

- **Static site (current phase):** plain HTML5, CSS custom properties (`assets/css/tokens.css`, `base.css`, `components.css`), vanilla JS where needed (`assets/js/main.js`, page-local `support.js` files). Each page is self-contained — no shared HTML partial system. See §2 for why, and what replaces it.
- **Payload conversion target (Phase 9, untouched since Phase 0):** Next.js (App Router), TypeScript, Payload CMS 3.88.0, Postgres (Neon via Vercel), Vercel Blob storage. One Vercel project.

---

## 1a. Design Corrections — strict, sitewide, non-negotiable

**No icons, anywhere — one exemption.** Categories, channels, and navigation are differentiated through typography, layout, and colour only. **The sole exemption: the home icon in the Channel Toggle** (the Home/Commercial/Connect/Personal & Property switcher shown on the three channel pages, and on Compare) — that icon stays, confirmed both in the updated brief and in the actual Phase 4 `component-channel-toggle` mockup, which was built with it intentionally. Every other icon anywhere on the site is out of scope for this exemption — including Connect's FAQ accordion chevrons, which are a confirmed, unexempted violation (see §11).

**Heading weight capped at Bold (700).** Default to Semibold (600) for most headings — confirmed as the actual value in the live `base.css` — reserving Bold (700) for hero-level statements only. Never 800/900.

**Typeface: DM Sans only, sitewide.** The earlier Work Sans (headings) + DM Sans (body) split is dropped entirely — confirmed in the live `tokens.css`, both `--font-heading` and `--font-body` resolve to `'DM Sans'`. DM Sans has enough character at a lighter weight to command the page without a second typeface.

---

## 2. Routing architecture — Option A (consolidated `/commercial/`)

```
/                                         → Home (index.html, root)
/404.html                                 → 404 (root)
/home-shared/about/                       → About Us (full)
/home-shared/apply/                       → canonical shared intake engine, ?purpose= parameterized (no per-channel entry pages — see note below)
/home-shared/broker-portal/
/home-shared/credit-guide/
/home-shared/terms/
/home-shared/privacy/                     → 🔴 does not exist yet — see §11
/home-shared/contact/                     → 🔴 does not exist yet — see §11
/commercial/                              → Commercial Hub
/commercial/products/                     → Products Hub
/commercial/business-term-loans/          → Individual Product Page (built)
/commercial/business-line-of-credit/      → Individual Product Page (not yet built — see §12)
/commercial/overdraft/
/commercial/charge-card/
/commercial/chattel-mortgage/
/commercial/finance-lease/
/commercial/operating-lease/
/commercial/invoice-finance/
/commercial/fund-an-invoice/
/commercial/trade-finance/
/commercial/export-finance/
/commercial/supply-chain-funding/
/commercial/merchant-cash-advance/
/commercial/r-and-d-funding/
/commercial/compare/                      → Compare Overview (built, but a pre-redesign stub — see §11)
/commercial/compare-report/               → Compare Report (built)
/commercial/guides/                       → Guides Hub (built)
/commercial/guides/business-term-loans/   → Individual Guide Article (built — slug doesn't carry the "-guide" suffix the other 8 planned guides use, flagged in §12)
/commercial/guides/compare-business-loans/          → not yet built
/commercial/guides/best-line-of-credit/             → not yet built
/commercial/guides/business-line-of-credit-guide/   → not yet built
/commercial/guides/business-charge-card-guide/      → not yet built
/commercial/guides/business-overdraft-guide/        → not yet built
/commercial/guides/business-loan-bad-credit/        → not yet built
/commercial/guides/invoice-vs-debtor-finance/       → not yet built
/commercial/guides/lease-vs-buy/                    → not yet built
/commercial/repayment-calculator/         → Calculator Tool Page (built)
/commercial/equipment-calculator/         → Calculator Tool Page (not yet built)
/commercial/lenders/                      → Lender Panel — was blocked pending logo assets; 12 lender SVGs now exist in assets/img/lenders/, worth reconfirming whether this is still blocked (§12)
/connect/                                 → Connect Hub (built)
/connect/how-it-works/                    → built
/connect/for-vendors/                     → 🔴 not yet built — no mockup exists either, see §11
/connect/for-customers/                   → 🔴 not yet built — no mockup exists either, see §11
/connect/faqs/                            → built, but 5 chevron icons need removing (§11)
/personal-and-property/                   → P&P Hub (built)
/personal-and-property/home-loans/        → built
/personal-and-property/investment-property/  → built
/personal-and-property/commercial-property/  → built
/personal-and-property/construction/      → built
/personal-and-property/smsf-property/     → built
/personal-and-property/personal-loans/    → built
/personal-and-property/debt-consolidation/ → built
/personal-and-property/second-mortgage/   → built — confirms this migrated here from Commercial, resolving the prior open question
/personal-and-property/self-employed-home-loans/ → built — same, migrated from Commercial
```

**No `/connect/apply/` or `/personal-and-property/apply/` entry pages.** An earlier version of this plan had per-channel parameterized entry pages funnelling into the shared Apply engine. That's not what got built — there's one Apply page (`/home-shared/apply/`), parameterized via `?purpose=`, confirmed working end-to-end (S.T.A.R. eligibility engine recalculates, match cards render) in the 2026-08-24 QA audit. Simpler than originally planned — no change needed, just correcting the doc to match reality.

**No "About (thin)" template.** Every channel's nav links "About" straight to `/home-shared/about/` — confirmed in the live markup on all three channel hubs. No per-channel thin About page exists or is needed; this template is dropped from the plan entirely.

### Repo-root folder structure

```
/
  index.html                 ← Home, the only content HTML file allowed loose at root
  404.html                   ← the only other one
  /home-shared/
  /commercial/
  /connect/
  /personal-and-property/
  /assets/                   ← css/, js/, img/ — shared stylesheets and script, referenced (not included) per page
  /ui-mockups/                ← Phase 4 design source, 17 numbered templates + 2 components
  /oldsite/                   ← quarantined legacy build, never served
  /qa/                         ← audit reports (e.g. 2026-08-24-site-audit.md)
  /docs/                       ← this doc set: plan.md, buildspec.md, prompts.md, and any redirect/route-map docs (claude.md and tokens.md live at true repo root, not here)
  /branding/                   ← brand guideline assets, logo source files
  [Payload/Next.js app files] ← app/, collections/, payload.config.ts, package.json, etc. — scaffolded in Phase 0, untouched until Phase 9
```

---

## 3. Shared components — real state: duplicated per page, not templated

**Why there's no shared partial system.** An earlier version of this doc specced a manifest-driven build (`pages.json` + `build.mjs`) specifically to prevent shared-component drift across many pages. That approach was never adopted — decided against in prior sessions on this repo. The actual site is hand-authored: each page carries its own copy of the nav, footer, and (where applicable) Channel Toggle markup, referencing the shared CSS files but not any shared HTML. **This is a locked, already-made decision, not something this revision is reopening** — but it means the exact risk the build script was meant to prevent has already partially materialized (see §11): four different, mutually-inconsistent footer implementations exist across the pages built before the last two sessions' cleanup pass.

**What replaces build-time enforcement:** periodic manual audits, like `qa/2026-08-24-site-audit.md`. There's no automatic guarantee that a nav/footer change propagates everywhere — every page-adding or shared-markup-changing prompt in `prompts.md` now explicitly asks Claude to check its work against the *other* pages sharing that same markup pattern, since there's no script to catch a miss.

### Nav bar
Universal across every page: **Products / Compare / About**, three items only. "Products" content swaps per active channel. Confirmed byte-for-byte identical across all pages that carry it in the 2026-08-24 audit — this part has held up despite the no-build-system approach.

### Products mega-menu
Context-aware, duplicated per page (not a shared partial):

| Channel | Bold heading on hover | Content |
|---|---|---|
| Commercial | **FUND MY BUSINESS** | links to `/commercial/products/` and its category pages |
| Connect | **SUPPORT CLIENT PAYMENTS** | vendor/customer finance options |
| Personal & Property | **FUNDING OWNERS RUNNING BUSINESS** | the 9 service categories (7 original + second-mortgage + self-employed-home-loans) |

### Compare nav item
Hover reveals "Which Option is Best" → links to `/commercial/compare/`.

### Channel Toggle
- 4 destinations: Home (**icon exempted, see §1a**) → `/`, then Commercial, Connect, Personal & Property.
- Present on `/commercial/`, `/connect/`, `/personal-and-property/`, and `/commercial/compare/`. Not shown on the homepage or any brand-neutral page.
- Own visual identity: border + shadow, distinct from the nav bar — confirmed compliant in the QA audit.

### Footer
Global pattern, meant to be identical everywhere: 4 columns (Brand/contact, Channels, Company, Legal) + 4 badges (ACL 387856, AFCA Member, CAFBA, Fintech Australia, all plain-text `<span>`, zero icons) + full copyright line. **Currently only true on the 7 brand-neutral pages** (`index`, `404`, `about`, `apply`, `broker-portal`, `credit-guide`, `terms`) — the four channel-rooted pages each have a different, non-compliant footer. This is the single largest outstanding defect on the site — see §11.

---

## 4. Homepage-specific components

- **Hero:** master statement + Commercial's primary CTA. No calculator, no photography.
- **"Three ways we help business owners" section:** large framed channel boxes, Commercial leading, Connect and Personal & Property as extensions with locked taglines + hover-reveal supporting lines.
- **"Compare 100+ products" moment:** design element, not a paragraph.
- **"Why we exist" section:** status still unconfirmed from earlier revisions — see `plan.md` §2.

---

## 5. Compare page (`/commercial/compare/`)

Nested under Commercial per Option A. **Built, but flagged as a pre-redesign stub in the 2026-08-24 audit** — missing the Products mega-menu, About link, and Contact CTA in its nav; footer is a single unstyled line with no columns or badges. This needs rebuilding to match the other 10 compliant pages before it's considered done — see §11 and `plan.md` Phase 5 for the concrete fix.

- Explains the Cashper matching engine, 70+ lenders, 100+ products.
- Showcases the S.T.A.R. Compare Report — links through to `/commercial/compare-report/` for a sample (built, compliant).
- Self-selection routing: business / personal / customers → Commercial / Personal & Property / Connect.

## 5a. Commercial Products Hub (`/commercial/products/`)

Built and compliant. Landing/index page for Commercial's product categories, sitting between `/commercial/` and the Individual Product Pages.

---

## 6. Personal & Property specifics

Route prefix is `/personal-and-property/` (hyphenated — corrects prior docs). All 9 category pages are built and confirmed as genuinely distinct content (verified by diffing two pages directly — different hero copy, different "what's included" bullets, different cross-links, not a copy-paste stub with swapped titles).

- **9 categories, not 7** — Second Mortgage and Self-Employed Home Loans are confirmed migrated here from Commercial's taxonomy (resolves the prior open decision).
- **Enquire online form + Book-a-15-minute-chat**, embedded in the Channel Hub page, not separate routes.
- **Zoho lead/task creation wiring** is a Phase 9 job — needs the app layer.
- **James Lowe profile section, Contact directly block, News & Insights placeholder** — per the brief, unchanged.

---

## 7. Design tokens — confirmed against the live `tokens.css`

```css
--navy: #001C44;
--navy-blue: #1C1998;
--navy-deep: #000C22;
--skyblue: #54B4F6;
--skyblue-soft: #EAF4FE;
--peach: #FF5D5C;
--peach-soft: #FFF0F0;
--peach-hover: #E84847;
--gold: #FBB766;
--gold-soft: #FFF7EC;
--white: #FFFFFF;
--success: #10B981;
--ink-900: #0B1220; --ink-600: #3C4B63; --ink-400: #7A8AA3; --ink-200: #B7C2D3;
--light-bg: #F5F7FA; --bg-soft: #F5F8FC; --report-bg: #F0F4F8; --footer-bg: #00122E;
--font-heading: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
--font-body: 'DM Sans', -apple-system, sans-serif;
```

Body-text weight confirmed at 600 (Semibold) across headings in `base.css` — no 800/900 anywhere sitewide, confirmed by direct grep in the QA audit. No further token changes needed this revision — the live file already reflects the Design Corrections addendum correctly.

| Channel | Primary | Accent |
|---|---|---|
| Commercial | `--navy`/`--navy-blue` | `--skyblue` |
| Connect | `--gold` | `--navy` |
| Personal & Property | `--peach` | `--navy` |

---

## 8. Payload collections (Phase 9 target — unchanged, still untouched)

**`pages`** — `title`, `slug`, `channel`, `template`, `hero` group.
**`channelCards`** — `channel`, `label`, `hoverLine`, `ctaLabel`, `ctaHref`. No `icon` field.
**Globals:** `siteNav`, `productsMenu`, `channelToggle`, `footerLegal`.
**Decide before Phase 9:** Team Members, Lender logos/partners, News/blog collections — your call, per Abrar's guide.

---

## 9. Deployment

- Static build lives at the actual repo root — no separate `/site/` deploy target. Preview it directly (e.g. `python3 -m http.server` from the repo root, as the QA audit already did).
- Production Vercel/Payload deploy is still Phase 9's job, targeting the untouched Phase 0 scaffold.
- Never run a production deploy without asking first in chat.

---

## 10. Accessibility & performance baseline

- WCAG contrast ≥4.5:1 — **confirmed failing** in 3 places, see §11.
- 44×44px touch targets — **confirmed failing** in 4 shared classes, see §11.
- Every hover-only interaction needs a working tap/focus equivalent.
- Zero icons except the Channel Toggle home exemption — **confirmed 1 unexempted violation** (Connect FAQ chevrons), see §11.

---

## 11. Known outstanding defects — from the 2026-08-24 QA audit, not yet patched

Carried forward as concrete Phase 5 work, not a hypothetical risk list. Priority order:

| # | Defect | Where | Fix |
|---|---|---|---|
| 1 | Compare page is a pre-redesign stub — missing nav items, no real footer | `/commercial/compare/` | Rebuild nav/footer to match the other 10 compliant pages, adjusting relative paths for its folder depth |
| 2 | Four different, mutually-inconsistent footer implementations | `/commercial/`, `/connect/`, `/personal-and-property/`, `/commercial/compare/` | Replace each with the exact 4-column pattern already correct on the 7 brand-neutral pages |
| 3 | 5 chevron SVG icons — genuine zero-icon violation, no exemption | `/connect/faqs/` | Replace with the CSS-only `+`/`–` text-state pattern already used for nav dropdown carets sitewide |
| 4 | Dead `href="#"` / broken anchors, ~54 across the site | Sitewide, worst on `/commercial/`, `/connect/`, `/personal-and-property/`, and every footer's Privacy Policy link | Point real links to real destinations once `/home-shared/privacy/` and `/home-shared/contact/` exist; fix `commercial/index.html`'s internal anchors per-link, not by blind regex |
| 5 | WCAG contrast failures: skyblue text/CTA on white (2.27:1), peach CTA text (3.01:1), gold text on white (1.74:1, currently decorative-only) | `.btn-primary` on Commercial-channel pages; standalone peach CTAs; any future skyblue-on-white text | Add the same navy-text override Connect's `.btn-primary` already has; darken peach CTAs to `--peach-hover` (verify ≥4.5:1) or switch to navy background |
| 6 | Touch targets below 44px: nav links (~34px), toggle tabs (~29px), footer links (~24px, worst), Apply page pills (~35px) | Sitewide, inherited from `base.css`/`components.css` | Increase padding on the shared classes — since there's no build script, this is one CSS file edit that does propagate everywhere (CSS *is* shared, only HTML markup is duplicated) |
| 7 | No active-nav-state indicator anywhere | Sitewide | Per-page `aria-current="page"` + styling on whichever nav item matches — mechanical but must be done per file |

**Not a defect, resolved by the updated brief:** the Channel Toggle's home icon was flagged in the audit as violating the old text-only rule. The Design Corrections addendum now explicitly exempts it — no action needed, the QA finding is superseded.
