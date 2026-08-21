# Task 3: New Site UX/UI & AI Audit Case Study
### Subject: tradefunding-gamma.vercel.app — Unlaunched Staging Build, Mirror Audit Against the Task 2 Legacy Baseline
**Prepared as:** Lead UX Researcher & Technical SEO Auditor, scored against the same four-pillar rubric used in Task 2
**Baseline data:** `Legacy_Site_UX_UI___AI_Audit_Case_Study.md` (Task 2, scored 2.25/5 composite), a direct code audit of 33 delivered HTML/JS files (`New_Files.zip`), one live-UI screenshot of the staging homepage
**Status:** Scored — ready for stakeholder readout

---

## 0. Methodology & Evidence Note

Following the same transparency discipline as Task 2, here is what this audit is and isn't built from.

**What was available and used:**
- **33 HTML files and 2 JS files** delivered as a static export of the staging build (`index.html`, 24 product pages, `apply.html`, `comparison-report.html`, `about.html`, `resources.html`, `meet-cashper.html`, legal pages, two calculator tools, a 404 page, and `sitemap.xml`).
- **`product-page.js`** — shared client-side logic for the comparison switcher, repayment calculator, download gate, and FAQ accordion used across product pages.
- **The full intake-flow logic embedded in `apply.html`** (~1,650 lines) — including the 3-step state machine, field-level validation, an eligibility engine explicitly commented as a *"1:1 port from `calculatorEngine.ts`"* (i.e., mirrors the real backend/portal logic), and the S.T.A.R. scoring legend.
- **One live-UI screenshot** of the staging homepage (`tradefunding-gamma.vercel.app`), used to visually confirm the "How it works" / Cashper 3-step mechanic.
- **Direct comparison against every finding in the Task 2 legacy case study**, pillar by pillar.

**What was not available, and is flagged rather than invented:**
- **No CSS files were included in the export.** Every page references `shared-styles.css`, and product pages additionally reference `product-styles.css` — neither file exists anywhere in the delivered archive, only large inline `<style>` blocks. The live screenshot confirms these stylesheets exist and render correctly on the actual Vercel deployment, so this is a **gap in the file export provided for audit, not evidence the site is unstyled.** Actual CSS payload weight, unused-CSS ratio, and critical-path rendering strategy cannot be scored from this package.
- **No Core Web Vitals, Lighthouse, or PageSpeed report was provided** for the staging build, mirroring the same gap flagged in Task 2. Structural performance proxies (lazy-loading usage, font-loading strategy, script placement) are used instead and labelled as such.
- **No re-run of the GEO/AI-answer-engine baseline** (ChatGPT/Gemini/Perplexity) was conducted against the staging site. Schema and content changes that *should* improve AI-answer-engine legibility are noted as **Interpretation**, not as a confirmed fix — the only way to confirm the legacy brand-confusion problem is resolved is to re-run that same three-engine test against the live staging URL before launch.
- **A discrepancy was found between the provided code and the provided screenshot.** The live screenshot's navbar shows a **"Contact"** link between "Compare Report" and "About." No `contact.html` file, no `#contact` anchor, and no "Contact" nav link exist anywhere in the delivered HTML. This likely means the screenshot reflects a slightly different/later deployment state than the code archive — it is flagged here rather than silently reconciled, since it affects the accuracy of the nav-structure findings below.
- **Form validation was assessed from the actual JS**, not inferred from screenshots (an explicit gap Task 2 could not close) — this audit is stronger on that specific point than the legacy one.

Every figure below traces to a direct `grep`/read of the delivered files. Where a finding is inference rather than a direct code observation, it is labelled **Interpretation**.

---

## Executive Summary

The staging site is a **structural rebuild that resolves nearly every architectural failure identified in Task 2, executed at roughly 80% completion.** The single biggest legacy defect — a product catalogue built from eight non-indexable, filter-parameter URLs — is gone entirely, replaced by 24 permanent, keyword-specific, schema-marked product pages. The universal duplicate-H1 problem is gone; every page carries a unique, message-matched H1 and meta description. The "Purpose vs. Products" navigation conflict Task 2 flagged as a dedicated deep-dive is resolved by adopting exactly the recommendation given: product-taxonomy-led navigation, with the underlying intent model preserved inside a `?purpose=` query parameter that pre-fills the intake flow — a genuine, code-verified differentiated apply-vs-research journey that did not exist before.

