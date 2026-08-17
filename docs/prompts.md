# Prompt Library — Trade Funding Rebuild

**Status: v2 — updated for the single-app/sub-path architecture, finalized `tokens.md`, the updated Master IA doc, and the deferred-blockers sequencing.** Run these one at a time inside your project folder, which should now contain `commercial/`, `connect/`, `design baseline/` (reference only — see note below), `docs/`, `tokens.md`, `Master Information Architecture & Sitemap.md`, `plan.md`, `buildspec.md`, and `CLAUDE.md`.

**Reminder before every session:** `design baseline/` is a **color-and-button reference only**. Never point Claude Code at it as something to copy, import, or deploy — only as something to read for color/contrast decisions that then get applied to the real `commercial/`, `connect/`, and new Personal & Property files.

---

## Prompt 0 — Hit list (Phase 0) — already run once; re-run only if new comments arrive

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

## Prompt 1 — Branding tokens (Phase 1) — DONE, tokens.md already exists

No action needed here — `tokens.md` is finalized. If you need to regenerate or extend it (e.g. a fourth channel is added later), read the existing `tokens.md` first and treat every value in it as locked unless I say otherwise.

---

## Prompt 1b — Apply tokens to the real HTML files (Phase 4 — new, replaces the old "design baseline" step)

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

## Prompt 2 — Site architecture / nav (Phase 2)

```
Read Master Information Architecture & Sitemap.md §2A, §2B, and §11 in
full, plus the existing commercial/components/navbar.html and
commercial/components/footer.html.

Produce nav-spec.md describing:
1. The ChannelSwitcher component's behavior on each of the three route
   groups (per §2A), including the navy-blue contrast fix noted in
   plan.md §4.
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

## Prompt 3.1 — Research (Phase 3.1 — do in Claude web chat, not Claude Code)

*(Run this first. The Executive Questionnaire has already been returned with real strategic input for Personal & Property and Connect — this step organizes it into a page-ready reference, it doesn't generate it from scratch.)*

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

## Prompt 3.2 — Copy creation (Phase 3.2 — do in Claude web chat, not Claude Code)

*(Run this once `research-notes.md` exists and you've chased down anything marked "STILL NEEDED" that you can realistically get before drafting.)*

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

## Prompt 3b — Apply approved copy (after copy-final.md is signed off)

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

## Prompt 4 — Design component inventory (Phase 4)

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

## Prompt 5 — Personal & Property page production (Phase 5, net-new)

```
Read Master Information Architecture & Sitemap.md §7 in full and
buildspec.md §6.

Produce the Personal & Property page skeleton as static HTML (matching
the existing commercial/ and connect/ conventions) for: home,
owner-occupied-home-loans, investment-property-loans, refinancing,
construction-loans, commercial-property-finance, smsf-loans,
personal-loans, debt-consolidation, apply, and about — all under a new
personal-and-property/ folder, using the color/button decisions from
Prompt 1b (peach-dominant, navy accent, white hero card panel, navy
icons).

Use placeholder copy clearly marked [DRAFT — pending Executive
Questionnaire content] for anything beyond structural headings — do not
invent substantive product copy for the 8 loan types from the
design-baseline reference file, since that file is styling-only.

Flag, rather than resolve, the self-employed-home-loan.html channel
placement question (hit-list item 43) and the commercial-property-finance
overlap with /second-mortgage/ and /self-employed-home-loan/ noted in
buildspec.md §6.
```

---

## Prompt 6 — Payload CMS scaffold (Phase 6, core conversion — architecture updated)

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

## Prompt 7 — Migrate one page end-to-end (Phase 6, do before batch-converting)

```
Convert exactly one page — commercial/business-term-loans.html — into a
Payload-backed page using the collections scaffolded in Prompt 6 and the
component inventory in design/components.md.

Show me:
1. The Payload collection entry (content) this page becomes, including
   its `parent` relationship value ("Business Loans")
2. The React template/component that renders it, with breadcrumb output
   (Home > Business Loans > Business Term Loans)
3. A local preview

Do not touch any other HTML file until I approve this pattern.
```

---

## Prompt 8 — Batch-convert remaining pages

```
Using the approved pattern from business-term-loans.html, convert the
remaining commercial/*.html product and guide pages, then connect/*.html,
then the Personal & Property pages built in Prompt 5 — one page at a
time, committing after each. Preserve every URL exactly as listed in
Master Information Architecture & Sitemap.md, and apply the Duplicate
Resolution Log (§9) redirects exactly as specified — do not invent
additional redirects. Stop and flag me if any page doesn't cleanly fit
the established pattern.
```

---

## Prompt 9 — Vercel deploy (single project — updated)

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
- Never delete existing pages/routes to "declutter."
- One phase per prompt.
- Never treat `design baseline/` as anything other than a color/button reference — it is not part of the build.
