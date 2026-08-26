# Trade Funding — Master IA & Page-Build Checklist (v2)

**Status:** Working checklist, supersedes page-list content in `Master Information Architecture & Sitemap.md` where the two conflict (see §0 Reconciliation Flags below). Use this as the tracking doc for what needs to be built or rebuilt for the MVP.

---

## 0. Reconciliation Flags — read before using this checklist

Your brief introduces structural changes that conflict with the prior sitemap. I've resolved what I can infer and flagged what needs an explicit decision rather than guessing.

| # | Conflict | Old sitemap said | New brief says | Resolution used below |
|---|---|---|---|---|
| 1 | **Root homepage identity** | `/` = BLC homepage content, i.e. Commercial *is* the home site (no neutral brand layer) | Root `/` is a separate, neutral, brand-level homepage; Commercial moves to its own route | Treated as **superseded** — root is now neutral per the confirmed 2+1 architecture. Commercial content moves to `/commercial/`. |
| 2 | **Personal & Property URL slug** | `/personal-and-property/` (hyphenated) | `/personalandproperty` (no hyphens) | 🔴 **Needs your confirmation** — I've used `/personalandproperty/` throughout per your latest message, but flagging this since it reverses a previously-documented slug and affects every P&P route, redirect map entry, and internal link. |
| 3 | **Product/guide page nesting** | Product pages stay **flat** at root (e.g. `/business-term-loans/`, not `/business-loans/business-term-loans/`) specifically to preserve existing SEO equity | Not addressed in your new message | 🔴 **Needs your confirmation** — with Commercial now living at `/commercial/` rather than `/`, do the 20+ existing product/guide/tool URLs stay flat at root (original SEO-preservation rationale), or move under `/commercial/`? This is the single biggest open redirect-map decision and should be locked before Phase 3 redirect work. Checklist below defaults to **flat/root**, matching the original rationale, pending your call. |
| 4 | **Channel switcher scope** | 2-destination switcher (current channel implicit, only shows the *other two*) | 4-destination toggle (Home icon + all three channels, including current) shown identically on all three channel pages | Updated below to the new 4-destination spec. |
| 5 | **Top-level nav labels** | Products / Why Us / Partners / Contact-in-footer | Products / Compare / About (universal, dynamic-context Products) | Updated below. "Why Us" and "Partners" are not in your new directive — flagged as either folded into About/Products or dropped; confirm which. |

---

## 1. Global / Cross-Channel Components (not routable pages, but required builds)

- [ ] **Root Header** — neutral brand nav, no channel switcher present (per your directive)
- [ ] **Channel Header** (shared across Commercial / Connect / P&P) — includes:
  - [ ] Universal nav: **Products** (context-aware — swaps product set per current channel), **Compare**, **About**
  - [ ] **Channel Toggle** component:
    - [ ] 4 destinations: Home icon → `/`, Commercial, Connect, Personal & Property
    - [ ] Visually distinct border + shadow so it doesn't blend into the nav bar
    - [ ] Smooth transition/animation on route change
    - [ ] Active-state styling for whichever channel is current
- [ ] **Products mega-menu — Commercial context** (Fund My Business): Term Loans, Credit Lines, Invoice, Trade, Equipment, Other
- [ ] **Products mega-menu — Connect context** (Support Client Payments): vendor/customer finance options
- [ ] **Products mega-menu — Personal & Property context** (Funding Owners Running Business): the 7 service categories from James's brief
- [ ] **Compare mega-menu / hover state** — "Which Option is Best" → links to `/compare/`
- [ ] **Footer** (global, all channels + root) — Commercial / Connect / P&P as equal peers, full parity
- [ ] **`FooterLegal` global component** — ACL number + AFCA badge, single Payload global, no per-channel duplication
- [ ] **Large framed channel boxes** (root homepage only) — hover reveals short supporting line per channel
- [ ] **"Compare 100+ products" visual/design moment** — design-led, not copy-led; homepage only
- [ ] Accent token system: skyblue (Commercial) / gold (Connect) / peach (Personal & Property) — confirm neutral root has no accent or a fourth neutral token

---

## 2. Root Homepage (`/`)

- [ ] **Home** — `/`
  - Neutral master-brand page. No channel switcher present.
  - Hero: master statement (e.g. *"Business capital, from every angle"*) + primary Commercial CTA
  - "Three ways we help business owners" section (Commercial / Connect / P&P, unequal real estate — Commercial leads)
  - Family taglines (locked copy, from brief):
    - Commercial: *Compare, choose, and access business capital — with full transparency.*
    - Connect: *Fund your customers. Get paid faster.*
    - P&P: *Personal and property funding, for the business owner behind the business.*
  - 🔴 **BLOCKER carried forward:** final hero copy not signed off by Matt
  - 🔴 **BLOCKER carried forward:** GoogleReviews live count/widget provider unconfirmed

---

## 3. Commercial Channel (`/commercial/`)

- [ ] **Commercial Home** — `/commercial/`
  - Flagship channel landing page; primary CTA target from root hero
  - Channel toggle present (4-destination)
  - Owns the Compare experience entry point

