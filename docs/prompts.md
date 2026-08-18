# Prompt Library — Trade Funding Rebuild

**Status: v6 — adds Phase 6 (Build Quality & Architecture Fix Pass), a new set of prompts inserted between the (now complete) Phase 5.5 cleanup and Payload conversion, which is renumbered Phase 7. Everything is listed below in strict chronological run order.**

**Reminder before every session:** `design baseline/` is a **color-and-button reference only**. Never point Claude Code at it as something to copy, import, or deploy.

---

## Status snapshot (from your latest zip)

| # | Prompt | Status | Evidence |
|---|---|---|---|
| 1 | Branding tokens | ✅ Done | `tokens.md` exists at root, locked |
| 1b | Apply tokens to real HTML | ✅ Done | `connect/index.html` uses real `--gold` tokens; `personal-and-property/styles/main.css` defines `--peach` |
| 0 | Hit list (`hitlist.md`) | ⬜ Not run | Optional, low priority — content already folded into `plan.md` §2 |
| 2 | Nav spec (`nav-spec.md`) | ⬜ Not run | Optional — the nav itself got built anyway inside Prompt 5 |
| 3.1 | Research (`research-notes.md`) | ✅ Done | `docs/research-notes.md` exists |
| 3.2 | Copy creation (`copy-final.md`) | ✅ Done | `docs/copy-final.md` exists |
| 3b | Apply approved copy | ✅ Done (at least partially) | Commercial home hero copy is in place with correctly spaced hyphens |
| 4 | Component inventory (`design/components.md`) | ⬜ Not run | Optional, doesn't block Phase 7 |
| 5 | Page production | ✅ Done | `personal-and-property/*` (11 pages), `commercial/guides/index.html` hub, both calculators all present |
| 5-fix | Collapse two-tier header | ✅ Done, with one miss | Every folder-scoped page is fixed; `contact.html` at the repo root still has the old two-tier structure — pick up in Phase 6 below |
| 5.5 | Pre-conversion cleanup | ✅ Done | `docs/cleanup-report.md` exists; retired files and the spaced-name duplicate are confirmed gone |
| **6** | **Build quality & architecture fix pass (NEW)** | 🔴 **Not started — run these next, in order** | Full list surfaced by your team's site review (`TF_Site_v_07.docx`) — see Prompts 6.1–6.7 below |
| 7–10 | Payload/Next.js/Vercel (formerly 6–9) | ⬜ Not started | No `/site` app scaffold present yet — correctly sequenced after Phase 6 |

**What this means for you right now:** run the Phase 6 prompts below, in order (6.1 → 6.7), then the Phase 6 decision prompt (6.8, a discussion not a code change), before touching Phase 7. Prompts 0, 2, and 4 are still optional and don't block anything downstream.

---

## Prompt 0 — Hit list (Phase 0) — ⬜ NOT RUN (optional, low priority)

```
Read plan.md §1 and §2, Team Comments.md, Master Information Architecture &
Sitemap.md, and SEO Roadmap.md in this repo.

Update hitlist.md (or create it if it doesn't exist): a single flat numbered
list of every requested change, with source, priority, and status (LOCKED /
PLACEHOLDER / BLOCKER). Blockers involving Matt or Ben (company address,
lender logos, hero copy sign-off, hello@ routing) should be marked
"DEFERRED TO PHASE 3" rather than "blocking now" — per plan.md §1, don't
treat these as work-stoppers before Phase 3 kickoff.

Do not touch any other files in this step.
```

---

## Prompt 1 — Branding tokens (Phase 1) — ✅ DONE

No action needed — `tokens.md` is finalized. If you need to regenerate or extend it later, read the existing `tokens.md` first and treat every value in it as locked unless told otherwise.

---

## Prompt 1b — Apply tokens to the real HTML files (Phase 4) — ✅ DONE

