# Prompt Library — Trade Funding Homepage-First Rebuild

**Status: v4.** Two changes from v3: **Phase 3 now includes Prompt 3.3**, updating the Master IA & Sitemap doc itself (not just cross-checking against it). **Phase 10 is now "Payload Conversion & Vercel Launch,"** with its prompts taken from Abrar's `Trade Funding Build Walkthrough for Jana.pdf` rather than a generic deploy description. Execution order: Phase 0 → 1 (Design Tokens) → 2 (Wireframe) → 3 (IA/Routing/Redirect) → 4 (Site Folder & Route Scaffold) → 5 (Homepage Production) → 6 (Subsite Pass) → 7 (Copy) → 8 (Stakeholder Review) → 9 (Audits) → 10 (Payload Conversion & Vercel Launch) → 11 (Post-Launch). **Phases 0–2 are done.** Old Prompt 1.2 (brand guideline amendment note) remains removed — not being implemented.

| Tag | Venue | What that means practically |
|---|---|---|
| 💬 | **Claude Chat** | A normal conversation. No repo/file access needed — output is a decision, a document, or draft copy. |
| 🎨 | **Claude Design** | Claude's visual design/mockup tooling. Not this repo's codebase. |
| 💻 | **Claude Code** | Real repo work — needs the actual project files, runs builds, touches deploys. |

Run phases sequentially, one at a time — get a review checkpoint between phases rather than chaining multiple in one uninterrupted run.

**Before Prompt 3.1:** make sure `plan.md`, `claude.md`, `buildspec.md`, and `homepage.md` are all sitting at the repo root, and that any AI session working on this reads them first, in that order.

---

## Phase 0 — Archive & Environment Reset — 💻 Claude Code — ✅ DONE

