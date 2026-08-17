**SEO & DIGITAL PERFORMANCE AUDIT**

**tradefunding.com.au**

_16-Month Google Search Console Baseline • Live Site Crawl • Indexation Review_

Data Baseline: TF_Audit_Baseline_2026-07-21.xlsx

Report Date: 27 July 2026

Prepared by: Skyrocket Studios - PMO / Digital Growth

**Brand Legend**

**Coral #FF585D** Critical findings • **Orange #FCA165** Opportunities • **Blue #22A4E3** Data insight • **Dark Pink #E75669** Action item

# **Executive Summary & SEO Health Score**

Trade Funding's organic search channel is currently under-performing relative to its market opportunity. Across the 16-month Google Search Console baseline (19 March 2025 - 10 July 2026), the site generated 413 clicks from 22,712 impressions - an average CTR of 1.82% - almost entirely on brand-name searches for "trade funding" itself.

| **SEO HEALTH SCORE**<br><br>**34 / 100**<br><br>**Needs Urgent Intervention** | **Rating basis:** 97% traffic concentration on a single URL, near-total absence of non-brand visibility, a faceted/canonicalised product catalogue with no indexable product pages, and unresolved legacy redirects.<br><br>This is a structural and content visibility problem, not a demand problem - SME finance search demand around Trade Funding's core terms is substantial (impressions in the thousands for non-brand queries) but the site is not positioned to capture it. |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

### **Key Strengths**

- Strong brand equity in search: "trade funding" and "tradefunding" together deliver 312 clicks (75.5% of all organic clicks) at healthy CTRs of 5.53% and 11.52% respectively.
- The homepage ranks respectably for its primary brand term (average position 13.5) and carries the overwhelming majority of site authority.
- Desktop traffic converts impressions to clicks more efficiently than mobile (1.99% vs 1.50% CTR), suggesting the underlying value proposition works once a qualified visitor lands - the gap is in reach, not message.

### **Primary Structural Bottlenecks**

- Extreme traffic concentration: the homepage alone drives 97.1% of all clicks; every product and campaign page combined drives under 3%.
- Non-brand demand is being lost at scale: high-volume commercial queries ("funding traders", "fund trade", "business funding sydney", "trade finance loan") generate thousands of impressions but near-zero clicks because average positions sit between 8 and 70+.
- The live site crawl shows individual product/landing pages (e.g. /products/grow, /products/save) that still earn Search Console impressions no longer exist as standalone crawlable pages - they have been consolidated into a single faceted /our-products/ catalogue, and every filtered variant of that catalogue is canonicalised (non-indexable).
- Of 28 crawled URLs, only 15 are indexable; 8 are non-indexable faceted filter URLs and 5 are legacy 301 redirects (www/non-www, http/https, trailing-slash) that add crawl waste without adding equity.

# **Section 1: How Our SEO Performed So Far**

16-month baseline covering 19 March 2025 to 10 July 2026, sourced from Google Search Console.

## **1.1 Traffic Distribution & Page Equity**

Organic performance is almost entirely a homepage story. This is a warning sign for a site with a multi-product offering - it means paid campaigns, content marketing, and product-specific SEO investment are not yet translating into independently discoverable, rankable pages.

| **Page**                                             | **Clicks** | **Impressions** | **CTR** | **Avg. Position** |
| ---------------------------------------------------- | ---------- | --------------- | ------- | ----------------- |
| **Homepage ( / )**                                   | 401        | 20,592          | 1.95%   | 13.5              |
| **/products/grow**                                   | 5          | 1,198           | 0.42%   | 58.3              |
| **/products/save**                                   | 3          | 476             | 0.63%   | 3.4               |
| **/products/business-cards**                         | 2          | 427             | 0.47%   | 4.0               |
| **/products/equipment-finance**                      | 1          | 448             | 0.22%   | 24.3              |
| **/products/international-business-transactions-fx** | 0          | 1,003           | 0.00%   | 49.5              |

