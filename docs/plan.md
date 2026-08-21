# Trade Funding — Homepage-First Rebuild Plan

**Status: v2 — resequencing pass.** Phase order changed from the original v1 draft: Phase 0 stays first, but **Phase 1 (Design Tokens) and Phase 2 (Homepage Wireframe) now run before Phase 3 (IA/Routing/Redirect Lock)** — reflecting that tokens need to exist before the wireframe can be designed, and the wireframe needs to exist before the real route/redirect map is finalized against actual page structure. Phase 0 is **done**. Phase 2 (wireframe) is **done, built in Claude Design**. No phase content changed beyond this reordering and the venue tags added throughout — see the legend below. This supersedes the old `CLAUDE.md` / `plan.md` / `buildspec.md` / `prompts.md` (v11) in this repo.

**Source materials this plan is built from:** Matt's shared Claude conversation (2+1 architecture, "business capital from every angle"), the 2026-08-21 sprint transcript (Matt + Jana), the homepage mockup screenshot, `Trade Funding — Brand Guidelines.pdf`, and the retained `oldsite/` static build (for content/product-data reference).

---

## Venue legend (which tool runs each phase)

Every phase below is tagged with where the work actually happens — this matters because "Claude Chat" work is conversational/decision-making (no repo access needed), "Claude Design" is visual mockup/wireframe work, and "Claude Code" is real repo/implementation work. `prompts.md` carries this same tag on every individual prompt.

| Tag | What it means |
|---|---|
| 💬 **Claude Chat** | Conversation only — decisions, research, copywriting, redirect/route tables as documents. No code repo involved. |
| 🎨 **Claude Design** | Visual mockup/prototype tooling — wireframes, layout exploration. Not the production codebase. |
| 💻 **Claude Code** | Actual repo work — components, pages, config, deploys. |

---

## 0. The pivot, in one paragraph

The old architecture put Commercial at `/` as the hero brand, with Connect and Personal & Property reached via a "ChannelSwitcher" from inside Commercial. The new architecture — confirmed by Matt in the transcript and locked for this rebuild — makes **the homepage itself a neutral, brand-level entry point**, not Commercial's page. `/` becomes a short, high-impact directory: master statement ("Business capital, from every angle") plus three equal-weight cards — **Commercial, Connect, Personal & Property** — each linking to its own subsite. **Commercial moves off root to `/commercial/`**, becoming a peer of `/connect/` and `/personal-and-property/`, not their parent.

This is a "2+1" architecture, not a "3 equal" one: Commercial and Personal & Property are full customer-facing product tracks; Connect is a partner/vendor-facing track with less overall site weight — but on the homepage itself, per Matt's explicit instruction, all three get equal visual treatment as entry cards. The audience-weighting shows up in each subsite's depth and nav prominence, not on the homepage.

---

## 1. Locked decisions (do not re-litigate without a chat with Matt)

| Decision | Locked answer | Source |
|---|---|---|
| Root URL owner | New neutral homepage. Commercial moves to `/commercial/`. | Confirmed for this rebuild |
| Code reuse | Full rebuild. `oldsite/` is reference-only (content, product data, FAQs) — no components/CSS ported directly. | Confirmed for this rebuild |
| Old docs (v11) | Fully replaced by this doc set. | Confirmed for this rebuild |
| Homepage nav | One row: logo, `Products` / `Choice` / `About`, CTA button (not "Get started" — that was Claude taking liberties in the original mockup; needs a real CTA decision, e.g. "Compare now" or "Contact us"). | Transcript 00:10:40–00:11:29 |
| Three-card section | Commercial / Connect / Personal & Property, equal visual weight, icon + one-liner + "Explore →" each. | Transcript + screenshot |
| Sticky nav dial | Appears once scrolled past the hero **inside a subsite**, not on the homepage itself. Shows the current channel plus a way back to Home. This is a renamed/repositioned version of the existing `ChannelSwitcher` component already specced in the old `tokens.md`/`buildspec.md` — reuse the *concept and states*, not the *old markup*. | Transcript 00:34:13–00:38:10 |
| Calculator | Stays, but lives on the **Commercial subsite** (where the compare/apply funnel lives), not on the new homepage. | Transcript 00:15:33–00:19:29 |
| "Why we exist" section | Required, sits below the three cards, homepage only — longer-form brand narrative for the ~2% of visitors who read past the fold. | Transcript 00:30:33–00:32:13 |
| Typography | Work Sans (headings, unchanged) + **DM Sans** (body/UI), replacing Roboto. **This deviates from the current brand guidelines PDF (Work Sans + Roboto).** Matt verbally approved it but flagged the guidelines document itself needs updating — that update has not happened yet. Flagged as an action item in §9. | Transcript 00:28:07–00:29:48 |
| Visual style | Plain white background, no photography/gradient in the hero, typography-led minimalism (Carta/Prospa direction) over the photo-heavy Shift-style hero. See `claude.md` for the full comparative research. | Transcript 00:22:05–00:26:36 |