*(Done — see `plan.md` §4, Phase 0 for the verified specifics: Next.js 16 + Payload 3.88.0 scaffolded, local Postgres 16 dev DB migrated, build/dev both confirmed working, `oldsite/` untouched, tree committed but not pushed. One follow-up surfaced: Node 22 is required, system default Node 26 crashes Payload's config loader — a `.nvmrc`/`engines` pin is still outstanding, tracked in Phase 9.)*

---

## Phase 1 — Design Tokens & Brand Deviation Sign-off *(formerly Phase 2)* — 💬 Claude Chat — ✅ DONE

**Prompt 1.1 — Rebuild tokens.md** *(done)*
> 💬 Create a fresh `tokens.md` at the repo root using the exact color values in `buildspec.md` §4 (do not alter any hex value).

*(Old Prompt 1.2 — brand guideline amendment note — removed. Not being implemented. The DM Sans-vs-brand-guidelines deviation stays documented in `tokens.md`/`buildspec.md`; formally updating the guidelines PDF itself is being handled outside this prompt library.)*

---

## Phase 2 — Homepage Wireframe & Approval *(formerly Phase 3)* — 🎨 Claude Design — ✅ DONE

*(Done, built directly in Claude Design — no chat/code prompt needed here.)*

---

## Phase 3 — IA, Routing & Redirect Lock *(formerly Phase 1)* — 💬 Claude Chat

**Prompt 3.1 — Build the full redirect map**
> 💬 Using `oldsite/commercial/` as the source of truth, enumerate every `.html` file currently reachable from the old site root and produce a complete 301 redirect table mapping each old URL to its new `/commercial/...` equivalent, per the skeleton in `buildspec.md` §3. Flag `self-employed-home-loan.html` explicitly for a channel-placement decision (Commercial vs. Personal & Property) rather than defaulting silently. Output `redirect-map.md` as a human-readable table — this is a planning document, not a code file. (The code implementation happens in Phase 6.)

**Prompt 3.2 — Route map confirmation**
> 💬 Produce `route-map.md` listing every final route in the new site (homepage, all Commercial/Connect/Personal & Property pages) with its intended Payload `channel` value and page title. Cross-check against `oldsite/docs/Master Information Architecture & Sitemap.md` for anything that might have been missed — this is a read-only reference check at this step; the doc itself gets updated in Prompt 3.3. This document is the direct input to Phase 4's folder scaffold — nothing gets a folder in Phase 4 that isn't named here first.

**Prompt 3.3 — Update the Master IA & Sitemap doc**
> 💬 The existing `oldsite/docs/Master Information Architecture & Sitemap.md` describes the pre-pivot architecture (Commercial at root `/`, `ChannelSwitcher` hiding the current channel) and is now out of date on exactly the points this rebuild changes. Using it as a starting reference, produce a fresh `master-ia-sitemap.md` at the repo root: carry forward every page-level entry that hasn't changed (source asset, SEO intent, duplicate-resolution calls), but correct the routing model to match `redirect-map.md`/`route-map.md` from Prompts 3.1/3.2 — new homepage at `/`, Commercial's full page inventory now under `/commercial/*`, and the sticky-dial behavior per `homepage.md` §4 replacing the old "hide the current channel" `ChannelSwitcher` spec. Do not edit the `oldsite/` copy — it stays as a historical record. `master-ia-sitemap.md` becomes the canonical IA reference for every phase from here on.

---

## Phase 4 — Site Folder & Route Scaffold (NEW) — 💻 Claude Code

**Prompt 4.1 — Scaffold the site folders**
> 💻 Using `route-map.md` and `master-ia-sitemap.md` from Phase 3 as the source of truth, create the Next.js route folders for `/` (home), `/commercial/*`, `/connect/*`, `/personal-and-property/*`, plus the shared `components/`, `collections/`, `globals/` structure per `buildspec.md` §2. Each route gets a minimal placeholder page only (e.g., channel name + "content coming in Phase 5/6") — do not write real hero copy, cards, or subsite content here, this prompt is structure-only. Confirm `npm run build` succeeds and every route returns 200 locally. Confirm none of the new folders collide with anything in the quarantined `oldsite/`.

*(Checkpoint: don't start Phase 5 until all four route groups build and resolve as placeholders.)*

---

## Phase 5 — Homepage Production *(formerly Phase 4)* — 💻 Claude Code

**Prompt 5.1 — Real homepage build**
> 💻 Using the approved wireframe from Phase 2, the tokens from `tokens.md` (Phase 1), and the `app/page.tsx` scaffolded in Phase 4, build the production homepage per `homepage.md`'s full spec: real (even if draft) hero copy, the three-card section with real icons pulled from `oldsite/commercial/assets/`, `oldsite/connect/branding/`, and equivalent Personal & Property assets, and the "why we exist" section. Build the nav row as a shared component (`SubsiteNav.tsx`) intended for reuse across all three subsites in Phase 6 — do not build a homepage-only nav.

**Prompt 5.2 — CTA resolution**
> 💻 Flag the homepage CTA button label and destination as unresolved per `plan.md` §2 open decision #1. Implement it as a clearly-labeled placeholder (a visible `TODO`, not invisible in code) until Matt confirms the real label/destination.

---

## Phase 6 — Subsite Architecture Pass *(formerly Phase 5)* — 💻 Claude Code

**Prompt 6.1 — Commercial subsite**
> 💻 Fill in the `app/commercial/` route group scaffolded in Phase 4, reusing `SubsiteNav.tsx` and the shared footer from Phase 5. Migrate the calculator/compare-report tool from its old homepage placement into the Commercial subsite. Use `oldsite/commercial/comparison-report.html` and `oldsite/commercial/repayment-calculator.html` as functional/content references, not as code to port directly. **Implement the Phase 3 redirect table (`redirect-map.md`) here as real `next.config.js`/`vercel.json` redirects** and verify every old Commercial URL resolves correctly.

**Prompt 6.2 — Connect subsite**
> 💻 Fill in the `app/connect/` route group, reusing the same shared nav/footer components. Reuse content from `oldsite/connect/*.html` as the copy/content source, rewritten into the new component structure. Apply Connect's gold-primary/navy-accent tokens per `buildspec.md` §4.

**Prompt 6.3 — Personal & Property subsite**
> 💻 Fill in the `app/personal-and-property/` route group, reusing the same shared nav/footer components. Reuse content from `oldsite/personal-and-property/*.html` as the copy/content source. Apply Personal & Property's peach-primary/navy-accent tokens.

**Prompt 6.4 — Sticky channel dial**
> 💻 Build `StickyChannelDial.tsx` per `buildspec.md` §5: renders only on subsite pages, appears once scrolled past that subsite's own hero, shows all three channels plus an explicit link back to `/`, with an active-state treatment tinted to the current channel's accent color. Verify contrast on all three channel backgrounds.

**Prompt 6.5 — Full link audit**
> 💻 Crawl every route in the new site (homepage + all three subsites) and confirm zero broken internal links, zero 404s against the Phase 3 redirect map, and that every page loads the shared nav/footer components byte-for-byte identically in structure. Report any discrepancy found.

---

## Phase 7 — Copy Pass *(formerly Phase 6)* — 💬 Claude Chat (draft) → 💻 Claude Code (apply)

**Prompt 7.1 — Homepage copy finalization**
> 💬 Draft final copy options for the homepage master statement, subhead, three card one-liners, and "why we exist" section, following the "short captions over long paragraphs" guardrail from `plan.md`/`claude.md`. Present 2–3 options per section rather than a single locked draft.

**Prompt 7.2 — Subsite copy tightening**
> 💬 Review the reused copy from Phase 6 against the "less is more" guardrail and the SEO guardrails in `oldsite/docs/research-notes.md`. Produce the tightened copy as a document (`copy-final.md`).

**Prompt 7.3 — Apply copy to pages**
> 💻 Take the approved `copy-final.md` from Prompt 7.2 and apply it to the actual homepage and subsite components/CMS entries.

---

## Phase 8 — Vercel Stakeholder Review *(formerly Phase 7)* — 💻 Claude Code

**Prompt 8.1 — Deploy for review**
> 💻 Deploy the current full state (homepage + all three subsites) to a Vercel preview URL and prepare a short written summary of what's ready for review vs. still placeholder. Do not deploy to production.

---

## Phase 9 — Pre-Launch Technical Audits *(formerly Phase 8)* — 💻 Claude Code

**Prompt 9.1 — Security audit**
> 💻 Audit CSP configuration (no `unsafe-inline`), confirm Turnstile is wired front-to-back on every form, confirm no form silently discards submissions on failure. Report findings with file/line references.

**Prompt 9.2 — Dependency & architecture review**
> 💻 Run a dependency audit on the new scaffold. Confirm the shared-component approach structurally eliminates the old "3 of 66 pages synced" propagation bug by verifying nav/footer changes only need to happen in one file location.

**Prompt 9.3 — UI/UX & accessibility audit**
> 💻 Check contrast ratios for all three channel accent treatments against WCAG AA, confirm every hover-only interaction has a working keyboard/touch equivalent, confirm 44×44px touch targets sitewide.

**Prompt 9.4 — Performance & SEO audit**
> 💻 Verify the Phase 3/6 redirect map resolves correctly against a production-like build, confirm updated `sitemap.xml`/`robots.txt` are correct, capture Core Web Vitals baseline for the homepage.

**Prompt 9.5 — Resilience & observability audit**
> 💻 Confirm rate limiting works correctly in a serverless/multi-instance context. Confirm error monitoring and form-submission logging are in place.

**Prompt 9.6 — Folder & environment sanity check**
> 💻 Confirm `oldsite/` is fully excluded from the production build output, confirm no duplicate or orphaned routes exist, confirm no broken references to old-domain asset paths. Also confirm a `.nvmrc`/`engines` field has been added pinning Node 22 (flagged during Phase 0 — verify it's actually been done, not assumed).

**Prompt 9.7 — Consolidated report**
> 💻 Compile all Phase 9 findings into `pre-launch-audit-report.md` with a pass/fail/deferred status and owner for every item.

---

## Phase 10 — Payload Conversion & Vercel Launch *(formerly Phase 9; now follows Abrar's Build Walkthrough)* — 💻 Claude Code

These prompts are taken directly from `Trade Funding Build Walkthrough for Jana.pdf` (Guide 2 of 2), adapted to this project's specifics — use them close to verbatim rather than re-describing the steps generically.

**Prompt 10.0 — Decide what's editable (do this before 10.1, not a prompt to Claude)**
> Your call, not Claude's: beyond the `pages` / `channelCards` / `siteNav` collections already locked in `buildspec.md` §6, decide whether **Team Members**, **Lender logos/partners**, and **News/blog posts** need their own Payload collection for this build. Anything left off stays fixed in code — per the guide, "which is fine, and actually safer."

**Prompt 10.1 — Prep the project for GitHub + Vercel**
> 💻 Get this project ready to deploy on Vercel. Create a new private GitHub repository and push the code. Generate a secure `PAYLOAD_SECRET` value for me. Then give me a short, numbered checklist of exactly what to click in Vercel to deploy it, including adding a Neon Postgres database and Blob storage for images.

**Prompt 10.2 — Verify the live deploy**
> 💻 Once deployed: confirm `your-site.vercel.app/admin` loads, walk me through creating the admin account on the live database (separate from local), and verify a content edit made in the live dashboard shows up on the public site. Report the live URL.

*(Checkpoint: share the `.vercel.app` link with Matt and Ben for review here — this is the guide's own definition of done for this phase. Domain cutover below is separate and later — don't let it hold up sharing the link.)*

**Prompt 10.3 — Domain cutover (later, optional — only after Matt/Ben approve the `.vercel.app` site)**
> 💻 The site is live on Vercel and approved. I now want to point our real domain `tradefunding.com.au` at it. Our DNS is managed in Cloudflare. Walk me through it one step at a time: what to do in Vercel first, then exactly which DNS records to add in Cloudflare and what proxy setting to use. Ask me to confirm after each step before moving on.

**Troubleshooting reference for this phase (from the guide's "if something goes wrong" section):**
- *"Node version" errors on deploy* → set the Vercel project's Node version to 20.x+ and redeploy. Related to the Node 22 requirement flagged in Phase 0 (Node 26 crashes Payload's config loader) — check the `.nvmrc`/`engines` pin from Phase 9 actually covers Vercel's build environment too, not just local.
- *Images work locally but not live* → Blob storage was skipped during deploy; add it in Vercel's Storage tab and redeploy.
- *Dashboard is empty after going live* → expected, the live DB starts blank; re-enter or export/import content once.

---

## Phase 11 — Post-Launch *(formerly Phase 10)* — 💬 Claude Chat (analysis) + 💻 Claude Code (tracking setup)

**Prompt 11.1 — SEO monitoring setup**
> 💻 Set up (or confirm existing) Search Console tracking specifically for brand-term ranking and click-share on the new homepage, to run for 4–6 weeks post-launch per `plan.md` §3.

**Prompt 11.2 — ICP, journey, and conversion case study**
> 💬 Once sufficient post-launch data exists, define the ideal customer profile and user journey per channel, and produce a before/after conversion comparison between the old Commercial-as-homepage flow and the new homepage-first flow.