But this is a staging build, and it shows: **canonical tags use three different URL patterns across the site** (with/without `www`, with/without `.html`), **nine footer links point to a `/guides/` subdirectory that does not exist** in the delivered files, **no page uses `<header>` or `<main>` landmark tags**, and an **orphaned, unlinked duplicate of the entire apply flow** (`trade-funding-website-application.html`, an earlier ~1,000-line draft) still sits in the root, undeleted and unsitemapped. None of these are the kind of foundational, months-of-work problems Task 2 catalogued — they are pre-launch punch-list items, the kind a QA pass catches before go-live, not a redesign.

| Pillar | Weight | Legacy Score (/5) | New Site Score (/5) | Verdict |
|---|---|---|---|---|
| 1. Commercial | 35% | 2 | **4** | Strong — differentiated journeys and permanent product URLs now exist |
| 2. UX & Interactive Tooling | 25% | 3 | **4** | Strong — genuine progressive disclosure, live eligibility engine |
| 3. Trust & Authority | 20% | 2 | **3** | Improved substance, one regression (delinked AFCA badge) |
| 4. Architecture & SEO | 20% | 2 | **3** | Foundations are excellent; execution is inconsistent |
| **Composite** | **100%** | **2.25 / 5 (~45%)** | **3.60 / 5 (~72%)** | **Launch-track, pending a fix list, not a rebuild** |

---

## 1. Side-by-Side Comparison Matrix

