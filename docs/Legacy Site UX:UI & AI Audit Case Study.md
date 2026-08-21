# Legacy Site UX/UI & AI Audit — Case Study
### Subject: tradefunding.com.au — Pre-Migration Baseline
**Prepared as:** Lead Technical Audit, scored against the Legacy Architecture Rubric
**Baseline data:** `TF_Audit_Baseline_2026-07-21.xlsx` (Live Site Crawl + 16-month GSC export), prior SEO & Digital Performance Audit (Skyrocket Studios, 27 Jul 2026), visual screenshot capture of six live templates, Trade Funding competitor/GEO market research
**Status:** Scored — ready for stakeholder readout

---

## 0. Methodology & Evidence Note

Before scoring, a transparency note on what this audit is and isn't built from, so every figure below is defensible.

**What was available and used:**
- **Google Search Console — 16-month performance export** (19 Mar 2025 – 10 Jul 2026): daily clicks/impressions/CTR/position, device split, 541 queries, top pages, and the Page Indexing report.
- **A full live-site crawl** (Screaming Frog–style export, 28 URLs + 167 total requests including assets): status codes, indexability, canonicals, directives, H1s, word counts, readability scores, response times, redirect chains.
- **A prior independent SEO & Digital Performance Audit** (Skyrocket Studios, dated 27 July 2026) built from this same baseline file — used here as a corroborating second source, not as this audit's own conclusion.
- **Six visual screenshot captures** of live templates (Homepage, About Us, Our Products, Partners, Contact Us, Purpose).
- **Trade Funding's own commissioned market and competitor research**, including a dated three-engine (ChatGPT/Gemini/Perplexity) GEO/AI-answer-engine baseline.

**What was not available, and is flagged rather than invented:**
- **No GA4 export was included in the provided package.** All on-site behavioural metrics referenced in this report — bounce rate, session duration, page-level drop-off, scroll depth, funnel/step-completion — are **GSC-derived acquisition proxies (clicks, impressions, CTR, position) or crawl-derived structural proxies**, not GA4 session data. Where the rubric calls for a GA4-only metric (e.g. exact bounce rate), this is marked **"Not assessable — GA4 not provided"** rather than estimated. This is the single most important gap to close before final sign-off.
- No Core Web Vitals (LCP/INP/CLS) or axe/WCAG accessibility scan was included; crawl-level server response time is used as a partial proxy and labelled as such.
- Form validation/error-state behaviour cannot be assessed from static screenshots and is marked as requiring a live interaction pass.

Every figure below traces to one of the sources listed above. Where a finding is inference rather than a direct figure, it is labelled **Interpretation**.

---

## Executive Summary

Trade Funding's legacy site is **not failing on demand** — its own competitor research and its own Search Console data agree that SME finance search volume around its core terms is substantial. It is failing on **structure and corroboration**: a prior independent audit scored it **34/100** on SEO/technical health, **97.1% of all organic clicks over 16 months land on a single URL (the homepage)**, and across 541 tracked queries, **534 (98.7%) produced zero clicks** while still collectively absorbing 12,462 impressions (62% of all tracked-query impressions). The product catalogue that should be capturing that demand is built almost entirely from non-indexable filtered URLs, a legally distinct Credit Consent page has been canonicalised into invisibility, and all 15 indexable templates on the site share one identical, non-descriptive H1. Trust furniture (AFCA/CAFBA badges, credit licence number, Google reviews) is present but — by Trade Funding's own commissioned research — the thinnest of ten benchmarked platforms, and the brand is either entirely absent or actively mis-identified across three major AI answer engines.

| Pillar | Weight | Score (/5) | Verdict |
|---|---|---|---|
| 1. Commercial Viability | 35% | **2 / 5** | Present but poor |
| 2. User Experience & Friction | 25% | **3 / 5** | Adequate / industry-average |
| 3. Trust & Authority | 20% | **2 / 5** | Present but poor |
| 4. Technical Architecture | 20% | **2 / 5** | Present but poor |
| **Composite** | **100%** | **2.25 / 5 (~45%)** | **High priority for migration** |

This composite is directionally consistent with — but not identical to — the prior audit's narrower 34/100 SEO-only health score; that score covers Pillar 4 and part of Pillar 1, while this composite also credits genuine strengths found in Pillars 1–2 (an above-the-fold intake mechanism, a first-class broker channel, a differentiated intent taxonomy) that a pure-SEO score doesn't capture. Both readings land in the same place: **urgent, structural, pre-migration priority.**

