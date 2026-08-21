# Trade Funding — Homepage-First Rebuild Plan

**Status: v4.** Two changes from v3: (1) **Phase 3 (IA/Routing/Redirect Lock) now includes updating the Master Information Architecture & Sitemap doc itself**, producing a fresh `master-ia-sitemap.md` that becomes the canonical IA reference going forward — the old `oldsite/docs/` copy stays untouched as a historical record. (2) **Phase 10 is now "Payload Conversion & Vercel Launch,"** rewritten around the concrete steps in Abrar's `Trade Funding Build Walkthrough for Jana.pdf`, replacing the earlier generic "flip DNS" description. Execution order is otherwise unchanged: Phase 0 → Phase 1 (Design Tokens) → Phase 2 (Wireframe) → Phase 3 (IA/Routing/Redirect Lock) → Phase 4 (Site Folder & Route Scaffold) → Phase 5 (Homepage Production) → Phase 6 (Subsite Pass) → Phase 7 (Copy) → Phase 8 (Stakeholder Review) → Phase 9 (Audits) → Phase 10 (Payload Conversion & Vercel Launch) → Phase 11 (Post-Launch). **Phases 0, 1, and 2 are done and verified** — see §4.

**Source materials this plan is built from:** Matt's shared Claude conversation (2+1 architecture, "business capital from every angle"), the 2026-08-21 sprint transcript (Matt + Jana), the homepage mockup screenshot, `Trade Funding — Brand Guidelines.pdf`, `Trade Funding Build Walkthrough for Jana.pdf` (Abrar's Payload/Vercel deployment guide), the retained `oldsite/` static build (for content/product-data reference), and the Phase 0 scaffold session transcript.

---

## Venue legend (which tool runs each phase)

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
| Typography | Work Sans (headings, unchanged) + **DM Sans** (body/UI), replacing Roboto. **This deviates from the current brand guidelines PDF (Work Sans + Roboto).** Matt verbally approved it. The guidelines document itself has not been formally updated — see note in §4, Phase 1. | Transcript 00:28:07–00:29:48 |
| Visual style | Plain white background, no photography/gradient in the hero, typography-led minimalism (Carta/Prospa direction) over the photo-heavy Shift-style hero. See `claude.md` for the full comparative research. | Transcript 00:22:05–00:26:36 |
| Site folder structure | Explicit dedicated phase (Phase 4) to scaffold the four top-level route groups — home, commercial, connect, personal-and-property — before either gets filled with real content. | Added in this revision |

---

## 2. Open decisions (need Matt's sign-off before the relevant phase starts)

1. **Homepage CTA button label + destination.** "Get started" was flagged as a placeholder Claude invented. Needs a real label (candidates: "Compare now," "Talk to us," "Get funded") and a real destination.
2. **Whether the homepage needs an actual routing/matching mechanism** ("are these products for me / my customers / me personally," floated by Matt as a `Products` nav-hover interaction) or whether the three-card section alone is sufficient wayfinding.
3. **Final hero copy** for the homepage master statement and subhead.
4. **CTA button copy per card** ("Explore" is a placeholder from the mockup, not confirmed final).
5. **Brand guidelines PDF formal update** for the DM Sans typography change — verbally approved by Matt, not yet formalized in the actual guidelines document. Not currently assigned to an AI prompt (see Phase 1 note below) — needs a direct owner (Jana/Matt) and a date.

---

## 3. SEO risk this pivot creates — and how we mitigate it

The retained `oldsite/docs/research-notes.md` records that the **existing Commercial homepage at `/` carries 97.1% of the site's total organic clicks** and ranks at an average position of 13.5 for brand terms. Moving Commercial off `/` to `/commercial/` is a URL-level migration on the single highest-equity page in the domain.

Mitigation plan (built into Phase 3 — IA/Routing/Redirect Lock — not as an afterthought at Phase 9):

