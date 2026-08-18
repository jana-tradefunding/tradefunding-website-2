# Prompt Library — Trade Funding Rebuild

**Status: v9 — Phase 8.1–8.3 are done, and both regressions (Prompts 8.1-fix, 8.3-fix) are now fixed and verified in-browser. A new Prompt 8.11 (Vercel deploy for stakeholder review) is added before Phase 9.**

**Reminder before every session:** `_internal/_DO-NOT-DEPLOY-design-baseline/` is a **color-and-button reference only**. Never point Claude Code at it as something to copy, import, or deploy.

**Next up: Prompt 8.4 (CSP/HSTS sitewide).**

---

## Status snapshot (from your latest zip + screenshots)

| # | Prompt | Status | Evidence |
|---|---|---|---|
| 1 | Branding tokens | ✅ Done | `tokens.md` exists at root, locked |
| 1b | Apply tokens to real HTML | ✅ Done | `connect/index.html` uses real `--gold` tokens; `personal-and-property/styles/main.css` defines `--peach` |
| 0 | Hit list (`hitlist.md`) | ⬜ Not run | Optional, low priority |
| 2 | Nav spec (`nav-spec.md`) | ⬜ Not run | Optional — the nav itself got built anyway inside Prompt 5 |
| 3.1 / 3.2 / 3b | Copy (research/creation/apply) | ✅ Done | `docs/research-notes.md`, `docs/copy-final.md` exist |
| 4 | Component inventory | ⬜ Not run | Optional, doesn't block Phase 9 |
| 5 / 5-fix / 5.5 | Page production, header fix, cleanup | ✅ Done | Confirmed via git log and file checks |
| 6.1–6.8 | Build quality & architecture fix pass | ✅ Done | Six Phase 6 commits confirmed via `git log` |
| 7.0–7.12 | Pre-Migration Remediation | ✅ Done, with 3 confirmed gaps | See notes on Prompts 7.3, 7.7, 7.9, 7.11 |
| 7.13 | Dependency fixes + tests + closing report | 🔴 Never ran | Folded into Phase 8.9/8.10 |
| 8.1–8.3 | Design/aesthetic/animation fixes | ✅ Done, **2 regressions found and fixed** | See Prompts 8.1-fix and 8.3-fix below |
| **8.1-fix / 8.3-fix** | **Regression fixes** | ✅ **Done** | Connect `main.css` version bumped to `?v=20260819-1` across all 8 pages; `.navbar__link--dropdown-trigger` given explicit literal values; both verified in-browser via a static preview server |
| 8.4–8.10 | Remaining Phase 8 fix work | ⬜ Not started | Run next |
| **8.11** | **Vercel deploy for stakeholder review (NEW)** | ⬜ Not started | Deploys the current static site as-is, before Phase 9 |
| 9–12 | Payload/Next.js/Vercel | ⬜ Not started | Correctly sequenced after Phase 8 |

**What actually happened in 8.1 and 8.3, and how each was fixed:**
- **8.1's hero-padding fix was correct in source** (`connect/styles/main.css`'s `.hero` rule has the right `calc()` formula) — but `connect/index.html` and 7 other Connect pages still referenced `main.css?v=20260811-1`, a cache-busting version string predating the fix (file last edited 2026-08-18, one day after that stamp). Bumped to `?v=20260819-1` across all 8 pages. Swept the repo for other stale `?v=` references — none found; this was the only one.
- **8.3's dropdown accessibility fix (converting the trigger to a `<button>`) broke visual parity** — `.navbar__link--dropdown-trigger` used `font: inherit; color: inherit;`, but the button carries no `.navbar__link` class, so it never actually inherited those values from a matching source. Replaced with the literal values from `.navbar__link` in `shared/styles/chrome.css` plus a matching `:hover`. Computed styles now match `.navbar__link` (`Compare Options`) exactly. Checked for other `<a>`→`<button>` conversions from Phase 8.3 — only this one exists; the hamburger triggers are icon-only and unaffected.

Both verified in an actual rendered page via a temporary static server, not just by reading the stylesheet. Committed as `8d9df92`.

**What this means for you right now:** proceed to **Prompt 8.4** (CSP/HSTS sitewide), then 8.5 → 8.10, followed by the new **Prompt 8.11** (Vercel deploy for stakeholder review) before Phase 9.

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