---

## 1. Pillar One — Commercial Viability

**Weight: 35% | Score: 2 / 5 — Present but poor**

**Industry benchmark (per rubric):** single unambiguous primary CTA repeated at scroll depth; lead capture within the first screen; clearly signposted product pathways; distinct apply-vs-research journeys; broker/partner channel as first-class; quantified proof of outcomes; nurture infrastructure; visible client portal.

### What the evidence shows

**Genuine strengths, confirmed:**
- **A quote/intake mechanism sits above the fold on the homepage** — a "How much money do you need?" slider feeding a "Show me options" CTA — meeting the category standard the rubric calls out in Section 1 (a calculator/eligibility widget as the primary conversion mechanism, not a generic contact form).
- **The primary CTA ("Compare Options") is genuinely repeated at every scroll depth** on every one of the six captured templates: sticky header button, mid-page CTA, and an identical dark-gradient "Ready to explore your funding options?" block at the foot of every single page (Home, About, Products, Partners, Purpose, Contact). This is a real, above-average pattern of CTA discipline.
- **A dedicated broker/partner channel exists as a first-class nav item** (`/partners/`) with its own qualification form (Business Name, First/Last Name, Phone, Email, Partner Type dropdown, Enquiry notes) — this is *rarer* in the category than the rubric's benchmark assumes, and Trade Funding does it.
- **A retargeting pixel is live** (LinkedIn Insight Tag confirmed in the crawl's outbound request log), evidencing at least baseline remarketing infrastructure.
- Lead forms are reasonably lean (Contact Us: 5 fields) — no evidence of excessive friction by field count.

**Structural failures, confirmed by data:**
- **The product catalogue is functionally a single page wearing eight disguises.** `/our-products/` is filtered via URL query parameters (`?e-filter-b92be93-product_category=...`) into per-category views (Invoice, Trade, Lease, Property, Term Loans, etc.) — but every one of those eight filtered URLs is `Non-Indexable / Canonicalised` back to the parent page in the live crawl. There is no dedicated, permanent, indexable landing page per product.
- **This is the direct, quantified cause of a client-reported problem.** The prior SEO audit traces Search Console's *historic* top pages — `/products/grow` (1,198 impressions), `/products/save` (476), `/products/business-cards` (427), `/products/equipment-finance` (448), `/products/international-business-transactions-fx` (1,003) — to URLs that **no longer exist as standalone pages on the live site.** Over 3,500 impressions of demand for named products currently resolves to a generic filtered catalogue view instead of a message-matched landing page — the exact "gets traffic but doesn't convert" symptom flagged by the client and confirmed in the data.
- **No case studies or quantified outcome proof appear anywhere in the six captured templates** — no funding amounts, approval-time figures, or named client outcomes, despite the About page's narrative claims of founder experience. This is a direct, scored gap against rubric item 1.8.
- **No client/existing-customer login or application-status portal is visible anywhere in the nav or footer** — an absence, not an oversight, and one the rubric explicitly flags as a category-standard trust/retention signal (Section 1, point 4).
- **No differentiated "Apply Now" vs. "Research" journey** — every path (product card, About page, Purpose page, Contact page) funnels to the same generic comparison CTA; there's no fast-track for a visitor who already knows what they want versus one who's still exploring.

### Score justification
The mechanics of conversion (CTA repetition, an above-fold intake tool, a broker channel) are genuinely above the rubric's baseline. But the pillar's core job — capturing funding-intent traffic into a specific, attributable product application — is structurally broken at the point where it matters most: campaign and product-specific traffic lands on a generic filtered catalogue, not a dedicated offer page. **2/5**, not lower, because the underlying UI patterns are sound; the fix is architectural (indexable product URLs), not a redesign of the conversion mechanism itself.

> **Data gap flagged:** Form completion rate, cart/funnel abandonment, and step-level drop-off require GA4 event data, which was not provided. This would sharpen — but is unlikely to reverse — the finding above, since the root cause (non-existent landing pages) is independently confirmed by the crawl and GSC data alone.

---

## 2. Pillar Two — User Experience & Friction

**Weight: 25% | Score: 3 / 5 — Adequate / industry-average**

**Industry benchmark (per rubric):** core content reachable in 2–3 clicks; true mobile parity; jargon explained in plain language; consistent design system; functional site search; graceful error states; fast perceived performance; WCAG 2.1 AA baseline; logical internal linking.

### What the evidence shows

**Strengths, confirmed:**
- **Depth is shallow and well within benchmark.** All primary content (Products, Purpose, Partners, About, Contact, FAQs) sits at crawl depth 1 from the homepage — one click, well inside the 2–3 click standard.
- **Visual/component consistency is genuinely strong.** The same CTA block, card layout, and gradient system are reused verbatim across every template — a real, above-average sign of a disciplined component system for a small marketing site.
- **No internal broken links were found in the crawl.** Of 28 crawled URLs, zero return an internal 404; the only 404 encountered sitewide is a third-party Google-hosted review photo, not Trade Funding's own content.
- **HTTPS is enforced sitewide** with no internal insecure content.

**Friction points, confirmed by data:**
- **A real, quantified mobile gap.** GSC device data shows mobile *outranks* desktop on average position (9.9 vs 22.9) yet converts impressions to clicks at a lower rate (1.50% vs 1.99%). Ranking better but clicking less is the classic signature of a mobile snippet/experience problem (title truncation, tap-target sizing, perceived load time) rather than a visibility problem — this is a genuine, data-backed UX flag, even without GA4 session confirmation.
- **Jargon is inconsistently handled.** The top-level Purpose/Products framing (Run / Pay / Purchase / Structure) is plain-English by design — but one level down, product cards drop straight into unexplained technical terms ("debtor finance/factoring," "invoice discounting," "merchant cash advance," finance-lease-vs-operating-lease comparison tables) with no tooltip or glossary layer. This is corroborated by the crawl's own readability scoring: `/our-products/` and several of its filtered sub-views score **"Fairly Hard"** (Flesch 54.8–57.0), and — notably — the **FAQs page itself, whose entire purpose is plain-language clarification, also scores "Fairly Hard" (55.3)**.
- **No on-site search exists** on any captured template or in the crawled HTML — absent, against rubric benchmark 2.5.
- **Internal link equity is misallocated.** The eight non-indexable filtered product URLs collectively receive *more* unique internal inlinks (144–194 each) than the canonical, indexable pages they duplicate — `/about-us/`, `/partners/`, and `/purpose/` each receive only 95. The site's own navigation is spending more structural weight on pages that cannot be indexed than on the ones that can.
- **A universal H1 problem doubles as a UX/orientation issue, not just an SEO one.** Every single page — Careers, FAQs, Contact, Privacy Policy, all three blog posts — carries the identical H1 "Let's find your best-fit funding." A screen-reader user or anyone navigating by heading structure gets no page-level orientation cue anywhere on the site.

**Not assessable from available evidence:**
- Form validation/error-state quality, true Core Web Vitals (LCP/INP/CLS), and WCAG 2.1 AA conformance (contrast, alt text, focus states) all require live interaction testing or a dedicated scan not included in this baseline. Server response times (0.29s–0.94s across templates) are a partial, indirect proxy only.

### Score justification
Shallow IA, strong visual consistency, and zero internal 404s are genuinely good. But the mobile CTR/position mismatch, uneven jargon handling on the pages meant to explain products, absent search, and misallocated internal link equity are real, data-confirmed friction points that keep this at industry-average rather than above it. **3/5.**

---

## 3. Pillar Three — Trust & Authority

**Weight: 20% | Score: 2 / 5 — Present but poor**

**Industry benchmark (per rubric):** visible regulatory credentials, review/reputation density, third-party corroboration, and — in 2026 — machine-readable/AI-answer-engine legibility, since LLM-mediated search is now a first-class discovery channel for commercial finance queries.

### What the evidence shows

**Present:**
- **Regulatory disclosure is visible.** "Australian Credit Licence 387856" appears in the footer of every page, alongside AFCA, CAFBA, and FinTech Australia badges (confirmed in all six screenshots).
- **A Google review carousel is live** on the homepage: 5.0 average, 31 reviews, "powered by Google" — a genuine, verifiable third-party trust signal.

**Broken or thin:**
- **The AFCA trust badge does not reliably resolve.** The outbound link to `afca.org.au` returns a **403 Forbidden** in the live crawl. This may be AFCA-side bot-blocking rather than a Trade Funding defect, but the practical effect is the same: a visitor or journalist attempting to verify the AFCA membership claim by following the site's own badge link hits a wall.
- **By Trade Funding's own commissioned competitor research**, the brand carries **"the thinnest public trust-signal footprint of the ten platforms mapped"** — no visible Trustpilot or ProductReview volume, versus, for example, Money.com.au's 4.9/5 Trustpilot score or Waddle's 183+ Xero-marketplace reviews, both of which the research explicitly identifies as functioning as **"machine-trust infrastructure, not just human social proof."**
- **A compliance-adjacent page has been technically erased.** `/credit-consent/` — 2,120 words of distinct legal content — carries a canonical tag pointing to `/privacy-policy/`, an entirely different page. Google will never independently index or surface Credit Consent under its own URL. For a regulated credit provider, a legal disclosure page disappearing from independent discoverability is a trust-architecture defect, not just a technical one.
- **AI-answer-engine visibility is a measured, dated failure, not a hypothesis.** Trade Funding's own GEO baseline (captured across ChatGPT, Gemini, and Perplexity) found the brand:
  - **Absent from all three engines** on the top-of-funnel query "best business loan comparison site Australia."
  - **Absent from all three engines** on the mid-funnel query "how do I compare business finance options without hurting my credit score" — despite this being, on the research's own assessment, the single strongest and most differentiated claim Trade Funding has to make.
  - **Confused with the generic financial instrument "trade finance"/"trade funding"** on its own brand-name query in 2 of 3 engines (Gemini hallucinates it away entirely to Export Finance Australia/ScotPac/NAB; ChatGPT appends it only as a secondary, cautionary disambiguation note). Only Perplexity correctly identifies and cites the brand.

### Score justification
The visual furniture of trust — badges, a licence number, a review carousel — is present, which keeps this off the bottom of the scale. But a broken badge link, a self-erased compliance page, and a research-confirmed, third-party-verified corroboration gap (culminating in the brand being unrecognised or mis-identified by the AI systems now mediating a growing share of commercial finance search) mean the *substance* behind the trust signals is thin to actively compromised. **2/5.**

---

## 4. Pillar Four — Technical Architecture

**Weight: 20% | Score: 2 / 5 — Present but poor**

**Industry benchmark (per rubric):** passing Core Web Vitals, clean URL taxonomy, healthy crawl profile, no redirect chains, correct canonicalisation, HTTPS sitewide, minimal orphaned/duplicate content.

### What the evidence shows

This is the most heavily quantified pillar, and it is corroborated by an independent prior audit (Skyrocket Studios, 27 Jul 2026) built from this same baseline file, which scored the site's SEO/technical health at **34/100 — "Needs Urgent Intervention."**

- **Organic performance, 16-month baseline (19 Mar 2025 – 10 Jul 2026):** 413 clicks from 22,712 impressions (1.82% blended CTR). Independent recompute against the full 541-query dataset confirms and extends this: **534 of 541 tracked queries (98.7%) produced zero clicks**, while still collectively absorbing **12,462 impressions — 62.2% of all tracked-query impression volume.** The demand exists; the site is structurally unable to capture it.
- **Extreme traffic concentration:** the homepage alone drives **97.1% of all clicks**; every other page combined drives under 3%. Brand queries ("trade funding," "tradefunding") account for 312 of 413 total clicks (75.5%) at healthy CTRs (5.83% / 11.52%); the top four non-brand queries by impression volume convert at **0.10% CTR**.
- **Crawl composition (28 URLs):** 15 indexable, **8 non-indexable/canonicalised** (all `/our-products/` filter-parameter variants), and **5 legacy 301 redirects**, including a genuine two-hop chain: `http://www.tradefunding.com.au/contact` → `https://www.tradefunding.com.au/contact` → `https://tradefunding.com.au/contact-us/`.
- **Canonical misconfiguration:** `/credit-consent/` (2,120 words, legally distinct content) canonicalises to `/privacy-policy/` — see Pillar 3.
- **Universal duplicate H1:** all 15 indexable templates share the identical H1, "Let's find your best-fit funding." — zero page-level topical differentiation anywhere on the site, and notably, this doesn't even match the *visually* prominent hero heading on the homepage ("Compare with Confidence, Grow Without Limits"), indicating the coded H1 and the visual hero are two different elements — a semantic/accessibility mismatch as well as an SEO one.
- **Metadata gaps:** meta descriptions are missing on 4 of 28 crawled URLs (Terms & Conditions, Privacy Policy, Credit Consent, and one blog post). Separately, `/partners/` — a page about broker partnerships — carries the SERP title "SME Loan Comparison Tool | Best Rates | Trade Funding," a title/content mismatch.
- **Live GSC Page Indexing report** (most recent tracked window) flags 4 sampled non-indexed URLs: 1 blocked by robots.txt, 1 page-with-redirect, 2 "Crawled – currently not indexed." Small in absolute count, but indicative of unresolved indexing hygiene rather than a clean bill of health.
- **Stack diagnosis:** the crawl's directive/asset data confirms WordPress + Elementor (Pro) on a custom child theme (`trade-funding-website-2025` on `hello-elementor`). This is directly causal: Elementor's product-filter widget is what generates the eight non-indexable `?e-filter-...` query-string URLs — the plugin choice and the indexation failure are the same root cause, which matters directly for migration planning.
- **Positives:** HTTPS is enforced sitewide with no mixed content; server response times are moderate-to-acceptable (0.29s–0.94s across templates, with FAQs at 0.94s and Contact at 0.88s as the slowest); no internal 404s were found in the crawl.

### Score justification
HTTPS, response times, and the absence of internal 404s keep this off the floor of the scale. Everything else — the canonical misconfiguration, the universal duplicate H1, the redirect chain, the metadata gaps, the title/content mismatch, and above all the near-total conversion of organic demand into zero clicks — is confirmed, quantified, and independently corroborated. **2/5**, directionally consistent with the prior audit's 34/100 (note: that score is SEO/technical-scoped only and uses a different scale; it is cited here as corroboration, not as this pillar's source score).