| Pillar | Legacy Score/State | New Site Score/State | Specific Gap/Improvement |
|---|---|---|---|
| **Commercial — Product URLs** | 8 of ~8 product views are non-indexable `?e-filter-...` query-string variants, canonicalised to a single parent page | 24 permanent, keyword-specific URLs (`invoice-finance.html`, `trade-finance.html`, etc.), each with its own H1, meta description, and FAQ schema | **Full resolution** of the single largest structural defect in the legacy audit |
| **Commercial — Apply vs. Research journey** | Every path (product card, About, Purpose, Contact) funnels to the same generic comparison CTA; no differentiated journey | Product pages pass `?purpose=pay_invoices` (etc.) into `apply.html`, which pre-fills Step 1's title, subtext, and purpose dropdown | **New capability** — legacy had none; confirmed in code (`URLSearchParams` read on load in `apply.html`) |
| **Commercial — CTA discipline** | Primary CTA repeated at every scroll depth on all 6 templates — already above rubric baseline | CTA repeated 5–6 times per page (`grep` count), plus a **mobile-only sticky CTA** not present in legacy | Legacy's strength is retained and extended, with a targeted fix for legacy's own flagged mobile gap |
| **Commercial — Outcome proof** | Zero case studies or quantified outcomes anywhere in six captured templates | Named-industry (if not named-client) case studies with facility size, advance rate, and outcome narrative on product pages (e.g., invoice-finance.html) | Improvement, but not full resolution — proof is anonymised ("Operations Manager, Logistics Company, Sydney"), not independently verifiable |
| **Commercial — Resource hub integrity** | N/A (no equivalent existed) | `resources.html` and its footer links promise 9 guide articles; only the hub page itself exists — all 9 `/guides/*.html` targets 404 | **New defect** introduced by the rebuild — a promise made in the IA that the file tree doesn't deliver on yet |
| **UX — Product filtering/catalogue depth** | Filtered views duplicate the parent page; site's own nav sends more internal link equity to non-indexable pages than indexable ones | Each product URL is a standalone, deep page (2,000–2,500 words per `grep` word-count check) with its own comparison table, FAQ, and calculator | Direct resolution of legacy's "internal link equity misallocated" finding |
| **UX — Intake flow structure** | No dedicated multi-step intake flow existed; homepage slider was the only mechanism, duplicated by a separate "Purpose" page | Genuine 3-step flow (`apply.html`) with conditional field disclosure — e.g., "Tax Debt Amount" and "Property Value" fields are `display:none` until the relevant Yes/No toggle is set | **New capability**, and it specifically implements the "progressive disclosure" pattern the rubric calls for |
| **UX — Validation & error states** | Flagged as **"Not assessable from available evidence"** — screenshots can't show live validation | Assessed directly: `validateStep1()`/`validateStep2()` clear and re-apply error classes, scroll to first error, block step advancement — but email format is checked only for non-empty, not for valid structure, beyond native `type="email"` | Closes an entire data gap Task 2 couldn't close; reveals a minor-but-real friction gap (weak email validation) |
| **UX — S.T.A.R. comparison tooling** | No equivalent existed | Genuinely interactive and **live-updating** inside `apply.html` Step 3 (cards re-render as profile data is entered) — but the pre-signup `comparison-report.html` marketing page only shows a **static mockup** of the same report | New capability, with a specific commercial trade-off: visitors can't experience the real tool before entering personal data |
| **UX — Mobile experience** | Quantified gap: mobile ranks better (9.9 vs 22.9 avg. position) but converts fewer impressions to clicks (1.50% vs 1.99%) | Mobile-specific sticky CTA (`.mobile-sticky-cta`, hidden on desktop via media query) implemented as a direct, targeted response | **Interpretation**: directionally correct fix; cannot be scored as "resolved" without a live re-measurement of mobile CTR post-launch |
| **UX — Accessibility** | Not assessable — no WCAG/axe scan available | 100% `alt` text coverage across all sampled pages (73/73, 3/3, 4/4); FAQ accordion correctly toggles `aria-expanded`; hamburger menu button has an `aria-label` but does **not** update `aria-expanded` on toggle; the "What's S.T.A.R.?" explainer relies on a native `title` tooltip (weak on touch devices and inconsistently exposed to screen readers) | Meaningfully better default posture than legacy, but not a clean WCAG 2.1 AA pass — same caveat as legacy: a live scan is still required |
| **Trust — Regulatory badges** | ACL number, AFCA/CAFBA/FinTech Australia badges present in footer; **AFCA badge link returns 403** | Same badges present as footer text, **but none are hyperlinked at all** — AFCA only appears as a live link deep inside `credit-guide.html` and `terms.html` | The broken-link defect is gone, but so is the footer's ability to let a visitor self-verify membership with one click — a regression in *convenience*, not accuracy |
| **Trust — Compliance page indexability** | `/credit-consent/` (2,120 words) canonicalises to `/privacy-policy/`, erasing it from independent indexing | `credit-guide.html`, `privacy.html`, and `terms.html` are separate, indexable files, each with a unique meta description | **Full resolution** of the specific canonical-misconfiguration defect |
| **Trust — AI/automation transparency** | Not addressed; no AI-disclosure pattern existed | `meet-cashper.html` contains explicit first-person AI disclosure: *"Behind the friendly face, I'm an AI-powered lending intelligence engine"* | **New capability** — directly relevant given 2026 category expectations for disclosed AI use in credit-adjacent decisioning |
| **Trust — Schema / GEO readiness** | Zero structured data anywhere in the crawl; brand confused with generic "trade finance" on 2 of 3 AI engines | `Organization`, `FinancialService`, `FinancialProduct`, `FAQPage`, `AggregateRating`, and `BreadcrumbList` JSON-LD deployed across `index.html`, product pages, and `about.html` | **Interpretation**: this is the correct technical fix for the legacy GEO failure, but only a fresh three-engine re-test can confirm the brand-confusion problem is actually resolved |
| **Architecture — Canonical consistency** | One specific canonical misconfiguration (Credit Consent → Privacy Policy) | **Three different canonical URL patterns in use simultaneously**: `https://www.tradefunding.com.au/invoice-finance` (no extension, with www), `https://tradefunding.com.au/apply` (no extension, no www), and the sitemap's own `https://tradefunding.com.au/invoice-finance.html` (with extension, no www) | A **new, broader** canonicalisation problem — inconsistent host/path patterns risk duplicate-content signals across nearly every URL, not just one page |
| **Architecture — Semantic landmarks** | Not specifically scored, but H1 duplication was flagged as a semantic/accessibility issue | Zero uses of `<header>` or `<main>` across sampled pages; `<nav>`, `<footer>`, and `<section>` are used correctly and consistently | Partial credit — most semantic tags are used well, but the two landmark tags that matter most for assistive-tech page orientation are absent sitewide |
| **Architecture — Sitemap completeness** | 28 URLs crawled; issues were about canonicalisation and indexability, not sitemap omissions | `sitemap.xml` lists 29 URLs but **omits `resources.html`** (the guides hub, linked from every footer) and all three legal pages (`privacy.html`, `terms.html`, `credit-guide.html`); it also **lists 5 of the 9 promised `/guides/*.html` pages that don't exist yet** | New, sitemap-specific defect: the sitemap both under-represents real pages and over-represents pages that don't exist |
| **Architecture — Codebase hygiene** | N/A — legacy is a live WordPress/Elementor site, not a static export | `trade-funding-website-application.html` — a ~1,061-line orphaned duplicate/earlier draft of `apply.html` (1,644 lines) — exists unlinked from any nav, footer, or sitemap entry | Pre-launch hygiene issue: dead weight that should be deleted before deployment, not a functional defect but a maintainability risk |
| **Architecture — Performance hygiene** | Server response times 0.29s–0.94s used as a partial CWV proxy; no real CWV data | `loading="lazy"` applied to 70 images on the homepage; `rel="preconnect"` used for Google Fonts; `font-display: swap` set; primary interactive `<script>` blocks placed near the end of `<body>` | Genuinely good default practice on every signal that *can* be checked from static HTML; the CSS-file gap (see Methodology note) means the two most important performance levers — actual stylesheet weight and render-blocking behaviour — remain unscored |