## Prompt 4 — Design component inventory (Phase 4) — ⬜ NOT RUN (optional, doesn't block Phase 9 but speeds it up)

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

## Prompt 6.1 — Finish header propagation + trust bar + locked nav labels — ✅ DONE (nav wording superseded again in Phase 7 — see Prompt 7.2)

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

## Prompt 6.2 — Remove what shouldn't be in the deployable tree — ✅ DONE

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

## Prompt 6.3 — Path & templating debt — ✅ DONE

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

## Prompt 6.4 — Accessibility pass — ✅ DONE

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

## Prompt 6.5 — SEO/meta hygiene — ✅ DONE

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

## Prompt 6.6 — Nav/CTA routing fixes — ✅ DONE

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

## Prompt 6.7 — Personal & Property animation parity — ✅ DONE (assumed — confirm if not yet verified)

```
Read plan.md §9.7 and tokens.md §1.5.

Apply the same IntersectionObserver-based reveal treatment (fade-in +
16px rise, staggered 100ms delays, respecting prefers-reduced-motion)
used on Commercial and Connect to every Personal & Property page. Reuse
the existing reveal script/CSS classes rather than writing a new
implementation.
```

---

## Prompt 6.8 — Templating decision + fix report — ✅ DONE (confirm `docs/fix-report.md` reflects the decision made)

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

## Prompt 7.0 — Commit current work — ✅ DONE

```
Check git status. If there are uncommitted changes, commit them now with
a sensible message describing what they are. If the tree is already
clean, confirm that and move on — don't force an empty commit.
```

---

## Prompt 7.1 — Address + email fixes (Commercial) — ✅ DONE

```
Read plan.md §10.1.

1. Fill in all 4 confirmed placeholder spots — commercial/credit-guide.html
   (body list item + footer contact item) and commercial/terms.html
   (§13 "Post" reference + footer contact item) — with:

   Office Address: Level 8, 387 George Street, Sydney, NSW, 2000

   Label it explicitly "Office Address" in every spot — not "Registered
   Address," not unlabeled.

2. Replace every occurrence of hello@tradefunding.com.au with
   support@tradefunding.com.au, sitewide. Connect already uses support@
   consistently — confirm that and leave it untouched. Personal & Property
   (all 11 pages) and roughly half of Commercial's pages still use hello@.

3. Do NOT touch anything related to hello@ actually routing/forwarding to
   support@ — that's a separate, still-unconfirmed operational question
   for Ben Lyons (inbox access), not a site-content change. Leave
   CLAUDE.md's note on this exactly as-is.

Show me a diff before writing changes; list every file touched by the
email replacement in step 2.
```

---

## Prompt 7.2 — Update Commercial's top-level nav wording — ✅ DONE

```
Read plan.md §10.2.

Update Commercial's primary nav labels to their new, final wording:
Funding Solutions | Compare Options | Partners | Why Choose Us?

Mapping (confirm each against the live markup before changing):
- "What Funding Do I Need?" -> "Funding Solutions" (same dropdown/structure)
- "Offer Funding Solutions" (currently routes to /connect/for-vendors.html)
  -> "Partners" (same destination)
- "Why Trade Funding?" -> "Why Choose Us?"
- "Compare Options" is a new fourth item with no existing nav slot -
  do NOT silently pick its destination. Flag it to me: my best guess is
  comparison-report.html, but confirm before wiring the link. Also flag,
  don't decide, where the Guides Hub (/guides/) and about.html should
  live now that the top-level list doesn't name them.

Apply consistently across every Commercial page's header and any
footer/mobile-nav mirror of these links. Show me a diff of the canonical
navbar.html first, then propagate.
```

---

## Prompt 7.3 — HTML-include build step (architecture fix, highest leverage — do before further edits) — ⚠️ DONE, BUT INCOMPLETE — only 3/66 pages actually adopted the marker pattern; finished in Phase 8.1

