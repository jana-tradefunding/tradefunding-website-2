# copy-final.md — Phase 3.2 Page Copy Drafts

**Source inputs:** `docs/research-notes.md`, `docs/plan.md` §5.0, `docs/buildspec.md` §5–§6.
**Scope:** every page listed in `plan.md` §5.1, organized by channel.
**Status key:** ✅ ready to build from directly · 🟡 draft, not yet signed off · 🔴 blocked, do not build the flagged section from this draft.

Locked messaging direction applied throughout (do not treat as a final pass — it's baked into every hero/body/CTA below):
- Lead with *why* (personalised, qualified options), not *how* (the matching mechanism).
- "Compare Report" / scoring language is never the lead — it can appear once qualification/credibility has been established, and always with a one-line explanation of what it gets the reader.
- One-service, three-channel story reinforced wherever natural: Commercial (business gets funding options) / Connect (business's customers get funded at point of sale) / Personal & Property (the people who run the business get personal/property funding).

SEO guardrails applied to every page below (not repeated per-page unless there's something specific to add):
- Every page gets its own permanent, canonical, indexable URL — never a filtered/listing view.
- Meta title + description lead with a specific benefit + number (rate, speed, amount, timeframe).
- Above-the-fold trust signal called out per page.
- Lead-capture forms kept to minimum viable fields.
- Non-brand query targets noted where the audit flagged one.

---

## Commercial

### Home
- **URL:** `/`
- **Channel:** Commercial
- **Status:** 🔴 Hero blocked pending sign-off

**Hero / headline:**
> [DRAFT — PENDING SIGN-OFF]
> "Business finance shouldn't mean reading through hundreds of lenders you'll never qualify for. We match your business — and the people behind it — with funding that actually fits."
>
> *(Directional agreement only — plan.md §5.0. Do not publish without sign-off. Replaces the current live hero, "Every option. Scored for your business. Then we get it done.", which leads with the scoring mechanism the locked direction says to avoid.)*

**Key body copy / section summaries:**
- **Why-first intro (below hero):** One short paragraph translating the #1 pain point shared across Commercial and Personal & Property — reviewing 70+ lenders and hundreds of products alone risks wasted time and a damaged credit file. Frame this as the reason Trade Funding exists, not as a feature list.
- **Three-channel explainer strip:** Short, three-panel section spelling out the one-service story in plain terms — funding for your business, funding for your customers at the point of sale, funding for the people who run the business. Links out to Business Loans Hub, Connect, and Personal & Property hubs.
- **How it works (secondary, after the why):** Keep the existing step-by-step panel, but make sure it reads as the mechanism *behind* the promise above, not the opening pitch. Fix the Step 01 field-alignment issue flagged separately for Phase 5 (Team Comments, Isabella).
- **Lending Products grid:** Retain, standardise tile sizing per the flagged formatting note (Phase 5 task, not a copy change).
- **Trust section:** Lender panel + GoogleReviews component (see Shared section below for GoogleReviews copy — this is the one page it appears on).
- **Repetitive CTA fix:** Per the flagged feedback, don't repeat the same Compare Report CTA in every section — vary at least one instance (e.g. the bottom pill button) to route to Google Reviews or the three-channel explainer instead.

**CTA wording:**
- Primary: "Get your free Compare Report" (kept — but only introduced once the why-first framing has done its job, not as the first thing the visitor reads).
- Secondary: "See how it works" (routes to the mechanism section).

---

### Business Loans Hub
- **URL:** `/business-loans/`
- **Channel:** Commercial
- **Status:** ✅ ready to draft — low risk, no blocker

**Hero / headline:**
> "Every kind of business finance, in one place — built for your business, not a generic search."

**Key body copy / section summaries:**
- **Intro paragraph:** Why-first framing — instead of guessing which of dozens of loan products fits, see the options that are actually built for businesses like yours, in one hub.
- **Card grid:** One short card per product spoke (Trade Finance, Invoice Finance, Debtor Finance, Business Term Loans, Business Line of Credit, Overdraft, Chattel Mortgage, Finance Lease, Operating Lease, Equipment Finance, Merchant Cash Advance, Supply Chain Funding, Charge Card, R&D Funding, Export Finance, Second Mortgage, Self-Employed Home Loan). Each card: one-line benefit statement + link to its existing product page. *(Confirm this list matches the locked Products nav in plan.md §4 before finalising card copy — flagged as an outstanding low-risk confirmation step in research-notes.md.)*
- **Trust strip:** Lender panel logos + an indicative approval-timeframe line (per SEO audit's above-the-fold trust guardrail).

**CTA wording:**
- Primary: "Compare your options" (routes to Compare Report flow — acceptable here since the hub's whole job is comparison, but still followed by a one-line explanation of what the reader gets).
- Per-card: "See [Product] options" (not "Learn more" — keeps benefit-specific per the audit's CTR guardrail).

**SEO note:** This is the canonical category hub the audit calls out as missing (§3.3, "business funding" — 706 impressions, avg. position 8.0). Meta title/description should lead with a number (e.g. "Compare 15+ business funding options" style framing) once exact copy is finalised — must link out to indexable product pages only, never a filtered view.

---

### Broker Portal
- **URL:** `/broker-portal/`
- **Channel:** Commercial
- **Status:** 🔴 Blocked — referral process, commission structure, aggregator login not yet available

**Hero / headline:**
> "Refer with confidence. We do the matching — you keep the relationship."
>
> *(Directional only — no questionnaire coverage for brokers. Framing follows the locked "why before how" direction: leads with the partner's outcome, not the mechanics.)*

**Key body copy / section summaries:**
- **Why partner with TF (can draft now):** Brokers/aggregators get access to the same 70+-lender panel and matching process TF uses for direct clients, without having to maintain those relationships themselves. Reinforces the one-service story — this is the same engine behind Commercial, not a separate product.
- **[BLOCKED — NEEDS: referral-process steps]** — do not invent a step-by-step flow. Needs Matt/Ben input (research-notes.md, buildspec.md §5.1/§5.2).
- **[BLOCKED — NEEDS: commission structure / rates]** — do not state or imply a commission percentage, tier, or payment timing anywhere on this page until confirmed.
- **[BLOCKED — NEEDS: aggregator-login details for `app.tradefunding.com.au`]** — do not draft copy describing portal login/access flow until confirmed.
- **Trust section (can draft now):** Credibility line reflecting "real, live pipeline and settlements approaching" once Matt confirms which specifics are publishable (research-notes.md cross-pillar Q02) — until then, use a general credibility statement ("working with brokers across Australia") rather than a specific number.

**CTA wording:**
- Primary: "Partner with us" (holding wording — not final; commission/process detail may change what the CTA promises once unblocked).

**SEO note:** Directly matches the audit's flagged non-brand opportunity "trade finance brokers" (456 impressions, avg. position 14.2). Needs its own canonical indexable URL and a minimum-viable lead-capture form (name, business/brokerage, email, phone) — do not gate the form behind commission-detail copy that isn't ready yet.

---

## Connect

*(Cross-cutting note: all Connect copy below reflects the now-confirmed, narrower B2B audience — equipment sellers of any kind sold B2B, and/or professional-services firms — not the older, broader "trades / stock wholesalers" framing. No "Fundit" references anywhere.)*

### Connect Home — audience-narrowing copy pass
- **URL:** `/connect/`
- **Channel:** Connect
- **Status:** ✅ ready to draft — strategic direction resolved, this is a copy pass on an existing page, not a new URL

**Hero / headline:**
> "Win more business. Get paid faster."
>
> *(Kept close to existing proven positioning per the questionnaire's "keep as-is, don't rewrite" input — but tightened to make sure "business" reads as B2B, not general retail.)*

**Key body copy / section summaries:**
- **Why-first intro:** For B2B equipment sellers and professional-services firms — every quote can carry a QR code that shows the customer all their transparent finance options at the point of sale, not just one option (which might not be the best fit) or none (which can stall the sale). Reframe any remaining language that implies a retail/consumer/trades audience.
- **Proof points (keep, don't rewrite):** Non-intrusive QR code, increases sales conversions, reduces late payments, partnership framing ("we support you to win more business and get paid").
- **B2B specificity check:** Anywhere the existing page uses general "customers" or "businesses" language ambiguously, tighten to reflect the confirmed archetype (equipment sellers, professional-services firms) so it doesn't read as open to retail/trades.

**CTA wording:**
- Primary (sole, sitewide across Connect per buildspec.md §5): **"Become a Partner"**.
- Supporting actions (not competing CTAs): "Request a call" and "Register your business" become secondary links within the Become a Partner flow, not separate top-level CTAs.

**SEO note:** No specific non-brand keyword flagged for Connect in the audit's table — apply general structural guardrails (canonical URL under `/connect/`, above-the-fold trust signal, minimum-viable lead form).

---

### Connect — About
- **URL:** `/connect/about/`
- **Channel:** Connect
- **Status:** ✅ ready to draft (existing page/pattern — apply same audience-narrowing pass)

**Hero / headline:**
> "Built for the businesses that sell to businesses."

**Key body copy / section summaries:**
- Short brand-story paragraph: this is a rename, not a repositioning — the point-of-sale finance model is proven and unchanged; what's changed is the name.
- Confirm B2B-only audience framing throughout (equipment sellers of any kind sold B2B, and/or professional-services firms).

**CTA wording:** "Become a Partner"

---

### Connect — Terms & Privacy
- **URL:** `/connect/terms.html`, `/connect/privacy.html`
- **Channel:** Connect
- **Status:** ✅ no strategic copy change flagged — legal content, out of scope for this copywriting pass beyond removing any residual "Fundit" references (buildspec.md §5 rename instruction).

---

## Personal & Property

*(All pages below share the cross-cutting Personal & Property strategic input: savvy/repeat-borrower tone — not first-time-reassuring — targeting businesses turning over roughly $2M–$100M; lead credibility with customers-helped/transparency/testimonials, not approval-speed or rate-range; pre-empt the "can TF actually deliver the best outcome" objection; flag any claims/guarantee language for compliance review given the consumer-lending angle here specifically. Do not use the word "Individuals" anywhere in published copy — internal questionnaire naming only.)*

### Personal & Property Home
- **URL:** `/personal-and-property/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — questionnaire returned, no blocker

**Hero / headline:**
> "You've built the business. Let's get the right funding behind you and the people who run it."

**Key body copy / section summaries:**
- **Why-first intro:** Reuses the same core insight as the Commercial Home hero — reviewing 70+ lenders and hundreds of products alone risks wasted time and a damaged credit file — applied here to the individuals behind the business, not the business itself.
- **Credibility block (lead with this, not speed/rate):** Customers helped, transparency, testimonials. Explicitly avoid leading with approval-speed or rate-range framing per the questionnaire's Q06 answer.
- **Objection-handling line:** Directly addresses "can TF actually get me the best outcome" — e.g., TF works the lender relationships so you don't have to gamble on one application; this is the #1 objection to pre-empt per the questionnaire (Q04).
- **Loan-type card grid:** Links out to all 8 loan-type pages below as individually indexable pages — never a filtered view.
- **CTA framing (Q07):** "Why before how" — get a clear picture of your real options before committing to the wrong product, echoing the Compare Report mechanic without leading with the word "score."

**CTA wording:**
- Primary: "Get your options" (or equivalent "why before how" phrasing — avoid leading with "Compare Report"/"score" language; can be named once the benefit is established).

**Compliance flag:** Any language implying guaranteed approval or a guaranteed rate needs compliance review before publishing, given the consumer-lending regulation note in research-notes.md.

---

### Owner-Occupied Home Loans
- **URL:** `/personal-and-property/owner-occupied-home-loans/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — general guardrails only, no product-specific input

**Hero / headline:**
> "Finance your home the way a savvy borrower would — with every option on the table."

**Key body copy / section summaries:**
- Why-first framing: self-employed and business-owner applicants often get pushed toward costlier low-doc products because standard income verification doesn't fit their situation — TF works the lender relationships to find real options, not just the easiest-to-approve one.
- Credibility block: customers helped / transparency / testimonials (not speed or rate-range).

**CTA wording:** "See your home loan options"

---

### Investment Property Loans
- **URL:** `/personal-and-property/investment-property-loans/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — general guardrails only

**Hero / headline:**
> "Grow your portfolio with financing that's actually built for investors."

**Key body copy / section summaries:**
- Why-first framing: investment lending has its own qualification quirks (serviceability, existing debt structures) — reviewing every lender's fine print yourself is exactly the transparency/qualification pain point this channel exists to solve.
- Credibility block: customers helped / transparency / testimonials.

**CTA wording:** "See your investment loan options"

---

### Refinancing
- **URL:** `/personal-and-property/refinancing/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — general guardrails only

**Hero / headline:**
> "A better deal shouldn't mean starting from scratch."

**Key body copy / section summaries:**
- Why-first framing: refinancing is one of the clearest cases of "you don't know what you're missing until someone shows you every option" — directly ties to the #1 pain point (transparency/qualification).
- Credibility block: customers helped / transparency / testimonials.

**CTA wording:** "See your refinancing options"

---

### Construction Loans
- **URL:** `/personal-and-property/construction-loans/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — general guardrails only

**Hero / headline:**
> "Funding that keeps pace with your build."

**Key body copy / section summaries:**
- Why-first framing: construction finance is complex and lender-specific (staged drawdowns, valuations) — TF's qualification/matching approach removes the guesswork of which lender actually fits a build like this.
- Credibility block: customers helped / transparency / testimonials.

**CTA wording:** "See your construction loan options"

---

### Commercial Property Finance
- **URL:** `/personal-and-property/commercial-property-finance/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft, with a flagged cross-channel note

**Hero / headline:**
> "Commercial property finance, matched to how your business actually earns."

**Key body copy / section summaries:**
- Why-first framing: same self-employed/business-owner qualification difficulty as the cross-cutting differentiator (Q01) — applied to commercial property specifically.
- Credibility block: customers helped / transparency / testimonials.

**⚠️ Flagged, unresolved cross-channel overlap (carry forward, do not resolve silently):** This page needs a cross-check against `/second-mortgage/` and `/self-employed-home-loan/` in the Commercial channel (buildspec.md §6) once both channels have final copy, to avoid duplicated or conflicting positioning between the two channels for the same underlying need.

**CTA wording:** "See your commercial property options"

---

### SMSF Loans
- **URL:** `/personal-and-property/smsf-loans/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — general guardrails only

**Hero / headline:**
> "SMSF property lending, without the guesswork."

**Key body copy / section summaries:**
- Why-first framing: SMSF lending has a narrower pool of eligible lenders and stricter compliance requirements than standard property finance — reinforces the transparency/qualification value proposition specifically for trustees.
- Credibility block: customers helped / transparency / testimonials.

**CTA wording:** "See your SMSF loan options"

**Compliance flag:** SMSF lending carries its own regulatory considerations distinct from standard consumer lending — flag for compliance review alongside the general consumer-lending note.

---

### Personal Loans — Secured & Unsecured
- **URL:** `/personal-and-property/personal-loans/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — general guardrails only

**Hero / headline:**
> "Personal lending, matched to your actual situation — not a generic checklist."

**Key body copy / section summaries:**
- Why-first framing: whether secured or unsecured is the right fit depends on circumstances most people can't easily assess themselves — same transparency/qualification insight applied at the personal-loan level.
- Credibility block: customers helped / transparency / testimonials.

**CTA wording:** "See your personal loan options"

---

### Debt Consolidation
- **URL:** `/personal-and-property/debt-consolidation/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — general guardrails only

**Hero / headline:**
> "One clear repayment, matched to lenders who'll actually approve it."

**Key body copy / section summaries:**
- Why-first framing, but positioned as *one* reason people come to TF, not the leading one — per research-notes.md, the questionnaire's #1 reason cited was business cash-flow pressure, not debt consolidation specifically. Avoid over-indexing this page's narrative on debt consolidation as if it were the primary driver of the whole channel.
- Credibility block: customers helped / transparency / testimonials.

**CTA wording:** "See your consolidation options"

---

### About Personal & Property
- **URL:** `/personal-and-property/about/`
- **Channel:** Personal & Property
- **Status:** ✅ ready to draft — net-new, thin brand-story page, same pattern as `/connect/about/`

**Hero / headline:**
> "The people behind your business deserve the same clarity your business gets."

**Key body copy / section summaries:**
- Short brand-story paragraph tying this pillar back to the one-service story: this is the same lending-intelligence approach used for the business itself, applied to the people who run it.
- Credibility block: customers helped / transparency / testimonials (consistent with the rest of the channel).

**CTA wording:** "See your options"

**SEO note:** Lower priority for keyword targeting than the product pages (brand-story pages aren't typically the primary non-brand acquisition surface) — still needs its own canonical indexable URL.

---

## Shared

### Contact Us
- **URL:** `/contact/`
- **Channel:** Shared (all channels)
- **Status:** ✅ ready to draft — operational email-routing question doesn't block copy

**Hero / headline:**
> "Talk to the right team, first time."

**Key body copy / section summaries:**
- Short intro: one line explaining the department selector exists so enquiries reach the right team without back-and-forth.
- **Department selector (four options):** General / Broker / Connect Vendor Enquiry / Personal & Property.
- **Contact details:** Phone 1300 161 641. Email hello@tradefunding.com.au.
- Minimum-viable form fields per the SEO audit's CRO guardrail: name, email, phone, department selector, message. No extra fields.

**CTA wording:** "Send message"

**🔴 Note before publishing (not a copy blocker, but flagged):** confirm `hello@tradefunding` routes to `support@` and who has inbox access before this address goes live (plan.md §1, operational — needs Ben). Copy can be drafted and built now; just don't treat the email address as final until confirmed.

---

### Credit Guide
- **URL:** `/credit-guide/`
- **Channel:** Shared
- **Status:** 🔴 Address section blocked — everything else can proceed

**Hero / headline:**
> "Credit Guide"
> *(kept as a plain, functional heading — legal/compliance page, not a marketing page)*

**Key body copy / section summaries:**
- Intro paragraph (can draft now): purpose of the guide, unchanged from existing structure — who TF is, services provided, how TF is paid, complaints handling.
- Licensee details block: ACL 387856, phone 1300 161 641 — not blocked.
- **[BLOCKED — NEEDS: confirmed company address]** — the currently-live page shows "Level 18, 233 Castlereagh Street, Sydney NSW 2010"; do not carry this forward as confirmed without sign-off from Matt (research-notes.md, plan.md §5.0/§1). Leave this field as a clearly marked placeholder until confirmed.
- Services/commission section: can proceed largely as-is (existing structure already discloses that TF may receive commissions/referral/trail fees from Product Providers, and discloses success-fee terms).
- Complaints/AFCA section: not blocked — AFCA's own address (GPO Box 3, Melbourne VIC 3001) is a third-party detail, not TF's own address, and doesn't require the same sign-off.

**CTA wording:** "Get your free Compare Report" (kept — same secondary CTA pattern as other legal pages).

---

### Privacy Policy
- **URL:** `/privacy/`
- **Channel:** Shared
- **Status:** 🔴 Address section blocked — same blocker as Credit Guide

**Hero / headline:**
> "Privacy Policy"

**Key body copy / section summaries:**
- Structure and body content (collection, use, disclosure, cookies, overseas storage) — not blocked, can proceed as-is from the existing page.
- **[BLOCKED — NEEDS: confirmed company address]** — same address blocker as Credit Guide (research-notes.md, plan.md §1). Do not draft or publish an address in this policy until confirmed.
- Related, separately flagged item (not this page, but same root cause): the "Post" address reference in T&C §13 ("Trade Funding Pty Ltd, Sydney, NSW, Australia") should also be treated as unconfirmed/outdated until the same address confirmation lands — carry this flag forward to Phase 5, don't fix silently.

**CTA wording:** none — informational page only.

---

### GoogleReviews trust component
- **Location:** Homepage trust section only (Commercial channel placement)
- **Channel:** Commercial (Shared component, single placement)
- **Status:** 🔴 Blocked — real review count/rating and widget provider not yet available

**Key body copy / section summaries:**
- **[BLOCKED — NEEDS: actual current Google review count/rating and confirmed real widget provider/script/API key]** — the currently-live schema and UI show a static "5.0 / 31 reviews" figure already flagged by the team as inaccurate and non-updating (Team Comments — Isabella). Do not carry this number forward as final.
- **Honest fallback copy (use until the real count is available):** a short line inviting the visitor to see genuine reviews on Google directly, linking out to the real Google Business listing, rather than displaying any specific number. Example direction: "See what real customers say about us on Google" with a link-out, no numeric claim.
- Component should not compete with the Compare Report CTA for primary visual weight — it's a trust signal, not a conversion path in its own right.

**CTA wording:** "Read our reviews on Google" (link-out only — no in-page numeric count until confirmed).

---

## Summary of open blockers carried into this draft

1. 🔴 **Home hero** — directional copy above is draft-only; needs Matt's sign-off before publishing.
2. 🔴 **Credit Guide & Privacy Policy address sections** — placeholders only; needs Matt.
3. 🔴 **GoogleReviews count/rating + widget provider** — fallback link-out copy only; needs Matt/Ben.
4. 🔴 **Broker Portal referral process, commission structure, aggregator-login details** — placeholders only; needs Matt/Ben.
5. ⚠️ **Personal & Property Commercial Property Finance vs. Commercial's `/second-mortgage/` and `/self-employed-home-loan/`** — flagged cross-channel overlap, not resolved here; carry forward to final copy review.
6. Operational (doesn't block copy, but flag before publish): `hello@tradefunding` → `support@` routing/inbox access on Contact Us — needs Ben.
