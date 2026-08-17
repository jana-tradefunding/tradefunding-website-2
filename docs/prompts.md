# Prompt Library — Trade Funding Rebuild

**Status: v5 — reordered into strict chronological (run-this-then-this) order, with a status snapshot based on the zip you most recently sent.** Statuses below reflect what's actually in your files right now, not what should theoretically be done — re-check after every session, since this snapshot goes stale the moment you run something new.

**Reminder before every session:** `design baseline/` is a **color-and-button reference only**. Never point Claude Code at it as something to copy, import, or deploy.

---

## Status snapshot (from your latest zip)

| # | Prompt | Status | Evidence |
|---|---|---|---|
| 1 | Branding tokens | ✅ Done | `tokens.md` exists at root, locked |
| 1b | Apply tokens to real HTML | ✅ Done | `connect/index.html` uses real `--gold` tokens; `personal-and-property/styles/main.css` defines `--peach` |
| 0 | Hit list (`hitlist.md`) | ⬜ Not run | No `hitlist.md` found — low priority, its content is already folded into `plan.md` §2, but produce it if you want a standalone tracker |
| 2 | Nav spec (`nav-spec.md`) | ⬜ Not run | No `nav-spec.md` found — the nav itself got built anyway inside Prompt 5, but the standalone spec doc doesn't exist |
| 3.1 | Research (`research-notes.md`) | ✅ Done | `docs/research-notes.md` exists |
| 3.2 | Copy creation (`copy-final.md`) | ✅ Done | `docs/copy-final.md` exists |
| 3b | Apply approved copy | ✅ Done (at least partially) | Commercial home hero copy is in place with correctly spaced hyphens — spot-check other pages before assuming it's everywhere |
| 4 | Component inventory (`design/components.md`) | ⬜ Not run | No `design/components.md` found — low priority, doesn't block Phase 6 but makes it slower |
| 5 | Page production | ✅ Done — **you ran this one** | `personal-and-property/*` (11 pages), `commercial/guides/index.html` hub, both calculators all present |
| 5-fix | Collapse two-tier header | 🔴 **Not run — run this next** | `commercial/components/navbar.html` still has the `.utility-bar` + `.navbar` two-tier structure, and **because Prompt 5 ran first, it's now been copied into 62 of your 66 HTML files** — see the updated Prompt 5-fix below, scope has grown since you last saw this prompt |
| 5.5 | Pre-conversion cleanup | ⬜ Not run | `personal and property/` (spaces) duplicate is already gone — good, no action needed there. But `commercial/debtor-finance.html` and `commercial/trade-funding-website-application.html` are both still present and need secure deletion once redirects are confirmed |
| 6–9 | Payload/Next.js/Vercel | ⬜ Not started | No `/site` app scaffold present yet — correctly sequenced after 5-fix and 5.5 |

**What this means for you right now:** run **Prompt 5-fix next**, before anything else — it now needs to touch far more files than originally scoped, since Prompt 5 propagated the two-tier header into all the new Personal & Property and Guides pages too. Then run Prompt 5.5 (cleanup). Prompts 0, 2, and 4 are optional documentation steps you can go back for later — they don't block anything downstream.

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

## Prompt 4 — Design component inventory (Phase 4) — ⬜ NOT RUN (optional, doesn't block Phase 6 but speeds it up)

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

## Prompt 5 — Page production, all channels (Phase 5) — ✅ DONE (you ran this one — see 5-fix below for the fallout)

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

## Prompt 5-fix — Collapse the two-tier header back into one strip — 🔴 NOT RUN, RUN THIS NEXT

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

## Prompt 5.5 — Pre-conversion cleanup (Phase 5.5) — ⬜ NOT RUN — run after 5-fix

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

## Prompt 6 — Payload CMS scaffold (Phase 6) — ⬜ NOT STARTED

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

## Prompt 7 — Migrate one page end-to-end (Phase 6) — ⬜ NOT STARTED

```
Convert exactly one page — commercial/business-term-loans.html — into a
Payload-backed page using the collections scaffolded in Prompt 6 and the
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

## Prompt 8 — Batch-convert remaining pages — ⬜ NOT STARTED

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

## Prompt 9 — Vercel deploy (Phase 6) — ⬜ NOT STARTED

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