```
Read tokens.md and buildspec.md §2 (ChannelSwitcher spec) and §5 (Connect
re-skin task list) and §6 (Personal & Property build task list).

You may open design baseline/connect.html and design baseline/
personal-and-property.html to see how these color decisions were validated,
but do NOT copy those files, import them, or treat them as part of the
build — they are reference only and explicitly out of scope.

Apply the following to the REAL files:

1. commercial/index.html — no color change. Only fix the ChannelSwitcher
   component: set its border and text to navy blue (--navy, #001C44) while
   on the home page, so the other two toggle options (Connect, Personal &
   Property) remain visible against the light home-page background.

2. connect/index.html — full re-skin per buildspec.md §5: replace
   #EAB308/#FACC15 with real --gold/--gold-soft tokens; flip hero,
   commission strip, and legacy CTA to gold-dominant/navy-accent; fix
   low-contrast gold-as-text spots (step numbers, FAQ plus-icon, eyebrow
   labels) to navy; add a dark-on-light navbar override; fix logo paths to
   logo-navy.png/logo-white.png. Remove any remaining peach.

Do not touch Personal & Property yet — it doesn't have real page content
built (see Prompt 5 for that). Show me a diff before writing changes to
either file.
```

---

## Prompt 2 — Site architecture / nav (Phase 2) — ⬜ NOT RUN (optional — nav was built anyway inside Prompt 5, this just produces the standalone spec doc)

```
Read Master Information Architecture & Sitemap.md §2A, §2B, and §11 in
full, plus the existing commercial/components/navbar.html and
commercial/components/footer.html.

Produce nav-spec.md describing:
1. The ChannelSwitcher component: it must ALWAYS show all three channels,
   on every page, regardless of which one is current — Home icon +
   "Home" text (never the word "Commercial"), Connect, and Personal &
   Property. This overrides any earlier "hide the current channel" logic.
   It renders inside the SAME single header row as the logo and primary
   nav — never as a separate tier. Include a clear .active CSS state
   (underline, bold, or a background/border tinted to that channel's own
   accent color from tokens.md) on whichever of the three matches the
   current page. Verify contrast for all three entries against each
   channel's own background per buildspec.md §2.
2. The Products / Why Us / Partners primary nav (Commercial), each mapped
   to its structural role AND the pending Matt-approval placeholder
   wording from plan.md §4 ("What Funding Do I Need?" / "Why Trade
   Funding?" / "Offer Funding Solutions") — flag clearly that final
   wording is still pending sign-off.
3. The footer structure: two columns, single componentized ACL/legal
   instance (FooterLegal global), de-duplicated T&Cs/Credit Guide links.

Do NOT remove or delete any existing product HTML pages or routes. Do NOT
build the Connect or Personal & Property nav yet — those come from
Master Information Architecture & Sitemap.md §6 and §7 directly, which
are already fully specified; just confirm your nav-spec.md is consistent
with them.
```

---

## Prompt 3.1 — Research (Phase 3.1) — ✅ DONE

```
Read docs/Executive Questionnaire for Personal and Property and Connect.docx,
plan.md §5, buildspec.md §5 and §6, and docs/SEO_Audit_Report.md.

Produce research-notes.md structured by channel (Commercial / Connect /
Personal & Property / Shared), with one section per page from plan.md §5.1.
For each page, include: the strategic input available (quote or closely
paraphrase the questionnaire where it applies — attribute it), the relevant
SEO guardrails from SEO_Audit_Report.md, and an explicit "STILL NEEDED"
line for anything not yet answered (Broker Portal specifics, Home hero
sign-off, the three hard blockers — address, lender logos, GoogleReviews
count). Do not draft any actual page copy in this step — reference
document only.
```

## Prompt 3.2 — Copy creation (Phase 3.2) — ✅ DONE

```
Read research-notes.md, plan.md §5.0 (locked messaging direction + copy-
style guardrails), and buildspec.md §5–§6.

Draft page-level copy for every page listed in plan.md §5.1, organized by
channel (Commercial / Connect / Personal & Property / Shared), in a single
copy-final.md file. For each page include: page name, URL, channel, hero/
headline copy, key body copy or section summaries (not full page HTML),
and CTA wording. Where a page has a blocker (Home hero sign-off, Credit
Guide/Privacy address, GoogleReviews count, Broker Portal commission
detail), write a clearly labeled [DRAFT — PENDING SIGN-OFF] or
[BLOCKED — NEEDS: ...] placeholder instead of guessing.

Apply the SEO guardrails and copy-style constraints from research-notes.md
throughout as you draft each page, not as a final pass.

Output copy-final.md at the project root, ready to be added back into the
project zip before Phase 4/5 building begins.
```

## Prompt 3b — Apply approved copy — ✅ DONE (at least the Commercial home hero — spot-check the rest)

