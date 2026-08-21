# Prompt Library — Trade Funding Homepage-First Rebuild

**Status: v2 — resequencing pass, matches `plan.md`.** Execution order is now **Phase 0 → Phase 1 (Design Tokens) → Phase 2 (Wireframe) → Phase 3 (IA/Routing/Redirect) → Phase 4 onward**, not the original 0-1-2-3 numeric order. Phase 0 is done. Phase 2 is done, and was built in Claude Design, not this prompt library. **Every prompt below is tagged with its venue** — run it in the tool named, not just wherever's convenient:

| Tag | Venue | What that means practically |
|---|---|---|
| 💬 | **Claude Chat** | A normal conversation. No repo/file access needed — output is a decision, a document, or draft copy. |
| 🎨 | **Claude Design** | Claude's visual design/mockup tooling. Not this repo's codebase. |
| 💻 | **Claude Code** | Real repo work — needs the actual project files, runs builds, touches deploys. |

Run phases sequentially, one at a time — get a review checkpoint between phases rather than chaining multiple in one uninterrupted run.

**Before Prompt 1.1:** make sure `plan.md`, `claude.md`, `buildspec.md`, and `homepage.md` are all sitting at the repo root, and that any AI session working on this reads them first, in that order.

---

## Phase 0 — Archive & Environment Reset — 💻 Claude Code — ✅ DONE

**Prompt 0.1 — Quarantine the old build** *(done)*
> Move all existing site content (the `commercial/`, `connect/`, `personal-and-property/`, and `docs/` folders, plus any loose HTML/CSS/JS at the repo root) into a single `oldsite/` folder if not already done. Confirm `oldsite/` is excluded from the Vercel build via `.vercelignore` and from any TypeScript/Next.js build glob.

**Prompt 0.2 — Fresh scaffold** *(done)*
> Starting from an empty repo root (with `oldsite/` quarantined per Prompt 0.1), scaffold a new Next.js App Router + TypeScript project with Payload CMS 3.x installed in-app, per `buildspec.md` §1.

---

## Phase 1 — Design Tokens & Brand Deviation Sign-off *(formerly Phase 2)* — 💬 Claude Chat

**Prompt 1.1 — Rebuild tokens.md**
> 💬 Create a fresh `tokens.md` at the repo root using the exact color values in `buildspec.md` §4 (do not alter any hex value). Add the DM Sans typography decision as a clearly flagged deviation from the brand guidelines PDF, with a note that the guidelines document itself needs a follow-up update from Matt. This is a spec/document prompt — no code implementation, no CSS files touched yet.

**Prompt 1.2 — Brand guideline amendment note**
> 💬 Draft a short, one-paragraph note for Matt confirming the DM Sans decision and asking him to formally sign off on updating `Trade Funding — Brand Guidelines.pdf` (or explicitly confirm it stays a website-only exception). This is a message to send, not a code change.

---

## Phase 2 — Homepage Wireframe & Approval *(formerly Phase 3)* — 🎨 Claude Design — ✅ DONE

**Prompt 2.1 — Wireframe** *(done, built in Claude Design — no chat/code prompt needed here)*
> 🎨 Structure already built: nav row (logo, Products/Choice/About placeholder links, CTA button placeholder), hero (placeholder headline/subhead, no calculator), three-card section (Commercial/Connect/Personal & Property, placeholder icons/copy), "why we exist" placeholder section, footer.

