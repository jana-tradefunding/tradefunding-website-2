# Prompt Library — Trade Funding Homepage-First Rebuild

**Status: v1 — fresh build.** Replaces the old `prompts.md` (v11). Run these sequentially, one phase at a time — get a review checkpoint between phases rather than chaining multiple in one uninterrupted run, per the working discipline that served the last build well.

**Before Prompt 1:** make sure `plan.md`, `claude.md`, `buildspec.md`, and `homepage.md` are all sitting at the repo root, and that any AI session working on this reads them first, in that order.

---

## Phase 0 — Archive & Environment Reset

**Prompt 0.1 — Quarantine the old build**
> Move all existing site content (the `commercial/`, `connect/`, `personal-and-property/`, and `docs/` folders, plus any loose HTML/CSS/JS at the repo root) into a single `oldsite/` folder if not already done. Confirm `oldsite/` is excluded from the Vercel build via `.vercelignore` and from any TypeScript/Next.js build glob. Do not delete anything — this is a reference archive, not a cleanup. Report back the final folder structure and confirm nothing outside `oldsite/` still references old paths.

**Prompt 0.2 — Fresh scaffold**
> Starting from an empty repo root (with `oldsite/` quarantined per Prompt 0.1), scaffold a new Next.js App Router + TypeScript project with Payload CMS 3.x installed in-app, per `buildspec.md` §1. Confirm it builds and runs locally before doing anything else. Do not import or reference any file inside `oldsite/` yet.

---

## Phase 1 — IA, Routing & Redirect Lock

**Prompt 1.1 — Build the full redirect map**
> Using `oldsite/commercial/` as the source of truth, enumerate every `.html` file currently reachable from the old site root and produce a complete 301 redirect table mapping each old URL to its new `/commercial/...` equivalent, per the skeleton in `buildspec.md` §3. Flag `self-employed-home-loan.html` explicitly for a channel-placement decision (Commercial vs. Personal & Property) rather than defaulting silently. Output as `redirects.ts` in the format Next.js's `redirects()` config expects, plus a human-readable `redirect-map.md` table for review.

**Prompt 1.2 — Route map confirmation**
> Produce `route-map.md` listing every final route in the new site (homepage, all Commercial/Connect/Personal & Property pages) with its Payload `channel` value and page title. Cross-check against `oldsite/docs/Master Information Architecture & Sitemap.md` for anything that might have been missed. Flag any discrepancy rather than resolving it silently.

---

## Phase 2 — Design Tokens

**Prompt 2.1 — Rebuild tokens.md**
> Create a fresh `tokens.md` at the repo root using the exact color values in `buildspec.md` §4 (do not alter any hex value). Add the DM Sans typography decision as a clearly flagged deviation from the brand guidelines PDF, with a note that the guidelines document itself needs a follow-up update from Matt. Do not implement any CSS yet — this is a spec-only prompt.

---

## Phase 3 — Homepage Wireframe

**Prompt 3.1 — Wireframe only, no real content**
> Build a static, unstyled-to-minimally-styled wireframe of the new homepage: nav row (logo, Products/Choice/About placeholder links, CTA button placeholder), hero (placeholder headline/subhead, no calculator), three-card section (Commercial/Connect/Personal & Property, placeholder icons/copy), "why we exist" placeholder section, footer. Use Lorem-ipsum-level placeholder copy — the goal is structure and proportion, not content, per `plan.md` Phase 3. Deploy to a Vercel preview URL and report the link.

