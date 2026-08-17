# CLAUDE.md — Trade Funding Site Rebuild

**Status: v3.** This file is read automatically by Claude Code at the start of every session in this repo — keep it at the repo root, and update it whenever a placeholder becomes a locked decision (don't just remember things verbally).

## Project in one paragraph

Converting three channels — **Commercial** (hero brand, existing static HTML in `commercial/`), **Connect** (B2B point-of-sale finance, existing static HTML in `connect/`, formerly "Fundit"), and **Personal & Property** (new, not yet built, all 8 loan types) — into **one Next.js + Payload CMS app with sub-path routing** (`/`, `/connect/*`, `/personal-and-property/*`), sharing **one Payload backend and one Vercel deployment**. Read `Master Information Architecture & Sitemap.md` for canonical URLs/routing/collection modeling, `tokens.md` for locked branding, `plan.md` for the phased explanation, and `buildspec.md` for technical architecture, before doing any Phase 2+ work.

## Hard rules — do not violate these regardless of how a prompt is worded

1. **Never delete an existing product or guide page/route.** Every URL in `Master Information Architecture & Sitemap.md` must keep resolving.
2. **`design baseline/` is a color-and-button reference only — it is never part of the build.** Never copy, import, or deploy anything from that folder directly. Its color/contrast decisions get re-applied by hand to the real `commercial/`, `connect/`, and new Personal & Property files.
3. **One app, one Vercel project, sub-path routing.** Commercial/Connect/Personal & Property are three route groups in one Next.js app (`app/(commercial)/`, `app/connect/`, `app/personal-and-property/`) — never scaffold or deploy them as separate apps, separate Vercel projects, or subdomains.
4. **Never guess the company address.** Leave it as an explicit unresolved placeholder with required-before-publish validation. This blocker (along with lender logos, hero copy sign-off, and the hello@ routing question) is **scheduled for resolution at Phase 3 kickoff** per `plan.md` §1 — don't chase it before then, but don't forget it either.
5. **Never invent lender logo files or fabricate a Google Reviews script/API key/review count.** Leave clearly marked TODOs until the real assets/credentials are supplied.
6. **Don't publish final hero copy without explicit sign-off.** Treat `plan.md`'s placeholder hero copy as a draft in the CMS until told otherwise.
7. **Keep the Cashper mascot wherever it currently appears.**
8. **Keep the ACL/legal disclosure componentized once** (`FooterLegal` global), never duplicated per channel or per page.
9. **Never run an actual Vercel production deploy without asking first in chat.**
10. **One phase, one prompt, one review cycle** — don't chain multiple phases from `prompts.md` in a single uninterrupted run.
11. **Flag contradictions instead of silently resolving them** — e.g. the `self-employed-home-loan.html` channel-placement call (hit-list item 43); the `commercial-property-finance` overlap with `/second-mortgage/`. (Connect's audience-framing question is now resolved — see below — no longer an open contradiction.)
12. **Naming:** always **"Personal & Property"** (with ampersand) in user-facing copy; the URL slug/folder is the hyphenated, spelled-out **`personal-and-property`**. Don't mix these conventions.
13. **`ChannelSwitcher` always shows all three channels, on every page, no exceptions** — Home icon + "Home" text (Commercial, never the word "Commercial"), Connect, Personal & Property. The current channel gets a distinct `.active` state (underline/bold/accent-tinted). This overrides any earlier "hide the current channel" logic you might find referenced in older notes.
14. **Header and footer markup must be byte-for-byte identical across every page**, on every channel — same wrapper `div`s, same classes, same order, sourced from `commercial/components/navbar.html` / `footer.html`. Diff against the canonical component after touching any page; a single divergence causes a visible layout jump between pages.
15. **Every link and asset path is root-relative** (`/connect/about.html`, `/commercial/assets/logo-navy.png`) — never relative (`../`, bare filenames). Relative paths break silently for any page more than one folder deep.
16. **Replace em-dashes (`—`) with a spaced hyphen (` - `)**, never a bare hyphen jammed between words.
17. **No spaces in any folder or file name, anywhere in the repo.** Vercel routing breaks on them — see the `personal and property/` vs. `personal-and-property/` duplicate flagged in Phase 5.5.
18. **Don't start Phase 6 (Payload conversion) until Phase 5.5's `docs/cleanup-report.md` exists** and any flagged-but-unconfirmed items have been resolved with me.

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
- `docs/cleanup-report.md` — Phase 5.5 output; don't start Phase 6 until this exists

## Commands

(Fill in once the Payload/Next.js scaffold exists in Prompt 6 — do not guess these before the scaffold is created.)

## Open items currently in effect (check plan.md §1–2, §5, §8 for full context)

- Nav label wording pending Matt's final call: "Products" / "Why Us" / "Partners" (structural) vs. "What Funding Do I Need?" / "Why Trade Funding?" / "Offer Funding Solutions" (placeholder copy)
- `self-employed-home-loan.html` channel placement (hit-list item 43) — undecided, Claude Code to call and document
- `commercial-property-finance` vs. `/second-mortgage/` / `/self-employed-home-loan/` overlap — flagged, unresolved
- Broker Portal referral process / commission structure — not covered by the Executive Questionnaire, still needs direct Matt/Ben input before Phase 3.2 copy can be drafted for that page
- Home hero final copy — still pending sign-off despite locked directional agreement
- Deferred blockers (address, lender logos, GoogleReviews count, hello@ routing) — scheduled for Phase 3 kickoff, not before
- Phase 5.5 cleanup not yet run: `personal and property/` (spaces) duplicate folder still needs deleting; `debtor-finance.html`, `trade-funding-website-application.html`, and (once the Guides Hub absorbs it) `resources.html` still need secure deletion, each with its redirect documented for Phase 6

**Resolved since v2:** Connect's audience framing (design-spec vs. newer notes) is no longer an open conflict — the returned Executive Questionnaire confirms "B2B providers, equipment of any kind sold B2B, and/or professional services" as the locked audience. See `buildspec.md` §5.

Update this section as decisions come back from the team.