```
Read plan.md §10.4 item 1 and architecture-review-report.md §4.2.

Add a minimal build-time HTML-include step (e.g. a small Node script
using posthtml-include, or a five-line custom script) that replaces
<!-- include:navbar --> / <!-- include:footer --> style markers with the
canonical component's contents at commit or CI time, instead of the
current manual copy-paste-into-62-files approach. connect/package.json
already declares "type": "module" and Node >=20 - use that, no new
runtime dependency needed for the site itself (devDependency only, if
any).

Do not run this across all 62 files as a one-shot rewrite - first show
me the script working correctly against 2-3 sample pages (one per
channel), then propagate once I approve the approach.
```

---

## Prompt 7.4 — Extract shared chrome CSS — ✅ DONE

```
Read plan.md §10.4 item 2 and architecture-review-report.md §1.1.

Extract the header/footer/ChannelSwitcher/button/container CSS that
Connect and Personal & Property currently pull from
commercial/shared-styles.css into a new, channel-agnostic
shared/styles/chrome.css, referenced by all three channels.
commercial/shared-styles.css keeps only genuinely Commercial-specific
rules after the split. No visual change expected - this is a file-
structure fix, not a redesign. Show me a diff before writing changes,
and confirm all three channels still render identically after the move.
```

---

## Prompt 7.5 — Extract shared serverless library (`_lib/`) — ✅ DONE

```
Read plan.md §10.4 item 3 and architecture-review-report.md §2.1.

Create connect/api/_lib/ with origin-check.js (fromAllowedOrigin),
form-token.js (issueToken/verifyToken), rate-limit.js (stub for now -
the real Upstash-backed implementation lands in Prompt 7.6), and
html-escape.js (escapeHtml) - extracted from the existing logic in
connect/api/form-token.js and connect/api/request-call.js. Update both
existing files to import from _lib/ instead of containing this logic
inline. Do not change behavior - this is a pure extraction. Show me a
diff before writing changes.
```

---

## Prompt 7.6 — Security Critical: fix rate limiting — ✅ DONE

```
Read plan.md §10.3 item 1 and security-audit-report.md Finding 2 in full.

Replace the in-memory Map-based rate limiter in
connect/api/_lib/rate-limit.js (from Prompt 7.5) with an Upstash
Redis-backed sliding-window limiter (@upstash/ratelimit + @upstash/redis),
matching the report's exact fix: 3/hour and 10/day per IP, using
UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN env vars. Update
connect/.env.example with the two new variables and a comment on where
to get them (Upstash free tier, or Vercel KV as a drop-in alternative).
Show me a diff before writing changes.
```

---

## Prompt 7.7 — Security High: add a real anti-abuse check — ⚠️ DONE SERVER-SIDE ONLY — the front-end Turnstile widget was never wired up; finished in Phase 8.5

```
Read plan.md §10.3 item 2 and security-audit-report.md Finding 1 in full.

Add Cloudflare Turnstile verification to connect/api/_lib/origin-check.js
(or a new sibling module), called from both form-token.js and
request-call.js alongside - not instead of - the existing Origin/Referer
check. Add TURNSTILE_SECRET_KEY to connect/.env.example. Note the
matching front-end change needed (adding the Turnstile widget/script to
connect/index.html's request-call form) as a follow-up - flag it, don't
silently skip it.
```

---

## Prompt 7.8 — Security Medium: wire the two silently-broken forms — ✅ DONE (disabled with "coming soon" messaging, per the git log)

```
Read plan.md §10.3 item 3 and security-audit-report.md Finding 5 in full.

For commercial/contact.html (action="#", does nothing) and the
comparison-report download gate in product-page.js (fakes a "Sent to
[email]" success, discards the address): build a real endpoint for each
using the connect/api/_lib/ shared modules from Prompt 7.5, following
request-call.js's pattern. If a real endpoint genuinely can't be
finished in this pass, disable the submit control instead and show
"Coming soon - email us at support@tradefunding.com.au" rather than a
form that silently discards input - tell me which path you're taking
for each of the two forms before implementing.
```

---

## Prompt 7.9 — Security Medium: fix the Broker Portal form — 🔴 CONFIRMED NOT DONE — verified directly (`commercial/broker-portal.html:596` still has `<form class="bp-form">` with no `method`/`action`). Not caught by either round of security reports; finished in Phase 8.5.