> **Data gap flagged:** No Core Web Vitals (LCP/INP/CLS) or WCAG scan was provided; server response time is used only as a partial proxy and is not a substitute for either.

---

## 5. Dedicated Deep-Dive — The "Purpose-Driven Navigation" Question

This is the specific pattern called out for executive review: the top-level IA leads with **Purpose**, ahead of **Products**, as confirmed in every footer capture ("Business Lending: Purpose, Products") and in the dedicated `/purpose/` page itself, headlined **"Not sure where to begin? We can help with that."**

### The verdict, stated plainly
**The navigation *label and placement* introduced friction. The content model living inside it is a genuine strength.** These are two separate design decisions that got bundled into one page, and they should be scored — and fixed — separately.

### Where it worked
The Purpose page's actual content is organised around an intent-based taxonomy — **Run / Pay / Purchase / Structure** — mapping to plain-English borrower problems ("I need cash flow to run my business," "I need to pay a tax bill," etc.) rather than financial-product jargon. This is not a weak idea:
- Trade Funding's own competitor research is explicit that **none of the nine benchmarked competitors** (Finder, Valiant, Money.com.au, Lend.com.au, Prospa, OnDeck, Banjo, Waddle, Shift) use as clean an intent-based model — most rely on structural jargon (secured/unsecured/line of credit) that assumes financial literacy the target SME borrower often doesn't have.
- The same research flags this taxonomy as a **structural advantage for AI-answer-engine retrieval specifically**, since LLMs increasingly favour content matching natural-language problem statements over rigid financial nomenclature — and this is borne out in the GEO baseline itself: Perplexity is the one engine that correctly disambiguates the brand on its own name query, and does so **by citing the Run/Pay/Purchase/Structure taxonomy directly.**