**Data Insight**

The homepage's 97.1% share of clicks masks a genuinely interesting signal buried in the data: /products/save and /products/business-cards rank well (positions 3.4 and 4.0) but still convert impressions to clicks at under 1%. Good rank with poor CTR usually points to a weak or generic meta title/description rather than a ranking problem - a fast, low-cost fix.

## **1.2 Brand vs Non-Brand Intent**

Search visibility is currently a near-monopoly of brand-name queries. This is healthy for defending existing awareness but does nothing to acquire new SME borrowers who don't yet know the Trade Funding name.

| **Query Type**        | **Example Terms**                                                                | **Clicks** | **Impressions** | **CTR** |
| --------------------- | -------------------------------------------------------------------------------- | ---------- | --------------- | ------- |
| **Brand**             | "trade funding", "tradefunding"                                                  | 312        | 5,351           | 5.83%   |
| **Non-brand (top 4)** | "funding traders", "fund trade", "business funding sydney", "trade finance loan" | 4          | 4,212           | 0.10%   |

**Critical Finding**

Non-brand queries generate roughly comparable impression volume to brand queries but convert to clicks at 1/58th the rate. This is the single largest quantifiable growth opportunity in the account: closing even a fraction of this CTR gap would multiply non-brand organic lead volume without any additional media spend.

## **1.3 Device Performance**

| **Device** | **Clicks** | **Share of Clicks** | **Impressions** | **CTR** | **Avg. Position** |
| ---------- | ---------- | ------------------- | --------------- | ------- | ----------------- |
| Desktop    | 274        | 66.3%               | 13,778          | 1.99%   | 22.9              |
| Mobile     | 133        | 32.2%               | 8,860           | 1.50%   | 9.9               |
| Tablet     | 3          | 0.7%                | 74              | 4.05%   | 5.7               |

**Opportunity**

Mobile ranks better on average (position 9.9 vs 22.9) but converts impressions to clicks at a lower rate (1.50% vs 1.99%). Since SME owners frequently research finance options on mobile outside business hours, this points to a mobile page-experience or mobile SERP-snippet issue worth a dedicated technical review (page speed, mobile title truncation, tap-target sizing on forms).

# **Section 2: Dedicated Client Traffic & Campaign Landing Page Analysis**

**Client Question**

"Given you were reviewing website traffic, have you reviewed traffic holistically hitting the website and landing pages? Were you able to glean any insights from visits, especially hitting the landing pages for our campaigns? These seem to get a lot of traffic but don't convert leads well."

## **2.1 What the Data Shows**

Yes - and the holistic view is the most important finding in this audit. Campaign and product landing pages (Grow, Save, Business Cards, Equipment Finance, International FX) are collectively earning meaningful impression volume - over 3,500 impressions across five pages - but converting almost none of it into clicks, and the pages themselves no longer exist as dedicated, crawlable URLs on the live site.

The current live site crawl (28 URLs) contains zero standalone /products/\* pages. Every product that Search Console still has indexed from the old URL structure now resolves through a single faceted listing page, /our-products/, filtered by category query parameters. Every one of those filtered variants is marked Non-Indexable / Canonicalised in the crawl.

**Critical Finding**

This is very likely the root cause of the client's concern. If paid campaigns or email/social CTAs are still pointing to the old /products/ URLs (or to filtered /our-products/ variants), visitors are landing on a generic filtered catalogue view rather than a purpose-built, message-matched landing page - which explains healthy traffic/impressions alongside poor lead conversion. This should be verified immediately against current campaign UTM destinations in Google Ads / paid channels.

## **2.2 Why Traffic Isn't Converting - Diagnostic Framework**