```
Read plan.md §10.3 item 4 and security-audit-report.md Finding 3 in full.

commercial/broker-portal.html's form has no method/action, defaulting to
GET and leaking name/email/phone into the URL, browser history, referrer
headers, and server logs. Add a real POST endpoint (/api/broker-lead),
built from connect/api/_lib/, and wire the form to it with a submit
handler (mirroring connect/scripts/form.js's pattern). Show me a diff
before writing changes.
```

---

## Prompt 7.10 — Security Low: add secret rotation support — ✅ DONE

```
Read plan.md §10.3 item 5 and security-audit-report.md Finding 4 in full.

Add a KEY_VERSION prefix (e.g. "v1.") to the HMAC token format in
connect/api/_lib/form-token.js so FORM_TOKEN_SECRET can be rotated later
without breaking in-flight tokens. Also confirm (report back to me,
don't just assume) whether FORM_TOKEN_SECRET was actually generated via
openssl rand -hex 32 in Vercel's dashboard, per the existing
.env.example comment, rather than left as a placeholder.
```

---

## Prompt 7.11 — Architecture: consolidate cookie-consent — ⚠️ DONE, BUT INCOMPLETE — the shared module was built correctly, but never added to Personal & Property's 11 pages; finished in Phase 8.5

```
Read plan.md §10.4 item 4 and architecture-review-report.md §2.2.

Consolidate connect/scripts/main.js's localStorage-based cookie-consent
check (key: tf-connect-cookie-consent) and commercial/cookie-consent.js's
document.cookie-based check (key: blc_cookie_consent - a legacy codename,
retire it) into one shared implementation in shared/scripts/consent.js,
using a single new cookie key (e.g. tf_cookie_consent) so consent state
carries across channels via the ChannelSwitcher instead of re-prompting.
Show me a diff before writing changes.
```

---

## Prompt 7.12 — Architecture: testability refactors — ✅ DONE

```
Read plan.md §10.4 items 5-6 and architecture-review-report.md §1.2 and §3.2.

1. Refactor calcMonthly() in commercial/product-page.js into a pure
   function taking { principal, annualRatePct, months, mode } and
   returning { monthly, total, interest } - no DOM references inside it -
   mirroring connect/scripts/calculator.js's compute() pattern. Keep a
   thin DOM-reading wrapper calling it.

2. Refactor connect/api/request-call.js to read all required env vars
   once at the top of handler(), passed down as a plain config object to
   sendEmail()/sendSlack(), rather than reading process.env deep inside
   those functions.

No behavior change expected in either case - this is purely to make both
independently unit-testable. Show me a diff before writing changes.
```

---

## Prompt 7.13 — Dependency fixes + tests + closing report — 🔴 NEVER RUN — confirmed via git log and the dependency-risk report. Finished in Phase 8.9, folded together with the closing report as Phase 8.10 instead.

```
Read plan.md §10.5, buildspec.md §13, and dependency-risk-report.md in full.

1. Update connect/package.json with the exact devDependencies/scripts
   block from dependency-risk-report.md (vitest ^2.1.0, eslint ^9.13.0;
   "test": "vitest run", "lint": "eslint ."). No production dependencies.

2. Write vitest unit tests covering: calcMonthly() and compute() (the
   amortization/rate math from Prompt 7.12 and calculator.js), the rate
   limiter's pure logic (post-Upstash migration from Prompt 7.6), and
   HMAC token verification (form-token.js). Run npm test and confirm
   they pass before moving on.

3. Produce docs/remediation-report.md summarizing everything fixed
   across Prompts 7.0-7.12, in order, referencing which finding/item
   from each of the three source reports it addresses. Include the two
   open flags from Prompt 7.2 ("Compare Options" mapping, Resources/
   About placement) and confirm the hello@ -> support@ inbox-routing
   question from Prompt 7.1 is still open and unresolved by this phase.

Do not begin Phase 8 (Payload conversion) until this report exists and
I've reviewed it.
```

---

## Prompt 8.1 — Include-sync coverage fix + hero/header overlap — ✅ DONE (regression found — see Prompt 8.1-fix below)