```
Read copy-final.md.

Update the hero section and page headings across commercial/index.html,
connect/index.html, and the Personal & Property pages (once built — see
Prompt 5) to use this approved copy, replacing any placeholder text.
Do not touch anything still marked [BLOCKED] in copy-final.md — leave
the existing placeholder in place for those specific sections. Do not
alter layout, only copy. Show me a diff before writing changes.
```

---

## Prompt 4 — Design component inventory (Phase 4) — ⬜ NOT RUN (optional, doesn't block Phase 7 but speeds it up)

```
Read tokens.md, commercial/shared-styles.css, commercial/product-styles.css,
and connect/styles/main.css.

Produce /design/components.md: every distinct reusable UI block across
both real sites (hero, product tile, lender logo strip, testimonial card,
CTA banner, footer, sticky nav, calculator widget, ChannelSwitcher, etc.)
with which channel(s) use it and which existing file to pull reference
markup/CSS from. Do not reference design baseline/ files here — inventory
only what exists in the real, in-scope files.

This becomes the checklist for the React component build in Phase 6.
```

---

## Prompt 5 — Page production, all channels (Phase 5) — ✅ DONE

```
Read plan.md §7 (all of 7.1–7.6) and buildspec.md §10 in full before
touching any file.

Standing rules for every page you touch or create in this step, no
exceptions:
- Header/footer markup must be byte-for-byte identical to
  commercial/components/navbar.html and commercial/components/footer.html
  — same wrapper divs, same classes, same order. Diff against the
  canonical component after each page.
- Every href/src (nav links, footer links, CSS <link>, images) must be
  root-relative (e.g. /connect/about.html, /commercial/assets/
  logo-navy.png) — never relative (../, bare filenames).
- Replace every em-dash (—) with a spaced hyphen ( - ), not a bare hyphen.
- Build the ChannelSwitcher per Prompt 2's updated spec: all three
  channels always visible, with the .active state on the current one.

Then, specifically:

1. Personal & Property (net-new): build home, owner-occupied-home-loans,
   investment-property-loans, refinancing, construction-loans,
   commercial-property-finance, smsf-loans, personal-loans,
   debt-consolidation, apply, and about under personal-and-property/,
   using copy-final.md for any copy it covers and the color/button
   decisions from Prompt 1b. Flag, don't resolve, the
   self-employed-home-loan.html channel-placement question (hit-list
   item 43) and the commercial-property-finance overlap noted in
   buildspec.md §6.

2. Guides Hub + guide articles + calculators (previously missing from
   this phase): build/confirm the /guides/ hub landing page linking out
   to every guide in Master Information Architecture & Sitemap.md §4
   (compare-business-loans, best-line-of-credit,
   business-line-of-credit-guide, business-charge-card-guide,
   business-overdraft-guide, business-term-loans-guide,
   business-loan-bad-credit, invoice-vs-debtor-finance, lease-vs-buy),
   using copy-final.md where it has copy for these. Confirm both
   calculators (repayment-calculator.html, equipment-calculator.html)
   are present, correctly linked from the hub and their related product
   pages, and follow the same header/path/em-dash rules above.

3. Commercial and Connect reconciliation: apply copy-final.md, the
   known fix list (broken reviews carousel, "Unlock your full report"
   button, "How it works" panel alignment, tile sizing, payoff-line
   reword, Resources-page image swap), and remove all remaining
   "Fundit" references from Connect.

Show me a diff before writing changes to any existing file; new files
can be created directly but flag each one you add.
```

**⚠️ Known side effect of having run this before Prompt 5-fix:** because `commercial/components/navbar.html` still had the two-tier header at the time this ran, every new page this prompt created (all 11 Personal & Property pages, the Guides Hub) copied that same two-tier structure faithfully — that's the header-parity rule working correctly, just propagating a bug that existed in the canonical source at the time. This isn't a new mistake; it's why Prompt 5-fix below now has a wider blast radius than it did when it was first written.

---

## Prompt 5-fix — Collapse the two-tier header back into one strip — ✅ DONE (with one miss — see Prompt 6.1)