---

## 2. Open decisions (need Matt's sign-off before the relevant phase starts)

These are real gaps — don't guess on them:

1. **Homepage CTA button label + destination.** "Get started" was flagged as a placeholder Claude invented. Needs a real label (candidates: "Compare now," "Talk to us," "Get funded") and a real destination (Commercial's apply flow? A contact form? Context-dependent per card?).
2. **Whether the homepage needs an actual routing/matching mechanism** ("are these products for me / my customers / me personally," floated by Matt as a `Products` nav-hover interaction) or whether the three-card section alone is sufficient wayfinding. Matt was unsure himself ("I haven't really seen that used... it's just probably a question of whether we need that").
3. **Final hero copy** for the homepage master statement and subhead — directional agreement exists ("Business capital, from every angle"), literal final wording does not.
4. **CTA button copy per card** ("Explore" is a placeholder from the mockup, not confirmed final).

---

## 3. SEO risk this pivot creates — and how we mitigate it

Flagging this explicitly because it's real and it's ours to manage, not Matt's to have already thought through: the retained `oldsite/docs/research-notes.md` records that the **existing Commercial homepage at `/` carries 97.1% of the site's total organic clicks** and ranks at an average position of 13.5 for brand terms. Moving Commercial off `/` to `/commercial/` is not a cosmetic change — it's a URL-level migration on the single highest-equity page in the domain.

Mitigation plan (build this into Phase 3 — IA/Routing/Redirect Lock — not as an afterthought in Phase 8):

- **301 redirect map** for every existing Commercial URL currently live at `/` and its children (`/about.html`, `/apply.html`, `/business-loans.html`, etc.) to their new `/commercial/...` equivalents — one-to-one, no redirect chains.
- **Updated `robots.txt` and `sitemap.xml`** reflecting the new URL set, submitted to Search Console on launch day, not weeks later.
- **New homepage `/` needs its own meta title/description and structured data** — it's a genuinely new page competing for brand-term intent, not a copy-paste of Commercial's old metadata.
- **Internal linking**: every subsite's footer and the sticky nav dial link back to `/`, so link equity flows into the new homepage quickly rather than pooling only at `/commercial/`.
- **Search Console monitoring for 4–6 weeks post-launch** specifically watching brand-term rankings and click share — this is a named Phase 9 task, not left implicit.

---

## 4. Phases (execution order)

### Phase 0 — Archive & Environment Reset — 💻 Claude Code — ✅ **DONE**
- Move the entire current repo content into `oldsite/` so Claude Code sessions never confuse legacy files with new build targets.
- Confirm `oldsite/` is excluded from Vercel deploys (`.vercelignore`) and from any new `tsconfig`/build glob.
- Start a clean Next.js + Payload scaffold at repo root.
- **Deliverable:** empty, buildable Next.js app; `oldsite/` fully quarantined; this doc set in place at repo root.

### Phase 1 — Design Tokens & Brand Deviation Sign-off *(formerly Phase 2)* — 💬 Claude Chat
- Carry forward the existing per-channel accent system unchanged (it's already correct for this pivot): Commercial = navy/skyblue, Connect = gold, Personal & Property = peach, shared navy/white base.
- Formalize the Work Sans + DM Sans decision as a **documented brand guideline amendment**, not a silent site-only deviation — send Matt a one-line confirmation that the brand guidelines PDF itself should be updated, and log the response.
- This runs before the wireframe (Phase 2) so the tokens exist as real values the wireframe can be designed against, rather than the wireframe inventing placeholder colors that get swapped later.
- **Deliverable:** `tokens.md` (rebuilt fresh, same values, new typography section), a short "brand guideline amendment" note for Matt to countersign.

### Phase 2 — Homepage Wireframe & Approval *(formerly Phase 3)* — 🎨 Claude Design — ✅ **DONE**
- Built as a plain, content-free wireframe first (per Matt's own suggestion: "forget the content... build almost a wireframe... just to go, yeah, we're on 100% the right page").
- Structure: Nav → Hero (master statement + subhead, no calculator) → Three-card section (equal weight) → "Why we exist" section → Footer.
- **Deliverable:** wireframe (done), Matt's explicit go-ahead.

### Phase 3 — IA, Routing & Redirect Lock *(formerly Phase 1)* — 💬 Claude Chat
- Now that the wireframe (Phase 2) shows the actual page structure, lock the final route map against it: `/` (new homepage), `/commercial/*`, `/connect/*`, `/personal-and-property/*`.
- Produce the full 301 redirect table (old Commercial URLs → new `/commercial/...` paths) as a reviewable document — this is a planning/decision artifact, not a code change yet. The redirect *table* is built here in chat; it gets *implemented* in code during Phase 4/5.
- Re-confirm nav labels are consistent with the old `Master Information Architecture & Sitemap.md` where nothing has changed, and flag any label that needs to change now that Commercial is no longer "home."
- **Deliverable:** `redirect-map.md`, `route-map.md` — both written as chat-produced documents, then handed to Phase 4/5 for implementation.

### Phase 4 — Homepage Production — 💻 Claude Code
- Build the approved wireframe (Phase 2) out in code against the real design tokens (Phase 1) and real (even if draft) copy.
- Implement the "Products/Choice/About" nav row as components shared with the subsites (same nav shell, different active state) — do not build a homepage-only nav that has to be reconciled later.
- **Deliverable:** production homepage, deployed to a preview URL.

### Phase 5 — Subsite Architecture Pass (Commercial, Connect, Personal & Property) — 💻 Claude Code
- Stand up the three subsite route groups fresh (`app/commercial/`, `app/connect/`, `app/personal-and-property/`), reusing the shared nav/footer/`ChannelSwitcher`-equivalent component built in Phase 4.
- Re-platform the Commercial calculator/compare-report tool into `/commercial/`, since it no longer lives on the homepage.
- Reuse existing page copy and product data from `oldsite/` per page — this is where "nothing is lost" actually gets executed, distinct from Phase 0's file quarantine.
- Implement the redirect table produced in Phase 3 as actual `next.config.js`/`vercel.json` redirects.
- **Deliverable:** three subsites live on preview, all internal links resolving, Phase 3's redirect map implemented and tested.

### Phase 6 — Copy Pass — 💬 Claude Chat (drafting) + 💻 Claude Code (applying)
- Not before this point, per Matt's explicit sequencing ("don't worry about copy now... design has to go first"). Once design/structure is locked:
  - Homepage: finalize master statement, subhead, three card one-liners, "why we exist" narrative — drafted in chat.
  - Subsites: reuse and tighten `oldsite/docs/copy-final.md`-equivalent content against the new "less is more" guardrail Matt set (short captions over long paragraphs — "98% of people don't read... it's got to be more visual") — drafted in chat, applied to pages in code.
- **Deliverable:** `copy-final.md` (rebuilt), applied to all pages.

### Phase 7 — Vercel Stakeholder Review — 💻 Claude Code
- Deploy to a real Vercel preview URL and get Matt/Ben's eyes on the whole thing **before** the heavier performance/SEO/security pass — this mirrors the sequencing fix already learned on the last build (stakeholder feedback surfacing before, not after, the expensive audit work).
- **Deliverable:** stakeholder feedback log, prioritized fix list.

### Phase 8 — Pre-Launch Technical Audits — 💻 Claude Code
Run all of these, informed by what's already known from the last build cycle:
- **Security:** CSP without `unsafe-inline`, Turnstile actually wired front-to-back (not just server-side), form-submission integrity (no silent discards — a real bug found last time).
- **Dependency risk:** fresh `npm audit`/lockfile check on the new scaffold (it's new, but don't assume zero risk).
- **Architecture review:** confirm the shared-component propagation approach (Next.js components, not the old include-sync script) actually eliminates the "3 of 66 pages synced" class of bug structurally, rather than just moving it.
- **UI/UX & accessibility:** contrast checks per channel accent (especially gold/Connect, which inverts a dark-surface convention), keyboard/touch equivalents for any hover-based nav interaction, 44×44px touch targets.
- **Performance/SEO:** validate the redirect map from Phase 3 actually resolves correctly in production, submit updated sitemap, check Core Web Vitals on the homepage specifically since it's brand-new.
- **State/resilience/observability:** rate limiting (learn from the Vercel rate-limiter memory-state issue already on record), form submission logging, error monitoring.
- **Folder sanity check:** confirm `oldsite/` truly never ships, confirm no duplicate routes, confirm no orphaned old-domain assets.
- **Deliverable:** `pre-launch-audit-report.md`, all blockers resolved or explicitly deferred with owner + date.

### Phase 9 — Launch — 💻 Claude Code
- Flip DNS/production deploy.
- Immediately verify the redirect map live (not just in preview).
- Submit updated sitemap to Search Console same day.
- **Deliverable:** live site, launch checklist signed off.

### Phase 10 — Post-Launch — 💬 Claude Chat (analysis) + 💻 Claude Code (tracking setup)
- 4–6 week SEO monitoring window specifically watching brand-term rankings/click-share given the Phase 3 root-URL change (see §3).
- Define ideal customer profile and user journey per channel — now genuinely informed by real post-launch behavior data rather than assumption.
- Conversion case study: does the new homepage-first flow convert better or worse than the old Commercial-as-homepage flow? This is measurable now that both exist as before/after states.
- **Deliverable:** `post-launch-report.md`, ICP + journey docs, conversion case study.

---

## 5. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Root URL SEO equity loss (see §3) | Redirect map treated as a Phase 3 deliverable, not a Phase 8 afterthought |
| Matt's iterative decision style produces scope churn mid-build | Async WhatsApp-speed check-ins at each phase boundary (wireframe, homepage prod, subsite pass) rather than one big review gate |
| "Less is more" direction collides with vibe-coded execution risk (Jana's own concern: removing graphics may expose vibe-coded typography/spacing) | Lock typography (Work Sans/DM Sans) and spacing tokens explicitly in `buildspec.md` before any page is built, so "plain" doesn't default to "generic" |
| Calculator relocation breaks an existing user expectation/link | Add an explicit redirect/backlink from any legacy calculator URL to its new `/commercial/` home |
| Turnstile / rate-limiter / include-sync issues recur in the new build | New build uses real Next.js components, not the old copy-paste include system — treat this as structurally fixed, but verify explicitly in Phase 8, don't assume |
| Homepage nav-hover product-matching idea (open decision #2) gets built without sign-off and wastes effort | Do not start building it until Matt confirms it's worth the scope — flagged, not started, in this plan |
| Phase 3 (IA/redirect lock) runs in chat, not code — risk that the resulting `redirect-map.md`/`route-map.md` never actually gets implemented | Phase 5 explicitly names "implement Phase 3's redirect table in code" as its own deliverable line, so it can't be silently skipped |

---

## 6. What "done" looks like at each gate

- **End of Phase 2 (wireframe, Claude Design):** ✅ done — Matt has seen and approved a wireframe before any production code is written.
- **End of Phase 3 (IA/redirect, Claude Chat):** a reviewed `redirect-map.md`/`route-map.md` exists as a document — not yet implemented in code, that's Phase 5.
- **End of Phase 5:** every URL from the old site either resolves at its new address or 301s cleanly — zero 404s from internal links.
- **End of Phase 7:** stakeholder feedback is captured in one place, not scattered across WhatsApp threads.
- **End of Phase 8:** every item in this plan's audit list has a pass/fail/deferred status with a name attached — no silent "should be fine."