```
Read plan.md §11 (intro + 8.1) and architecture-review-report.md Finding 1
and ui-ux-a11y-report.md item 1 in full.

1. Confirm the "Home" icon-only vs. icon+text decision has been made
   (check with me if not) before touching the ChannelSwitcher markup.

2. Convert the remaining 63 pages (everything except
   commercial/business-loans.html, connect/for-vendors.html, and
   personal-and-property/personal-loans.html, which already use it) to
   the <!-- include:start src="..." --> / <!-- include:end --> marker
   pattern for navbar/footer, matching those 3 pages' existing usage.
   Run node connect/scripts/build-includes.mjs, then --check, and
   confirm all 66 pages pass.

3. Wire build:includes:check into a pre-commit hook (or note if a CI
   config exists to add it to instead).

4. While the canonical navbar component is open: fix the hero/header
   overlap. Change Commercial's .hero top padding to
   calc(var(--utility-bar-height, 37px) + 80px + 32px), and verify
   Connect's and Personal & Property's hero padding clears the same
   trust-bar+navbar stack height, especially at mobile widths.

Do this in stages: markers first (show me 5 sample pages before doing
all 63), then the hero-padding fix, then a final --check run. Show me a
diff before writing changes.
```

---

## Prompt 8.1-fix — Regression: Connect header still appears to cover the hero — ✅ DONE

*(Confirmed via screenshot. The CSS fix from 8.1 is actually correct in `connect/styles/main.css` — the bug is a stale cache-busting query string preventing the fix from actually reaching browsers.)*

```
Read plan.md §11 (8.1-fix) and buildspec.md §14.

1. Confirm connect/styles/main.css's .hero rule already has the correct
   padding: calc(var(--utility-bar-height, 37px) + 80px + 32px) formula
   (it should, per the Phase 8.1 commit) - if it's somehow NOT there,
   flag that as a different problem before proceeding.

2. Grep every connect/*.html file for main.css?v=20260811-1 (or any
   other stale version string referencing main.css) and bump it to a
   new value, consistently, across every file that references it.

3. Sweep the whole repo for any other ?v=YYYYMMDD-N style query string
   on a CSS/JS asset. For each one found, check git log -1 --format=%ad
   on the referenced file against the version date in the query string -
   flag and bump any that are stale.

4. Confirm in an actual rendered page (not just by reading the CSS
   source) that Connect's hero no longer overlaps the header after this
   fix - screenshot or describe what you see.

Show me the list of files changed before writing changes. Don't treat
this as "redo the 8.1 fix" - the fix is already correct, this is a
cache-invalidation problem only.
```

---

## Prompt 8.2 — Branding/visual cleanup (depends on 8.1) — ✅ DONE

```
Read plan.md §11 (8.2), ui-ux-a11y-report.md items 3, 4, 6, and
security-audit-report.md Finding 6.

1. Remove the 20 emoji <span class="dd-icon ...">&#...;</span> icon
   spans from the Funding Solutions dropdown in
   commercial/components/navbar.html — leave the plain text labels.
2. Remove the 3 emoji entity references (&#128222;, &#128231;,
   &#128205;) from all three canonical footer components.
3. Fix the distorted Casper logo: add class="footer__cashper" to the
   <img> at connect/components/footer.html:28, remove the inline
   style="height:56px;width:auto;" — the matching CSS rule already
   exists at connect/styles/main.css:760.
4. Build a dedicated Products page (commercial/products.html, or
   repurpose business-loans.html) as the standalone menu-style view,
   reusing the existing category-grouping markup.
5. Propagate the confirmed office address to all 59 remaining
   [BLOCKED - NEEDS: confirmed address] placeholder occurrences
   (including commercial/privacy.html) — footer instances ride the
   now-fixed include-sync; find-and-replace any body-content instances
   directly.

Re-run build:includes:check after steps 1-3 to confirm propagation.
Show me a diff before writing changes.
```

---

## Prompt 8.3 — Animation & interaction accessibility polish — ✅ DONE (regression found — see Prompt 8.3-fix below)

