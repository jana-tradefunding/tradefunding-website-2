# CLAUDE.md — Trade Funding Site Rebuild

**Status: v10.** This file is read automatically by Claude Code at the start of every session in this repo — keep it at the repo root, and update it whenever a placeholder becomes a locked decision (don't just remember things verbally). **`ChannelSwitcher`'s "Home" is now locked as icon-only (see rule 13). The two Phase 8 regressions (8.1-fix, 8.3-fix) are fixed and verified — see plan.md §11. A third issue (8.3-fix-2 — "Why Choose Us" nav link goes nowhere, should route to About Us) is queued to run next, before 8.4. Phase 8.11 (Vercel deploy) has been resequenced to run right after 8.6, before 8.7's performance/SEO work.**

## Project in one paragraph

Converting three channels — **Commercial** (hero brand, existing static HTML in `commercial/`), **Connect** (B2B point-of-sale finance, existing static HTML in `connect/`, formerly "Fundit"), and **Personal & Property** (new, not yet built, all 8 loan types) — into **one Next.js + Payload CMS app with sub-path routing** (`/`, `/connect/*`, `/personal-and-property/*`), sharing **one Payload backend and one Vercel deployment**. Read `Master Information Architecture & Sitemap.md` for canonical URLs/routing/collection modeling, `tokens.md` for locked branding, `plan.md` for the phased explanation, and `buildspec.md` for technical architecture, before doing any Phase 2+ work.

## Hard rules — do not violate these regardless of how a prompt is worded

1. **Never delete an existing product or guide page/route.** Every URL in `Master Information Architecture & Sitemap.md` must keep resolving.
2. **`_internal/_DO-NOT-DEPLOY-design-baseline/`** (relocated and renamed from `design baseline/` in Phase 6) **is a color-and-button reference only — it is never part of the build.** Excluded from Vercel deploys via `.vercelignore`. Never copy, import, or deploy anything from that folder directly.
3. **One app, one Vercel project, sub-path routing.** Commercial/Connect/Personal & Property are three route groups in one Next.js app (`app/(commercial)/`, `app/connect/`, `app/personal-and-property/`) — never scaffold or deploy them as separate apps, separate Vercel projects, or subdomains.
4. **Never guess the company address.** The office address for Credit Guide/Terms/footer display is now supplied (see Phase 7, plan.md §10.1) and must be labeled "Office Address" specifically — not "Registered Address" and not unlabeled — since it isn't necessarily the ASIC-registered business address. Lender logos and hero copy sign-off remain genuine open blockers. The `hello@`→`support@` **inbox routing/access question is still unconfirmed** (Ben Lyons) even after the site's displayed email address is updated — don't treat a display-copy change as resolving the operational question.
5. **Never invent lender logo files or fabricate a Google Reviews script/API key/review count.** Leave clearly marked TODOs until the real assets/credentials are supplied.
6. **Don't publish final hero copy without explicit sign-off.** Treat `plan.md`'s placeholder hero copy as a draft in the CMS until told otherwise.
7. **Keep the Cashper mascot wherever it currently appears.**
8. **Keep the ACL/legal disclosure componentized once** (`FooterLegal` global), never duplicated per channel or per page.
9. **Never run an actual Vercel production deploy without asking first in chat.**
10. **One phase, one prompt, one review cycle** — don't chain multiple phases from `prompts.md` in a single uninterrupted run.
11. **Flag contradictions instead of silently resolving them** — e.g. the `self-employed-home-loan.html` channel-placement call (hit-list item 43); the `commercial-property-finance` overlap with `/second-mortgage/`. (Connect's audience-framing question is now resolved — see below — no longer an open contradiction.)
12. **Naming:** always **"Personal & Property"** (with ampersand) in user-facing copy; the URL slug/folder is the hyphenated, spelled-out **`personal-and-property`**. Don't mix these conventions.
13. **`ChannelSwitcher`'s "Home" is icon-only — locked.** No "Home" text label, on any page, any channel. This was confirmed during Phase 8.3 (resolving the earlier contradiction). All three channels (Home icon, Connect, Personal & Property) remain always visible with a distinct `.active` state.
14. **Header is a single strip — logo, primary nav, and `ChannelSwitcher` all in the same row.** Never build the switcher as a separate tier/utility bar above or below the main nav. (An earlier ambiguous instruction caused exactly this two-tier mistake once already — see `plan.md` §7.2 for the fix; don't repeat it.) Header and footer markup must otherwise be byte-for-byte identical across every page, on every channel — same wrapper `div`s, same classes, same order, sourced from `commercial/components/navbar.html` / `footer.html`. Diff against the canonical component after touching any page.
15. **Every link and asset path is root-relative** (`/connect/about.html`, `/commercial/assets/logo-navy.png`) — never relative (`../`, bare filenames). Relative paths break silently for any page more than one folder deep.
16. **Replace em-dashes (`—`) with a spaced hyphen (` - `)**, never a bare hyphen jammed between words.
17. **No spaces in any folder or file name, anywhere in the repo.** Vercel routing breaks on them — see the `personal and property/` vs. `personal-and-property/` duplicate flagged in Phase 5.5.
18. **Don't start Phase 8 (Payload conversion) until Phase 7's `docs/remediation-report.md` exists**, and Phase 6's templating-vs-migrate-now decision has been made explicitly with the team.
19. **Any shared markup (header, footer, dropdown) lives at exactly one canonical source and gets re-propagated everywhere, including root-level pages that live outside a channel folder** — `contact.html` at the repo root was missed by an earlier propagation pass for exactly this reason. Don't assume "sitewide" excludes files that aren't inside `commercial/`, `connect/`, or `personal-and-property/`.
20. **Nav label wording changes are cumulative — always check `plan.md` §10.2 for the current final wording before touching the primary nav.** It's been locked and re-locked more than once already; don't assume an older note (even one in this file) is still current without checking.
21. **Never build a new form/endpoint that duplicates origin-check, token-verification, rate-limiting, or HTML-escaping logic that already exists.** Use the shared `connect/api/_lib/` module (see `buildspec.md` §13) once it exists — a security fix applied there should never need re-applying in three separate handler files.
22. **Never ship a form that silently discards user input.** If a real backend endpoint genuinely isn't ready, disable the submit control and show a clear "coming soon, email us at [address]" message instead of a working-looking form that does nothing — this applies sitewide, not just to the two forms already flagged in the security audit.
23. **Shared markup gets propagated via the include-sync system (`connect/scripts/build-includes.mjs`), not by hand.** Only 3 of 66 pages actually used the `<!-- include:start -->` marker pattern before Phase 8 — the other 63 relied on manual copy-paste with no enforcement, which is why rule 19's `contact.html` incident happened and why several Phase 8 bugs (emoji regression, address drift) recurred. Every page must use the marker pattern; `npm run build:includes:check` must pass before any commit that touches shared markup.
24. **Every page must load `/shared/scripts/consent.js`.** Personal & Property shipped with zero cookie-consent coverage on all 11 pages until Phase 8 caught it — a live compliance gap, not just a UX inconsistency. Check this explicitly whenever a new page is added to any channel.
25. **Never weaken an anti-abuse check to work around a missing front-end integration.** If a server-side check (e.g. Turnstile) fails closed because its front-end widget isn't wired up yet, fix the front-end — do not loosen the server-side check (e.g. `if (!token) return true`) as a shortcut. This exact temptation is called out by name in the security report.
26. **Every `<img>` tag needs explicit `width`/`height` (or a CSS `aspect-ratio`) — no exceptions going forward.** 0 of 73 images on Commercial's homepage had them before Phase 8; don't reintroduce the gap on new pages.
27. **RUM/telemetry (once added in Phase 8) must have PII scrubbing configured before it's turned on** — form fields (name/email/phone/business) must never reach a third-party telemetry dashboard via default DOM/session-replay capture. Check this whenever telemetry config changes.
28. **New shared logic (validation, templating, retry helpers) goes in `connect/api/_lib/` or `shared/scripts/` — never copy-pasted into a second handler or script.** This project has already had to retroactively fix this pattern twice (origin-check/token/rate-limit extraction in Phase 7, email/Slack templating and validation regex extraction in Phase 8) — don't create a third instance.
29. **This project has multiple "reports say X was done but it wasn't" incidents on record** (Phase 7.13's test/lint/lockfile setup was written into `prompts.md` but never run; the include-sync system existed but only covered 3 pages). **Verify claimed completion against the actual repo state — git log, file existence, grep for the specific pattern — before treating any phase or prompt as done.** Don't take a prior session's summary at face value without a quick independent check.
30. **A fix landing correctly in a CSS/JS source file doesn't mean it's actually live in the browser.** Every manually-versioned asset reference (`?v=YYYYMMDD-N` style cache-busting query strings) must be bumped whenever its underlying file changes, or a stale cached copy can keep serving pre-fix behavior indefinitely even though the source is correct. Check this specifically whenever a visual/behavioral fix doesn't seem to have "taken" despite the source looking right.
31. **Don't rely on `font: inherit` / `color: inherit` alone to guarantee a converted element (e.g. `<a>` → `<button>` for accessibility) visually matches its siblings.** Declare the literal property values explicitly and verify against an actual rendered page, not just the stylesheet — this exact assumption already caused one regression (the "Funding Solutions" nav trigger, Phase 8.3-fix).
32. **Anchor-link nav items (`href="...#section-id"`) need the target `id` verified to actually exist on the page, not assumed from the label.** "Why Choose Us?" pointed at `/commercial/index.html#why` sitewide with no matching `id="why"` anywhere on that page (Phase 8.3-fix-2) — it silently went nowhere on every one of the 52 pages that linked it. Check anchor targets exist whenever a nav link or CTA is added or changed.

## Tech stack quick reference

- Next.js (App Router) + TypeScript, Payload CMS 3.x installed in-app
- Postgres via Payload's Postgres adapter (Vercel Postgres/Neon)
- Media: Payload Vercel Blob storage adapter
- Styling: existing CSS system carried over, tokenized per `tokens.md` — not a Tailwind rewrite
- Deployment: **one** Vercel project, sub-path routing for all three channels

## Brand tokens (locked — see tokens.md for full detail; do not deviate)

```
Shared base (all channels):
--navy: #001C44        --navy-blue: #1C1998     --navy-deep: #000C22
--skyblue: #54B4F6     --skyblue-soft: #EAF4FE
--peach: #FF5D5C       --peach-soft: #FFF0F0
--gold: #FBB766        --gold-soft: #FFF7EC
--success: #10B981
Headings: Work Sans 700-900   Body: Roboto 400/500

Per-channel primary/accent:
Commercial            → primary: navy/navy-blue (unchanged)   accent: skyblue
Connect                → primary: gold (dominant)              accent: navy
Personal & Property   → primary: peach (dominant)              accent: navy
```

Connect and Personal & Property both lead with their own primary tint and use navy as accent/detail color only — a bigger shift for Connect specifically, since it inverts its old navy-dominant/gold-accent rhythm. See `buildspec.md` §5 for the concrete re-skin task list this implies.

## Key file locations

- `commercial/`, `connect/` — existing static HTML source of truth
- `design baseline/` — **reference only, not part of the build** (colors/buttons for all 3 channels)
- `Master Information Architecture & Sitemap.md` — canonical URL/routing/collection-modeling reference; treat as the migration checklist
- `tokens.md` — locked branding decisions
- `docs/Team Comments.md`, `docs/SEO_Audit_Report.md`, `docs/SEO Roadmap.md` — raw task list, SEO guardrails for Phase 3 copy
- `docs/Executive Questionnaire for Personal and Property and Connect.docx` — **returned with real answers** (uses "Individuals" as the internal working name for what this project calls Personal & Property — same pillar). Primary strategic input for Personal & Property and Connect copy — see `plan.md` §5.2 for the extracted content and `research-notes.md` (Phase 3.1 output) for the page-ready version.
- `connect/docs/design-spec.md` / `implementation-plan.md` — Connect's original build spec, still authoritative for token values (now partially superseded in *role* — not values — by tokens.md's dominant/accent flip)
- `plan.md`, `buildspec.md`, `prompts.md` — this project's own planning docs
- `docs/cleanup-report.md` — Phase 5.5 output (done)
- `docs/fix-report.md` — Phase 6 output (done)
- `docs/remediation-report.md` — Phase 7 output; **was never produced** — Phase 7 stopped after item 10.4, item 10.5 never ran. Not retroactively created; folded into Phase 8 §11.9 instead.
- `docs/phase8-report.md` — Phase 8 output; don't start Phase 9 until this exists
- `security-audit-report.md`, `architecture-review-report.md`, `dependency-risk-report.md`, `performance-seo-report.md`, `state-resilience-observability-report.md`, `ui-ux-a11y-report.md` — the six source reports Phase 8 remediates (the first three are the *second* version of those reports — re-run against the Phase 7 build, not the originals from Phase 7). Keep all of them for reference; Phase 9's own dependency audit will need re-running against the same categories again.

## Commands

`connect/`: `npm run build:includes` / `npm run build:includes:check` (include-sync, see rule 23). `npm test` / `npm run lint` — **planned since Phase 7, added for real in Phase 8 §11.9** (check `connect/package.json` directly before assuming either exists). Payload/Next.js commands: fill in once the Phase 9 scaffold exists — do not guess these before the scaffold is created.

## Open items currently in effect (check plan.md §1–2, §5, §9, §10, §11 for full context)

- `self-employed-home-loan.html` channel placement (hit-list item 43) — undecided, Claude Code to call and document
- `commercial-property-finance` vs. `/second-mortgage/` / `/self-employed-home-loan/` overlap — flagged, unresolved
- Broker Portal referral process / commission structure — not covered by the Executive Questionnaire, still needs direct Matt/Ben input
- Home hero final copy — still pending sign-off despite locked directional agreement
- Lender logos, GoogleReviews real count — still genuinely unresolved
- `hello@` → `support@` inbox routing/access — still unconfirmed (Ben Lyons)
- **"Compare Options" nav mapping (plan.md §10.2)** — flagged, not resolved: most likely `comparison-report.html`, needs confirmation. Also unresolved: where the Guides Hub and `about.html` live in the new 4-item nav.
- ✅ **Both Phase 8 regressions are fixed** (Prompts 8.1-fix, 8.3-fix, committed as `8d9df92`): Connect's stale `main.css` cache-busting version was bumped across all 8 pages (a repo-wide sweep found no other stale `?v=` references); the "Funding Solutions" nav trigger now uses explicit literal styles instead of `inherit` and matches its siblings pixel-for-pixel. Both verified in-browser.
- 🟡 **A third issue found in the same pass — Prompt 8.3-fix-2 — run next, before 8.4:** "Why Choose Us?" links to `/commercial/index.html#why` sitewide (52 pages), but no `id="why"` exists on that page — it's a dead anchor. Fix: point the link at the existing `/commercial/about.html` page instead of wiring up the missing anchor, edit the canonical `commercial/components/navbar.html`, and re-propagate via include-sync.
- 🔵 **Phase 8, remaining sub-phases — run in this order:** 8.4 (CSP/HSTS) → 8.5 (P&P consent + Turnstile + Broker Portal form) → 8.6 (shared validation/notify extraction) → **8.11 (Vercel deploy for stakeholder review — resequenced to run here, right after 8.6, not at the end of Phase 8)** → 8.7 (image dimensions + WebP + OG/sitemap fixes) → 8.8 (retry/backoff + global error handler + RUM with PII scrubbing) → 8.9 (the never-run Phase 7.13 dependency/test setup + inline-`<style>` consolidation) → 8.10 (final QA + closing report). Full list in plan.md §11.

**Resolved since v9:** the newly-found "Why Choose Us" dead-link bug is scoped and queued as 8.3-fix-2. Prompt 8.11 (Vercel deploy) is resequenced to run right after 8.6 instead of at the very end of Phase 8, so any final stakeholder tweaks land before the performance/SEO/resilience/process work in 8.7–8.10.

Update this section as decisions come back from the team.