### 3.1 Business Loans & Credit Facilities
- [ ] Business Term Loans — `/business-term-loans/`
- [ ] Business Line of Credit — `/business-line-of-credit/`
- [ ] Business Overdraft — `/overdraft/`
- [ ] Business Charge Card — `/charge-card/`
- [ ] Chattel Mortgage — `/chattel-mortgage/`

### 3.2 Equipment & Asset Finance
- [ ] Finance Lease — `/finance-lease/`
- [ ] Operating Lease — `/operating-lease/`

### 3.3 Invoice Finance (consolidated)
- [ ] Invoice Finance — `/invoice-finance/` (merged with retired `debtor-finance.html`)
- [ ] Fund an Invoice — `/fund-an-invoice/`

### 3.4 Trade & Supply Chain Finance
- [ ] Trade Finance (hub) — `/trade-finance/`
- [ ] Export Finance — `/export-finance/` (child of Trade Finance)
- [ ] Supply Chain Funding — `/supply-chain-funding/` (child of Trade Finance)

### 3.5 Cards & Working Capital
- [ ] Merchant Cash Advance — `/merchant-cash-advance/`

### 3.6 Specialist & Property-Backed Finance
- [ ] R&D Tax Incentive Funding — `/r-and-d-funding/`
- [ ] Second Mortgage — `/second-mortgage/`
- [ ] Self-Employed Home Loan — `/self-employed-home-loan/` — 🟡 flag: revisit relationship to `/personalandproperty/` now that channel exists

### 3.7 Compare
- [ ] **Compare** — `/compare/` *(renamed from "Choice")*
  - Explains Cashper matching engine, 70+ lenders, 100+ products
  - Showcases S.T.A.R. Compare Report (Security, Term, Amount, Rate)
  - Self-selection routing: for my business (Commercial) / for me personally (P&P) / to support my customers (Connect)
  - 🔴 Pre-launch priority per current top-of-mind: resolve before Compare nav link ships
- [ ] Compare Report Sample ("See What's Inside") — `/compare-report/`

### 3.8 Guides & Resources Hub — `/guides/`
- [ ] Guides & Resources hub landing — `/guides/`
- [ ] How to Compare Business Loans (pillar) — `/guides/compare-business-loans/`
- [ ] Best Business Line of Credit Options (listicle) — `/guides/best-line-of-credit/`
- [ ] Business Line of Credit: Complete Guide (pillar, carries FAQ schema) — `/guides/business-line-of-credit-guide/`
- [ ] Business Charge Card: Complete Guide — `/guides/business-charge-card-guide/`
- [ ] Business Overdraft: Complete Guide — `/guides/business-overdraft-guide/`
- [ ] Business Term Loans: Complete Guide — `/guides/business-term-loans-guide/`
- [ ] How to Get a Business Loan with Bad Credit — `/guides/business-loan-bad-credit/`
- [ ] Invoice Finance vs Debtor Finance — `/guides/invoice-vs-debtor-finance/`
- [ ] Lease vs Buy (with embedded calculator) — `/guides/lease-vs-buy/`

### 3.9 Tools & Calculators
- [ ] Business Loan Repayment Calculator — `/repayment-calculator/`
- [ ] Equipment Finance Calculator (Lease vs Buy) — `/equipment-calculator/` (canonical; shared component with the guide above)

### 3.10 Trust / Recommended Additions
- [ ] 🟡 Lender Panel / "Our Lenders" — `/lenders/` — **blocked pending updated lender logo files**
- [ ] 🟡 Testimonials / Case Studies — no asset exists yet; recommended addition

---

## 4. Connect Channel (`/connect/`)

- [ ] **Connect Home** — `/connect/` — sole primary CTA: "Become a Partner"
- [ ] How Connect Works — `/connect/how-it-works/`
- [ ] For Vendors (Become a Partner) — `/connect/for-vendors/`
  - 🔴 **BLOCKER carried forward:** live QA flagged literal placeholder text naming Matt and Ben on this page — must be replaced before release
- [ ] For Customers — `/connect/for-customers/`
- [ ] Apply (Connect) — `/connect/apply/` — shared `/apply/` engine, parameterized `product=connect-vendor-finance`
  - 🔴 **BLOCKER carried forward:** apply-form submission flow previously found broken on this channel (data silently discarded) — must be verified fixed
- [ ] About Connect — `/connect/about/` — thin, links up to core `/about/`
- [ ] Connect FAQs — `/connect/faqs/`
- [ ] ~~Connect Contact~~ — routes to `/contact/?dept=connect`, no standalone page
- [ ] 🟡 **Pre-launch priority (current top-of-mind):** correct Connect's visual weighting on the root homepage / nav so it reads as a subordinated partner track, not a peer to Commercial/P&P
- [ ] 🔴 **BLOCKER carried forward:** conflicting registered office address across Connect hub locations must be reconciled

---

## 5. Personal & Property Channel (`/personalandproperty/`)

🔴 *Slug per §0 flag #2 — confirm hyphenation before build.*

- [ ] **Personal & Property Home** — `/personalandproperty/`
  - Structure priority: lead with finance options before introducing James individually
  - Tagline: *Personal and property funding, for the business owner behind the business.*