So as a **content/messaging framework**, this is arguably one of the few genuinely differentiated assets on the site. It should not be discarded.

### Where it failed
- **It is not the category-standard entry pattern**, and the rubric's working hypothesis is confirmed rather than refuted by the evidence: transactional trade/SME finance buyers arrive with a defined need and expect solution-led or audience-led navigation (the product, or "who am I") — not a mission/orientation step first. Zero of the nine competitors profiled lead their top-level nav or homepage argument with an abstract "Purpose"/orientation entry point; they lead with product taxonomy or an intake tool.
- **It occupies a first-class nav slot but shows no measurable organic acquisition value.** `/purpose/` receives a mid-tier 95 internal inlinks in the crawl (on par with About and Partners) — but across the full 16-month, 541-query GSC dataset, it does not appear among the site's recorded top landing pages at all. Whatever internal weight the navigation gives it, it is not converting that weight into any external, attributable click or ranking value in this baseline.
- **It duplicates work the homepage already does.** The homepage already carries an above-fold "How much money do you need?" intake slider — meaning a visitor who clicks "Purpose" from the nav is arguably being routed to a second, less concrete version of a decision they could already start making on the page they landed on.
- **The label itself is the specific defect, not the taxonomy.** "Purpose" reads as brand/mission language ("why we exist") rather than task language ("what do you need"). A visitor scanning the nav for their problem has to resolve what "Purpose" means before they can act on it — exactly the "risk read" the rubric's own hypothesis anticipated.