- **301 redirect map** for every existing Commercial URL currently live at `/` and its children to their new `/commercial/...` equivalents — one-to-one, no redirect chains.
- **Updated `robots.txt` and `sitemap.xml`** reflecting the new URL set, submitted to Search Console on launch day.
- **New homepage `/` needs its own meta title/description and structured data.**
- **Internal linking**: every subsite's footer and the sticky nav dial link back to `/`.
- **Search Console monitoring for 4–6 weeks post-launch** — a named Phase 11 task.

---

## 4. Phases (execution order)

### Phase 0 — Archive & Environment Reset — 💻 Claude Code — ✅ **DONE, verified**

Original scope: quarantine `oldsite/`, scaffold a fresh Next.js + Payload app at repo root.

**What actually happened (from the Phase 0 session):**
- Scaffolded Next.js 16 App Router + TypeScript at repo root (via a scratch build merged in, since `create-next-app` refuses non-empty directories).
- Installed Payload CMS 3.88.0 in-app, with `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/storage-vercel-blob` (installed but not wired — needs a Blob token before enabling), and `sharp`.
- Wired the standard App Router integration: `payload.config.ts`, `collections/Users.ts`, `collections/Media.ts`, admin routes under `app/(payload)/admin/`, REST/GraphQL routes under `app/(payload)/api/`.
- `oldsite/` confirmed completely untouched, excluded via `.vercelignore` **and** now `tsconfig.json`'s exclude list too.
- Set `"type": "module"` in `package.json` — required for Payload's tooling to resolve ESM packages correctly.
- Spun up local Postgres 16 (via Homebrew) as the dev database, ran the initial migration, confirmed both `npm run build` and `npm run dev` work.
- Verified in-browser: `/` and `/admin` both return 200; the admin panel renders Payload's real UI (not an error page) and shows the "create first user" onboarding screen against a real DB connection.
- Git status confirmed clean after committing — local `main` is ahead of `origin/main` but **not pushed**, per the "never push without asking" rule.

**Action item surfaced during this phase (not yet resolved):** the system default Node (26) hits an ESM/CJS interop crash in Payload's `tsx`-based config loader — Node 22 had to be used instead. **Needs a `.nvmrc` or `engines` field added** so future sessions/contributors don't hit the same wall. Flagged in §5 risks table below.

- **Deliverable:** ✅ buildable, verified Next.js + Payload app; `oldsite/` fully quarantined; this doc set in place at repo root.

