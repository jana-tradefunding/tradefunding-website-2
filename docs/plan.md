# Trade Funding — Site Rebuild Plan (HTML → Payload CMS → Vercel)

**Status: v8 — inserts a new Phase 8 (Final Pre-Deployment Fix Pass) addressing six new review reports (architecture, dependency-risk, performance/SEO, security, state/resilience/observability, UI/UX/a11y) run against the Phase 7 build. The old "Phase 8 — Payload CMS conversion" is renumbered to Phase 9. This is the last fix pass before deployment — Phase 9 should not start until Phase 8's closing report confirms everything here is resolved.**

## Current build status (check before running anything)

| Phase | Status |
|---|---|
| 0 — Hit list | Optional, not produced as a standalone file — content already folded into §2 below |
| 1 — Branding tokens | ✅ Done (`tokens.md`) |
| 2 — Site architecture / nav | Nav is built into the live pages; the standalone `nav-spec.md` doc was never produced (optional) |
| 3 — Copy (research → copy-final.md → applied) | ✅ Done |
| 4 — Design component inventory | Optional, not produced (`design/components.md`) |
| 5 — HTML/page production | ✅ Done |
| 5.5 — Pre-conversion cleanup | ✅ Done (`docs/cleanup-report.md`) |
| 6 — Build quality & architecture fix pass | ✅ Done |
| 7 — Pre-Migration Remediation | ⚠️ **Done through 7.12, but 7.13 never ran** — confirmed via git log (last commit is 7 §10.4 items 5-6) and via the dependency-risk report (`connect/package.json` still has no `devDependencies`, no `test`/`lint` scripts, no lockfile; `docs/remediation-report.md` doesn't exist). Folded into the new Phase 8 below (§11.9) rather than reopening Phase 7. |
| **8 — Final Pre-Deployment Fix Pass (NEW)** | 🔴 **Not started. Do this next.** See §11 below. |
| 9 — Payload/Vercel conversion (formerly "Phase 8") | Not started — waits on Phase 8 |

**Source materials this plan is built from:** original meeting notes (2026-08-17), `Master Information Architecture & Sitemap.md` (canonical IA/architecture doc), `tokens.md` (finalized Phase 1 output), the team's numbered hit list with comments, `Team Comments.md`, `SEO Roadmap.md`, `SEO_Audit_Report.md`, `connect/docs/design-spec.md` + `implementation-plan.md`, `docs/research-notes.md` and `docs/copy-final.md` (Phase 3 outputs), and the `commercial/`, `connect/`, `personal-and-property/`, and `design baseline/` folders in the project zip.

**What's new in v3:** Phase 5 is expanded to cover the things that make a 30+ page raw-HTML build actually feel smooth rather than like a stack of disconnected documents — pixel-identical headers across every page, root-relative (not relative) paths for every link/asset, correctly spaced em-dash replacements, and explicit coverage of the Guides Hub + guide articles + calculator tools (previously under-specified). The `ChannelSwitcher`'s behavior is also revised: it now **always shows all three channels** (Home icon+text for Commercial, plus Connect, plus Personal & Property) with a clear active-state indicator, overriding the original "hide the current channel" logic from Phase 2. A new **Phase 5.5 — Pre-Conversion Cleanup** sits between Phase 5 and Phase 6, covering the duplicate `personal and property/` (with spaces) folder, secure deletion of retired files, and a general file-organization pass before anything gets migrated into Payload.

---

## 0. The three channels — updated architecture

| Channel | Role | URL | Status |
|---|---|---|---|
| **Commercial** | The hero. Core Trade Funding brand + BLC product taxonomy. | `/` (root) | Fully built as static HTML in `commercial/`; being migrated in place. |
| **Connect** | Secondary. B2B point-of-sale finance for equipment sellers / professional-services firms. Formerly "Fundit" — that name is retired everywhere. | `/connect/*` | Existing static site in `connect/`, migrating to a sub-path route group in the same app. Needs the full color-flip + CTA + rename work described in Phase 4/5 below. |
| **Personal & Property** | New. All 8 loan types under what was internally called "Mortgage." Standalone, independently indexable acquisition channel. | `/personal-and-property/*` | 🔴 Does not exist as a real site yet. `design baseline/personal-and-property.html` is a **styling reference only** — actual page copy/structure comes from the Master IA doc §7 skeleton + the Executive Questionnaire, once supplied, not invented here. |

**Locked (no longer placeholder):** Commercial, Connect, and Personal & Property are **three Next.js route groups in one app on one Vercel project**, sharing one Payload backend — e.g. `app/(commercial)/`, `app/connect/`, `app/personal-and-property/`. This is a same-origin, sub-path structure, not subdomains. See `buildspec.md` §2 for the technical detail. This replaces this plan's earlier three-Vercel-projects placeholder.

**Naming convention — use consistently:** the channel is always written **"Personal & Property"** (with an ampersand) in any user-facing copy, nav label, page title, or doc prose. The URL slug and folder name are the hyphenated, spelled-out **`personal-and-property`** (not `personal-property`, not `property-personal`). Don't let these two conventions bleed into each other.

---

## 1. How blockers are now sequenced (changed from v1)

Per direction from the team: **blockers involving Matt/Ben (company address, updated lender logo files, final hero copy sign-off, the `hello@tradefunding` routing question) are not to be chased before Phase 3.** Phase 0's hit list still records them — so nothing is lost — but Phase 0–2 work should proceed without waiting on them. They become active work items again at the **start of Phase 3**, when real page copy is actually being written and the placeholders would otherwise get baked into published content.

| Blocker | Deferred to | Notes |
|---|---|---|
| Company address (Credit Guide, Privacy Policy, T&C §13 "Post" reference) | Phase 3 kickoff | Matt to provide. Do not guess in the meantime — leave the field visibly blank/TBD in any draft. |
| Updated/official lender logo files | Phase 3 kickoff (content stage) — doesn't block the Payload `lenderLogos` collection scaffold itself | Matt to supply new images. |
| Final Home hero copy sign-off | Phase 3, start of copy-writing sub-phase | Directional agreement exists (lead with the *why*); exact wording still pending. |
| `hello@tradefunding` → `support@` routing + inbox access | Phase 3 kickoff (operational, not a build blocker) | Operational question for Ben — doesn't block any code, only content/process. |

---

## 2. Hit list — status of numbered items from the team's comments

The team's hit list uses item numbers from their own internal task list (not reproduced here in full, since I wasn't given that master numbered list directly — cross-reference `Team Comments.md` / the shared task tracker if the number alone isn't enough context). Statuses as given:

- **Meta/source-material issues** — ignore and remove completely; not carried into this plan.
- **Master IA doc** — resolved; the updated `Master Information Architecture & Sitemap.md` is now canonical (see §0 above and `buildspec.md`).
- **Channel structure/URLs/domains** — resolved via the updated IA doc (sub-path routing, one app, one deployment).
- **Items 25–29** — ignore and remove completely; out of scope.
- **Items 31–32** — copy-style change; folded into Phase 3 below as explicit copy-writing guardrails (tone/terminology/formatting constraints), not just a single hero-copy prompt.
- **Item 33** — keep and fix (flagged for Claude Code to locate and address in Phase 5 against the original source item; not enough context here to specify further).
- **Item 38** — Claude Code to fix directly during Phase 5 (same caveat as above).
- **Item 40** — working as-is ("cat[egory] works") — keep, no action.
- **Item 41** — fully addressed by item 42 (the token decisions below) — no separate action needed.
- **Item 42** — the `tokens.md` color/token decisions (Phase 1, now locked — see §3 below).
- **Item 43** — Claude Code should decide the appropriate channel for `self-employed-home-loan.html`. This matches the flag already in `Master Information Architecture & Sitemap.md` §3.6: with Personal & Property standing up as its own channel, this page's relationship to `/personal-and-property/` (cross-link vs. eventual migration) needs a call. Make the call during Phase 5, document the reasoning, don't silently decide without a visible note.
- **Item 45** — go-ahead given for the copy direction; proceed with Phase 3 copy work using the locked messaging framing (see Phase 3).
- **Item 46** — `hello@tradefunding` routing/inbox-access question — operational, for Ben; deferred per §1 above, doesn't block build.
- **Items 47–49** (address, T&C §13 "Post" reference, lender logos) — all deferred per §1 above.
- **Resources page images** (Comparisons/Roundups section flagged as bland/AI-generated) — flagged for replacement with clearer visuals; Phase 5 content task.
- **SEO guardrails from `SEO_Audit_Report.md`** — must inform all copy written in Phase 3; see Phase 3 below and the updated `prompts.md`.

---

## 3. Phase 1 — Branding (now LOCKED via tokens.md, not placeholder)

`tokens.md` is the finalized Phase 1 deliverable. Summary of the locked decisions (full detail lives in that file, keep it in the repo root):

| Channel | Primary | Accent |
|---|---|---|
| Commercial | Navy / Navy-blue (`#001C44` / `#1C1998`) — **unchanged** | Skyblue (`#54B4F6`) |
| Connect | **Gold** (`#FBB766`) — dominant, was previously navy-dominant | Navy (`#001C44`) |
| Personal & Property | **Peach** (`#FF5D5C`) — dominant | Navy (`#001C44`) |

This **supersedes** this plan's original placeholder ("muted teal/green" for Personal & Property) — peach was available precisely because it moved off Connect, and since Personal & Property is a new build there's no legacy-page churn from the choice. Note: `Master Information Architecture & Sitemap.md` §7 still shows the old teal/green placeholder text in one spot — treat `tokens.md` as the newer, authoritative source on this specific point, and update that stray reference in the IA doc when convenient (not urgent).

Connect's shift is bigger than a simple accent swap — it **inverts** the existing "dark section = navy, accent = gold/peach" rhythm to "dominant = gold, accent = navy." This has concrete, already-scoped fix-list implications for Phase 4/5 (see below) — it isn't just a token file change, it's a real re-skin of the existing `connect/index.html`.

---

## 4. Phase 2 — Site Architecture (updated)

**Locked structural decisions**, now reflected in `Master Information Architecture & Sitemap.md` §2A/§2B/§11:

- **`ChannelSwitcher` component** replaces the old idea of three equal-weighted nav buttons. **It lives in the exact same single header row as the logo and primary nav — never a separate tier, strip, or bar above/below it.** One row: logo (left) → Products / Why Us / Resources / Partners (center) → `ChannelSwitcher` (right). 🔴 **Correction:** an earlier version of this plan said the switcher should sit "above or beside" the main nav — that phrasing was ambiguous and led to a literal two-tier header being built (a top utility strip with just the switcher, a second strip below with the logo/nav). That's now explicitly wrong. There is exactly one horizontal header strip, always.
  - 🔁 **Updated behavior (overrides the original "hide the current channel" logic below):** for the static-HTML build in Phase 5, the switcher **always shows all three channels on every page, regardless of which one you're currently on** — Commercial, Connect, and Personal & Property are all visible, all the time. This is a deliberate override of the original plan (which only showed the two *other* channels) because navigating between 30+ raw HTML files needs a switcher that doesn't visually shift its own content between pages — always-three keeps the control itself stable while only its *active state* changes.
  - **Commercial is always rendered as the Home icon + "Home" text — never the word "Commercial."** Connect renders as "Connect." Personal & Property renders as "Personal & Property." All three appear together, every time.
  - **Active state (new, required):** since all three are always visible, the current channel must be visually distinguished — a clear `.active` CSS state (underline, bold text, or a brand-color background/border tinted to the *current* channel's accent from `tokens.md`) applied to whichever of the three matches the page you're on. Without this, a visitor has no way to tell which channel they're currently viewing.
  - Icon-plus-label on desktop, icon-only on mobile for all three entries, not just Home.
  - 🟡 **Contrast fix, generalized:** the original bug ("other two toggle options aren't visible on the home page") is fixed by the always-show-three + active-state approach above, but re-verify contrast for the *inactive* two entries against each channel's own accent background (Commercial's light background, Connect's gold, Personal & Property's peach) — not just the home page in isolation.
- **Home icon:** icon + "Home" text label on desktop, icon-only on mobile — locked, no longer a placeholder. Commercial *is* the home page; the two terms are used interchangeably in prompts/specs, but "Commercial" itself never appears as a nav label — it's always the Home icon + "Home" text, including inside the always-visible `ChannelSwitcher`.
- **Contact:** removed from top nav entirely, lives in the footer only. A floating contact button is evaluated separately, not bundled into this decision.
- **Products:** stays in the primary nav as a grouped hover-expand list (Term Loans, Credit Lines, Invoice, Trade, Equipment, Personal & Property, Other) — no emoji/icon grid. A dedicated `/business-loans/` full-menu page exists for users directed there. No product page is ever deleted for nav decluttering.
- **Why Us:** purpose-driven navigation, reintroduced alongside Products as a second path into the same underlying pages.
- **Partners:** covers Broker Portal and, contextually, Connect's "Become a Partner" acquisition path.
- 🔁 **Nav label wording — locked in Phase 6, then changed again in Phase 7 (see §10.2):** the Phase 6 site review (`TF_Site_v_07.docx`) locked in "Products" → "What Funding Do I Need?", "Why Us" → "Why Trade Funding?", "Partners" → "Offer Funding Solutions". This has since been superseded — see §10.2 for the current, final wording ("Funding Solutions | Compare Options | Partners | Why Choose Us?").

---

## 5. Phase 3 — Copy Per Page (restructured: 3.0 guardrails → 3.1 research → 3.2 copy creation)

### 5.0 Guardrails checklist (do these first, before any page-level drafting)

1. Chase the deferred blockers from §1: company address, lender logo files, `hello@` routing question. Get real answers, don't guess.
2. Re-read `SEO_Audit_Report.md` in full and extract every applicable comment as an explicit constraint — folded into the Phase 3.2 prompt as a checklist, not left as background reading.
3. Apply the copy-style constraints flagged in the hit list (items 31–32) — tone, formatting, terminology rules the team called out — as guardrails alongside the locked messaging direction below.

**Locked messaging direction (unchanged from v1, go-ahead per hit-list item 45):**
- Lead with *why* (personalized, qualified options), not *how* (the matching mechanism).
- Avoid "compare report"/"score" language without explanation.
- Reinforce that all three channels stem from one underlying service/technology: the business gets funding options (Commercial), the business's customers get funded at the point of sale (Connect), and the people who run the business get personal/property funding (Personal & Property).

🟡 **Placeholder Home hero draft** (still a draft — mark as such in the CMS, don't publish without sign-off):
> "Business finance shouldn't mean reading through hundreds of lenders you'll never qualify for. We match your business — and the people behind it — with funding that actually fits."

### 5.1 Pages needing copy or content work — categorized by channel

| Page | URL | Channel | What's needed |
|---|---|---|---|
| Home | `/` | **Commercial** | 🔴 Final hero copy blocked pending sign-off (lead with *why*, avoid "compare"/"score" jargon). Placeholder above stands until then. |
| Business Loans Hub | `/business-loans/` | **Commercial** | Newly identified gap — short intro + card-grid copy linking to every product spoke. Low risk: mostly derivable from existing product pages + locked messaging, no external blocker. |
| Broker Portal | `/broker-portal/` | **Commercial** | Net-new partner-acquisition page — needs real referral-process and commission-structure detail (see Research, below — not covered by the Executive Questionnaire, still needs Matt/Ben input). |
| Contact Us | `/contact/` | **Shared asset** | Identified gap — missing from both source assets. Needs new copy: intro, department selector (General / Broker / Connect Vendor Enquiry / Personal & Property), phone (1300 161 641), email (hello@tradefunding.com.au). |
| Credit Guide | `/credit-guide/` | **Shared asset** | 🔴 Blocked pending company address confirmation — do not draft the address section, everything else can proceed. |
| Privacy Policy | `/privacy/` | **Shared asset** | 🔴 Same address blocker as Credit Guide. |
| GoogleReviews trust component | homepage trust section | **Commercial** (homepage-only placement) | 🔴 Blocked pending actual current review count/rating and real widget provider — fallback copy can't be finalized without it. |
| Connect — audience-narrowing copy pass | `/connect/*` | **Connect** | Not in your original list, added here because it was flagged as an open conflict in `buildspec.md` §5 — **now substantially resolved**, see Research 3.1 below. Needs a copy pass to make sure existing Connect pages reflect the confirmed B2B-only audience, not the older, broader design-spec framing. |
| Personal & Property Home | `/personal-and-property/` | **Personal & Property** | Net-new. Research input now available (see 3.1) — was previously blocked on the Executive Questionnaire, which has since been returned. |
| Owner-Occupied Home Loans | `/personal-and-property/owner-occupied-home-loans/` | **Personal & Property** | Net-new. |
| Investment Property Loans | `/personal-and-property/investment-property-loans/` | **Personal & Property** | Net-new. |
| Refinancing | `/personal-and-property/refinancing/` | **Personal & Property** | Net-new. |
| Construction Loans | `/personal-and-property/construction-loans/` | **Personal & Property** | Net-new. |
| Commercial Property Finance | `/personal-and-property/commercial-property-finance/` | **Personal & Property** | Net-new. Flag the overlap with `/second-mortgage/` and `/self-employed-home-loan/` (Commercial) noted in `buildspec.md` §6 — don't resolve silently. |
| SMSF Loans | `/personal-and-property/smsf-loans/` | **Personal & Property** | Net-new. |
| Personal Loans (Secured & Unsecured) | `/personal-and-property/personal-loans/` | **Personal & Property** | Net-new. |
| Debt Consolidation | `/personal-and-property/debt-consolidation/` | **Personal & Property** | Net-new. |
| About Personal & Property | `/personal-and-property/about/` | **Personal & Property** | Net-new, thin brand-story page per the pattern already used for `/connect/about/`. |

### 5.2 Phase 3.1 — Research

**Good news: the Personal & Property research gap is largely closed.** `docs/Executive Questionnaire for Personal and Property and Connect.docx` has been returned with real, specific answers from Matt (it uses "Individuals" as the internal working name for what this project calls "Personal & Property" — same pillar, confirm this synonymy doesn't leak into published copy). Key strategic inputs now available:

**Personal & Property (questionnaire calls it "Individuals"):**
- Core differentiator: TF specializes in self-employed applicants — commercial-channel overlap, since self-employed income is hard to verify and TF works with lenders to get real deals, not just costlier low-doc products.
- #1 reason people come to TF: business cash-flow pressure.
- Top pain point (ranked #1): **transparency & qualification** — same "impossible to review 70+ lenders/hundreds of products yourself" framing already locked for Commercial's Home hero. This pillar can reuse that core insight, not invent a new one.
- #1 objection to pre-empt: doubt that TF can actually deliver the best outcome — copy needs to reassure credibility here specifically.
- Tone: **savvy/repeat borrower, not first-time-reassuring** — target businesses turning over $2M–$100M, sophisticated audience.
- Credibility signals to lead with: customers helped, transparency, testimonials (not approval-speed or rate-range framing).
- Primary CTA: get a report / understand real options before committing to the wrong product — echoes the Compare Report mechanic, so this pillar likely needs the same "why before how" framing as Commercial's Home, not a from-scratch CTA concept.
- Compliance note: **strong compliance/regulation constraints apply specifically to the consumer-lending angle of this channel** — flag any claims/guarantees language for compliance review before publishing, more so than for Commercial.

**Connect (questionnaire's "Pillar 03"):**
- Keep as-is (proven, don't rewrite): lending market at point-of-sale; QR code as non-intrusive customer choice; increases sales conversions; reduces late payments; partnership framing ("we support vendors to win more business and get paid").
- Nothing flagged as outdated — the existing Fundit-era positioning is considered sound, this is a rename, not a repositioning.
- Why partner with TF over a competitor: all transparent options at point-of-sale — not one option that may not be best, not none.
- Biggest vendor friction point: winning quotes and getting paid — customer commitment to proceed and getting paid on completed work (not onboarding time or commission clarity).
- **Confirms, again:** no Fundit mention anywhere going forward.
- **Resolves the audience conflict flagged in `buildspec.md` §5:** ideal partner archetype is explicitly **B2B providers — equipment of any kind sold B2B, and/or professional services.** This confirms the newer, narrower meeting-note framing over the older `connect/docs/design-spec.md` §2 broader framing ("trades... stock/supplies wholesalers"). Treat this as resolved, not an open flag, going forward — update `buildspec.md` §5 accordingly.
- Primary CTA: **Become a Partner** — promote the QR code and/or refer customers to TF. Matches the already-locked CTA decision.

**Cross-pillar:** six-months-post-launch "win" = vendor sign-ups/QR scans/business written (Connect) and strong referral numbers/loans written (Personal & Property) — both pillars already have live customers in the pipeline and settlements approaching, so copy can speak to real traction, not purely aspirational positioning, once confirmed with Matt which specifics are publishable.

**Still genuinely open — not answered by the questionnaire, needs direct follow-up:**
- Broker Portal: referral process steps, commission structure/rates, aggregator-login details (`app.tradefunding.com.au`) — nothing in the questionnaire covers broker/aggregator specifics, only individual borrowers and Connect vendors.
- Business Loans Hub: low risk, but confirm the exact category groupings match the locked Products nav (§4) before drafting card copy.
- Home hero: still pending final sign-off despite the directional agreement — the questionnaire didn't cover Commercial's Home page.
- The three hard blockers from §5.0 (address, lender logos, GoogleReviews count) remain genuinely unanswered.

**Research prompt** (run this in Claude web chat first, to turn the above into a structured, page-ready reference doc):

```
Read docs/Executive Questionnaire for Personal and Property and Connect.docx,
plan.md §5, buildspec.md §5 and §6, and docs/SEO_Audit_Report.md.

Produce research-notes.md structured by channel (Commercial / Connect /
Personal & Property / Shared), with one section per page from plan.md §5.1.
For each page, include: the strategic input available (quote or closely
paraphrase the questionnaire where it applies — attribute it), the relevant
SEO guardrails from SEO_Audit_Report.md, and an explicit "STILL NEEDED"
line for anything not yet answered (Broker Portal specifics, Home hero
sign-off, the three hard blockers). Do not draft any actual page copy in
this step — this is a research/reference document only, to be handed to
the copy-writing step next.
```

### 5.3 Phase 3.2 — Copy creation

**Do this in Claude web chat** (judgment/tone work, not Claude Code) once `research-notes.md` exists.

```
Read research-notes.md, plan.md §5.0 (locked messaging direction + copy-style
guardrails), and buildspec.md §5–§6.

Draft page-level copy for every page listed in plan.md §5.1, organized by
channel (Commercial / Connect / Personal & Property / Shared), in a single
copy-final.md file. For each page include: page name, URL, channel, hero/
headline copy, key body copy or section summaries (not full page HTML),
and CTA wording. Where a page has a 🔴 blocker (Home hero sign-off, Credit
Guide/Privacy address, GoogleReviews count, Broker Portal commission
detail), write a clearly labeled [DRAFT — PENDING SIGN-OFF] or
[BLOCKED — NEEDS: ...] placeholder instead of guessing, matching the
existing placeholder pattern already used for the Home hero.

Apply the SEO guardrails and copy-style constraints from research-notes.md
throughout — don't treat them as a final pass, bake them into each page's
draft as it's written.

Output copy-final.md at the project root, ready to be added back into the
project zip before Phase 4/5 building begins.
```

Once `copy-final.md` is approved, hand it to Claude Code via the updated Prompt 3b in `prompts.md` to actually place the copy into the HTML files.

---

## 6. Phase 4 — Design Baseline (updated — `design baseline/` is reference-only)

**Important scoping change:** the `design baseline/` folder in the zip (`index.html`, `connect.html`, `personal-and-property.html`, `shared-styles.css`, two logo files) is **not part of the build**. It exists purely as a visual reference for the three channels' colors and updated button styles. Nothing in that folder gets deployed, imported, or copied wholesale. Its decisions get **applied to the real files**: `commercial/`, `connect/`, and the new Personal & Property build.

**Concrete Phase 4 tasks, by channel (all confirmed, not placeholder):**

- **Commercial (`commercial/index.html`)** — stays as-is (navy/skyblue, unchanged) **except** the `ChannelSwitcher` contrast fix described in Phase 2 above (navy border/text on the home page so the other two toggle options are visible).
- **Connect (`connect/index.html`) — full revision required**, matching the pattern already validated in `design baseline/connect.html`:
  - Replace fake off-token colors (`#EAB308`, `#FACC15`) with the real `--gold` / `--gold-soft` tokens from `tokens.md`.
  - Flip hero, commission strip, and legacy CTA from navy-dominant/gold-accent to **gold-dominant/navy-accent** (backgrounds, text, buttons, card panel, badges all swap roles).
  - Fix low-contrast gold-as-text spots (step numbers, FAQ plus-icon, inline eyebrow labels) to navy — check against the ≥4.5:1 contrast ratio referenced in `connect/docs/design-spec.md` §12, since flipping dominant/accent roles can break contrast that worked in the old navy-dominant layout.
  - Add a dark-on-light navbar override (logo, nav links, hamburger, and the `ChannelSwitcher`) so they stay visible now that the hero is light gold instead of dark navy.
  - Fix logo paths to `logo-navy.png` / `logo-white.png`.
  - No peach should remain anywhere in the Connect build — peach is now Personal & Property's color exclusively.
- **Personal & Property — new build, using `design baseline/personal-and-property.html` as a color/button reference only** (not a copy or structure reference — actual page content comes from the IA §7 skeleton + Executive Questionnaire, per §6 below):
  - Replace fake orange (`#F97316` family) with the real `--peach` / `--peach-soft` tokens.
  - Hero: peach-dominant background/text/buttons/trust icons, navy accent.
  - Hero card panel: white surface with navy ink (not a colored panel).
  - Product-card icons: navy, for legibility against peach.

---

## 7. Phase 5 — HTML/Page Production (expanded — smoother multi-page navigation, guides/tools, path hygiene)

**Why this phase got bigger:** with 30+ raw HTML files (not yet a Next.js app), anything that differs between pages — header markup, path style, dash characters — creates a visible "jump" or a broken link the moment someone clicks between pages. The items below are all in service of making that raw-HTML phase feel like one smooth site, not a stack of independent documents.

### 7.1 Header must be pixel-perfect and identical across every page

The HTML structure, padding, and CSS classes for the header (and footer) must be **100% identical, byte-for-byte in structure**, across all 30+ pages — Commercial, Connect, and Personal & Property alike. A single missing wrapper `div`, a reordered class, or an extra space on one page causes a visible layout "jump" when the browser paints the next page, breaking the single-page-app-like feel the raw HTML needs to fake.

- Treat `commercial/components/navbar.html` and `commercial/components/footer.html` as the **single canonical source** for header/footer markup. Every page — including `connect/*` and `personal-and-property/*` — includes this exact markup (via whatever include mechanism the static build uses), never a hand-copied or re-typed variant.
- After building/updating any page, diff its header/footer DOM against the canonical component. Any divergence is a bug, not a style choice.

### 7.2 ChannelSwitcher — build the overridden, always-three-visible version, in one strip

Per the updated §4 above: build the switcher so **Commercial (Home icon + "Home" text), Connect, and Personal & Property are all visible on every page, all the time**, with a clear `.active` state (underline, bold, or brand-tinted background) marking whichever one matches the current page. Do not build the original "hide the current channel" version — that logic is explicitly overridden for this phase. **The switcher renders inside the single header strip, alongside the logo and primary nav — never as its own separate utility bar/tier.** If you're fixing an existing two-tier header (see 🔴 note below), collapse it into one row rather than rebuilding from scratch.

🔴 **Known regression to fix, not just re-prompt for:** an earlier ambiguous instruction ("sits above or beside the main nav") led to a real two-tier header being built — a `.utility-bar` strip containing only the `ChannelSwitcher`, sitting above the `.navbar` strip with the logo and primary nav. This is now explicitly wrong per the correction in §4. **Status update: Phase 5 (page production) was run before this fix landed, so the two-tier header has since been copied into every new page it produced too** — as of the last audit, 62 of 66 HTML files across Commercial, Connect, and Personal & Property carry the bug, not just the original ~30. Don't just re-run the original Phase 5 prompt expecting a different result — use the corrective prompt in `prompts.md` ("Prompt 5-fix"), which now fixes the canonical component first, then re-propagates the fix across every affected file in batches, rather than regenerating headers from scratch and hoping they come out differently.

### 7.3 Root-relative paths everywhere (not relative paths)

Pages live at the root (`commercial/index.html` → `/`), in subfolders (`connect/index.html` → `/connect/`), and in sub-subfolders (`commercial/guides/lease-vs-buy.html` → `/guides/lease-vs-buy/`). A relative path (`../assets/logo.png`, `href="about.html"`) resolves differently depending on how deep the current page sits — it'll look fine on the homepage and silently break the moment you're two folders deep.

**Rule: every header link, footer link, CSS `<link>`, and image `src` uses a root-relative path** (starting with `/`), e.g. `href="/connect/about.html"`, `src="/commercial/assets/logo-navy.png"` — never a relative path (`../`, bare filenames like `about.html`). Apply this consistently across Commercial, Connect, and Personal & Property; it's the single biggest reason a "it worked on the homepage" bug shows up two folders deep.

### 7.4 Em-dash replacement — spaced hyphens, not squished ones

Per the earlier em-dash removal task: replace every em-dash (`—`) with a **spaced hyphen (` - `)**, not a bare hyphen (`-`) jammed directly between words — a bare hyphen can visually squish adjacent words together if the surrounding spacing isn't handled, while a spaced hyphen reads cleanly and matches how the character is actually used in running text.

### 7.5 Don't skip the Guides Hub or the Tools/Calculators — build them from `copy-final.md`

Phase 5 work must explicitly include (not just the product pages):
- The **Guides & Resources Hub** (`/guides/`, per `Master Information Architecture & Sitemap.md` §4) — a real hub/landing page linking out to every guide below, not just the existing `resources.html` left as-is.
- Every **long-form guide article** listed in the IA doc §4 (e.g. `compare-business-loans`, `best-line-of-credit`, `business-line-of-credit-guide`, `business-charge-card-guide`, `business-overdraft-guide`, `business-term-loans-guide`, `business-loan-bad-credit`, `invoice-vs-debtor-finance`, `lease-vs-buy`) — using `copy-final.md` for any copy that document covers, not invented fresh.
- Both **calculator tools** (`repayment-calculator.html`, `equipment-calculator.html`) — confirmed present and correctly cross-linked from the Guides Hub and from their respective product pages (Finance Lease, Operating Lease, Chattel Mortgage), per IA §5.

Do not treat product pages as the whole of Phase 5 — the Guides Hub and the two calculators are equally in-scope and were previously under-specified here.

### 7.6 Per-channel production tasks (as before, now read alongside 7.1–7.5)

- **Commercial** — reconcile existing HTML against Phase 2 nav changes, Phase 3 copy, the fix list (broken reviews carousel, non-functional "Unlock your full report" button, "How it works" navy panel alignment, lender logo updates once supplied, em-dash removal *per 7.4*, tile-sizing fixes, payoff-line reword), the Resources-page image swap, the Guides Hub + guide articles + calculators from 7.5, and the `self-employed-home-loan.html` channel decision (hit-list item 43).
- **Connect** — apply the Phase 4 color-flip work to the real `connect/index.html` (and `terms.html`/`privacy.html`), remove all remaining "Fundit" references, confirm "Become a Partner" is the single primary CTA, and apply 7.1–7.4 (header parity, switcher, root-relative paths, em-dash spacing) consistently.
- **Personal & Property** — genuinely net-new page production: home + 8 loan-type pages + `apply` + `about`, per IA §7 and `copy-final.md`, built with the same header-parity, switcher, root-relative-path, and em-dash rules from 7.1–7.4 from the very first page — don't build it first and retrofit path/header consistency later.

---

## 8. Phase 5.5 — Pre-Conversion Cleanup & File Organization (NEW)

**Purpose:** before Phase 6's fix pass, Phase 7's remediation pass, Phase 8's final fix pass, and Phase 9's Payload conversion, do a dedicated housekeeping pass on the raw file structure. This phase exists because Phase 5 production naturally creates loose ends — duplicate folders, retired-but-not-deleted files, unused assets — that are cheap to fix now and expensive to carry into the CMS migration.

**Concrete cleanup tasks:**

1. **Delete the duplicate Personal & Property folder.** The project currently has both `personal-and-property/` (correct) and `personal and property/` (with spaces — currently empty, but a real risk if anything ever gets saved into it). **Delete `personal and property/` entirely.** Spaces in folder names break Vercel routing; there must be exactly one Personal & Property folder, correctly named.
2. **Securely delete retired files**, per the Duplicate Resolution Log in `Master Information Architecture & Sitemap.md` §9 — don't just stop linking to them, actually remove them so they don't linger as ghost/crawlable pages:
   - `commercial/debtor-finance.html` — confirm its unique content was merged into `commercial/invoice-finance.html` first (per §9 item 4), then delete the file and confirm the `/debtor-finance/` → `/invoice-finance/` redirect is documented for Phase 9.
   - `commercial/trade-funding-website-application.html` — confirm `apply.html` is the live, complete version, then delete the legacy file and confirm the redirect to `/apply/` is documented for Phase 9.
   - `commercial/resources.html` — once the Guides Hub (7.5) is live at `/guides/`, confirm whether this file's content has been fully absorbed into the hub; if so, delete it and confirm the `/resources/` → `/guides/` redirect is documented for Phase 9. If any unique content still only exists in `resources.html`, migrate it into the Guides Hub first.
3. **Audit for unused assets** — orphaned images, unreferenced CSS classes/rules, unused JS files (across `commercial/`, `connect/`, and `personal-and-property/`) that nothing in the final page set actually links to or uses. Flag before deleting anything not explicitly named above — don't silently remove assets you're not sure are unused.
4. **Verify folder structure matches the IA doc exactly**: `commercial/` (root-level pages + `guides/` + `components/` + `assets/`), `connect/` (with its own `branding/`/`styles/`/`api/`), `personal-and-property/` (single, correctly named, no duplicates) — flag anything that doesn't match this shape.
5. **Run the header/footer parity check from 7.1 across every remaining page** as a final gate — confirm no page's header/footer markup has silently drifted from the canonical component during Phase 5 production.
6. **Produce `cleanup-report.md`** documenting: files deleted (with reasoning), files flagged as possibly-unused but not deleted (pending confirmation), and any header/path inconsistencies found and fixed. Keep this report in `docs/` alongside the other planning docs.

Do not begin Phase 9 (Payload conversion) until `cleanup-report.md` exists and the folder structure is clean — migrating a messy file tree into Payload collections just moves the mess into the CMS. (Phase 6, Phase 7, and Phase 8 all still sit between this cleanup and Phase 9 — see below.)

---

## 9. Phase 6 — Build Quality & Architecture Fix Pass (NEW)

**Why this phase exists:** Phase 5.5's cleanup handled file-tree hygiene (duplicates, retired files). It didn't catch the class of issue a full-site review surfaces — one page the propagation script missed, files that shouldn't ship, accessibility gaps, and content parity issues between channels. `TF_Site_v_07.docx` (your team's own site review) found all of the below across the live build. Fix these before converting anything into Payload — a broken pattern that gets migrated into a CMS component just becomes a broken pattern that's harder to find and fix.

### 9.1 Finish the header propagation the last fix missed

- **`contact.html` at the repo root still has the old two-tier `.utility-bar` header** — it's outside any channel folder, so the earlier fix's per-folder batching (Commercial → Connect → Personal & Property) never reached it. It's also live-linked from every Personal & Property page, so this is visibly broken in normal navigation, not just in an edge case. Fix it directly, and **move it into a channel folder** (recommend `commercial/contact.html`, since Commercial is the hub and Contact is a shared asset per plan.md §5.1) with root-relative links from every channel — so future propagation scripts catch it automatically instead of relying on someone remembering a root-level exception.
- **The trust bar** (★★★★★ 5.0 Google · 31 reviews · ACL 387856 · AFCA Member · 70+ Lenders) needs to be **pinned at the very top of every page**, above the header row, identical across all channels — it's currently not visible/not pinned correctly. This is a distinct element from the `ChannelSwitcher` row fixed earlier — a persistent top trust-strip, not a second nav tier. Don't rebuild it as another tiered bar; it should read as one continuous masthead block (trust strip + header row) that never shifts between pages.
- **Nav label wording is now locked** — no longer "pending Matt's call" per §4's earlier placeholder status: **"What Funding Do I Need?" | "Offer Funding Solutions" | "Why Trade Funding?"** is confirmed final. Update §4 mentally to drop the 🟡 placeholder flag on this specific item.
- **Reaffirm header parity as the mechanism for seamless channel-switching** — the header (trust strip + nav row) must be pixel-identical across every page and channel; only the `ChannelSwitcher`'s active-state highlight color should differ between pages. If switching channels feels anything other than seamless, the header isn't actually identical somewhere — treat that as a parity bug, not a design question.

### 9.2 Remove what shouldn't be in the deployable tree

- **Move `design baseline/` and `connect/tests/calculator-test.html` outside the web root entirely** — both currently ship inside the deployable tree, and `calculator-test.html` in particular has a filename that could collide with a real production page. Don't just rename in place — relocate both to a location Vercel would never serve (e.g. a top-level `_internal/` or `.reference/` folder excluded via `.vercelignore`), and additionally rename `design baseline/` to something that can't collide even if the move is ever undone, e.g. `_DO-NOT-DEPLOY-design-baseline/`.
- **Remove the stray `console.log` in `commercial/product-page.js:225`.**

### 9.3 Path & templating debt

- **Fix the 9 files in `commercial/guides/`** that still use relative paths (`src="../cookie-consent.js"`) — change to root-relative (`/commercial/cookie-consent.js`) in all 9. This is the same root-relative rule from §7.3, just missed in the guides folder specifically.
- **Replace ~3,000+ inline `style=""` attributes** (e.g. `commercial/index.html` alone has 291) that duplicate values already defined in `tokens.md`, with token-driven utility classes (`.icon--sky`, `.icon--peach`, etc.) generated from `tokens.md`. This is cleanup, not a redesign — the visual output shouldn't change, only how the color is expressed in markup.
- **Flag, for an explicit team decision, not a silent one:** there is no templating/build system for this 66-page site — header, footer, and dropdown markup are physically copy-pasted into 50–65 files (`id="navbar"` appears 62×), meaning every future shared-component fix (including this whole phase) requires a manual re-propagation pass, and things like the `contact.html` miss in 9.1 are a structural risk, not a one-off mistake. Two real options: **(a)** adopt a minimal templating layer (11ty, Astro, or server-side includes) before producing any more raw HTML, or **(b)** treat this as the last major raw-HTML fix pass and move straight into Phase 7's Next.js/Payload migration, where the component system replaces copy-pasted markup permanently. Surface this choice to the team explicitly before closing out Phase 6 — it changes how much further raw-HTML investment is worth making.

### 9.4 Accessibility & semantic HTML

- **`<header>` landmark used on 0 of 62 pages; `<main>` only on 21/62.** Wrap the masthead in `<header>` and primary page content in `<main>` at the template/component level, then re-propagate sitewide.
- **Footer badges (AFCA, CAFBA, Fintech Australia, ACL) are plain `<span>`s, not links.** Wrap each in an `<a>` pointing to its real verification/membership page.
- **Commercial's hamburger menu doesn't update `aria-expanded`** (it only toggles a CSS class) — Connect's script does this correctly. Copy Connect's `aria-expanded` toggle pattern into Commercial's hamburger handler.
- **The "What's S.T.A.R.?" explainer on `apply.html` uses a native `title=""` tooltip** — not accessible via tap/touch. Replace with a small click/tap-accessible popover component.
- **`apply.html` has 4 separate `<h1>` elements** (one per funnel step + thank-you page). Use one page-level `<h1>` ("Apply for Funding"), demote step titles to `<h2>`, or announce step changes via `aria-live` instead of new headings.

### 9.5 SEO/meta hygiene

- **34 pages still missing `<meta name="robots">`** — worse, proportionally, than the ~20 originally flagged in the SEO audit. Template a single `<meta>`/`<title>`/description block and apply sitewide, except `404.html`.
- **`sitemap.xml` doesn't include `privacy.html`, `terms.html`, `credit-guide.html`, or `broker-portal.html`, and still uses `.html`-suffixed URLs**, contradicting the extensionless canonical tags used elsewhere. Diff the live file tree against `sitemap.xml`, add the missing pages, and align the URL format with the extensionless canonical pattern (this is the target format implied by the canonical tags already in use).

### 9.6 Cross-channel nav/CTA routing gaps

- **"Partners" nav item still links to the legacy `/commercial/broker-portal.html`, not Connect.** The routing decision from §4 (Partners covers both Broker Portal *and* Connect's Become a Partner path) was specified but never actually implemented in the markup. Route through Connect; update the nav link and cross-link Broker Portal from within Connect's own partner page.
- **No "Become a Partner" CTA anywhere in `commercial/` pointing to Connect.** Add the CTA to Commercial's nav/footer or relevant pages, linking into Connect — this was a locked requirement from the original meeting notes (Nicole's "highly visible become-a-partner CTA" ask) that never made it into Commercial's markup.
- **ACL number "387856" still appears 3× in the footer** (badge, legal strip, copyright line). Reduce to once or twice max — this is the same "ACL repeated three times" issue flagged in the original meeting notes; it either came back or was never actually fixed the first time.

### 9.7 Cross-channel visual parity

- **Personal & Property doesn't have the same reveal/scroll animations as Commercial and Connect.** Apply the same `IntersectionObserver`-based reveal treatment from `tokens.md` §1.5 (staggered delays, `prefers-reduced-motion` respected) to Personal & Property's pages for parity.

**Output:** `docs/fix-report.md`, documenting what was fixed and in what order, with explicit before/after notes for anything accessibility- or SEO-related (these are hard to eyeball-verify from a screenshot). Don't start Phase 7 (Payload conversion) until this exists **and** the templating-vs-migrate-now decision from 9.3 has been made explicitly with the team — that decision materially changes how Phase 7 gets scoped.

---

## 10. Phase 7 — Pre-Migration Remediation (NEW)

**Why this phase exists:** three independent review reports (security, architecture, dependency-risk) landed after Phase 6 closed, plus a handful of real content blockers (address, email) and a nav-wording change came in directly from the team. All of it needs resolving before Payload conversion, for the same reason Phase 6 came before it: fixing a broken pattern is cheaper now than migrating it into a CMS component and fixing it there.

### 10.0 Commit current work

Before starting: commit the current working tree with a sensible message. (As of the zip reviewed for this update, `git status` shows a clean tree through Phase 6's six commits — so this may be a no-op, but confirm at the start of every phase regardless, as standing practice.)

### 10.1 Fill in the company address + email blockers (Commercial)

- **Exact locations confirmed in the live files** — there are 4 placeholder spots across two files, not 3: `commercial/credit-guide.html` (a body list item around line 208, and a footer contact item around line 295) and `commercial/terms.html` (the §13 "Post" reference around line 318, and a footer contact item around line 340).
- Fill each with the supplied address, **explicitly labeled "Office Address"** — not "Registered Address" and not unlabeled — since this is the office/correspondence address, not necessarily the ASIC-registered business address:
  > Office Address: Level 8, 387 George Street, Sydney, NSW, 2000
- ⚖️ **Not legal advice — flag for your own compliance check:** Credit Guides for Australian Credit Licence holders generally need to disclose contact details, but whether the *registered* address specifically is required (versus a genuine office/contact address) is worth confirming with whoever manages your ACL compliance. Labeling this accurately as "Office Address," rather than presenting it as the registered address, is the safer disclosure choice regardless of that answer.
- **Email — confirmed sitewide replacement needed:** Connect already uses `support@tradefunding.com.au` consistently across all 8 of its pages (no changes needed there). **Personal & Property (all 11 pages) uses `hello@tradefunding.com.au` exclusively, and roughly half of Commercial's pages are still on `hello@` too** — 51 files total need `hello@tradefunding.com.au` replaced with `support@tradefunding.com.au`.
- **`hello@` → `support@` routing and inbox access remains genuinely unconfirmed** (Ben Lyons, per `CLAUDE.md`'s deferred-blocker list) — this is an operational question, not a site-content fix, and stays open regardless of the display-copy change above. Don't close this item out just because the displayed email address changed.

### 10.2 Update Commercial's top-level nav wording (supersedes the Phase 6.1 lock)

**New, final wording: Funding Solutions | Compare Options | Partners | Why Choose Us?**

Mapping onto what Phase 6.1/6.6 already built (confirmed against the live files and git history):
- "What Funding Do I Need?" → **"Funding Solutions"** — same dropdown/structure, label only changes.
- "Offer Funding Solutions" (this was the *Partners*-role label locked in 6.1, then routed to Connect's `for-vendors.html` in 6.6) → **"Partners"** — same destination, label reverts to the more literal term. Don't let the reused word "Solutions" cause confusion with the new "Funding Solutions" item — these are two different nav slots.
- "Why Trade Funding?" → **"Why Choose Us?"**
- 🟡 **"Compare Options" is a new fourth item, not part of the original 3-item structural pattern** — flagging rather than silently deciding: this most likely maps to `comparison-report.html` (the existing Compare Report page/CTA), promoting it from a CTA button to a top-level nav item. Confirm this mapping. Also confirm where the Guides Hub (`/guides/`) and `about.html` — both currently reachable via nav in some form — should live now that the top-level list doesn't name them explicitly (footer-only, folded into one of the four dropdowns, or a 5th item are all plausible; not resolved here to avoid overreaching on a nav-architecture call that isn't mine to make).

Apply consistently across every Commercial page's header, plus any footer/mobile-nav mirror of these same links.

### 10.3 Security audit remediation (priority order per the security report)

1. **[Critical] Fix rate limiting.** `connect/api/request-call.js`'s in-memory `Map`-based limiter doesn't actually work across Vercel's stateless, per-instance serverless runtime — an attacker can send effectively unlimited requests, each triggering a real Resend email and Slack post. Replace with an Upstash Redis-backed sliding-window limiter (`@upstash/ratelimit` + `@upstash/redis`).
2. **[High] Add a real anti-abuse check.** The Origin/Referer "same-origin" check in both `form-token.js` and `request-call.js` is trivially forgeable by any non-browser client (`curl` with the right headers defeats it completely). Add Cloudflare Turnstile (or hCaptcha/reCAPTCHA) verification alongside — not instead of — the existing checks.
3. **[Medium] Wire the two silently-broken forms.** `commercial/contact.html` (`action="#"`, submits nowhere) and the comparison-report download gate in `product-page.js` (fakes a "Sent to [email]" success message, discards the address entirely) both need a real endpoint before launch, or an explicit disabled "coming soon" state if the endpoint genuinely isn't ready. Do not ship either as a working-looking form that silently discards user data.
4. **[Medium] Fix the Broker Portal form.** No `method`/`action` means it defaults to `GET`, leaking name/email/phone into the URL, browser history, referrer headers sent to third parties, and server/CDN logs. Force `POST` to a real endpoint (new `/api/broker-lead`, mirroring `request-call.js`'s pattern).
5. **[Low] Add secret rotation support.** Prefix `FORM_TOKEN_SECRET`-signed tokens with a key version (`v1.`) so the secret can be rotated later without breaking in-flight tokens; confirm the secret was actually generated per-environment (`openssl rand -hex 32`) rather than left as a placeholder in Vercel's dashboard.

### 10.4 Architecture review remediation (priority per the report's own "highest leverage" call-out)

1. **[Do first — highest leverage]** Add a minimal HTML-include build step (e.g. `posthtml-include`, or a five-line custom Node script) so `navbar.html` / `footer.html` / `how-it-works.html` get physically included at commit/CI time instead of manually re-copied into 62+ files. This single fix directly addresses the failure mode behind both the two-tier header regression (Phase 5) and the `contact.html` propagation miss (Phase 6) — and it doesn't require waiting for Phase 9. (Note: per Phase 8 §11.1, this fix turned out to still be incomplete after Phase 6 — only 3 of 66 pages actually adopted it. Phase 8 finishes the job.)
2. **Extract shared chrome CSS** out of `commercial/shared-styles.css` into a new, channel-agnostic `shared/styles/chrome.css` — Connect and Personal & Property already silently depend on Commercial's stylesheet for header/footer/switcher/button/container styling; the folder structure should reflect that dependency honestly rather than hiding it.
3. **Extract a shared serverless library** (`connect/api/_lib/`: `origin-check.js`, `form-token.js`, `rate-limit.js`, `html-escape.js`) **before** building the new `broker-lead` and `contact` endpoints from 10.3 — otherwise the Turnstile/Upstash fixes above need to be re-applied identically across three or four near-duplicate handler files instead of landing once in a shared module.
4. **Consolidate cookie-consent** to one implementation with one shared cookie key — Connect's `localStorage`-based check (`tf-connect-cookie-consent`) and Commercial's `document.cookie`-based check (`blc_cookie_consent`, a legacy internal codename worth dropping too) currently disagree, so switching channels via the `ChannelSwitcher` re-prompts the cookie banner. Cookie-based is the better choice of the two, since it's server-readable if Phase 9's Next.js middleware ever needs it.
5. **Refactor `calcMonthly()`** in `commercial/product-page.js` into a pure function — mirroring `connect/scripts/calculator.js`'s already-correct `compute()` pattern — separating the amortization math from the DOM reads. This is what makes the loan-repayment calculation unit-testable at all.
6. **Refactor `request-call.js`'s env-var reads** to happen once at the top of `handler()`, passed down as a plain config object, rather than deep inside `sendEmail()`/`sendSlack()` — makes the handler mockable/testable without mutating real environment variables.
7. **Flag for Phase 9 acceptance criteria, not immediate action:** the two large CSS files (`product-styles.css` at 3,150 lines, `shared-styles.css` at 1,001, since split further in Phase 7 §10.4 item 2 into `shared/styles/chrome.css` + a slimmed `commercial/shared-styles.css`) should not get copy-pasted forward into the Next.js app as single files. Name "no single CSS file over ~500 lines, component-scoped only" as an explicit Phase 9 acceptance criterion now, while it's easy to agree on.
8. **Housekeeping, not urgent:** `_internal/_DO-NOT-DEPLOY-design-baseline/`'s CSS copy is already 135 lines out of sync with the real one and will keep drifting. Plan to move it out of the git repo entirely (Figma, a separate reference repo) once its reference value is exhausted.
9. **Superseded by Phase 8 §11.4** — this item recommended copying Connect's security-headers block to the other two channels as a stopgap; Phase 8 now does this directly (plus adds CSP/HSTS, which weren't part of the original header set) rather than treating it as a pre-launch checklist item.

### 10.5 Dependency risk remediation

- Add the recommended `devDependencies` to `connect/package.json` (`vitest`, `eslint`) plus `test`/`lint` scripts — no production runtime dependencies are being added, this only enables testing/linting the two serverless functions in CI before deploy.
- Once 10.4's refactors land (pure `calcMonthly()`, pure `request-call.js` config handling), write `vitest` unit tests covering: the amortization math, the rate limiter's pure logic (post-Upstash-migration), and HMAC token verification — the highest-value, lowest-effort tests given what 10.4 just made testable.
- **Re-run this exact dependency analysis again once Phase 9's Payload/Next.js `package.json` exists, and before its first production deploy** — the dependency report is explicit that it needs to be redone at that point, once a real dependency tree (Next.js, Payload, a Postgres driver, a Blob adapter) exists to audit.

**Output:** `docs/remediation-report.md`, documenting what was fixed from each of the three source reports, in the order above, plus the two open flags from 10.2 (the "Compare Options" mapping, and where Resources/About now live) and confirmation that the `hello@`→`support@` inbox-routing question from 10.1 is still open, unresolved by this phase. ⚠️ **This report was never actually produced** — Phase 7 stopped after item 10.4 items 5–6; item 10.5 (dependency hygiene/tests) never ran. Folded into Phase 8 §11.9 rather than reopening Phase 7 retroactively.

---

## 11. Phase 8 — Final Pre-Deployment Fix Pass (NEW)

**Why this phase exists:** six independent review reports (architecture, dependency-risk, performance/SEO, security, state/resilience/observability, UI/UX/a11y) were run against the Phase 7 build and landed together. This is explicitly **the last fix pass before deployment** — Phase 9 (Payload conversion) should not start until every item below is resolved or consciously deferred with a documented reason, since anything shipped broken here gets migrated into the CMS broken.

**Resolved:** the `ChannelSwitcher`'s "Home" entry is icon-only — `CLAUDE.md` rule 13 has been updated to match. This also happens to be the more defensible fix for Finding 8.1 below (a shorter switcher never wraps and covers the hero). The actual markup change (`commercial/components/navbar.html`) is Prompt 8.3's job, not done yet — see 8.3 below for why it waits on 8.1's include-sync fix landing first.

Fixes are grouped into 10 sub-phases (8.1–8.10), ordered so design/aesthetic/animation work leads (as requested), then propagation-dependent fixes, then independent security/performance/observability/process work, closing with a full pre-deployment QA pass.

### 8.1 — Fix the include-sync coverage gap + hero/header overlap (foundational, do first)

This is the single highest-leverage fix across all six reports: **the include-sync mechanism (`connect/scripts/build-includes.mjs`) only actually covers 3 of 66 pages** (`personal-and-property/personal-loans.html`, `connect/for-vendors.html`, `commercial/business-loans.html`) — confirmed directly. The other 63 pages have navbar/footer markup hand-copied, with no automated enforcement, which is the root cause behind several other findings below (emoji regression, address-placeholder drift, footer emoji). Fix this before any of the fixes in 8.2 that rely on propagation being trustworthy.

- Convert the remaining 63 pages to use the same `<!-- include:start src="..." --> ... <!-- include:end -->` marker pattern already proven on the 3 pages that use it.
- Wire `npm run build:includes:check` into a pre-commit hook or CI step so a page that drifts from its canonical component fails the build instead of silently shipping.
- **While the canonical header component is open for this work, fix the hero/header overlap** (confirmed root cause: `.trust-bar` + `.navbar` stack to ~105–107px of real fixed-header height, but `.hero` only reserves 90px `padding-top`). Change `.hero`'s top padding to `calc(var(--utility-bar-height, 37px) + 80px + 32px)` on Commercial, and verify the same math clears the stack on Connect's `.hero` (already more generous, but confirm on mobile) and Personal & Property's `.pp-hero`.
- This is the ideal first task to prove the include-sync fix actually propagates correctly — if the header/hero fix shows up identically on all 66 pages afterward, the mechanism is trustworthy for 8.2's fixes.

### 8.2 — Branding/visual cleanup that depends on 8.1's fixed propagation

- **Remove the 20 emoji icon spans** (`<span class="dd-icon ...">&#...;</span>`) from the Funding Solutions dropdown in `commercial/components/navbar.html` — the grouped-list redesign is already structurally correct, only the glyphs remain. Re-propagate via the now-fixed include-sync.
- **Remove the 3 emoji entity references** (`&#128222;`, `&#128231;`, `&#128205;`) from all three canonical footer components (Commercial/Connect/Personal & Property). Re-propagate the same way.
- **Fix the distorted Casper logo** in Connect's footer: add `class="footer__cashper"` to the `<img>` at `connect/components/footer.html:28` and drop the inline `style="height:56px;width:auto;"` — a correct, matching CSS rule (`object-fit:contain`, `flex-shrink:0`) already exists in `connect/styles/main.css:760` but was never wired to the markup.
- **Build a dedicated Products page** (`commercial/products.html`, or repurpose `commercial/business-loans.html` since it already has include-sync wired) — the dropdown groups everything correctly, but no standalone menu-style page exists yet, which was part of the original nav-redesign ask.
- **Propagate the confirmed office address to all 59 remaining placeholder occurrences** (including `commercial/privacy.html`) — the address is already correct in `credit-guide.html` and `terms.html` from Phase 7.1, it just never reached the other files. Use the now-fixed include-sync for the footer instances; do a direct find-and-replace for any body-content instances outside the shared footer.

### 8.3 — Animation, motion & interaction accessibility polish

- **Add entrance animation to Personal & Property's hero** — `.pp-hero__eyebrow`, `.pp-hero__title`, `.pp-hero__lead`, `.pp-hero__cta-group`, `.pp-hero__trust`, `.pp-hero__card` currently have no `reveal`/`reveal delay-N` classes, unlike Commercial and Connect's heroes. The shared `.reveal` CSS/JS is already loaded on this page (used below the fold) — this is a markup-only change, matching Connect's stagger pattern.
- **Make the Funding Solutions dropdown keyboard/AT accessible** — it's currently a plain `<div class="dropdown-menu">` shown via CSS `:hover` only, no `aria-expanded` state, no keyboard path. Add `aria-expanded` toggling and a click/focus-based open state (not hover-only), mirroring the hamburger menu's already-correct pattern in `connect/scripts/main.js`.
- **Fix channel-switcher touch targets on mobile** — at `≤640px`, `.channel-switch__option` drops to `padding: 7px 10px; font-size: 0.72rem`, producing a ~28–30px tap target, under the 44px minimum. Add `min-height: 44px` at this breakpoint via padding, not font-size alone.
- **Apply the "Home" icon-only decision** — remove `<span class="channel-switch__full">Home</span>` from the canonical `navbar.html` (now safe to propagate sitewide via 8.1's fix). `CLAUDE.md` rule 13 is already updated to match.
- Confirm `prefers-reduced-motion` gating is applied to the new P&P reveal classes the same way it already is everywhere else (it should be automatic, since it's the same shared `.reveal` system — just verify).

### 8.4 — Security headers: CSP + HSTS sitewide

- **Add a Content-Security-Policy and Strict-Transport-Security header** — currently absent from the entire codebase. Use the report's suggested policy as a starting point (`default-src 'self'; script-src 'self' https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; base-uri 'self'; form-action 'self'; frame-ancestors 'self'`, plus `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`). `style-src 'unsafe-inline'` is required for now because of the inline `<style>` blocks addressed in 8.9 — tightening that is a follow-on, not a blocker.
- **Extend the same four existing headers** (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`) plus the two new ones above to Commercial and Personal & Property — right now only `connect/vercel.json` has any of this, meaning the two channels hosting the actual loan-application forms are the ones with zero clickjacking/MIME-sniffing protection. Add equivalent config per channel now; consolidate into one root-level config during Phase 9's single-app conversion (this supersedes the equivalent, unfinished ask in §10.4 item 9).

### 8.5 — Compliance-critical gaps: P&P cookie consent + Turnstile front-end wiring + the still-unfixed Broker Portal form

- **Add cookie-consent coverage to all 11 Personal & Property pages** — none of them currently load `/shared/scripts/consent.js`, while 48 of the other 55 real pages do. This is a live compliance gap (GDPR/CCPA-style consent gate missing entirely on one channel), not just a UX inconsistency. Add `<script src="/shared/scripts/consent.js" defer></script>` to all 11 pages.
- **Wire the Turnstile front-end widget before this ships** — the backend (`_lib/turnstile.js`) already fails closed with no token (`if (!token) return false`), and its own code comment warns this rejects every real submission until the widget exists. Add the Turnstile widget to `connect/index.html`'s request-call form and update `scripts/form.js` to read the response token into `turnstile_token` on both the POST body and the `/api/form-token` GET query string. **Do not weaken the `if (!token) return false` check as a workaround** — that would reopen the abuse vector Phase 7 closed.
- 🔴 **Independently confirmed, not caught by either round of security reports: the Broker Portal form is still unfixed.** `commercial/broker-portal.html:596`'s `<form class="bp-form">` still has no `method`/`action` — the exact GET-leaking-PII issue flagged back in Phase 7 (Prompt 7.9) was apparently never actually applied, despite being marked as a Phase 7 task. Fix it now: force `POST` to a real endpoint, following `request-call.js`'s pattern.

### 8.6 — Shared-logic extraction: validation regex + email/Slack templating

- **Extract the duplicated email/phone validation regexes** (currently copy-pasted verbatim between `connect/api/request-call.js` and `connect/scripts/form.js`) into a small shared module, following the same `_lib/` pattern already used for origin-check/token/rate-limit/escape.
- **Extract `sendEmail`/`sendSlack`'s HTML/Slack-message templating** into `connect/api/_lib/notify.js`, parameterized by a template name — do this before a second form handler (Broker Portal's, from Phase 7) risks copy-pasting the same templates rather than reusing them.

### 8.7 — Performance & SEO

- **Add explicit `width`/`height` to every `<img>` tag sitewide**, starting with Commercial's homepage (0 of 73 currently have them) — a scripted pass (read real dimensions from disk, inject attributes) is more reliable than manual editing at this volume. `loading="lazy"` is already correctly applied on 70 of 73 — don't touch that.
- **Convert `commercial/assets/founders.jpg` (2.0MB) and other large JPG/PNG photos to WebP**, re-encoded at a sane max width for their rendered size.
- **Fix the broken Open Graph image on Commercial's homepage** — `og:image` points to a file (`commercial/assets/og-image.png`) that doesn't exist anywhere in the repo. Create a Commercial-specific OG image (don't reuse Connect's branding — they should look distinct).
- **Bring Personal & Property's `<head>` metadata up to Connect's standard** — currently missing `og:image`, any `twitter:card` tags, a `sitemap.xml`, and a `robots.txt`. Add all four, using Connect's `<head>` as the template. While at it, add `sitemap.xml` to Connect too (it currently has `robots.txt` but no sitemap).
- **Audit Commercial's 6 JSON-LD schema blocks for duplicate/conflicting `Organization` entries**, and check whether any of them reference the same broken image path fixed above — a broken reference duplicated into structured data compounds the same bug twice.

### 8.8 — Resilience & observability

- **Add retry/backoff to the two network calls in `connect/scripts/form.js`** (`fetchFormToken()` and the actual `/api/request-call` submit) — currently one attempt, then straight to an "email us instead" fallback. Add 2–3 attempts with short exponential backoff (e.g. 300ms/900ms), being careful not to trigger `_lib/form-token.js`'s 3-second minimum-age check with an overly fast retry loop.
- **Add a minimal global JS error handler** (`shared/scripts/error-handler.js`, loaded sitewide alongside `consent.js`) — `window.addEventListener('error', ...)` / `window.addEventListener('unhandledrejection', ...)`, at minimum logging structured error info. Every current script is a self-contained IIFE with no shared catch, so a DOM-shape mismatch currently fails silently with no record.
- **Stand up a lightweight RUM/telemetry integration** (Sentry's free tier is a reasonable default) before production traffic arrives — capture unhandled JS errors, unhandled promise rejections, and the three Core Web Vitals (LCP/INP/CLS) at minimum. **Explicitly configure it to scrub form fields (name/email/phone/business) from error context and any session-replay feature before it's turned on** — most RUM tools capture DOM/form state by default, and this form collects exactly the PII that shouldn't reach a third-party telemetry dashboard.

### 8.9 — Finish what Phase 7.13 didn't: dependency hygiene, tests, and HTML/CSS cleanup

Phase 7.13 was written into `prompts.md` but never actually run — confirmed via `git log` (the last Phase 7 commit is 7 §10.4 items 5–6) and via the dependency-risk report (`connect/package.json` still has no `devDependencies`, no `test`/`lint` scripts). Close this out now rather than treating it as separately owed:

- **Run `npm install` inside `connect/` and commit the resulting `package-lock.json`** — currently no lockfile exists anywhere, and with caret ranges on two actively-shipping packages (`@upstash/ratelimit` already has a `2.1.0-rc` upstream), a fresh install could silently drift.
- **Actually add the `vitest`/`eslint` devDependencies and `test`/`lint` scripts** per the exact block in `buildspec.md` §13, and **write the tests Phase 7.13 specified** (amortization math, rate-limiter pure logic, HMAC token verification) — all three are now genuinely testable thanks to Phase 7's refactors, they just were never written.
- **Consolidate each large HTML file's multiple inline `<style>` blocks into one**, with any override rules namespaced as modifier classes (e.g. `.hero--light-preview`) rather than a same-selector redefinition further down the file — `commercial/index.html` (6,399 lines, 4 separate `<style>` blocks, one of which silently re-overrides `.hero`) is the worst offender and the one to fix first. This is a low-cost intermediate step before Phase 9's real component-scoped CSS.

### 8.10 — Final pre-deployment QA pass + closing report

This is the last checkpoint before Phase 9. Do not treat this as a formality — actually re-verify:
- Re-run `npm run build:includes:check` and confirm all 66 pages pass, not just the original 3.
- Spot-check the header/hero fix (8.1), emoji removal (8.2), and P&P reveal animation (8.3) on at least one page per channel, visually.
- Confirm the CSP (8.4) doesn't break any legitimate inline `<style>` usage (it's allowed via `'unsafe-inline'` for now — verify nothing else silently broke).
- Confirm all 11 Personal & Property pages load `consent.js` (8.5), the Turnstile widget actually issues a token on Connect's live form (8.5), and the Broker Portal form now submits via `POST` to a real endpoint (8.5).
- Run the new `npm test` (8.9) and confirm it passes.
- Explicitly log, rather than silently drop, the items correctly deferred to Phase 9 per the reports themselves: the flat `commercial/` folder vs. the 7-category nav model (model as Payload sub-collections during conversion, don't replicate the flat structure), DOM-ID-based JS fragility (cross-check every `getElementById` target during the Next.js markup conversion), route-splitting/hydration guardrails (become relevant once the Next.js app exists), and SQL/NoSQL injection / auth-bypass re-audits (not applicable until Phase 9's Postgres/Payload backend and any login surface exist).
- Produce `docs/phase8-report.md` summarizing every fix from 8.1–8.9, referencing which finding from which of the six source reports each one closes out, plus the "Home" icon decision that was made and when.

**Do not start Phase 9 (Payload conversion) until `docs/phase8-report.md` exists and you've confirmed the QA pass above.**

---

## 12. Phase 9 — Conversion to Payload CMS + Vercel Publish (formerly "Phase 8"; architecture unchanged, just renumbered)

**One Next.js app, one Vercel project, one Payload backend, three route groups.** This replaces this plan's original three-Vercel-projects assumption. Full technical detail lives in `buildspec.md` — in short:

1. One Next.js app with route groups: `app/(commercial)/`, `app/connect/`, `app/personal-and-property/`.
2. Payload collections modeled with an explicit `parent` relationship field (Business Loans, Trade Finance, Connect, Personal & Property, Guides & Resources) for breadcrumbs/nav-grouping only — this field never affects the actual URL, which is always flat and explicit.
3. Shared header shell (channel-switcher-aware), footer, and legal globals (`FooterLegal`: single ACL/AFCA component) render across all three channels from one Payload global each — not duplicated per channel.
4. Redirects (`trade-funding-website-application.html` → `/apply/`, `/resources/` → `/guides/`, retired `debtor-finance.html` → `/invoice-finance/` after content merge — all confirmed deleted in Phase 5.5) live in Vercel/Next.js redirects config, checked against the Duplicate Resolution Log in `Master Information Architecture & Sitemap.md` §9 as the single source of truth.
5. `GoogleReviews` component per `buildspec.md` §6 — unchanged in spec, but its real-count blocker is now explicitly scheduled for Phase 3 (see §1 above), not chased early.
6. Deploy: one Vercel project, sub-path routing preserves one domain's SEO authority across all three channels, and makes `ChannelSwitcher` a same-origin route change rather than a cross-domain redirect.

See `prompts.md` for the updated, phase-by-phase Claude Code prompts.

---

## Suggested order of operations across tools (unchanged from v1)

1. **Claude (web chat):** Phase 0 hit-list review, Phase 3 copy iteration, blocker chasing.
2. **Claude Code (terminal):** Phases 2, 4, 5, 5.5, 6, 7, 8, 9 — anything that edits/creates files.
3. Keep `plan.md`, `buildspec.md`, `CLAUDE.md`, `tokens.md`, and `Master Information Architecture & Sitemap.md` at the repo root throughout — `CLAUDE.md` is read automatically at the start of every Claude Code session. Don't start Phase 9 until Phase 8's `docs/phase8-report.md` exists.