### Recommendation for migration
Keep the Run/Pay/Purchase/Structure taxonomy — it's a real differentiator and is already showing early machine-legibility value. Retire "Purpose" as a first-class, mission-labelled top-level nav item and re-platform the same four-way taxonomy under a task-first label (e.g. "What do you need?" or "Solutions") positioned at or ahead of "Products" in the hierarchy — collapsing two competing entry points (homepage slider + Purpose page) into one coherent, message-matched intake flow rather than two parallel, weaker ones.

**Pattern-specific score: 2/5 as implemented (label/placement), 4/5 as a content model (taxonomy) — the composite scores above weight this page under Pillars 1 and 2 as implemented, not as its underlying idea.**

---

## 6. Scoring Summary

| Pillar | Weight | Raw Score (/5) | Weighted | Priority for Migration |
|---|---|---|---|---|
| 1. Commercial Viability | 35% | 2 | 0.70 | **High** |
| 2. User Experience & Friction | 25% | 3 | 0.75 | Medium |
| 3. Trust & Authority | 20% | 2 | 0.40 | High |
| 4. Technical Architecture | 20% | 2 | 0.40 | **High** |
| **Composite** | **100%** | — | **2.25 / 5 (~45%)** | **Needs Urgent Intervention** |

This composite corroborates, at a broader scope, the prior audit's independently computed **34/100 SEO/technical health score** — the two are not directly comparable (different scope, different scale) but point to the same conclusion from two separate methodologies.