### 5.1 Service Category Pages (from James's brief — 7 categories, expandable/click-through)
- [ ] Home Loans — `/personalandproperty/home-loans/`
- [ ] Investment Property — `/personalandproperty/investment-property/`
- [ ] Commercial Property — `/personalandproperty/commercial-property/` — 🟡 cross-check overlap against `/second-mortgage/` and `/self-employed-home-loan/`
- [ ] Construction — `/personalandproperty/construction/`
- [ ] SMSF Property — `/personalandproperty/smsf-property/`
- [ ] Personal Loans — `/personalandproperty/personal-loans/`
- [ ] Debt Consolidation — `/personalandproperty/debt-consolidation/`

> Note: the previous sitemap scoped this as 8 loan-type pages by a different naming convention (Owner-Occupied Home Loans, Refinancing as separate from Investment, SMSF Loans, etc.). James's brief in your latest source names 7 categories. 🔴 Confirm which taxonomy is final before building — listed above per James's brief since it's the more recent/authoritative source.

### 5.2 Supporting Pages
- [ ] Enquire Online form — Name, Mobile, Email, "What can we help you with?", details, preferred contact method/time
  - Build note: must auto-create referral/lead in Zoho + follow-up task assigned to James
- [ ] Book a 15-Minute Chat — booking widget, not a direct 1-hour booking
- [ ] James Lowe profile section — role: Head of Personal and Property (placement/prominence pending Matt/Ben sign-off)
- [ ] Contact Directly block — phone, email, website (static contact card)
- [ ] News & Insights — placeholder "Coming Soon" section
- [ ] Apply (Personal & Property) — `/personalandproperty/apply/` — shared `/apply/` engine
- [ ] About Personal & Property — `/personalandproperty/about/` — thin, links to core `/about/`
- [ ] ~~P&P Contact~~ — routes to `/contact/?dept=personal-property`, no standalone page

### 5.3 Known Blockers — Personal & Property
- [ ] 🔴 Company address — blocks Credit Guide and Privacy Policy references
- [ ] 🔴 Compliance-review banner previously flagged as hard release blocker on P&P pages in live QA — confirm removed
- [ ] 🔴 Missing cookie consent previously flagged on this channel — confirm implemented
- [ ] 🟡 Accent color (suggested muted teal/peach — confirm final token) applied via shared component library, not a separate design system

---

## 6. Sitewide Utility Pages

- [ ] **About Us** — `/about/` — full compliance/E-E-A-T detail (ACL 387856, founder bios, milestones, press)
- [ ] Meet Cashper (brand explainer) — `/about/meet-cashper/`
- [ ] **Contact Us** — `/contact/` — single sitewide page with department selector (General / Broker / Connect / P&P), query-param routed from each channel
- [ ] Broker Portal — `/broker-portal/`
- [ ] Apply (core) — `/apply/` — canonical shared intake engine
  - 🔴 **BLOCKER carried forward:** apply-form flow previously broken on 2 of 3 channels — confirm fixed sitewide before launch
- [ ] 404 / Not Found — `/404/` — surfaces Products hub, Guides hub, Apply CTA

---

## 7. Legal / Compliance / Footer

- [ ] Credit Guide — `/credit-guide/` — 🔴 blocked on confirmed company address
- [ ] Terms & Conditions — `/terms/`
- [ ] Privacy Policy — `/privacy/` — 🔴 blocked on confirmed company address
- [ ] ACL / AFCA Trust Badges — Payload global (`FooterLegal`), not a routable page
- [ ] 🔴 **Pre-launch priority (current top-of-mind):** footer legal/compliance disclosures — confirm complete across all three channels before launch

---

## 8. Security / Infra Items Blocking Launch (from prior audits — not pages, but launch-gating)

- [ ] Non-functional rate limiter (Vercel stateless serverless issue) — fix or adopt Connect's anti-abuse stack (Turnstile, HMAC, Redis) as the sitewide template
- [ ] Committed `.env.local` with live credential — rotate credential, purge from history
- [ ] `build-includes.mjs` component-sync gap (previously covered 3 of 66 pages) — confirm resolved in the new codebase (should be moot on the fresh Next.js build, but worth a sanity check given it was the root cause of recurring UI regressions)

---

## 9. Open Decisions to Lock Before Phase 3 Redirect Map

1. Personal & Property slug: hyphenated or not (§0 #2)
2. Product/guide/tool URL nesting: flat at root, or moved under `/commercial/` (§0 #3)
3. Fate of "Why Us" and "Partners" nav items from the prior IA — folded in or dropped (§0 #5)
4. Final loan-category taxonomy for Personal & Property: James's 7 categories vs. the prior sitemap's 8 (§5.1 note)
5. Self-Employed Home Loan and Second Mortgage: stay in Commercial's taxonomy or migrate to Personal & Property now that the channel exists

---

*Compiled from `Master Information Architecture & Sitemap.md` and `Matt-Website-Brief.md`. Where the two conflicted with your latest directive, the directive won and the conflict is flagged above rather than silently resolved, per your team's standing practice.*