| **Cause**                         | **What We See in the Data**                                                                                                                                                     | **Likely Impact** |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Message mismatch                  | Campaign-specific URLs (e.g. /products/grow) no longer resolve to dedicated pages; traffic lands on a generic filtered catalogue instead of the offer promised in the ad/email. | High              |
| Indexation / structure disconnect | 8 of 28 crawled URLs are non-indexable faceted filters; there is no single canonical, indexable URL per product.                                                                | High              |
| Weak SERP snippet / CTR drag      | /products/save and /products/business-cards rank well (pos. 3-4) yet convert under 1% of impressions - title/description likely doesn't match searcher intent.                  | Medium            |
| Legacy redirect chains            | 5 of 28 URLs are 301s (www/non-www, http/https, trailing slash) - each hop adds latency and can leak referral/campaign parameters.                                              | Medium            |
| Mobile experience gap             | Mobile impressions nearly match desktop, but CTR and conversion lag - consistent with form friction or slow load on mobile landing pages.                                       | Medium            |

## **2.3 CRO & UX Action Plan for Campaign Landing Pages**

### **Immediate (0-2 weeks)**

- Audit every live paid/organic campaign for its actual landing destination; flag any pointing to /products/\* URLs or filtered /our-products/ views.
- Stand up one dedicated, indexable landing page per active campaign product (Grow, Save, Business Cards, Equipment Finance, FX) with a single clear CTA matched to the ad promise.
- Add trust signals above the fold: accreditation/lender logos, client testimonials, indicative approval timeframes - SME lending converts on trust as much as offer.

### **Near-Term (2-6 weeks)**

- Simplify lead-capture forms on landing pages to the minimum viable fields; test progressive profiling for anything beyond name/contact/loan amount.
- Rewrite meta titles/descriptions for high-position, low-CTR pages (/products/save, /products/business-cards) to lead with the specific benefit and a number (rate, speed, amount).
- Instrument scroll-depth and form-abandonment tracking on each landing page to separate a "traffic quality" problem from a "page friction" problem.

### **Structural (6-12 weeks)**

- Resolve the /our-products/ faceted-navigation problem: give each product a permanent, canonical, indexable URL rather than a filter parameter.
- Clean up the 5 legacy redirect chains so campaign links resolve in a single hop with parameters intact.
- Build a lightweight IA rule: every paid campaign, email CTA, and organic content piece must map to one canonical landing URL - never a filtered/listing view.

# **Section 3: Content & Keyword Strategy - What Works & What to Build**

## **3.1 What Currently Generates Visibility**

Brand-name search and the homepage are doing essentially all of the work. The three published blog/news articles in the live crawl (partnership announcement, product launch, and a business-owner-focused finance article) are indexable but do not yet appear among top-performing pages in the 16-month baseline - indicating they are too new, too thin, or not yet earning non-brand rankings.

## **3.2 Keyword Expansion - High-Intent Non-Brand SME Finance Queries**

The dataset already shows sizeable, currently-unmet demand. The priority is not guessing at new topics - it's building indexable, well-targeted pages against demand Trade Funding is already receiving impressions for but not ranking on.

| **Query**               | **Impressions** | **Current Avg. Position** | **Opportunity**               |
| ----------------------- | --------------- | ------------------------- | ----------------------------- |
| funding traders         | 1,496           | 5.2                       | Near page 1 - CTR/snippet fix |
| fund trade              | 1,304           | 8.4                       | Page 1 border - content depth |
| business funding sydney | 903             | 7.5                       | Local/commercial intent page  |
| trade finance companies | 731             | 20.1                      | Comparison / category page    |
| business funding        | 706             | 8.0                       | Core category landing page    |
| trade finance loan      | 509             | 70.0                      | Dedicated product page needed |
| trade finance brokers   | 456             | 14.2                      | Partner/broker-facing page    |

**Opportunity**

"funding traders" and "fund trade" already rank inside the top 10 on average but convert at near-zero CTR - these are the fastest wins in the entire dataset. A snippet/title rewrite and an on-page relevance pass could realistically move both into consistent page-1 clicks within weeks, well ahead of any new content investment.

## **3.3 Content Mapping Matrix**