```
Read plan.md §11 (8.3), ui-ux-a11y-report.md items 5, 8, 9, and item 2.

1. Add reveal/reveal delay-N classes to Personal & Property's hero
   elements (.pp-hero__eyebrow, .pp-hero__title, .pp-hero__lead,
   .pp-hero__cta-group, .pp-hero__trust, .pp-hero__card), matching
   Connect's stagger pattern. Markup-only change - the shared .reveal
   CSS/JS is already loaded on this page.
2. Add aria-expanded toggling and a click/focus-based open state to the
   Funding Solutions dropdown mega-menu (currently hover-only, no ARIA
   state) - keep the existing :hover CSS as a progressive enhancement,
   don't remove it.
3. Fix channel-switcher touch targets at <=640px: add min-height: 44px
   to .channel-switch__option and adjust padding (not font-size alone)
   so the actual tap target reaches 44px.
4. Apply whichever "Home" decision was confirmed in Prompt 8.1: if
   icon-only, remove <span class="channel-switch__full">Home</span>
   from navbar.html and update CLAUDE.md rule 13; if keeping the text,
   no markup change needed here.
5. Confirm prefers-reduced-motion still gates the new P&P reveal classes
   correctly (should be automatic via the shared .reveal system - verify,
   don't assume).

Show me a diff before writing changes.
```

---

## Prompt 8.3-fix — Regression: "Funding Solutions" trigger doesn't visually match sibling nav items — ✅ DONE