---

## 2. Pillar 1: Commercial (Audit & Findings)

**Weight: 35% | Legacy: 2/5 | New Site: 4/5 — Strong**

### What's working
The core commercial defect in the legacy audit was structural, not creative: good conversion mechanics (an above-fold intake tool, CTA repetition, a broker channel) sitting on top of a catalogue that couldn't be found or landed on. That defect is resolved. Every one of the 24 finance products named in the navigation now has its own permanent, keyword-matched, indexable page — `invoice-finance.html`, `trade-finance.html`, `chattel-mortgage.html`, and so on — each carrying a distinct H1, hero copy, and CTA (e.g., invoice-finance.html's H1 reads "Stop waiting 60 days to get paid," directly matched to the query intent rather than generic brand language).

More significantly, the site now closes the exact gap Task 2 flagged as absent: **a differentiated apply-vs-research journey.** A visitor arriving at `trade-finance.html` clicks through to `apply.html?purpose=pay_suppliers` — and the intake form's Step 1 headline dynamically rewrites itself to *"You're exploring Suppliers — let's find you the best match,"* with the purpose dropdown pre-selected. This is a code-verified, not aspirational, improvement: the JS reads the query parameter on page load (`URLSearchParams(window.location.search)`) and reduces the very first re-entry of information a warm visitor would otherwise have to repeat.

Value proposition clarity above the fold is strong: the homepage H1 — *"Every option. Scored for your business. Then we get it done."* — states the mechanism (scoring across lenders), the object (your business), and the outcome (it gets done), in eight words split across two lines. This is a more concrete, mechanism-led promise than the legacy homepage's "Compare with Confidence, Grow Without Limits."