### Phase 1 — Design Tokens & Brand Deviation Sign-off *(formerly Phase 2)* — 💬 Claude Chat — ✅ **DONE**
- Carried forward the existing per-channel accent system unchanged: Commercial = navy/skyblue, Connect = gold, Personal & Property = peach, shared navy/white base.
- `tokens.md` rebuilt at the repo root using the exact hex values from `buildspec.md` §4, no altered values.
- **Note:** the earlier plan for this phase included drafting a brand-guideline-amendment note for Matt to countersign (old Prompt 1.2) — **that sub-task is not being implemented.** The DM Sans deviation is documented in `tokens.md`/`buildspec.md` as a flagged decision, but the actual brand guidelines PDF update (open decision #5 above) is being handled outside this prompt library, not via an AI prompt.
- **Deliverable:** ✅ `tokens.md`.

### Phase 2 — Homepage Wireframe & Approval *(formerly Phase 3)* — 🎨 Claude Design — ✅ **DONE**
- Built as a plain, content-free wireframe: Nav → Hero (master statement + subhead, no calculator) → Three-card section (equal weight) → "Why we exist" section → Footer.
- **Deliverable:** ✅ wireframe, Matt's explicit go-ahead.

### Phase 3 — IA, Routing & Redirect Lock *(formerly Phase 1)* — 💬 Claude Chat
- Lock the final route map against the approved wireframe: `/` (new homepage), `/commercial/*`, `/connect/*`, `/personal-and-property/*`.
- Produce the full 301 redirect table (old Commercial URLs → new `/commercial/...` paths) as a reviewable document — a planning artifact, not a code change yet.
- Re-confirm nav labels are consistent with the old `Master Information Architecture & Sitemap.md` where nothing has changed, and flag any label that needs to change now that Commercial is no longer "home."
- **Update the Master Information Architecture & Sitemap doc itself.** The version in `oldsite/docs/Master Information Architecture & Sitemap.md` still describes the pre-pivot architecture (Commercial at root, `ChannelSwitcher` hiding the current channel) — it's now stale on the exact points this pivot changes. This phase produces a fresh `master-ia-sitemap.md` at the repo root (not inside `oldsite/`), carrying forward everything that hasn't changed (page inventory, duplicate-resolution calls, per-page SEO intent) but correcting the routing model, the home page entry, and the `ChannelSwitcher`/sticky-dial behavior to match `plan.md` §1 and `homepage.md`. This becomes the canonical IA reference for Phase 4 onward — the `oldsite/` copy stays untouched as a historical record of the old architecture, same as the rest of `oldsite/`.
- **Deliverable:** `redirect-map.md`, `route-map.md`, and `master-ia-sitemap.md` — all chat-produced documents, handed to Phase 4 (folder scaffold) and Phase 6 (redirect implementation).

### Phase 4 — Site Folder & Route Scaffold (NEW) — 💻 Claude Code
- Create the actual Next.js route folders per the route map locked in Phase 3: `app/page.tsx` (home), `app/commercial/`, `app/connect/`, `app/personal-and-property/`, plus the shared `components/`, `collections/`, `globals/` structure per `buildspec.md` §2.
- Each route gets a minimal placeholder page — enough to confirm it resolves (200, no route conflicts) — not real content. This deliberately separates "does the site structure exist and route correctly" from "is the content finished," so Phase 5 and Phase 6 aren't also responsible for inventing folder structure ad hoc while trying to write real content.
- Confirm `npm run build` succeeds with all four route groups present, and that none of them collide with `oldsite/`'s quarantined structure.
- **Deliverable:** buildable app with four resolvable, placeholder route groups matching `route-map.md`.

### Phase 5 — Homepage Production *(formerly Phase 4)* — 💻 Claude Code
- Build the approved wireframe (Phase 2) out in code, inside the `app/page.tsx` scaffolded in Phase 4, against the real design tokens (Phase 1) and real (even if draft) copy.
- Implement the "Products/Choice/About" nav row as a component shared with the subsites (same nav shell, different active state) — do not build a homepage-only nav that has to be reconciled later.
- **Deliverable:** production homepage, deployed to a preview URL.

### Phase 6 — Subsite Architecture Pass (Commercial, Connect, Personal & Property) *(formerly Phase 5)* — 💻 Claude Code
- Fill in the `app/commercial/`, `app/connect/`, `app/personal-and-property/` route groups scaffolded in Phase 4, reusing the shared nav/footer/`ChannelSwitcher`-equivalent component built in Phase 5.
- Re-platform the Commercial calculator/compare-report tool into `/commercial/`.
- Reuse existing page copy and product data from `oldsite/` per page.
- Implement the redirect table produced in Phase 3 as actual `next.config.js`/`vercel.json` redirects.
- **Deliverable:** three subsites live on preview, all internal links resolving, Phase 3's redirect map implemented and tested.

### Phase 7 — Copy Pass *(formerly Phase 6)* — 💬 Claude Chat (drafting) + 💻 Claude Code (applying)
- Homepage: finalize master statement, subhead, three card one-liners, "why we exist" narrative — drafted in chat.
- Subsites: reuse and tighten existing copy against the "less is more" guardrail — drafted in chat, applied to pages in code.
- **Deliverable:** `copy-final.md` (rebuilt), applied to all pages.

### Phase 8 — Vercel Stakeholder Review *(formerly Phase 7)* — 💻 Claude Code
- Deploy to a real Vercel preview URL and get Matt/Ben's eyes on the whole thing before the heavier performance/SEO/security pass.
- **Deliverable:** stakeholder feedback log, prioritized fix list.

### Phase 9 — Pre-Launch Technical Audits *(formerly Phase 8)* — 💻 Claude Code
- **Security:** CSP without `unsafe-inline`, Turnstile actually wired front-to-back, form-submission integrity.
- **Dependency risk:** fresh `npm audit`/lockfile check.
- **Architecture review:** confirm the shared-component propagation approach eliminates the "3 of 66 pages synced" class of bug structurally.
- **UI/UX & accessibility:** contrast checks per channel accent, keyboard/touch equivalents, 44×44px touch targets.
- **Performance/SEO:** validate the redirect map from Phase 3/6 resolves correctly in production, submit updated sitemap, check Core Web Vitals on the homepage.
- **State/resilience/observability:** rate limiting, form submission logging, error monitoring.
- **Folder sanity check:** confirm `oldsite/` truly never ships, no duplicate routes, no orphaned old-domain assets. Also confirm the Node version pin (`.nvmrc`/`engines`) flagged in Phase 0 has actually been added.
- **Deliverable:** `pre-launch-audit-report.md`, all blockers resolved or explicitly deferred with owner + date.

### Phase 10 — Payload Conversion & Vercel Launch *(formerly Phase 9; content now follows Abrar's Build Walkthrough)* — 💻 Claude Code

This phase now follows the concrete steps in `Trade Funding Build Walkthrough for Jana.pdf` (Guide 2 of 2) rather than a generic "flip DNS" description — that guide's Sections III–V map directly onto what "launch" actually means for a Payload site, so its steps are used here verbatim rather than re-invented.

- **Confirm the editable collections list before deploying.** The guide frames this as "your call": beyond the `pages` / `channelCards` / `siteNav` collections already locked in `buildspec.md` §6, decide whether **Team Members**, **Lender logos/partners**, and **News/blog posts** need their own Payload collections for this build, or stay fixed in code. Don't default to adding all of them — anything left out of Payload "stays fixed in code, which is fine, and actually safer" (guide, Section III).
- **Push to GitHub.** Create a new **private** GitHub repository and push the code.
- **Generate `PAYLOAD_SECRET`.** A long random string — the guide's own method: `openssl rand -base64 32`.
- **Deploy via Vercel:**
  1. Go to vercel.com/new, sign in with the team's existing account.
  2. Import the new GitHub repository.
  3. Before deploying, open the **Storage** tab and add a **Neon Postgres** database and **Blob storage** (for images) — Vercel injects the connection details automatically.
  4. Add the `PAYLOAD_SECRET` environment variable generated above.
  5. Click **Deploy**.
- **Verify the live URL.** Visit `your-site.vercel.app/admin` and create the admin account again — the live database is separate from the local one, so this is a genuinely fresh login, not the same account used in Phase 0's local testing.
- **Confirm the edit loop works live**, the same check used locally in Phase 0: change a piece of content in the dashboard, confirm it appears on the public site.
- **Share the `.vercel.app` link with Matt and Ben for review** — this is the guide's own definition of "done" for this phase (see below), distinct from the Phase 8 stakeholder preview, since this is the fully-built, production-configured deploy rather than an in-progress preview.
- **Domain cutover — later, optional, NOT part of this phase's completion.** Per the guide, don't let this hold up sharing the working site. Only do this once Matt/Ben have reviewed and approved the `.vercel.app` site:
  1. In Vercel: Project → Settings → Domains → add `tradefunding.com.au`. Vercel shows the exact DNS records needed.
  2. In Cloudflare: add those records (typically an A record for root, a CNAME for `www`).
  3. Set both records' proxy status to **"DNS only" (grey cloud, not orange)** so Vercel can issue its own certificate cleanly.
  4. Keep the current live site untouched until the new one is fully approved — loop in whoever manages the Cloudflare account first, since this is a domain change affecting live customers.
- **Troubleshooting (from the guide's "if something goes wrong" section, worth keeping on hand for this phase specifically):**
  - *"Node version" errors on deploy* → Vercel is using an old Node; set the project's Node version to 20.x or higher in Vercel project settings and redeploy. (Cross-reference: this project's Phase 0 already hit a related local issue — Node 22 required, system default Node 26 crashes Payload's config loader — so the `.nvmrc`/`engines` pin flagged there, and checked again in Phase 9, is exactly what prevents this class of error from recurring on Vercel too.)
  - *Images work locally but not live* → Blob storage was skipped during deploy. Add it in Vercel's Storage tab and redeploy.
  - *Dashboard is empty after going live* → expected. The live database starts blank and is separate from the local one — re-enter (or export/import) content once.
- **Deliverable:** live `.vercel.app` site, admin login working against the live database, content-edit loop verified in production, link shared with Matt and Ben. Domain cutover to `tradefunding.com.au` tracked as a separate, later sign-off — not required to call this phase done.

### Phase 11 — Post-Launch *(formerly Phase 10)* — 💬 Claude Chat (analysis) + 💻 Claude Code (tracking setup)
- 4–6 week SEO monitoring window watching brand-term rankings/click-share given the Phase 3/6 root-URL change (see §3).
- Define ideal customer profile and user journey per channel.
- Conversion case study comparing the old Commercial-as-homepage flow to the new homepage-first flow.
- **Deliverable:** `post-launch-report.md`, ICP + journey docs, conversion case study.

---

## 5. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Root URL SEO equity loss (see §3) | Redirect map treated as a Phase 3 deliverable, implemented in Phase 6 — not a Phase 9 afterthought |
| Matt's iterative decision style produces scope churn mid-build | Async WhatsApp-speed check-ins at each phase boundary rather than one big review gate |
| "Less is more" direction collides with vibe-coded execution risk | Typography (Work Sans/DM Sans) and spacing tokens locked in `buildspec.md` before any page is built |
| Calculator relocation breaks an existing user expectation/link | Explicit redirect/backlink from any legacy calculator URL to its new `/commercial/` home |
| Turnstile / rate-limiter / include-sync issues recur in the new build | New build uses real Next.js components, not the old copy-paste include system — verify explicitly in Phase 9, don't assume |
| Homepage nav-hover product-matching idea (open decision #2) gets built without sign-off | Do not start building it until Matt confirms it's worth the scope |
| Phase 3 (IA/redirect lock) runs in chat, not code — risk the resulting documents never get implemented | Phase 6 explicitly names "implement Phase 3's redirect table in code" as its own deliverable line |
| **New:** Phase 5/6 (homepage/subsite content) get built before the folder/route scaffold exists, causing structural rework | Phase 4 is now a dedicated, code-only gate — folders and routes exist and build cleanly before any real content is written |
| **New:** Node version mismatch (system default Node 26 crashes Payload's config loader; Node 22 required) causes future contributor friction | Add `.nvmrc`/`engines` field — flagged as an explicit Phase 9 folder-sanity-check item until it's done |

---

## 6. What "done" looks like at each gate

- **End of Phase 0 (Claude Code):** ✅ done — verified build/dev/admin all working locally, `oldsite/` untouched, tree committed.
- **End of Phase 1 (tokens, Claude Chat):** ✅ done — `tokens.md` exists with unaltered hex values.
- **End of Phase 2 (wireframe, Claude Design):** ✅ done — Matt has approved a wireframe.
- **End of Phase 3 (IA/redirect, Claude Chat):** a reviewed `redirect-map.md`/`route-map.md`/`master-ia-sitemap.md` exist as documents — not yet implemented in code.
- **End of Phase 4 (folder scaffold, Claude Code):** all four route groups exist, build cleanly, and resolve locally as placeholders — no content yet.
- **End of Phase 6:** every URL from the old site either resolves at its new address or 301s cleanly — zero 404s from internal links.
- **End of Phase 8:** stakeholder feedback is captured in one place.
- **End of Phase 9:** every item in this plan's audit list has a pass/fail/deferred status with a name attached.
- **End of Phase 10:** live on a `.vercel.app` URL, admin login works against the live (not local) database, a content edit made in the dashboard shows up on the public site, and Matt + Ben have the link — per the guide's own definition of "done." Domain cutover to `tradefunding.com.au` is explicitly not required to reach this gate.
