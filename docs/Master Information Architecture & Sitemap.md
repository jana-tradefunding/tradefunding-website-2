\> \*\*Routing note:\*\* the three top-level blocks above are \*\*Next.js route groups\*\* within one app (e.g. \`app/(commercial)/\`, \`app/connect/\`, \`app/personal-and-property/\`), not three separate deployments and not three subdomains. Shared components (header shell, footer, legal globals, \`ChannelSwitcher\`) live outside all three route groups and are composed into each channel's layout.

\---

\#\# 2\. Main Navigation / Core & Brand

\#\#\# 2A. Channel Switcher (replaces equal-weighted channel nav)

\- \*\*Component:\*\* \`ChannelSwitcher\` — a top-bar control, visually and functionally analogous to a region/country selector (e.g. a compact dropdown or segmented control anchored top-right or top-left of the primary header, outside the main product-navigation row).  
\- \*\*Purpose:\*\* Commercial must remain the unambiguous hero brand. The three channels are \*\*not\*\* presented as three equal nav buttons competing for attention — that dilutes the primary product navigation and implies false parity between the hero and the two secondary channels. Instead, the switcher surfaces Connect and Personal & Property as \*\*destinations you move to\*\*, the way a country/region selector moves you to a localized version of a site, while Commercial's own primary nav (Products / Why Us / Partners, per §2B) stays fully intact and undiluted.  
\- \*\*Behavior:\*\*  
  \- On \`/\` (Commercial): switcher shows current state as implicit (Commercial \*is\* the site — no explicit "Commercial" label is required in the switcher itself, consistent with the "yes, that's your home site" framing), with two selectable targets: \*\*Connect\*\* and \*\*Personal & Property\*\*.  
  \- On \`/connect/\*\` and \`/personal-and-property/\*\`: switcher shows the current channel name plus \*\*Home\*\* (back to Commercial) as an explicit option, so users always have a one-click path back to the hero.  
  \- Switching channels is a full route change (\`/\` ↔ \`/connect/\` ↔ \`/personal-and-property/\`), not a client-side theme toggle — each channel is a genuinely separate set of routes, nav state, and (per Phase 1 branding) accent styling.  
\- \*\*Placement relative to primary nav:\*\* the switcher sits above or beside the primary product navigation, never inline with it, so "Products / Why Us / Partners" (Commercial's own nav, see §2B) is never visually competing with the channel switcher for primary weight.  
\- \*\*Icon/label treatment:\*\* consistent with the "home icon" direction discussed for Commercial's own self-reference, the switcher itself is icon-plus-label on desktop and icon-only on mobile, matching the compact footprint expected of a region/country-style selector.

\#\#\# 2B. Home  
\- \*\*Page Name:\*\* Home  
\- \*\*Planned URL:\*\* \`/\`  
\- \*\*Source Asset:\*\* BLC (\`index.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Primary brand \+ platform hub. Targets "compare business loans Australia." Positions Trade Funding as a lending-intelligence platform (70+ lenders, S.T.A.R.-scored Compare Report), not a single-product lender.  
\- \*\*Duplicate Resolution:\*\* \*\*Confirmed.\*\* The legacy Trade Funding homepage and the BLC homepage compete for the same slot. \*\*BLC wins\*\* per the governing rule — it has the stronger conversion mechanic (free Compare Report funnel) and platform narrative. Legacy Trade Funding brand elements (logo, ACL number, founder credibility, review proof points) are merged in. Both resolve to \`/\`, so no redirect is required — this is a content replacement at the same URL, not a URL-level migration.

\#\#\# About Us  
\- \*\*Page Name:\*\* About Us  
\- \*\*Planned URL:\*\* \`/about/\`  
\- \*\*Source Asset:\*\* Live Site \+ BLC (\`about.html\`) — \*\*exists in both\*\*  
\- \*\*Core Purpose & SEO Intent:\*\* E-E-A-T anchor page. Company story, ACL 387856 disclosure, founder bios, "$500M+ in Compare Reports" proof point. Supports trust signals for YMYL (finance) content.  
\- \*\*Duplicate Resolution:\*\* \*\*Confirmed.\*\* BLC \`about.html\` wins as the base template (stronger platform/trust narrative, ACL disclosure already embedded). Ben confirmed the unique live-site content to merge in as supporting sections: founder history, company milestones, team detail, and press coverage. One canonical \`/about/\` page results — no separate legacy About is retained, and none of the live site's unique content is silently dropped.

\#\#\# Meet Cashper (Brand Explainer)  
\- \*\*Page Name:\*\* Meet Cashper  
\- \*\*Planned URL:\*\* \`/about/meet-cashper/\`  
\- \*\*Source Asset:\*\* BLC (\`meet-cashper.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Humanizes the AI matching engine behind the Compare Report ("friendly financial ghost"). Not a commercial-keyword page — it's a brand-differentiation and dwell-time asset, nested as a child of About for topical clarity.  
\- \*\*Duplicate Resolution:\*\* N/A — unique asset, no equivalent on Live Site.

\#\#\# Contact Us  
\- \*\*Page Name:\*\* Contact Us  
\- \*\*Planned URL:\*\* \`/contact/\`  
\- \*\*Source Asset:\*\* New  
\- \*\*Core Purpose & SEO Intent:\*\* \*\*Identified gap\*\* — neither source asset has a dedicated Contact page; details (1300 161 641, hello@tradefunding.com.au) currently live only in the footer. A proper Contact page with form, phone, email, and a department selector (General / Broker / Connect Vendor Enquiry) supports local SEO, NAP consistency, and AFCA transparency expectations.  
\- \*\*Duplicate Resolution:\*\* None — single sitewide Contact page. Connect routes here via a pre-selected query parameter rather than a separate page (see §6). Per the locked nav decision, Contact is removed from the top-level primary nav entirely and lives in the footer; a floating contact button is a separate, independently-evaluated decision, not bundled into this page's IA entry.

\#\#\# Broker Portal  
\- \*\*Page Name:\*\* Broker Portal  
\- \*\*Planned URL:\*\* \`/broker-portal/\`  
\- \*\*Source Asset:\*\* New (referenced only in passing on other Live Site pages; no dedicated asset exists)  
\- \*\*Core Purpose & SEO Intent:\*\* Partner/aggregator acquisition page — explains referral process, commission structure, and links out to the authenticated broker login (external app subdomain, e.g. \`app.tradefunding.com.au\`). Targets "become a broker partner" / "aggregator panel" intent.  
\- \*\*Duplicate Resolution:\*\* N/A — net-new page and net-new nav item.

\#\#\# Apply (Primary Conversion Funnel)  
\- \*\*Page Name:\*\* Apply  
\- \*\*Planned URL:\*\* \`/apply/\`  
\- \*\*Source Asset:\*\* BLC (\`apply.html\`) — canonical  
\- \*\*Core Purpose & SEO Intent:\*\* Sitewide lead-capture engine. Every product and guide page CTAs into this one form. Targets "apply for a business loan" transactional intent.  
\- \*\*Duplicate Resolution:\*\* \*\*Confirmed.\*\* Both files exist in the export. \`apply.html\` is the modern superset — canonical tag present, meta description present, current styling, roughly three times the code of \`trade-funding-website-application.html\`. \*\*\`apply.html\` wins.\*\* The legacy file is retired with a 301 redirect to \`/apply/\`; no content merge is needed since it's a strict subset.

\#\#\# Compare Report Sample  
\- \*\*Page Name:\*\* See What's Inside (Compare Report Sample)  
\- \*\*Planned URL:\*\* \`/compare-report/\`  
\- \*\*Source Asset:\*\* BLC (\`comparison-report.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Mid-funnel trust page — shows a sample of the deliverable before the visitor commits to applying. Reduces funnel drop-off; targets "what is a business loan compare report." Per locked copy direction, this page and its nav label avoid unexplained "compare"/"score" jargon in headline copy — the \*page\* is still named for the deliverable, but surrounding copy leads with the outcome, not the mechanism.  
\- \*\*Duplicate Resolution:\*\* N/A — unique asset.

\#\#\# Primary Navigation Structure (Commercial)  
\- \*\*Products\*\* — grouped hover-expand list (Term Loans, Credit Lines, Invoice, Trade, Equipment, Mortgage→\*\*Personal & Property\*\*, Other) — no emoji/icon grid, per locked decision. A dedicated \`/business-loans/\` full-menu page exists for users directed there from the simplified nav (see §3). Individual product pages are never removed for nav decluttering — they stay live, linked from the footer and/or \`/business-loans/\`, to preserve existing SEO equity.  
\- \*\*Why Us\*\* — purpose-driven navigation, reintroduced alongside the product-named navigation above as a second entry path into the same underlying product pages (not a replacement for Products).  
\- \*\*Partners\*\* — covers Broker Portal and, contextually, Connect's "Become a Partner" acquisition path.  
\- \*\*Contact\*\* — removed from top nav, lives in footer only (see Contact Us, above).  
\- \*\*Channel Switcher\*\* — see §2A; sits outside/above this primary row, never competing with it for weight.

\---

\#\# 3\. Products Hub (\`/business-loans/\`)

\#\#\# Products Hub Landing Page  
\- \*\*Page Name:\*\* Business Loans (Products Hub)  
\- \*\*Planned URL:\*\* \`/business-loans/\`  
\- \*\*Source Asset:\*\* New  
\- \*\*Core Purpose & SEO Intent:\*\* \*\*Identified gap.\*\* Currently the BLC homepage doubles as the de facto products hub, which risks Home and a dedicated hub cannibalizing "business loans australia." A distinct hub page (short intro \+ card grid linking every spoke below) lets Home own the brand/platform intent while this page owns the category-level commercial intent, and gives the Payload content model a clean top-of-taxonomy parent for every product below.

\> \*\*Payload/Next.js note:\*\* All products below are modeled as a \*\*Product Pages\*\* Payload collection with an explicit \`parent: "Business Loans"\` relationship field used for breadcrumb and nav-grouping purposes only. Each product document's \`slug\` field is authored flatly (e.g. \`invoice-finance\`, not \`business-loans/invoice-finance\`) and resolved via a Next.js dynamic route (\`app/\[slug\]/page.tsx\` or an equivalent flat catch-all) — there is no CMS-side "parent slug nesting" to override, because the route is never derived from the parent relationship in the first place.

\#\#\# 3.1 Business Loans & Credit Facilities

\- \*\*Business Term Loans\*\* — \`/business-term-loans/\` — BLC (\`business-term-loans.html\`) — Rate/term-anchored comparison page ("Rates from 8%, $10k–$5M, 1–7 years"); core commercial-lending head term. \*No duplicate.\*  
\- \*\*Business Line of Credit\*\* — \`/business-line-of-credit/\` — BLC (\`business-line-of-credit.html\`) — Revolving-facility comparison; targets "business line of credit australia." \*No duplicate on the product page itself\* — see §4 for the related guide-level cannibalization flag.  
\- \*\*Business Overdraft\*\* — \`/overdraft/\` — BLC (\`overdraft.html\`) — Bank/lender overdraft comparison; "pay interest only on what you draw" positioning. \*No duplicate.\*  
\- \*\*Business Charge Card\*\* — \`/charge-card/\` — BLC (\`charge-card.html\`) — Extended payment terms (30–55 days interest-free) positioning; targets "business charge card australia." \*No duplicate.\*  
\- \*\*Chattel Mortgage\*\* — \`/chattel-mortgage/\` — BLC (\`chattel-mortgage.html\`) — Asset-ownership finance from day one; grouped here (rather than pure Equipment Finance) because its core differentiator vs. leases is ownership/credit-facility structure. \*No duplicate.\*

\#\#\# 3.2 Equipment & Asset Finance

\- \*\*Finance Lease\*\* — \`/finance-lease/\` — BLC (\`finance-lease.html\`) — Own-at-end-of-term equipment finance; depreciation-claim angle. \*No duplicate.\*  
\- \*\*Operating Lease\*\* — \`/operating-lease/\` — BLC (\`operating-lease.html\`) — Use-without-owning, off-balance-sheet flexibility angle; deliberately positioned opposite Finance Lease for a clean "lease vs buy" contrast (reinforced by the guide in §4). \*No duplicate.\*

\#\#\# 3.3 Invoice Finance \*(consolidated)\*

\- \*\*Invoice Finance\*\* — \`/invoice-finance/\` — BLC (\`invoice-finance.html\` \+ \`debtor-finance.html\`, merged) — Single consolidated page covering the whole-ledger/ongoing factoring product formerly split out as "Debtor Finance," alongside the broader "invoice finance australia" head term. Captures both the umbrella query and the whole-ledger transactional intent in one page rather than two competing ones.  
\- \*\*Fund an Invoice (Selective Invoice Finance)\*\* — \`/fund-an-invoice/\` — BLC (\`fund-an-invoice.html\`) — Single-invoice, no whole-ledger commitment; genuinely distinct product structure from \`/invoice-finance/\`, so it remains a separate document in the Product Pages collection.  
\- \*\*Duplicate Resolution:\*\* \*\*Confirmed.\*\* \`invoice-finance.html\` and \`debtor-finance.html\` were found to target near-identical head terms ("compare debtor finance & factoring" appeared in both titles) because they were the same intent, not a genuine hub/child pair. \*\*Verdict: keep \`/invoice-finance/\` only.\*\* \`debtor-finance.html\` is retired; any unique whole-ledger-specific content (rates, lender panel detail, process steps) is merged into \`/invoice-finance/\` before the page is redirected, so nothing is silently dropped. \`/fund-an-invoice/\` is unaffected and remains live as the one genuine child of this cluster.

\#\#\# 3.4 Trade & Supply Chain Finance \*(hub-and-spoke)\*

\- \*\*Trade Finance (Spoke-Hub)\*\* — \`/trade-finance/\` — BLC (\`trade-finance.html\`) — Umbrella for import/export/supply-chain funding.  
\- \*\*Export Finance\*\* — \`/export-finance/\` — BLC (\`export-finance.html\`) — International sales pipeline funding — child of Trade Finance in Payload's parent relationship field.  
\- \*\*Supply Chain Funding\*\* — \`/supply-chain-funding/\` — BLC (\`supply-chain-funding.html\`) — Early-pay-supplier / extended-terms positioning — child of Trade Finance in Payload's parent relationship field.  
\- \*\*Duplicate Resolution:\*\* None — the three pages already have clean, non-overlapping intents; only the parent/child relationship needed formalizing.

\#\#\# 3.5 Cards & Short-Term / Working Capital

\- \*\*Merchant Cash Advance\*\* — \`/merchant-cash-advance/\` — BLC (\`merchant-cash-advance.html\`) — Turnover-based advance, "true cost" transparency framing. \*No duplicate.\*

\#\#\# 3.6 Specialist & Property-Backed Finance

\- \*\*R\&D Tax Incentive Funding\*\* — \`/r-and-d-funding/\` — BLC (\`r-and-d-funding.html\`) — Advance on R\&D refund (70–85% advance rate); niche specialist-lender vertical. \*No duplicate.\*  
\- \*\*Second Mortgage\*\* — \`/second-mortgage/\` — BLC (\`second-mortgage.html\`) — Specialist-lender equity access without refinancing; names actual panel lenders (Arc, Aquamore, Remara, Homesec). \*No duplicate.\*  
\- \*\*Self-Employed Home Loan\*\* — \`/self-employed-home-loan/\` — BLC (\`self-employed-home-loan.html\`) — Consumer-adjacent diversification product for sole traders/contractors with non-standard income. \*No duplicate\* — flagged only as a category outlier (property/consumer lending inside an otherwise commercial-lending taxonomy). \*\*Note:\*\* with Personal & Property now standing up as its own channel (§7), this page's future relationship to \`/personal-and-property/\` (cross-link vs. eventual migration) should be revisited once Personal & Property ships — not addressed by this revision.

\---

\#\# 4\. Guides & Resources Hub (\`/guides/\`)

\- \*\*Page Name:\*\* Guides & Resources (Hub)  
\- \*\*Planned URL:\*\* \`/guides/\` \*(renamed from \`resources.html\`; old \`/resources/\` path 301-redirected)\*  
\- \*\*Source Asset:\*\* BLC (\`resources.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Top-of-funnel content hub; aggregates every guide below by category (Comparisons / Product Guides / Tools). Primary internal-linking engine feeding the product pages in §3.  
\- \*\*Duplicate Resolution:\*\* None.

\> \*\*Payload/Next.js note:\*\* All guides below are modeled as a \*\*Guides\*\* Payload collection with \`parent: "Guides & Resources"\`, and their slugs already live flatly under \`/guides/\*\`, so no additional route reconciliation is needed here — URL nesting and the collection's logical grouping already align.

\- \*\*How to Compare Business Loans (Pillar Guide)\*\* — \`/guides/compare-business-loans/\` — BLC — Cornerstone content; links out to every product page in §3. \*No duplicate.\*  
\- \*\*Best Business Line of Credit Options\*\* — \`/guides/best-line-of-credit/\` — BLC — "Best-of 2026" listicle intent (commercial comparison of providers). \*Flagged adjacency, not duplicate\* — see below.  
\- \*\*Business Line of Credit: Complete Guide\*\* — \`/guides/business-line-of-credit-guide/\` — BLC — Comprehensive/pillar intent for the same product vertical.  
  \- \*\*Duplicate Resolution:\*\* These two guides are \*\*not literal duplicates\*\* (listicle vs. exhaustive guide are different SERP intents), but they sit close enough to risk keyword cannibalization. Resolution: the "Best Of" page stays a short, provider-comparison listicle that links up to the Complete Guide for depth; the Complete Guide is the one that should carry FAQ schema and the most internal links from \`/business-line-of-credit/\`.  
\- \*\*Business Charge Card: Complete Guide\*\* — \`/guides/business-charge-card-guide/\` — BLC — Companion long-form guide to \`/charge-card/\`. \*No duplicate.\*  
\- \*\*Business Overdraft: Complete Guide\*\* — \`/guides/business-overdraft-guide/\` — BLC — Companion guide to \`/overdraft/\`. \*No duplicate.\*  
\- \*\*Business Term Loans: Complete Guide\*\* — \`/guides/business-term-loans-guide/\` — BLC — Companion guide to \`/business-term-loans/\`. \*No duplicate.\*  
\- \*\*How to Get a Business Loan with Bad Credit\*\* — \`/guides/business-loan-bad-credit/\` — BLC — Underserved-borrower intent; supports the "no credit check" trust angle used sitewide. \*No duplicate.\*  
\- \*\*Invoice Finance vs Debtor Finance\*\* — \`/guides/invoice-vs-debtor-finance/\` — BLC — Terminology-explainer guide; retained even though \`/debtor-finance/\` no longer exists as its own page (§3.3), since "invoice finance vs debtor finance" is still a real search query people use interchangeably. Now the primary internal link from \`/invoice-finance/\` and \`/fund-an-invoice/\`, clarifying that "debtor finance" lives inside the consolidated Invoice Finance page rather than as a separate product. \*No duplicate.\*  
\- \*\*Lease vs Buy (with Calculator)\*\* — \`/guides/lease-vs-buy/\` — BLC — Comparison guide with an embedded calculator; dual-purpose with §5 Tools. \*Cross-referenced, not duplicated\* — canonical home is here in Guides; the Tools hub links to it rather than rebuilding the calculator as a separate page.

\---

\#\# 5\. Tools & Calculators

\- \*\*Page Name:\*\* Business Loan Repayment Calculator  
\- \*\*Planned URL:\*\* \`/repayment-calculator/\`  
\- \*\*Source Asset:\*\* BLC (\`repayment-calculator.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Utility/interactive tool for weekly/fortnightly/monthly repayments across term loans, lines of credit, and equipment finance. High dwell-time, strong internal-linking hub back into §3 products.  
\- \*\*Duplicate Resolution:\*\* None.

\- \*\*Page Name:\*\* Equipment Finance Calculator (Lease vs Buy)  
\- \*\*Planned URL:\*\* \`/equipment-calculator/\`  
\- \*\*Source Asset:\*\* BLC (\`equipment-calculator.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Compares leasing vs. buying total cost; feeds directly into Finance Lease, Operating Lease, and Chattel Mortgage product pages.  
\- \*\*Duplicate Resolution:\*\* \*\*Flagged overlap\*\* with \`/guides/lease-vs-buy/\`, which embeds its own calculator instance. Resolution: \`/equipment-calculator/\` is the canonical standalone tool (linked from the main Tools nav and all three equipment-finance product pages); the guide's embedded version is a shared React component instance of the same calculator logic, not a separate build — both call the same underlying component to avoid divergent maintenance.

\---

\#\# 6\. Connect Channel (\`/connect/\`) — \*formerly "Fundit"; that name is retired everywhere\*

No Connect content exists in the current source assets as a Payload-modeled channel yet, though a static site already exists in the project zip under \`connect/\` with its own design spec and serverless API — this section governs the IA for the migrated, sub-path version. It is designed to mirror the core site's conventions (same header shell, footer, legal suite, breadcrumbs, and shared design-token base) so it reads as a channel of Trade Funding rather than a bolted-on microsite. Cross-links are added from \`/finance-lease/\`, \`/operating-lease/\`, and \`/chattel-mortgage/\` toward \`/connect/\` as a complementary point-of-sale/vendor finance channel.

\- \*\*Page Name:\*\* Connect (Home)  
\- \*\*Planned URL:\*\* \`/connect/\`  
\- \*\*Source Asset:\*\* Existing \`connect/\` static site (migrated) — rename pass required to remove all "Fundit" references  
\- \*\*Core Purpose & SEO Intent:\*\* Program landing page introducing vendor/point-of-sale finance to equipment vendors, dealers, and suppliers who want to offer finance at checkout. Targets "vendor finance program australia" / "point of sale finance for equipment dealers." Sole primary CTA is \*\*"Become a Partner"\*\*, per locked decision — this replaces any prior CTA wording.  
\- \*\*Duplicate Resolution:\*\* N/A.

\- \*\*Page Name:\*\* How Connect Works  
\- \*\*Planned URL:\*\* \`/connect/how-it-works/\`  
\- \*\*Source Asset:\*\* Existing \`connect/\` static site (migrated)  
\- \*\*Core Purpose & SEO Intent:\*\* Process walkthrough (vendor signs up → integrates checkout finance option → customer approved → vendor paid out). Supports both vendor and customer research-stage queries.  
\- \*\*Duplicate Resolution:\*\* N/A.

\- \*\*Page Name:\*\* For Vendors (Become a Partner)  
\- \*\*Planned URL:\*\* \`/connect/for-vendors/\`  
\- \*\*Source Asset:\*\* Existing \`connect/\` static site (migrated)  
\- \*\*Core Purpose & SEO Intent:\*\* B2B acquisition page targeting equipment dealers/suppliers; commission and integration pitch. Primary conversion page for the vendor side of the two-sided marketplace, with \*\*"Become a Partner"\*\* as the sole primary CTA sitewide across Connect.  
\- \*\*Duplicate Resolution:\*\* N/A.

\- \*\*Page Name:\*\* For Customers  
\- \*\*Planned URL:\*\* \`/connect/for-customers/\`  
\- \*\*Source Asset:\*\* Existing \`connect/\` static site (migrated)  
\- \*\*Core Purpose & SEO Intent:\*\* End-customer-facing explainer of what vendor/point-of-sale finance is, indicative rates, and eligibility — captures "how do I finance my purchase from \[Vendor\]" intent.  
\- \*\*Duplicate Resolution:\*\* N/A.

\- \*\*Page Name:\*\* Apply (Connect)  
\- \*\*Planned URL:\*\* \`/connect/apply/\`  
\- \*\*Source Asset:\*\* Shares the core \`/apply/\` intake engine — not a separate build  
\- \*\*Core Purpose & SEO Intent:\*\* Conversion endpoint for both vendor and customer applications, pre-filtered to \`product=connect-vendor-finance\` so the Compare Report/matching logic only surfaces relevant panel lenders.  
\- \*\*Duplicate Resolution:\*\* \*\*Flagged by design, resolved by architecture.\*\* This is the same shared application component as \`/apply/\`, parameterized rather than duplicated — one intake engine, one codebase, two entry points.

\- \*\*Page Name:\*\* About Connect  
\- \*\*Planned URL:\*\* \`/connect/about/\`  
\- \*\*Source Asset:\*\* Existing \`connect/\` static site (migrated)  
\- \*\*Core Purpose & SEO Intent:\*\* Brand-story page — why the program exists, who it's for. Deliberately thin on corporate/compliance detail.  
\- \*\*Duplicate Resolution:\*\* \*\*Flagged and resolved.\*\* Corporate details, ACL number, and founder credibility live once at \`/about/\`. \`/connect/about/\` covers only Connect-specific positioning and hyperlinks to \`/about/\` for full company detail — this avoids thin/duplicate-content risk between the two "About" pages.

\- \*\*Page Name:\*\* Connect FAQs  
\- \*\*Planned URL:\*\* \`/connect/faqs/\`  
\- \*\*Source Asset:\*\* Existing \`connect/\` static site (migrated)  
\- \*\*Core Purpose & SEO Intent:\*\* Addresses vendor- and customer-side objections (fees, approval speed, what happens on default); strong FAQPage schema candidate.  
\- \*\*Duplicate Resolution:\*\* N/A.

\- \*\*Page Name:\*\* Connect Contact / Support  
\- \*\*Planned URL:\*\* \*(none — routes to \`/contact/?dept=connect\`)\*  
\- \*\*Source Asset:\*\* N/A  
\- \*\*Core Purpose & SEO Intent:\*\* N/A — intentionally not built as a standalone page.  
\- \*\*Duplicate Resolution:\*\* \*\*Resolved by not duplicating.\*\* Rather than forking NAP data and AFCA disclosure across a second Contact page, Connect enquiries route to the single sitewide \`/contact/\` with a pre-selected "Connect / Vendor Enquiry" department field.

\---

\#\# 7\. Personal & Property Channel (\`/personal-and-property/\`) — \*net-new; formerly internal "Mortgage"\*

🔴 \*\*This channel does not exist in any source asset (live site, BLC export, or \`connect/\` folder).\*\* The structure below is scoped from the project plan's stated coverage (all eight loan types) and is a placeholder skeleton for page count and grouping only — actual page-level copy, hero content, and detailed sub-navigation must be drafted from the Executive Questionnaire content once available, and are \*\*not\*\* invented here.

\- \*\*Page Name:\*\* Personal & Property (Home)  
\- \*\*Planned URL:\*\* \`/personal-and-property/\`  
\- \*\*Source Asset:\*\* New  
\- \*\*Core Purpose & SEO Intent:\*\* Standalone, independently indexable acquisition channel covering personal and property finance for the people behind a business (as distinct from Commercial's business-facing products and Connect's point-of-sale channel). Framed per the locked messaging direction: business gets funding options (Commercial), the business's customers get funded at the point of sale (Connect), and the people who run the business get personal/property funding here.  
\- \*\*Duplicate Resolution:\*\* N/A — net-new page and net-new channel.

\#\#\# 7.1 Loan Type Pages (all eight, per locked scope)

\- \*\*Owner-Occupied Home Loans\*\* — \`/personal-and-property/owner-occupied-home-loans/\` — New.  
\- \*\*Investment Property Loans\*\* — \`/personal-and-property/investment-property-loans/\` — New.  
\- \*\*Refinancing\*\* — \`/personal-and-property/refinancing/\` — New.  
\- \*\*Construction Loans\*\* — \`/personal-and-property/construction-loans/\` — New.  
\- \*\*Commercial Property Finance\*\* — \`/personal-and-property/commercial-property-finance/\` — New. \*(Cross-check against \`/second-mortgage/\` and \`/self-employed-home-loan/\` in §3.6 for overlap once both channels have final copy — flagged, not yet resolved.)\*  
\- \*\*SMSF Loans\*\* — \`/personal-and-property/smsf-loans/\` — New.  
\- \*\*Personal Loans (Secured & Unsecured)\*\* — \`/personal-and-property/personal-loans/\` — New.  
\- \*\*Debt Consolidation\*\* — \`/personal-and-property/debt-consolidation/\` — New.

\- \*\*Page Name:\*\* Apply (Personal & Property)  
\- \*\*Planned URL:\*\* \`/personal-and-property/apply/\`  
\- \*\*Source Asset:\*\* Shares the core \`/apply/\` intake engine — not a separate build, consistent with the shared-engine pattern already established for Connect (§6).  
\- \*\*Core Purpose & SEO Intent:\*\* Conversion endpoint parameterized to the relevant loan type, so the same matching logic surfaces the correct lender panel.  
\- \*\*Duplicate Resolution:\*\* \*\*Resolved by architecture\*\*, matching the pattern in §6 — one intake engine, three entry points.

\- \*\*Page Name:\*\* About Personal & Property  
\- \*\*Planned URL:\*\* \`/personal-and-property/about/\`  
\- \*\*Source Asset:\*\* New  
\- \*\*Core Purpose & SEO Intent:\*\* Brand-story page for the channel, thin on corporate/compliance detail and hyperlinking to \`/about/\` for full company detail — same pattern as \`/connect/about/\`.  
\- \*\*Duplicate Resolution:\*\* \*\*Resolved by pattern-matching §6\*\* — corporate/compliance detail lives once at \`/about/\`.

\- \*\*Page Name:\*\* Personal & Property Contact / Support  
\- \*\*Planned URL:\*\* \*(none — routes to \`/contact/?dept=personal-property\`)\*  
\- \*\*Source Asset:\*\* New  
\- \*\*Core Purpose & SEO Intent:\*\* N/A — not built as a standalone page, matching the Connect pattern.  
\- \*\*Duplicate Resolution:\*\* \*\*Resolved by not duplicating\*\*, matching §6's Contact resolution.

🟡 \*\*PLACEHOLDER — accent/branding:\*\* per Phase 1 branding decisions, Personal & Property receives its own distinct accent color (suggested muted teal/green — currently unused across Commercial and Connect) applied to the shared component library, not a separate design system. Confirm with the design team before Phase 4 build.

\---

\#\# 8\. Legal / Compliance / Footer Utility

\- \*\*Page Name:\*\* Credit Guide  
\- \*\*Planned URL:\*\* \`/credit-guide/\`  
\- \*\*Source Asset:\*\* Live Site (\`credit-guide.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Mandatory ACL disclosure — licensee details, remuneration, complaints handling. Referenced in every footer, including Connect's and Personal & Property's.  
\- \*\*Duplicate Resolution:\*\* None — single sitewide instance; no per-channel fork, on the assumption all channels operate under the same Trade Funding Pty Ltd ACL (387856). If a channel is later licensed under a different credit representative number, this page will need a channel-specific addendum section, not a duplicate page.  
\- 🔴 \*\*BLOCKER carried forward:\*\* the correct company address referenced on this page for Credit Guide \+ Privacy Policy has not been confirmed. Do not guess it — flagged as unresolved pending confirmation from the team.

\- \*\*Page Name:\*\* Terms & Conditions  
\- \*\*Planned URL:\*\* \`/terms/\`  
\- \*\*Source Asset:\*\* Live Site (\`terms.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Sitewide legal terms, ABN 28 647 543 084\.  
\- \*\*Duplicate Resolution:\*\* None.

\- \*\*Page Name:\*\* Privacy Policy  
\- \*\*Planned URL:\*\* \`/privacy/\`  
\- \*\*Source Asset:\*\* Live Site (\`privacy.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Data handling disclosure, referenced from every form (\`/apply/\`, \`/connect/apply/\`, and \`/personal-and-property/apply/\`).  
\- \*\*Duplicate Resolution:\*\* None.  
\- 🔴 \*\*BLOCKER carried forward:\*\* see address blocker above — same unresolved dependency applies here.

\- \*\*Page Name:\*\* ACL / AFCA Trust Badges  
\- \*\*Planned URL:\*\* \*(Payload global, not a routable page)\*  
\- \*\*Source Asset:\*\* Live Site (\`components/footer.html\`), migrated to a Payload \*\*global\*\* (e.g. \`FooterLegal\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Shared-footer trust component (ACL number \+ AFCA member badge), pulled into every channel's template (Commercial, Connect, Personal & Property) from a single global document — not duplicated per channel. Per the locked footer decision, the ACL number is componentized down to a single instance in the footer rather than repeated multiple times per page.  
\- \*\*Duplicate Resolution:\*\* None — single component, sitewide, one Payload global powering all three channels.

\- \*\*Page Name:\*\* 404 / Not Found  
\- \*\*Planned URL:\*\* \`/404/\`  
\- \*\*Source Asset:\*\* BLC (\`404.html\`)  
\- \*\*Core Purpose & SEO Intent:\*\* Standard error page; should surface the Products hub, Guides hub, and Apply CTA to recover lost sessions.  
\- \*\*Duplicate Resolution:\*\* None.

\---

\#\# 9\. Duplicate Resolution — Consolidated Log

\*All nine conflicts below are confirmed via the Task 5 working session with Ben (BLC asset owner) and signed off by Matt. Status: Complete — retained here as the permanent record of each verdict, not to be re-opened during migration. Class 3 has been relabeled from "Fundit" to "Connect" per the naming resolution; no verdicts changed.\*

\*\*Governing rule (resolves \#1–\#2 and pre-resolves any future cross-asset collision):\*\* where a page exists in both the live site and the BLC export, the BLC version wins as the structural/functional source of truth; the live site is a content donor, and its unique content (founder history, milestones, press mentions, legal wording) is merged in before the losing page is retired — never silently dropped.

\*\*Resolution Class 1 — Cross-asset conflicts (live site vs. BLC export)\*\*

| \# | Conflicting Assets | Winner | Rationale |  
|---|---|---|---|  
| 1 | Legacy Trade Funding Home vs. BLC \`index.html\` | \*\*BLC\*\* | Stronger conversion funnel \+ platform narrative; legacy brand elements (logo, ACL number, founder credibility, review proof points) merged in. Both resolve to \`/\` — content replacement at the same URL, no redirect required |  
| 2 | Legacy Trade Funding \`about.html\` vs. BLC \`about.html\` | \*\*BLC\*\* | Stronger trust/ACL narrative as base template; unique legacy founder history, milestones, team detail, and press coverage merged in as supporting sections |

\*\*Resolution Class 2 — Within-export conflicts (both files exist inside the zip)\*\*

| \# | Conflicting Assets | Winner | Rationale |  
|---|---|---|---|  
| 3 | \`apply.html\` vs. \`trade-funding-website-application.html\` | \*\*\`apply.html\`\*\* | Modern superset — canonical tag, meta description, current styling, roughly three times the code; legacy file 301-redirected and retired, no content merge needed (strict subset) |  
| 4 | \`invoice-finance.html\` vs. \`debtor-finance.html\` | \*\*\`/invoice-finance/\` only\*\* | Same intent, not a genuine hub/child pair; \`debtor-finance.html\` retired, unique whole-ledger content merged into \`/invoice-finance/\` before redirect |  
| 5 | \`best-line-of-credit.html\` vs. \`business-line-of-credit-guide.html\` | \*\*Both kept\*\*, roles differentiated | Listicle (provider comparison) vs. exhaustive pillar guide; pillar carries FAQ schema and the majority of internal links from \`/business-line-of-credit/\` |  
| 6 | \`equipment-calculator.html\` vs. \`lease-vs-buy.html\` | \*\*\`/equipment-calculator/\`\*\* is canonical tool | Guide embeds an instance of the exact same calculator component — one build, two placements, no divergent maintenance |

\*\*Resolution Class 3 — Connect pairs (resolved by architecture, not content)\*\*

| \# | Conflicting Assets | Winner | Rationale |  
|---|---|---|---|  
| 7 | Core \`/about/\` vs. \`/connect/about/\` | \*\*Core \`/about/\`\*\* for compliance detail | Connect page stays brand-and-positioning only and links up to core, avoiding thin/duplicate-content risk |  
| 8 | Core \`/apply/\` vs. \`/connect/apply/\` | \*\*Shared engine\*\* | Same intake component, parameterized by product — one codebase, two entry points, not a duplicate build |  
| 9 | Core \`/contact/\` vs. a Connect-specific contact page | \*\*Core \`/contact/\`\*\* only | Connect enquiries route in via a pre-selected "Connect / Vendor Enquiry" department field, preventing forked NAP and compliance data |

\---

\#\# 10\. Identified Gaps & Recommendations (Beyond Source Assets)

\- \*\*\`/contact/\`\*\* — missing entirely from both source assets; built as new (see §2B).  
\- \*\*\`/business-loans/\` hub\*\* — currently the homepage is doing double duty as brand hub \*and\* category hub; splitting these prevents keyword cannibalization (see §3).  
\- \*\*\`/broker-portal/\`\*\* — mentioned in passing on existing pages but never built as a real page; required per the brief, built as new (see §2B).  
\- \*\*Lender Panel / "Our Lenders" page\*\* — not present in any source asset. Recommended addition (e.g. \`/lenders/\`) listing the 70+ panel lenders by name — strong E-E-A-T and internal-linking asset for a comparison platform, and a natural home for the individual lender logos already sitting in \`/assets/lenders/\`. \*\*Blocked pending updated/official lender logo files\*\* (current ones flagged as outdated by Ben).  
\- \*\*Testimonials / Case Studies\*\* — no such asset currently exists; recommended for conversion-rate and trust purposes, particularly for higher-consideration products like Second Mortgage and R\&D Funding.  
\- \*\*FAQ schema\*\* — recommend applying FAQPage structured data to the Complete Guides (§4) and the new Connect FAQs page (§6) rather than building a separate sitewide FAQ hub.  
\- \*\*Personal & Property (§7)\*\* — entire channel is a content and structural gap; page skeleton scoped here from the eight-loan-type brief only. Actual copy and any additional sub-navigation depend on the Executive Questionnaire content, which has not yet been supplied into this IA process.  
\- \*\*\`GoogleReviews\` trust component\*\* — the live review count/rating currently hardcoded/displayed is stale (shows \~34 vs. a real count in the \~49–50 range). 🔴 \*\*BLOCKER:\*\* the actual current count must be confirmed before this component ships, specifically for its fallback/error-state copy — the live widget should render the real-time figure, but a stale hand-typed fallback would be visibly wrong if the widget fails to load.  
\- \*\*Final Home hero copy\*\* — 🔴 \*\*BLOCKER\*\*, directionally agreed (lead with the \*why\*, not the \*how\*; avoid unexplained "compare"/"score" jargon) but not yet signed off. Any placeholder copy used during build must be clearly marked as draft and superseded once final copy lands.

\---

\#\# 11\. Payload CMS / Next.js Implementation Notes

\- \*\*Content modeling replaces page-hierarchy mechanics.\*\* Where the previous draft relied on a CMS-side "Parent/Child" page-attribute field to express taxonomy, that relationship is now modeled explicitly as a \`parent\` relationship field on each Payload document (Product Pages, Guides collections) — every product in §3 references "Business Loans" as its parent, every guide in §4 references "Guides & Resources," every Connect page in §6 references "Connect," and every Personal & Property page in §7 references "Personal & Property." This field drives breadcrumb and nav-grouping logic only; it has no effect on the actual URL.  
\- \*\*No permalink-override mechanic is needed.\*\* Because Next.js routes are defined explicitly (either as static route segments or a flat dynamic \`\[slug\]\` route reading from Payload), there is no default "parent-slug nesting" behavior to fight in the first place — every §3 product's flat URL (\`/invoice-finance/\`, not \`/business-loans/invoice-finance/\`) is simply how the route is defined, not an override of a default.  
\- \*\*Connect inherits the shared layout\*\*, not a channel-specific one: the same header shell (channel-switcher-aware, see §2A), footer, and legal globals render across Commercial, Connect, and Personal & Property, reinforcing that all three are channels of one Trade Funding platform rather than separate sites — while each channel's route group applies its own accent theme and channel-specific nav state.  
\- \*\*Breadcrumbs\*\* are computed from the Payload \`parent\` relationship field and rendered via a shared breadcrumb component (not a CMS SEO plugin, since there is no WordPress/Yoast/RankMath layer in this stack): \`Home \> Business Loans \> Invoice Finance\` (no third level, since Debtor Finance is consolidated — see §3.3), \`Home \> Business Loans \> Trade Finance \> Export Finance\`, \`Home \> Connect \> For Vendors\`, and \`Home \> Personal & Property \> Investment Property Loans\` should render sitewide to reinforce the hub-and-spoke structure to both users and search engines.  
\- \*\*Redirects\*\* (e.g. legacy \`trade-funding-website-application.html\` → \`/apply/\`, \`/resources/\` → \`/guides/\`) are defined in the Vercel/Next.js redirects configuration, not via a CMS redirect plugin, and should be checked against \`Master Information Architecture & Sitemap.md\` (this document) as the single source of truth for which legacy paths require a 301\.  
\- \*\*Sub-path routing, one deployment.\*\* Commercial, Connect, and Personal & Property are three route groups in one Next.js app on one Vercel project, sharing one Payload backend — not three subdomains and not three separate Vercel deployments. This preserves one domain's SEO authority across all three channels and keeps the \`ChannelSwitcher\` a same-origin route change rather than a cross-domain redirect.  