CTA discipline, already a legacy strength, is retained and extended: 5–6 CTA instances per product page (vs. legacy's "repeated at every scroll depth" on 6 templates), plus a mobile-only sticky CTA bar that didn't exist before — a targeted, plausible response to the legacy's quantified mobile CTR gap, though its effectiveness can only be confirmed post-launch.

Outcome proof, entirely absent in the legacy audit, now exists: product pages carry short case-study blocks with a facility size, advance rate, and narrative outcome (e.g., a "$500K invoice discounting facility... 85% of the value was advanced" on the invoice-finance page).

### Where it falls short
- **The Resources hub over-promises.** `resources.html` and every page's footer link to nine `/guides/*.html` articles (a compare-loans guide, a term-loans guide, a line-of-credit guide, etc.). None of the nine exist as files in this delivered build, and the `sitemap.xml` itself only lists five of the nine — meaning even the site's own sitemap doesn't fully agree with its own navigation about what should exist. If this ships as-is, it's nine dead links from a page whose entire purpose is to build research-stage trust.
- **Proof is anonymised, not verified.** The case-study snippets are a genuine improvement over zero, but "Operations Manager, Logistics Company, Sydney" is not independently checkable the way a named client or a linked review would be — this is progress, not full resolution of the legacy's "no quantified proof" finding.
- **The broker/partner channel visible in the legacy site's first-class `/partners/` nav item does not appear to have an equivalent in this build.** No partner-specific page, form, or nav item was found in the delivered files. If intentional (e.g., deprioritised for this launch phase), that's a scope decision worth confirming; if accidental, it's a regression on a feature Task 2 called "rarer in the category" and genuinely valuable.

---

## 3. Pillar 2: UX & Interactive Tooling

**Weight: 25% | Legacy: 3/5 | New Site: 4/5 — Strong**

### The 3-step intake flow
The flow in `apply.html` is a real implementation of progressive disclosure, not just a marketing claim. Step 1 collects funding purpose, amount (via a synced slider + text input), timeline, and contact/ABN details. Step 2 collects business financials — and critically, **conditional fields only render when relevant**: "Tax Debt Amount" and "On ATO payment plan?" stay `display:none` until the visitor toggles "Any outstanding tax debt?" to Yes; "Property Value" and "Mortgage Balance" stay hidden until "Do directors own property?" is set to Yes. This is exactly the cognitive-load reduction the evaluation framework asks about — a visitor with no tax debt and no property never sees those four extra fields at all.

Step 3 is where the S.T.A.R. scoring becomes live: `runCalc()` re-evaluates eligibility against a purpose-to-product map (`purposeProductMap`) every time the user advances a step, rendering primary and secondary product matches with real-time eligible/ineligible badges and stated reasons for ineligibility (e.g., a specific reason string is shown per disqualified product). Notably, the code comments explicitly flag this as *"a direct 1:1 port from `calculatorEngine.ts`... matches the portal exactly"* — meaning the marketing-site preview and the actual backend underwriting logic are the same code, not a simplified approximation. That's a meaningful integrity signal, though it's currently only visible in source comments, not communicated to the visitor as a trust point (see Pillar 3).

Validation is real and workable: `validateStep1()`/`validateStep2()` block advancement, apply/clear error-state CSS classes, and scroll the first error into view. The one gap: email is checked only for non-emptiness in the custom JS (relying on the browser's native `type="email"` behaviour for format checking) — functional, but not the frictionless, clearly-labelled inline validation the rubric benchmark implies.

### S.T.A.R. comparison tooling
S.T.A.R. (Security, Term, Amount, Rate — confirmed via the legend markup in `apply.html`) is represented as a four-dot colour-coded badge attached to each matched lender/product. Inside the live intake flow, it's genuinely interactive: cards animate in, badges reflect real per-product data, and a hover-accessible "What's S.T.A.R.?" explainer is present.

The gap: on `comparison-report.html` — the page whose entire job is to sell a skeptical, pre-signup visitor on the value of this tool — the "report preview" shown is a **static illustration**, not a working demo. Three of five sample rows are legible; the fourth is blurred and locked behind a "3 more lenders in your full report" gate. This is a defensible commercial pattern (gate the full value behind lead capture), but it means the *comparison decision-making experience itself* — the thing the rubric asks whether it "simplifies complex decision-making better than static tables" — currently can only be evaluated by a visitor who has already handed over contact details. A lighter, ungated interactive sample (even with placeholder lender names) would let visitors experience the mechanism before committing.

### Accessibility & polish
Alt-text coverage is complete on every page sampled (73/73 images on the homepage, 100% on two product/about pages checked). The FAQ accordion correctly manages `aria-expanded` state per item. Two smaller gaps: the hamburger menu toggle has an `aria-label` but never updates `aria-expanded` as it opens/closes, and the S.T.A.R. explainer leans on a native HTML `title` attribute — a pattern with inconsistent screen-reader support and no touch-device equivalent (no tap-to-reveal fallback was found in the JS).

---

## 4. Pillar 3: Trust Signals

**Weight: 20% | Legacy: 2/5 | New Site: 3/5 — Improved substance, one regression**

### Where trust genuinely improved
The most novel trust addition is **explicit AI disclosure**. `meet-cashper.html` personifies the underlying eligibility engine as "Cashper" and states plainly, in first person: *"Behind the friendly face, I'm an AI-powered lending intelligence engine... I make sure Trade Funding sticks to its promise of clarity, honesty, and no tricks. I don't push products or play favourites."* In a 2026 environment where AI-mediated financial decisioning is under increasing scrutiny, naming and disclosing the mechanism — rather than presenting scored results as if generated by an anonymous algorithm — is a genuine, above-category trust pattern, and directly relevant to the legacy audit's own finding that AI-answer-engine legibility is now a first-class discovery and credibility channel.

The specific canonical-misconfiguration defect that erased `/credit-consent/` from independent indexing is fully resolved: `credit-guide.html`, `privacy.html`, and `terms.html` are now separate, uniquely-titled, independently indexable files.

Structured data deployment (`Organization`, `FinancialService`, `FinancialProduct`, `FAQPage`, `AggregateRating` schema across `index.html`, product pages, and `about.html`) is the correct technical response to the legacy's GEO failure — though, per the Methodology note, this is the right fix applied, not a confirmed result. A fresh three-engine GEO re-test against the staging URL should be commissioned before this is scored as resolved rather than addressed.

### Where trust regressed or stayed thin
The AFCA badge's broken outbound link (403 in the legacy crawl) is gone in the new build — but not because it was fixed. It was **removed from the footer entirely.** ACL/AFCA/CAFBA/FinTech Australia now render as plain, non-clickable `<span>` badges on every page footer; the only live AFCA hyperlink left on the whole site is buried inside `terms.html`'s complaints-handling clause. This trades a visible defect for reduced visible verifiability — a visitor scanning the footer for a badge to click on can no longer do so at all, on any page. Given that Trade Funding's own commissioned research (cited in Task 2) already flagged this brand as having "the thinnest public trust-signal footprint" among ten benchmarked platforms, removing rather than repairing a trust-badge link works against that specific finding rather than closing it.

Outcome proof, discussed under Commercial, sits in the same place from a Trust angle: real, but anonymised. A named client, a linked review platform, or a specific dollar-figure aggregate ("$X funded across Y approved applications") would move this further.

---

## 5. Pillar 4: Architecture & SEO

**Weight: 20% | Legacy: 2/5 | New Site: 3/5 — Strong foundations, inconsistent execution**

### What's resolved
The single largest architectural defect in Task 2 — a product catalogue built entirely from non-indexable, canonicalised filter-parameter URLs — is fully resolved. Each of 24 products has a standalone, deep (2,000–2,500 word) page with unique meta title, meta description, H1, and FAQ schema. The universal duplicate-H1 problem (every legacy template sharing "Let's find your best-fit funding") is gone; every sampled page carries a distinct, message-matched H1. Semantic tag usage is mostly sound: `<nav>`, `<footer>`, and `<section>` are used consistently and correctly across every page checked. Performance-adjacent hygiene that *can* be verified from static HTML is genuinely good: `loading="lazy"` on 70 homepage images, `rel="preconnect"` for Google Fonts, `font-display: swap`, and primary interactive `<script>` blocks placed near the end of `<body>` rather than blocking `<head>` execution.

### What's not resolved, or newly introduced
- **Canonical inconsistency has gotten broader, not narrower.** The legacy site had one specific canonical misconfiguration. The new site has **three different URL conventions competing across its own canonical tags and sitemap**: some canonicals use `www.tradefunding.com.au/path` (no `.html`), some use `tradefunding.com.au/path` (no `www`, no `.html`), and the sitemap itself uses `tradefunding.com.au/path.html` (no `www`, with extension). Several product pages (e.g., `chattel-mortgage.html`, `export-finance.html`, `merchant-cash-advance.html`, `trade-finance.html`) have **no canonical tag at all**. This needs to be standardised to one pattern before launch — search engines resolve inconsistent signals by picking one on your behalf, which is a worse outcome than picking correctly yourself.
- **No `<header>` or `<main>` landmark tags exist anywhere** in the sampled pages. This matters specifically for assistive-technology users navigating by landmark region (a screen-reader user cannot jump directly to "main content," bypassing repeated nav/footer content, on any page of this site).
- **The sitemap disagrees with the site in both directions.** It omits `resources.html` (a page linked from every single footer) and both `privacy.html`/`terms.html`, while simultaneously listing 5 of 9 `/guides/*.html` URLs that don't exist as files yet — meaning it under- and over-represents the real site at the same time.
- **An orphaned draft file, `trade-funding-website-application.html`,** sits in the root, unlinked from any nav, footer, or sitemap entry, but still deployed. At 1,061 lines vs. `apply.html`'s 1,644, it reads as an earlier iteration of the same flow that should have been deleted, not shipped. It carries no immediate SEO risk (nothing links to it), but it's dead weight and a maintenance/QA red flag — the kind of thing that indicates a rushed final export rather than a clean build pipeline.
- **Robots meta tags are applied inconsistently** — present with `index, follow` on 9 pages, present with `noindex` on the 404 page (correct), and simply absent (defaulting to indexable) on the remaining ~20 pages, including most product pages. Not a functional defect, but inconsistent enough to suggest the meta-tag block wasn't templated centrally.
- **CSS architecture cannot be scored** because the referenced stylesheets weren't included in this export (see Methodology note) — this is the most consequential open question for a genuine Core Web Vitals / time-to-interactive assessment, and should be the first thing requested before this pillar can be scored with full confidence.

---

## 6. Scoring Summary

| Pillar | Weight | Legacy (/5) | New Site (/5) | Weighted (New) | Priority for Launch |
|---|---|---|---|---|---|
| 1. Commercial | 35% | 2 | 4 | 1.40 | Medium — fix `/guides/` dead links |
| 2. UX & Interactive Tooling | 25% | 3 | 4 | 1.00 | Low — polish, not structural |
| 3. Trust & Authority | 20% | 2 | 3 | 0.60 | Medium — re-link AFCA badge, re-run GEO test |
| 4. Architecture & SEO | 20% | 2 | 3 | 0.60 | **High** — canonical consistency, sitemap accuracy |
| **Composite** | **100%** | **2.25 / 5 (~45%)** | **3.60 / 5 (~72%)** | — | **Pre-launch fix list, not a rebuild** |

---

## 7. Next Steps for Task 4

1. **Canonical & sitemap reconciliation audit.** Before any design-fidelity work, standardise every canonical tag to one URL pattern (recommend: `https://www.tradefunding.com.au/{slug}`, no `.html`), add the missing canonicals on the ~10 product pages that currently have none, and rebuild `sitemap.xml` to exactly match the live, real file set — removing the five phantom `/guides/*.html` entries and adding `resources.html`, `privacy.html`, `terms.html`, and `credit-guide.html`.
2. **High-fidelity mockup of an ungated, sample S.T.A.R. comparison widget** for `comparison-report.html` — using illustrative/placeholder lender data — so pre-signup visitors can interact with the actual comparison mechanic (sorting, hovering per-dot breakdowns) rather than viewing a static, partially-blurred image. This is the single highest-leverage UX fidelity check for Task 4, since it directly affects both the Commercial and Trust pillars.
3. **Resources hub build-or-cut decision.** Either commission the nine promised `/guides/*.html` articles before launch, or trim `resources.html` and the sitewide footer down to the guides that actually exist — a mockup/content-model check is needed either way so Task 4 doesn't inherit dead links.
4. **Accessibility fidelity pass**, specifically: add `<header>`/`<main>` landmarks sitewide, wire the hamburger button's `aria-expanded` state to its open/closed status, and replace the native-`title` S.T.A.R. tooltip with a tap-and-click-accessible pattern (e.g., a small popover) that works on touch devices.
5. **Reconcile the live-screenshot "Contact" nav item.** Confirm whether a Contact page/section exists on the actual staging deployment that wasn't included in this file export, and if so, request it for a proper fidelity check — right now it's an unaudited gap between what stakeholders are looking at in-browser and what this code review could verify.