*(Checkpoint: get Matt's explicit sign-off on this wireframe before Prompt 4.1. Do not proceed on an assumed yes.)*

---

## Phase 4 — Homepage Production

**Prompt 4.1 — Real homepage build**
> Using the approved wireframe from Prompt 3.1 and the tokens from `tokens.md`, build the production homepage per `homepage.md`'s full spec: real (even if draft) hero copy, the three-card section with real icons pulled from `oldsite/commercial/assets/`, `oldsite/connect/branding/`, and equivalent Personal & Property assets, and the "why we exist" section. Build the nav row as a shared component (`SubsiteNav.tsx`) intended for reuse across all three subsites in Phase 5 — do not build a homepage-only nav.

**Prompt 4.2 — CTA resolution**
> Flag the homepage CTA button label and destination as unresolved per `plan.md` §2 open decision #1. Implement it as a clearly-labeled placeholder (e.g., a `TODO` in a visible admin note, not invisible in code) until Matt confirms the real label/destination — do not invent final copy here.

---

## Phase 5 — Subsite Architecture Pass

**Prompt 5.1 — Commercial subsite**
> Stand up `/commercial/*` as a route group reusing `SubsiteNav.tsx` and the shared footer from Phase 4. Migrate the calculator/compare-report tool from its old homepage placement into the Commercial subsite's hero or a dedicated `/commercial/compare/` page — this is new territory since it was previously on the homepage; use `oldsite/commercial/comparison-report.html` and `oldsite/commercial/repayment-calculator.html` as functional/content references, not as code to port directly. Apply the redirect map from Prompt 1.1 and verify every old Commercial URL resolves correctly.

**Prompt 5.2 — Connect subsite**
> Stand up `/connect/*` reusing the same shared nav/footer components. Reuse content from `oldsite/connect/*.html` (about, FAQs, for-customers, for-vendors, how-it-works) as the copy/content source, rewritten into the new component structure — not copy-pasted HTML. Apply Connect's gold-primary/navy-accent tokens per `buildspec.md` §4.

**Prompt 5.3 — Personal & Property subsite**
> Stand up `/personal-and-property/*` reusing the same shared nav/footer components. Reuse content from `oldsite/personal-and-property/*.html` as the copy/content source. Apply Personal & Property's peach-primary/navy-accent tokens.

**Prompt 5.4 — Sticky channel dial**
> Build `StickyChannelDial.tsx` per `buildspec.md` §5: renders only on subsite pages, appears once scrolled past that subsite's own hero, shows all three channels plus an explicit link back to `/`, with an active-state treatment tinted to the current channel's accent color. Verify contrast on all three channel backgrounds, not just one.

**Prompt 5.5 — Full link audit**
> Crawl every route in the new site (homepage + all three subsites) and confirm zero broken internal links, zero 404s from the redirect map, and that every page loads the shared nav/footer components byte-for-byte identically in structure (accent color aside). Report any discrepancy found.

---

## Phase 6 — Copy Pass

**Prompt 6.1 — Homepage copy finalization**
> Draft final copy options for the homepage master statement, subhead, three card one-liners, and "why we exist" section, following the "short captions over long paragraphs" guardrail from `plan.md`/`claude.md`. Present 2–3 options per section rather than a single locked draft, since hero copy sign-off is an explicit open item.

**Prompt 6.2 — Subsite copy tightening**
> Review the reused copy from Phase 5 against the same "less is more" guardrail and against the SEO guardrails in `oldsite/docs/research-notes.md` (specific benefit + number in meta titles/descriptions, above-the-fold trust signals, mobile-friendly form length). Tighten without rewriting from scratch — this is an edit pass, not a rewrite.

---

## Phase 7 — Vercel Stakeholder Review

**Prompt 7.1 — Deploy for review**
> Deploy the current full state (homepage + all three subsites) to a Vercel preview URL and prepare a short written summary of what's ready for review vs. still placeholder (CTA copy, hero copy, any unresolved open decision from `plan.md` §2). Do not deploy to production.

---

## Phase 8 — Pre-Launch Technical Audits

Run each of these as its own prompt/session, not chained:

**Prompt 8.1 — Security audit**
> Audit CSP configuration (no `unsafe-inline`), confirm Turnstile is wired front-to-back on every form, confirm no form silently discards submissions on failure. Report findings with file/line references, not general statements.

**Prompt 8.2 — Dependency & architecture review**
> Run a dependency audit on the new scaffold. Separately, confirm the shared-component approach (Next.js components) structurally eliminates the old "3 of 66 pages synced" class of propagation bug — verify by checking that nav/footer changes only need to happen in one file location, not by assumption.

**Prompt 8.3 — UI/UX & accessibility audit**
> Check contrast ratios for all three channel accent treatments against WCAG AA, confirm every hover-only interaction has a working keyboard/touch equivalent, confirm 44×44px touch targets sitewide.

**Prompt 8.4 — Performance & SEO audit**
> Verify the full redirect map resolves correctly against a production-like build (not just dev server), confirm updated `sitemap.xml`/`robots.txt` are correct, capture Core Web Vitals baseline for the homepage.

**Prompt 8.5 — Resilience & observability audit**
> Confirm rate limiting works correctly in a serverless/multi-instance context (this was a named issue on the prior build — verify it's actually fixed here, not assumed fixed because the framework changed). Confirm error monitoring and form-submission logging are in place.

**Prompt 8.6 — Folder sanity check**
> Confirm `oldsite/` is fully excluded from the production build output, confirm no duplicate or orphaned routes exist, confirm no broken references to old-domain asset paths anywhere in the new codebase.

**Prompt 8.7 — Consolidated report**
> Compile all Phase 8 findings into `pre-launch-audit-report.md` with a pass/fail/deferred status and owner for every item. No item should be left as an unstated assumption.

---

## Phase 9 — Launch

**Prompt 9.1 — Production deploy**
> Ask for explicit confirmation in chat before running this. Once confirmed: deploy to production, verify the redirect map live (not preview), submit the updated sitemap to Search Console same day, and report the live URL plus a spot-check of five old Commercial URLs confirming they redirect correctly in production.

---

## Phase 10 — Post-Launch

**Prompt 10.1 — SEO monitoring setup**
> Set up (or confirm existing) Search Console tracking specifically for brand-term ranking and click-share on the new homepage, to run for 4–6 weeks post-launch per `plan.md` §3's SEO risk mitigation.

**Prompt 10.2 — ICP, journey, and conversion case study**
> Once sufficient post-launch data exists, define the ideal customer profile and user journey per channel, and produce a before/after conversion comparison between the old Commercial-as-homepage flow and the new homepage-first flow.