---

## 7. Priority Recommendations Going Into Migration

**Structural (do before or during migration, not after):**
1. Give every product a permanent, canonical, indexable URL — eliminate the filter-parameter catalogue pattern entirely rather than patch it.
2. Build a 1:1 legacy-URL redirect map, explicitly including the deprecated `/products/*` paths that still carry real GSC impression volume.
3. Fix the Credit Consent canonical so it indexes independently of Privacy Policy.
4. Differentiate H1s (and ensure the coded H1 matches the visual hero) on every template.
5. Collapse the "Purpose" nav item and homepage intake slider into one task-first entry point, retaining the Run/Pay/Purchase/Structure taxonomy.

**High-leverage, low-cost (fastest wins in the dataset):**
6. Rewrite meta titles/descriptions on the small number of pages that already rank well but convert poorly (per the prior audit, `/products/save` and `/products/business-cards` rank positions 3–4 but convert under 1%) — a snippet fix, not a content rebuild.
7. Fix the AFCA badge link and add missing meta descriptions across the four flagged pages.
8. Deploy Organization/FinancialService schema and pursue the entity-disambiguation fixes identified in the GEO baseline before further AI-visibility investment.

**Requires data not yet in hand:**
9. Commission a GA4 instrumentation pass (funnel/step completion, scroll depth, mobile session behaviour) and a formal Core Web Vitals + WCAG 2.1 AA scan — both are prerequisites for fully scoring Pillars 1 and 2 with confidence, and for validating the mobile CTR/position gap identified here from GSC data alone.

---

## Appendix: Data Sources Referenced

- `TF_Audit_Baseline_2026-07-21.xlsx` — Live Site Crawl (28 URLs), GSC Perf – Pages/Queries/Overview, GSC Indexed URLs, Issues Log
- `TF_Live_Response_Codes.csv`, `TF_Live_Canonicals.csv`, `TF_Live_Directives.csv`, `TF_Live_Internal_HTML.csv` (supporting crawl exports)
- `TradeFunding_SEO_Audit_Report` (Skyrocket Studios, 27 July 2026) — prior independent audit, cited as corroboration
- Six screenshot captures: Homepage, About Us, Our Products, Partners, Contact Us, Purpose
- Trade Funding-commissioned competitor landscape and SME lending market research, including the Day 75–81 GEO/AI-answer-engine baseline (ChatGPT, Gemini, Perplexity)

**Not sourced in this audit:** GA4 export, Core Web Vitals/PageSpeed report, WCAG/axe accessibility scan. Recommend all three before final migration sign-off.