| **Content Type**                                         | **Purpose**                                                                        | **Priority** |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------ |
| Dedicated product landing pages (per offer)              | Replace faceted /our-products/ filters with canonical, campaign-ready pages        | Critical     |
| "Trade finance vs. business loan" comparison hub         | Capture broad comparison-intent queries (trade finance companies, trading finance) | High         |
| Working capital / invoice financing guide                | Own adjacent SME finance intent not yet targeted in current content                | High         |
| Eligibility / repayment calculator                       | Interactive tool to lift on-page engagement and qualify leads pre-form             | High         |
| Location-modified landing pages (e.g. Sydney, Melbourne) | Target "business funding sydney"-style local commercial queries                    | Medium       |
| SME finance education blog series                        | Build topical authority and internal linking equity toward product pages           | Medium       |
| Broker/partner-facing page                               | Capture "trade finance brokers" intent and support partnerships channel            | Medium       |

# **Section 4: Strategic Recommendations & Action Plan**

## **4.1 Immediate Fixes (0-2 Weeks)**

| **#** | **Action**                                                                                                                 | **Owner**        | **Priority** |
| ----- | -------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------ |
| 1     | Audit and correct any live campaign destinations pointing to deprecated /products/\* URLs or filtered /our-products/ views | Paid Media / Web | **Critical** |
| 2     | Rewrite meta titles & descriptions for /products/save and /products/business-cards to lift CTR at existing strong rankings | SEO              | **Critical** |
| 3     | Collapse the 5 legacy 301 redirect chains (www/non-www, http/https, trailing slash) to single-hop resolution               | Dev              | **High**     |
| 4     | Add trust signals (lender logos, testimonials, timeframes) to top-traffic pages                                            | Design/Content   | **High**     |

## **4.2 Pre-Migration Preparation (2-6 Weeks)**

Given the faceted-navigation and consolidated-catalogue issues identified in Section 2, we recommend treating the product/landing-page rebuild as a structured migration rather than a series of one-off fixes.

| **#** | **Action**                                                                                                        | **Owner**       | **Priority** |
| ----- | ----------------------------------------------------------------------------------------------------------------- | --------------- | ------------ |
| 1     | Define one canonical, indexable URL per product/offer and document 1:1 mapping from every legacy /products/\* URL | SEO / Dev       | **Critical** |
| 2     | Draft URL redirect map (old → new) to preserve existing link equity and campaign tracking before launch           | SEO / Dev       | **Critical** |
| 3     | Build simplified, form-light landing page templates per the CRO plan in Section 2.3                               | Design / Dev    | **High**     |
| 4     | Prepare updated XML sitemap and internal linking plan reflecting the new product URLs                             | SEO             | **High**     |
| 5     | Set up before/after tracking (GSC property verification, GA4 events, rank tracking) to isolate migration impact   | SEO / Analytics | **Medium**   |

## **4.3 Post-Launch Strategy (6-12+ Weeks)**

| **#** | **Action**                                                                                                          | **Owner**     | **Priority** |
| ----- | ------------------------------------------------------------------------------------------------------------------- | ------------- | ------------ |
| 1     | Publish comparison hub, working capital/invoice financing guide, and eligibility calculator from the content matrix | Content / SEO | **High**     |
| 2     | Launch location-modified landing pages for highest-volume local queries (e.g. Sydney)                               | Content / SEO | **Medium**   |
| 3     | Build internal linking from new blog content into product landing pages to compound authority                       | SEO           | **Medium**   |
| 4     | Establish monthly non-brand CTR and conversion-rate reporting against this baseline to track ROI                    | SEO / PMO     | **High**     |
| 5     | Expand broker/partner-facing content to support the partnerships channel                                            | Content       | **Low**      |

**Bottom Line**

**Trade Funding does not have a demand problem - it has a structure problem.** Fixing landing-page/URL structure and closing the non-brand CTR gap are the two highest-leverage moves available, and both are addressable within the next quarter without waiting on a full site migration.