*(Checkpoint: Matt's sign-off on this wireframe is the gate before Phase 4. If that sign-off hasn't happened yet, don't start Phase 4.)*

---

## Phase 3 — IA, Routing & Redirect Lock *(formerly Phase 1)* — 💬 Claude Chat

**Prompt 3.1 — Build the full redirect map**
> 💬 Using `oldsite/commercial/` as the source of truth, enumerate every `.html` file currently reachable from the old site root and produce a complete 301 redirect table mapping each old URL to its new `/commercial/...` equivalent, per the skeleton in `buildspec.md` §3. Flag `self-employed-home-loan.html` explicitly for a channel-placement decision (Commercial vs. Personal & Property) rather than defaulting silently. Output `redirect-map.md` as a human-readable table — this is a planning document, not a code file. (The code implementation of this table, `redirects.ts`/`next.config.js`, happens in Phase 5, in Claude Code.)

**Prompt 3.2 — Route map confirmation**
> 💬 Produce `route-map.md` listing every final route in the new site (homepage, all Commercial/Connect/Personal & Property pages) with its intended Payload `channel` value and page title. Cross-check against `oldsite/docs/Master Information Architecture & Sitemap.md` for anything that might have been missed. Flag any discrepancy rather than resolving it silently. This is a document to review with Matt/Ben before Phase 4/5 implementation — no code involved.

---

## Phase 4 — Homepage Production — 💻 Claude Code

**Prompt 4.1 — Real homepage build**
> 💻 Using the approved wireframe from Phase 2 and the tokens from `tokens.md` (Phase 1), build the production homepage per `homepage.md`'s full spec: real (even if draft) hero copy, the three-card section with real icons pulled from `oldsite/commercial/assets/`, `oldsite/connect/branding/`, and equivalent Personal & Property assets, and the "why we exist" section. Build the nav row as a shared component (`SubsiteNav.tsx`) intended for reuse across all three subsites in Phase 5 — do not build a homepage-only nav.

**Prompt 4.2 — CTA resolution**
> 💻 Flag the homepage CTA button label and destination as unresolved per `plan.md` §2 open decision #1. Implement it as a clearly-labeled placeholder (a visible `TODO`, not invisible in code) until Matt confirms the real label/destination.

---

## Phase 5 — Subsite Architecture Pass — 💻 Claude Code

**Prompt 5.1 — Commercial subsite**
> 💻 Stand up `/commercial/*` as a route group reusing `SubsiteNav.tsx` and the shared footer from Phase 4. Migrate the calculator/compare-report tool from its old homepage placement into the Commercial subsite. Use `oldsite/commercial/comparison-report.html` and `oldsite/commercial/repayment-calculator.html` as functional/content references, not as code to port directly. **Implement the Phase 3 redirect table (`redirect-map.md`) here as real `next.config.js`/`vercel.json` redirects** and verify every old Commercial URL resolves correctly.

**Prompt 5.2 — Connect subsite**
> 💻 Stand up `/connect/*` reusing the same shared nav/footer components. Reuse content from `oldsite/connect/*.html` as the copy/content source, rewritten into the new component structure. Apply Connect's gold-primary/navy-accent tokens per `buildspec.md` §4.

**Prompt 5.3 — Personal & Property subsite**
> 💻 Stand up `/personal-and-property/*` reusing the same shared nav/footer components. Reuse content from `oldsite/personal-and-property/*.html` as the copy/content source. Apply Personal & Property's peach-primary/navy-accent tokens.

**Prompt 5.4 — Sticky channel dial**
> 💻 Build `StickyChannelDial.tsx` per `buildspec.md` §5: renders only on subsite pages, appears once scrolled past that subsite's own hero, shows all three channels plus an explicit link back to `/`, with an active-state treatment tinted to the current channel's accent color. Verify contrast on all three channel backgrounds.

**Prompt 5.5 — Full link audit**
> 💻 Crawl every route in the new site (homepage + all three subsites) and confirm zero broken internal links, zero 404s against the Phase 3 redirect map, and that every page loads the shared nav/footer components byte-for-byte identically in structure. Report any discrepancy found.

---

## Phase 6 — Copy Pass — 💬 Claude Chat (draft) → 💻 Claude Code (apply)

**Prompt 6.1 — Homepage copy finalization**
> 💬 Draft final copy options for the homepage master statement, subhead, three card one-liners, and "why we exist" section, following the "short captions over long paragraphs" guardrail from `plan.md`/`claude.md`. Present 2–3 options per section rather than a single locked draft.

**Prompt 6.2 — Subsite copy tightening**
> 💬 Review the reused copy from Phase 5 against the "less is more" guardrail and the SEO guardrails in `oldsite/docs/research-notes.md`. Produce the tightened copy as a document (`copy-final.md`).

**Prompt 6.3 — Apply copy to pages**
> 💻 Take the approved `copy-final.md` from Prompt 6.2 and apply it to the actual homepage and subsite components/CMS entries. This is the code step — don't skip straight here without the chat drafting pass above.

---

## Phase 7 — Vercel Stakeholder Review — 💻 Claude Code

**Prompt 7.1 — Deploy for review**
> 💻 Deploy the current full state (homepage + all three subsites) to a Vercel preview URL and prepare a short written summary of what's ready for review vs. still placeholder. Do not deploy to production.

---

## Phase 8 — Pre-Launch Technical Audits — 💻 Claude Code

**Prompt 8.1 — Security audit**
> 💻 Audit CSP configuration (no `unsafe-inline`), confirm Turnstile is wired front-to-back on every form, confirm no form silently discards submissions on failure. Report findings with file/line references.

**Prompt 8.2 — Dependency & architecture review**
> 💻 Run a dependency audit on the new scaffold. Confirm the shared-component approach structurally eliminates the old "3 of 66 pages synced" propagation bug by verifying nav/footer changes only need to happen in one file location.

**Prompt 8.3 — UI/UX & accessibility audit**
> 💻 Check contrast ratios for all three channel accent treatments against WCAG AA, confirm every hover-only interaction has a working keyboard/touch equivalent, confirm 44×44px touch targets sitewide.

**Prompt 8.4 — Performance & SEO audit**
> 💻 Verify the Phase 3/5 redirect map resolves correctly against a production-like build, confirm updated `sitemap.xml`/`robots.txt` are correct, capture Core Web Vitals baseline for the homepage.

**Prompt 8.5 — Resilience & observability audit**
> 💻 Confirm rate limiting works correctly in a serverless/multi-instance context. Confirm error monitoring and form-submission logging are in place.

**Prompt 8.6 — Folder sanity check**
> 💻 Confirm `oldsite/` is fully excluded from the production build output, confirm no duplicate or orphaned routes exist, confirm no broken references to old-domain asset paths.

**Prompt 8.7 — Consolidated report**
> 💻 Compile all Phase 8 findings into `pre-launch-audit-report.md` with a pass/fail/deferred status and owner for every item.

---

## Phase 9 — Launch — 💻 Claude Code

**Prompt 9.1 — Production deploy**
> 💻 Ask for explicit confirmation in chat before running this. Once confirmed: deploy to production, verify the redirect map live, submit the updated sitemap to Search Console same day, and report the live URL plus a spot-check of five old Commercial URLs confirming they redirect correctly in production.

---

## Phase 10 — Post-Launch — 💬 Claude Chat (analysis) + 💻 Claude Code (tracking setup)

**Prompt 10.1 — SEO monitoring setup**
> 💻 Set up (or confirm existing) Search Console tracking specifically for brand-term ranking and click-share on the new homepage, to run for 4–6 weeks post-launch per `plan.md` §3.

**Prompt 10.2 — ICP, journey, and conversion case study**
> 💬 Once sufficient post-launch data exists, define the ideal customer profile and user journey per channel, and produce a before/after conversion comparison between the old Commercial-as-homepage flow and the new homepage-first flow. This is an analysis/strategy prompt — pull data via Claude Code first if it isn't already summarized, but the synthesis itself is a chat-based task.
