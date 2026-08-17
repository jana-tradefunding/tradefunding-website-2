# Trade Funding — Site Rebuild Plan (HTML → Payload CMS → Vercel)

**Status: v3 — updated for a smoother Phase 5 (multi-page raw-HTML build) and a new Phase 5.5 cleanup pass, after reviewing the latest zip.**

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

- **`ChannelSwitcher` component** replaces the old idea of three equal-weighted nav buttons. It's a top-bar control (like a region/country selector), sitting **above or beside** — never inline with — Commercial's own primary nav, so "Products / Why Us / Partners" is never diluted by channel-switching UI.
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
- 🟡 **Still open — nav label wording:** Matt has flagged "Products"/"About" as too generic and wants more action/benefit-oriented framing. **Final call is Matt's.** Until then, use these as working placeholders (map 1:1 onto the structural labels above): "Products" → **"What Funding Do I Need?"**, "Why Us" → **"Why Trade Funding?"**, "Partners" → **"Offer Funding Solutions"**. Treat these as swappable copy on the existing structural pattern, not a re-architecture, when the final wording lands.

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

### 7.2 ChannelSwitcher — build the overridden, always-three-visible version

Per the updated §4 above: build the switcher so **Commercial (Home icon + "Home" text), Connect, and Personal & Property are all visible on every page, all the time**, with a clear `.active` state (underline, bold, or brand-tinted background) marking whichever one matches the current page. Do not build the original "hide the current channel" version — that logic is explicitly overridden for this phase.

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

**Purpose:** before anything gets converted into Payload collections in Phase 6, do a dedicated housekeeping pass on the raw file structure. This phase exists because Phase 5 production naturally creates loose ends — duplicate folders, retired-but-not-deleted files, unused assets — that are cheap to fix now and expensive to carry into the CMS migration.

**Concrete cleanup tasks:**

1. **Delete the duplicate Personal & Property folder.** The project currently has both `personal-and-property/` (correct) and `personal and property/` (with spaces — currently empty, but a real risk if anything ever gets saved into it). **Delete `personal and property/` entirely.** Spaces in folder names break Vercel routing; there must be exactly one Personal & Property folder, correctly named.
2. **Securely delete retired files**, per the Duplicate Resolution Log in `Master Information Architecture & Sitemap.md` §9 — don't just stop linking to them, actually remove them so they don't linger as ghost/crawlable pages:
   - `commercial/debtor-finance.html` — confirm its unique content was merged into `commercial/invoice-finance.html` first (per §9 item 4), then delete the file and confirm the `/debtor-finance/` → `/invoice-finance/` redirect is documented for Phase 6.
   - `commercial/trade-funding-website-application.html` — confirm `apply.html` is the live, complete version, then delete the legacy file and confirm the redirect to `/apply/` is documented for Phase 6.
   - `commercial/resources.html` — once the Guides Hub (7.5) is live at `/guides/`, confirm whether this file's content has been fully absorbed into the hub; if so, delete it and confirm the `/resources/` → `/guides/` redirect is documented for Phase 6. If any unique content still only exists in `resources.html`, migrate it into the Guides Hub first.
3. **Audit for unused assets** — orphaned images, unreferenced CSS classes/rules, unused JS files (across `commercial/`, `connect/`, and `personal-and-property/`) that nothing in the final page set actually links to or uses. Flag before deleting anything not explicitly named above — don't silently remove assets you're not sure are unused.
4. **Verify folder structure matches the IA doc exactly**: `commercial/` (root-level pages + `guides/` + `components/` + `assets/`), `connect/` (with its own `branding/`/`styles/`/`api/`), `personal-and-property/` (single, correctly named, no duplicates) — flag anything that doesn't match this shape.
5. **Run the header/footer parity check from 7.1 across every remaining page** as a final gate — confirm no page's header/footer markup has silently drifted from the canonical component during Phase 5 production.
6. **Produce `cleanup-report.md`** documenting: files deleted (with reasoning), files flagged as possibly-unused but not deleted (pending confirmation), and any header/path inconsistencies found and fixed. Keep this report in `docs/` alongside the other planning docs.

Do not begin Phase 6 (Payload conversion) until `cleanup-report.md` exists and the folder structure is clean — migrating a messy file tree into Payload collections just moves the mess into the CMS.

---

## 9. Phase 6 — Conversion to Payload CMS + Vercel Publish (architecture rewritten)

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
2. **Claude Code (terminal):** Phases 2, 4, 5, 5.5, 6 — anything that edits/creates files.
3. Keep `plan.md`, `buildspec.md`, `CLAUDE.md`, `tokens.md`, and `Master Information Architecture & Sitemap.md` at the repo root throughout — `CLAUDE.md` is read automatically at the start of every Claude Code session. Don't start Phase 6 until Phase 5.5's `cleanup-report.md` exists.