*(Confirmed via screenshot. Item 2's aria-expanded conversion to a `<button>` broke visual parity with "Compare Options" / "Partners" / "Why Choose Us?".)*

```
Read plan.md §11 (8.3-fix) and buildspec.md §14.

1. In commercial/shared-styles.css, replace .navbar__link--dropdown-
   trigger's current "font: inherit; color: inherit;" with explicit
   literal values copied directly from .navbar__link in
   shared/styles/chrome.css: font-family: var(--font-heading);
   font-weight: 500; font-size: 0.95rem; color: var(--text-primary);
   plus a matching :hover { color: var(--skyblue); }.

2. Verify in an actual rendered page (not just by reading the CSS) that
   "Funding Solutions" now visually matches "Compare Options", "Partners",
   and "Why Choose Us?" - same weight, same font, same color, same hover
   behavior.

3. Check whether any other element converted from a plain <a>/text node
   to a <button> during Prompt 8.3's accessibility work has the same
   "relies on inherit, doesn't actually match" problem, and fix any you
   find the same way.

Show me a diff before writing changes, and confirm visually (describe
what you see, or screenshot) before considering this done.
```

---

## Prompt 8.4 — Security headers: CSP + HSTS sitewide — ⬜ NOT RUN

```
Read plan.md §11 (8.4) and security-audit-report.md Finding 1 and Finding 5.

Add a Content-Security-Policy and Strict-Transport-Security header to
connect/vercel.json's existing headers array (two more objects for the
"/(.*)" source), using this starting policy:

default-src 'self'; script-src 'self' https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline'; img-src 'self' data:;
connect-src 'self' https://challenges.cloudflare.com;
frame-src https://challenges.cloudflare.com; base-uri 'self';
form-action 'self'; frame-ancestors 'self'

plus Strict-Transport-Security: max-age=63072000; includeSubDomains; preload

Then create equivalent vercel.json files for commercial/ and
personal-and-property/ with the same full header set (the existing four
Connect headers plus these two new ones) - right now only Connect has
any security headers at all. Show me a diff before writing changes.
```

---

## Prompt 8.5 — Compliance-critical fixes: P&P consent, Turnstile widget, Broker Portal form — ⬜ NOT RUN

```
Read plan.md §11 (8.5), security-audit-report.md Finding 2 and Finding 3,
and connect/api/_lib/turnstile.js's own header comment.

1. Add <script src="/shared/scripts/consent.js" defer></script> to all
   11 personal-and-property/*.html pages - none of them currently load
   it, unlike 48 of the other 55 real pages.

2. Add the Turnstile widget to connect/index.html's request-call form
   (script tag from https://challenges.cloudflare.com/turnstile/v0/api.js
   plus a <div class="cf-turnstile" data-sitekey="..."> in the form) and
   update connect/scripts/form.js to read the widget's response token
   into turnstile_token on both the /api/form-token GET query string
   and the /api/request-call POST body. Do NOT relax the
   "if (!token) return false" check in _lib/turnstile.js as a shortcut.

3. Fix commercial/broker-portal.html's form (line ~596,
   <form class="bp-form">, no method/action - confirmed still broken,
   independently verified) - force POST to a new /api/broker-lead
   endpoint, following request-call.js's pattern and using the shared
   _lib/ modules.

Show me a diff before writing changes; flag your Turnstile site-key
source (test key vs. real key) before wiring it in.
```

---

## Prompt 8.6 — Shared-logic extraction: validation regex + notify templating — ⬜ NOT RUN

```
Read plan.md §11 (8.6), buildspec.md §14, and architecture-review-report.md
Finding 3, and security-audit-report.md Finding 4.

1. Extract the duplicated email/phone validation regexes (currently
   copy-pasted between connect/api/request-call.js and
   connect/scripts/form.js) into connect/api/_lib/validation.js. Flag
   for me which approach you're taking for sharing it with the
   client-side script (duplicate-with-comment vs. converting form.js to
   a module) before implementing either.

2. Extract sendEmail/sendSlack's HTML/Slack templating from
   request-call.js into connect/api/_lib/notify.js
   (renderLeadEmail(fields) / renderSlackMessage(fields)), parameterized
   so the new broker-lead endpoint from Prompt 8.5 can reuse them.

No behavior change expected in either case. Show me a diff before
writing changes.
```

---

## Prompt 8.7 — Performance & SEO — ⬜ NOT RUN

```
Read plan.md §11 (8.7) and performance-seo-report.md Findings 1-4, 9, 10
in full.

1. Add explicit width/height to every <img> tag sitewide - write a
   one-off script (scripts/add-image-dims.mjs) that reads each
   referenced image's real dimensions and injects the attributes,
   starting with commercial/index.html (0 of 73 currently have them).
   Don't touch the existing loading="lazy" attributes.
2. Convert commercial/assets/founders.jpg (2.0MB) and other large
   JPG/PNG photos to WebP, re-encoded at a sane max width.
3. Create a real commercial/assets/og-image.png and point Commercial's
   og:image tag at it (currently points to a file that doesn't exist).
4. Bring Personal & Property's <head> up to Connect's standard: add
   og:image, twitter:card tags, sitemap.xml, and robots.txt. Add
   sitemap.xml to Connect too (it's missing there specifically).
5. Audit Commercial's 6 JSON-LD schema blocks for duplicate/conflicting
   Organization entries, and check whether any reference the broken
   image path from step 3.

Show me a diff/file list before writing changes.
```

---

## Prompt 8.8 — Resilience & observability — ⬜ NOT RUN

```
Read plan.md §11 (8.8) and state-resilience-observability-report.md
Findings 1, 6, 7, 8 in full.

1. Add a small withRetry(fn, {attempts: 3, baseDelayMs: 300}) helper in
   shared/scripts/, and wrap both fetch() calls in
   connect/scripts/form.js (fetchFormToken and the request-call submit)
   with it. Be careful not to trigger _lib/form-token.js's 3-second
   minimum-age check with too-fast retries.
2. Add shared/scripts/error-handler.js with window.addEventListener
   ('error', ...) and ('unhandledrejection', ...) handlers that log
   structured error info. Load it sitewide alongside consent.js.
3. Set up a lightweight Sentry (free tier) integration capturing
   unhandled JS errors, unhandled promise rejections, and Core Web
   Vitals. Explicitly configure beforeSend/beforeBreadcrumb (or the
   equivalent config) to scrub name/email/phone/business fields from
   error context and disable session-replay DOM capture on form
   elements, before enabling it.

Show me a diff before writing changes; flag the Sentry DSN/project setup
as something I need to create an account for, not something to fake.
```

---

## Prompt 8.9 — Finish Phase 7.13: dependency hygiene, tests, CSS consolidation — ⬜ NOT RUN

```
Read plan.md §11 (8.9), buildspec.md §13 and §14, dependency-risk-report.md,
and architecture-review-report.md Finding 2.

1. Add the vitest/eslint devDependencies and test/lint scripts to
   connect/package.json exactly as specified in buildspec.md §13 (this
   was written into a prior prompt but never actually run - confirm
   that first via git log if you want to double check).
2. Run npm install inside connect/ and commit the resulting
   package-lock.json.
3. Write the vitest unit tests originally specified for Phase 7.13:
   calcMonthly()/compute() amortization math, the rate limiter's pure
   logic, and HMAC token verification. Run npm test and confirm they pass.
4. Consolidate commercial/index.html's 4 separate <style> blocks into
   one, renaming the "LIGHT HERO OVERRIDES (preview variant)" block's
   .hero-selector overrides to a .hero--light-preview modifier class,
   and updating the markup that relies on it to include that class
   explicitly rather than relying on document-order cascade.

Show me a diff before writing changes; run the test suite and show me
the output before considering this done.
```

---

## Prompt 8.10 — Final pre-deployment QA + closing report — ⬜ NOT RUN

```
Read plan.md §11 (8.10) in full.

1. Re-run npm run build:includes:check and confirm all 66 pages pass.
2. Spot-check the header/hero fix (8.1), emoji removal (8.2), and P&P
   reveal animation (8.3) visually on at least one page per channel.
3. Confirm the CSP (8.4) doesn't break any legitimate inline <style>
   usage.
4. Confirm all 11 Personal & Property pages load consent.js, the
   Turnstile widget issues a real token on Connect's live form, and the
   Broker Portal form now POSTs correctly (8.5).
5. Run npm test (8.9) and confirm it passes.
6. Produce docs/phase8-report.md, referencing each of the six source
   report filenames directly and listing, for each, which findings were
   fixed in Phase 8 versus explicitly deferred to Phase 9 (with the
   reason) per plan.md §11.10's final bullet.

Do not begin Phase 9 (Payload conversion) until this report exists and
I've reviewed it.
```

---

## Prompt 8.11 — Deploy the current static build to Vercel for stakeholder review — ⬜ NOT RUN

*(This deploys the existing static site as-is, for the team to leave final comments — it is not the Phase 9 Payload/Next.js launch. Get explicit go-ahead before running the actual deploy, and again before promoting any preview URL to production.)*

```
Read plan.md §11 (8.11).

1. Confirm every cache-busting query string flagged in Prompt 8.1-fix
   has been bumped, so this deploy reflects Phase 8's fixes rather than
   cached pre-fix assets.

2. Prepare (don't yet run) a Vercel deployment of the current repo as-is
   - commercial/, connect/, and personal-and-property/ together,
   preserving the existing sub-path structure. Tell me the exact Vercel
   CLI commands you'd run (e.g. vercel, then vercel --prod) rather than
   running them yet.

3. Once I confirm, run the preview deploy and share the resulting URL.
   Do not promote to a production URL without a separate, explicit
   confirmation from me.

This is an interim deploy for stakeholder review before Phase 9's
Payload/Next.js rebuild - not the final launch.
```

---

## Prompt 9 — Payload CMS scaffold (Phase 9) — ⬜ NOT STARTED

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

## Prompt 10 — Migrate one page end-to-end (Phase 9) — ⬜ NOT STARTED

```
Convert exactly one page — commercial/business-term-loans.html — into a
Payload-backed page using the collections scaffolded in Prompt 9 and the
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

## Prompt 11 — Batch-convert remaining pages — ⬜ NOT STARTED

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

## Prompt 12 — Vercel deploy (Phase 9) — ⬜ NOT STARTED

```
Read buildspec.md §8.

Set up vercel.json and .env.example for deploying /site as ONE Vercel
project with sub-path routing for all three channels, sharing one
Payload backend. Do not set up multiple projects or subdomains. Do not
run an actual deploy — prepare the config and give me the exact CLI
commands to run myself.
```

---

## General rules (updated)

- Tell Claude Code which files to read *before* it edits anything.
- Ask for a diff before large edits, especially anything touching more than one file.
- Never delete existing pages/routes to "declutter" — only delete files explicitly named as retired in `plan.md`/`buildspec.md` (and only after Phase 5.5 confirms it).
- One phase per prompt.
- Never treat `_internal/_DO-NOT-DEPLOY-design-baseline/` as anything other than a color/button reference — it is not part of the build.
- Header/footer markup must be identical across every page (enforced via include-sync as of Phase 8, not just manual diffing); every link/asset path must be root-relative; em-dashes become spaced hyphens (` - `); no spaces in any folder or file name.
- **Verify claimed completion against the repo, not just a prior session's summary** — Phase 8 exists partly because several Phase 7 items were marked done but weren't fully rolled out (see the "Three things" note above). A quick `git log`/`grep`/file-existence check costs little and catches this early.