*(Your `commercial/components/navbar.html` builds the header as two tiers — a `.utility-bar` strip containing only the ChannelSwitcher, sitting above the `.navbar` strip with the logo and primary nav. Because Prompt 5 ran first, this has now been copied into 62 of your 66 HTML files. This prompt fixes the canonical component first, then re-propagates the fix everywhere it's needed — it does not rebuild anything from scratch.)*

```
Read plan.md §4 and §7.2 and buildspec.md §2 — both specify a SINGLE
header strip, not two tiers.

Step 1: Rewrite commercial/components/navbar.html to collapse the current
.utility-bar + .navbar two-tier structure into one row:
logo (left) -> primary nav: Products / Why Us / Resources / Partners
(center) -> ChannelSwitcher (right), showing Home icon+text / Connect /
Personal & Property with the .active state on the current one. Remove
the .utility-bar div entirely and move the channel-switch markup inside
.navbar__inner, adjusting flexbox/grid so it sits at the right edge of
the same row as the logo and nav links (collapsing to the existing
hamburger-accessible mobile list, same as today). Show me this rewritten
file first, before touching anything else.

Step 2 (after I approve step 1): find every HTML file in commercial/,
connect/, and personal-and-property/ that still contains the old
.utility-bar two-tier structure (grep for "utility-bar" — as of your last
audit this was 62 of 66 files) and replace its header with the corrected
single-strip version, adjusting the ChannelSwitcher's .active state and
any channel-specific nav links per page as needed. Do this in batches by
folder (all of commercial/ first, then connect/, then
personal-and-property/), showing me a sample diff from each folder before
continuing to the next.

Step 3: re-run the header/footer parity check (diff every page's header
against the corrected canonical component) as a final gate.
```

---

## Prompt 5.5 — Pre-conversion cleanup (Phase 5.5) — ✅ DONE

```
Read plan.md §8 and buildspec.md §11 in full.

1. Confirm the "personal and property" folder (spaces) no longer exists
   in this repo — it doesn't as of the last check, but re-confirm before
   proceeding, since it re-appearing would break Vercel routing.

2. Confirm commercial/debtor-finance.html's unique content has been
   merged into commercial/invoice-finance.html (per Master Information
   Architecture & Sitemap.md §9), then delete the file. Confirm
   commercial/trade-funding-website-application.html is superseded by
   apply.html, then delete it. Confirm commercial/resources.html's
   content is fully absorbed into the /guides/ hub (already built in
   Prompt 5), then delete it. Document the corresponding redirect for
   each (/debtor-finance/ → /invoice-finance/, old application page →
   /apply/, /resources/ → /guides/) in a running list for Phase 6 — do
   not configure the actual redirects yet, that's a Phase 6 task.

3. Audit for unused assets (orphaned images, unreferenced CSS rules,
   unused JS) across commercial/, connect/, and personal-and-property/.
   List candidates rather than deleting anything not explicitly named
   in step 2 — flag for my confirmation first.

4. Re-run the header/footer parity check from Prompt 5-fix across every
   remaining page as a final gate.

5. Produce docs/cleanup-report.md: what was deleted and why, what's
   flagged but unconfirmed, and any header/path issues found and fixed.

Do not begin any Payload/Next.js scaffolding (Prompt 6) until this
report exists and I've confirmed the flagged items.
```

---

## Prompt 6.1 — Finish header propagation + trust bar + locked nav labels — 🔴 NOT RUN, RUN THIS FIRST

```
Read plan.md §9.1 and buildspec.md §12.

1. Fix commercial/contact.html — wait, first: move contact.html from the
   repo root into commercial/contact.html (it's the last root-level page
   and it's why the earlier header-propagation batching missed it).
   Rebuild its header using the corrected single-strip navbar.html
   component. Update every inbound link to it — check
   personal-and-property/*.html specifically, since those link to it
   directly — to the new root-relative path (/commercial/contact.html).

2. Build/fix the trust bar (star rating, review count, ACL number, AFCA
   Member, "70+ Lenders") as a persistent element pinned at the very top
   of every page, above the header row, identical across Commercial,
   Connect, and Personal & Property. Add it to the canonical header
   component so it propagates the same way the rest of the header does.
   Do not implement it as a second navigation tier — it's a thin trust
   strip, not a switcher or menu.

3. Update the primary nav labels to their now-locked final wording:
   "What Funding Do I Need?" / "Offer Funding Solutions" /
   "Why Trade Funding?" (replacing "Products" / "Partners" / "Why Us"
   as visible labels — keep the underlying structure/dropdowns the same,
   only the visible label text changes).

Show me a diff of commercial/components/navbar.html first, then
propagate to every page in batches by folder (commercial/, connect/,
personal-and-property/), same as the last header fix.
```

---

## Prompt 6.2 — Remove what shouldn't be in the deployable tree — ⬜ NOT RUN

```
Read plan.md §9.2.

1. Relocate design baseline/ and connect/tests/calculator-test.html to
   a location excluded from the Vercel build (add a .vercelignore entry
   or move them to a top-level _internal/ folder — your call, tell me
   which you're doing). Rename design baseline/ to
   _DO-NOT-DEPLOY-design-baseline/ regardless of where it ends up.

2. Remove the console.log at commercial/product-page.js:225.

Show me the diff/move plan before executing.
```

---

## Prompt 6.3 — Path & templating debt — ⬜ NOT RUN

```
Read plan.md §9.3 and buildspec.md §12.

1. Fix the 9 files in commercial/guides/ still using relative paths
   (src="../cookie-consent.js") — change to /commercial/cookie-consent.js
   in all 9. List the 9 files you changed.

2. Replace inline style="" attributes that duplicate tokens.md values
   (starting with commercial/index.html's 291 instances) with
   token-driven utility classes (.icon--sky, .icon--peach, etc.) added
   to shared-styles.css. Do this file by file — show me a diff of
   commercial/index.html first before continuing to the rest.

Do NOT make the templating-layer decision yourself (11ty/Astro/SSI vs.
proceeding straight to Phase 7) — flag it to me as an open question per
plan.md §9.3, I'll decide with the team.
```

---

## Prompt 6.4 — Accessibility pass — ⬜ NOT RUN

```
Read plan.md §9.4.

1. Wrap the masthead in <header> and primary page content in <main> at
   the canonical component/template level, then re-propagate sitewide
   (same batched-by-folder approach as prior header fixes).
2. Wrap each footer badge (AFCA, CAFBA, Fintech Australia, ACL) in an
   <a> pointing to its real verification/membership page — tell me if
   any of these URLs aren't obvious so I can confirm them.
3. Copy Connect's aria-expanded hamburger-toggle pattern into
   Commercial's hamburger handler (commercial's currently only toggles
   a CSS class).
4. Replace the native title="" tooltip on apply.html's "What's S.T.A.R.?"
   explainer with a click/tap-accessible popover component.
5. Fix apply.html's 4 separate <h1> elements — use one page-level <h1>
   ("Apply for Funding"), demote step titles to <h2>, or use aria-live
   for step-change announcements. Your call which approach fits the
   existing funnel markup best — show me before/after.

Show me a diff before writing changes to any file.
```

---

## Prompt 6.5 — SEO/meta hygiene — ⬜ NOT RUN

```
Read plan.md §9.5 and docs/SEO_Audit_Report.md.

1. Add a <meta name="robots"> (and confirm <title>/description) block
   to every page missing one — template it once, apply sitewide, skip
   404.html.
2. Diff the live file tree against commercial/sitemap.xml. Add the
   missing pages (privacy.html, terms.html, credit-guide.html,
   broker-portal.html) and align every URL to the extensionless
   canonical format already used in <link rel="canonical"> tags
   elsewhere on the site.

Show me the sitemap.xml diff before writing it.
```

---

## Prompt 6.6 — Nav/CTA routing fixes — ⬜ NOT RUN

```
Read plan.md §9.6.

1. Route the "Partners" nav item through Connect instead of the legacy
   /commercial/broker-portal.html — update the nav link, and cross-link
   Broker Portal from within Connect's partner page so it isn't lost.
2. Add a "Become a Partner" CTA somewhere visible in commercial/ (nav or
   footer, your call) linking into Connect.
3. Reduce the ACL number "387856" in the footer from 3 occurrences down
   to 1–2 (badge + one legal reference max) — remove the redundant
   copyright-line instance.

Show me a diff before writing changes.
```

---

## Prompt 6.7 — Personal & Property animation parity — ⬜ NOT RUN

```
Read plan.md §9.7 and tokens.md §1.5.

Apply the same IntersectionObserver-based reveal treatment (fade-in +
16px rise, staggered 100ms delays, respecting prefers-reduced-motion)
used on Commercial and Connect to every Personal & Property page. Reuse
the existing reveal script/CSS classes rather than writing a new
implementation.
```

---

## Prompt 6.8 — Templating decision + fix report (do this in Claude web chat, not Claude Code)

*(This is a discussion, not a code change — surface the real tradeoff from plan.md §9.3 and decide with the team before Claude Code produces the closing report.)*

```
Given everything fixed in Prompts 6.1–6.7, help me think through the
templating-layer decision from plan.md §9.3: adopt a minimal templating
system (11ty, Astro, or server-side includes) before any further raw
HTML production, versus treating Phase 6 as the last raw-HTML fix pass
and moving straight into Phase 7's Next.js/Payload migration. What are
the real tradeoffs given we're already committed to Payload/Next.js
in Phase 7?
```

Once decided, have Claude Code produce the closing report:

```
Read plan.md §9 in full.

Produce docs/fix-report.md documenting everything fixed across Prompts
6.1–6.7: what was fixed, in what order, with before/after notes for the
accessibility and SEO items specifically (these are hard to verify from
a screenshot alone). Include the templating-layer decision reached in
6.8 and its rationale. Do not begin Phase 7 until I've reviewed this
report.
```

---

## Prompt 7 — Payload CMS scaffold (Phase 7) — ⬜ NOT STARTED

```
Read buildspec.md §2 and §3 in full.

Scaffold a new Next.js + Payload CMS app in /site as ONE app with THREE
route groups: app/(commercial)/, app/connect/, app/personal-and-property/
— sharing one Payload backend. Do not scaffold this as three separate
apps or three Vercel projects.

Set up the collections and globals from buildspec.md §3 (pages, guides,
teamMembers, lenderLogos, testimonials; header, FooterLegal, siteSettings
globals), using the `parent` relationship field pattern (not a `category`
collection) per Master Information Architecture & Sitemap.md §11.

Local dev config only — do not touch deployment/Vercel yet. Confirm the
scaffold runs locally with all three route groups resolving before moving
to content migration.
```

---

## Prompt 8 — Migrate one page end-to-end (Phase 7) — ⬜ NOT STARTED

```
Convert exactly one page — commercial/business-term-loans.html — into a
Payload-backed page using the collections scaffolded in Prompt 7 and the
component inventory in design/components.md (if Prompt 4 was run — if
not, work directly from the existing HTML/CSS instead).

Show me:
1. The Payload collection entry (content) this page becomes, including
   its `parent` relationship value ("Business Loans")
2. The React template/component that renders it, with breadcrumb output
   (Home > Business Loans > Business Term Loans)
3. A local preview

Do not touch any other HTML file until I approve this pattern.
```

---

## Prompt 9 — Batch-convert remaining pages — ⬜ NOT STARTED

```
Read docs/cleanup-report.md first to confirm the file tree is clean and
no retired files remain.

Using the approved pattern from business-term-loans.html, convert the
remaining commercial/*.html product and guide pages, then connect/*.html,
then the Personal & Property pages built in Prompt 5 — one page at a
time, committing after each. Preserve every URL exactly as listed in
Master Information Architecture & Sitemap.md, and apply the Duplicate
Resolution Log (§9) redirects exactly as specified, including the ones
flagged in cleanup-report.md — do not invent additional redirects. Stop
and flag me if any page doesn't cleanly fit the established pattern.
```

---

## Prompt 10 — Vercel deploy (Phase 7) — ⬜ NOT STARTED

```
Read buildspec.md §8.

Set up vercel.json and .env.example for deploying /site as ONE Vercel
project with sub-path routing for all three channels, sharing one
Payload backend. Do not set up multiple projects or subdomains. Do not
run an actual deploy — prepare the config and give me the exact CLI
commands to run myself.
```

---

## General rules (unchanged)

- Tell Claude Code which files to read *before* it edits anything.
- Ask for a diff before large edits, especially anything touching more than one file.
- Never delete existing pages/routes to "declutter" — only delete files explicitly named as retired in `plan.md`/`buildspec.md` (and only after Phase 5.5 confirms it).
- One phase per prompt.
- Never treat `design baseline/` as anything other than a color/button reference — it is not part of the build.
- Header/footer markup must be identical across every page; every link/asset path must be root-relative; em-dashes become spaced hyphens (` - `); no spaces in any folder or file name.
