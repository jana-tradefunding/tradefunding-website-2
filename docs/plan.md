# Trade Funding — Homepage-First Rebuild Plan

**Status: v8.** This revision is grounded in the actual repo contents (`ui-mockups.zip`), not assumptions. Three things this resolves that were previously open, and one thing it corrects outright:

- **Resolved: Option A locked.** Commercial products, guides, tools, and Compare are nested under `/commercial/` — confirmed already substantially built this way. The earlier "flat at root" default is superseded.
- **Resolved: Personal & Property slug is hyphenated**, `/personal-and-property/` — confirmed as the real folder name. Every prior mention of `personalandproperty` in this doc set was wrong and is corrected here.
- **Resolved: Self-Employed Home Loan and Second Mortgage migrated to Personal & Property** — confirmed built there (9 category pages total, not 7).
- **Corrected: no `/site/` wrapper folder.** The static build lives directly at the true repo root, alongside the untouched Payload app folders, `docs/`, `branding/`, `oldsite/`, `ui-mockups/`, and a new `qa/` folder.
- **Corrected: no build script.** The manifest-driven `pages.json`/`build.mjs` approach this plan specced for Phase 5 was never adopted — decided against in prior sessions. The site is hand-authored static HTML. This plan stops describing a build system that doesn't exist and won't be built.

**Phases 0 through 4 are marked done, per instruction — the historical record below is unchanged.** Phase 4's mockup inventory is now reconciled against the real `ui-mockups/` folder (17 numbered templates + 2 components, not 18 — see Phase 4 for the precise reconciliation, including a few templates that turned out not to be needed and a few real pages that don't have a mockup yet). Phase 5 (Site Assembly) is rewritten from scratch around the real, current state of the repo: which of the ~55 pages exist, which don't, and a concrete, QA-sourced list of defects to fix — not a hypothetical build process.

**Source materials:** all prior source materials (transcript, brand guidelines, Matt-Website-Brief.md, Master IA checklist v2, Build Walkthrough PDF), plus `Matt_Vision_Site.md` (Design Corrections addendum — DM Sans only, home-icon exemption) and the actual project export `ui-mockups.zip`, including its `qa/2026-08-24-site-audit.md`.

---

## Venue legend

| Tag | What it means |
|---|---|
| 💬 **Claude Chat** | Conversation only — decisions, research, copywriting, planning documents. |
| 🎨 **Claude Design** | Visual mockup tooling. Not the production codebase. |
| 💻 **Claude Code** | Actual repo work — components, pages, config, deploys. |

---

## 0. The pivot, in one paragraph

The homepage is a neutral, brand-level entry point. `/` carries the master statement plus a "three ways we help business owners" section — Commercial leading, Connect and Personal & Property as extensions, not equal peers on the homepage specifically (equal weight everywhere else — footer, Products mega-menu, Channel Toggle). Routing is **Option A**: Commercial's hub, products, guides, tools, and Compare all nest under `/commercial/`; Connect and Personal & Property are fully nested under their own prefixes; genuinely brand-neutral pages (Home, 404, About Us, Apply, Broker Portal, Credit Guide, Terms, and soon Privacy and Contact) live under `/home-shared/`, with only `index.html` and `404.html` permitted loose at the true repo root.

---

## 1. Locked decisions

| Decision | Locked answer | Source |
|---|---|---|
| Root URL owner | New neutral homepage at `/`. | Confirmed |
| **Commercial routing (Option A)** | Hub, Products Hub, Individual Product Pages, Compare, Compare Report, Guides Hub, Guide Articles, and both Calculators all nest under `/commercial/`. Reverses the earlier flat-at-root default. | Confirmed against the real repo this revision |
| **Personal & Property slug** | Hyphenated: `/personal-and-property/`. | Confirmed against the real repo — corrects prior `personalandproperty` usage throughout this doc set |
| **Self-Employed Home Loan / Second Mortgage** | Migrated to Personal & Property (9 category pages, not 7). | Confirmed built this way |
| **Repo structure** | No `/site/` wrapper. Static pages live at the true repo root: `index.html`, `404.html` loose; everything else under `/home-shared/`, `/commercial/`, `/connect/`, `/personal-and-property/`. Siblings: untouched Payload app folders, `/docs/`, `/branding/`, `/oldsite/`, `/ui-mockups/`, `/qa/`. | Confirmed this session |
| **Build process** | No manifest, no generator script, no `/dist/` — hand-authored static HTML per page, decided in prior sessions. Consistency is maintained by periodic audit (`/qa/`), not build-time enforcement. | Confirmed against the real repo (`qa/2026-08-24-site-audit.md`) |
| Nav labels | **Products / Compare / About** — universal. | Matt-Website-Brief.md |
| Homepage three-channel section | Not equal weight — Commercial leads. | Matt-Website-Brief.md (supersedes original transcript) |
| Locked family taglines | Commercial: "Compare, choose, and access business capital — with full transparency." Connect: "Fund your customers. Get paid faster." P&P: "Personal and property funding, for the business owner behind the business." | Matt-Website-Brief.md |
| Channel Toggle | 4 destinations, Home + 3 channels. Present on channel pages, not homepage. Border + shadow for visual distinction. | Matt-Website-Brief.md, confirmed built |
| **Channel Toggle home icon** | **Exempted from the zero-icon rule** — the sole exemption sitewide. Confirmed intentional in the actual Phase 4 component mockup. | Matt_Vision_Site.md (Design Corrections addendum) |
| **Typography** | **DM Sans only, sitewide** — headings and body both. The earlier Work Sans/DM Sans split is dropped entirely. Confirmed already correct in the live `tokens.css`. | Matt_Vision_Site.md, confirmed against the real repo |
| Heading weight | Capped at Bold (700), default Semibold (600). Confirmed clean sitewide — zero 800/900 instances found in the QA audit. | Matt_Vision_Site.md, confirmed |
| Icons elsewhere | Banned — one exemption only (Channel Toggle home). Confirmed one live violation (Connect FAQ chevrons) — see §2/Phase 5. | Matt_Vision_Site.md, confirmed against the real repo |
| "Compare 100+ products against your profile" moment | Required, design-led. | Matt-Website-Brief.md |
| Calculator | Lives on Commercial, now at `/commercial/repayment-calculator/` and `/commercial/equipment-calculator/` — nested, not flat. | Confirmed |
| Footer | Commercial / Connect / Personal & Property equal peers, 4 columns + 4 text-badges. **Currently only correct on 7 of 11 built pages** — see Phase 5. | Matt-Website-Brief.md; compliance status confirmed via QA audit |
| **Apply/Intake routing** | One page, `/home-shared/apply/`, parameterized via `?purpose=` — no separate `/connect/apply/` or `/personal-and-property/apply/` entry pages. Confirmed working end-to-end. | Confirmed against the real repo — simpler than this plan previously specced |
| **"About (thin)" template** | Dropped entirely — every channel's nav links "About" straight to `/home-shared/about/`. No per-channel thin page exists or is needed. | Confirmed against the real repo |

---

## 2. Open decisions — carried forward, updated this revision

Several prior open items are now resolved (moved into §1 above) — Commercial nesting and the P&P slug in particular. What's left:

1. **Fate of "Why Us" and "Partners"** nav items from the prior IA — still unconfirmed.
2. **Personal & Property loan taxonomy** — now moot, resolved as 9 categories including the two migrated products (§1).
3. **Homepage CTA label** — destination is clear (Commercial's funnel), exact wording still open.
4. **Per-box hover-reveal lines** for Commercial's and P&P's homepage boxes — Connect's is locked, the other two aren't written.
5. **The "why we exist" homepage section** — still unconfirmed whether it exists at all, per the later brief's silence on it.
6. **Channel Toggle behavior** — confirmed present on channel pages + Compare; scroll-triggered vs. always-visible still not explicitly confirmed either way, though the built version appears always-visible in the header.
7. **Final hero master statement wording.**
8. **Brand guidelines PDF formal update** for DM Sans-only — not an AI task, needs an owner and date. More urgent now that Work Sans is dropped entirely, not just de-emphasized.
9. **`/commercial/products/` hub's relationship to the Master IA checklist** — this route needs to be formally added to the canonical `Master Information Architecture & Sitemap.md` v2, since it predates that document.
10. **Lender Panel status** — previously deferred as "blocked pending updated lender logo files." **12 lender SVGs now exist in `assets/img/lenders/`** (ANZ, Banjo, Bizcap, Butn, CBA, Earlypay, Judo Bank, Lumi, NAB, Prospa, Shift, Westpac). Worth reconfirming whether this is still blocked or ready to build — flagging rather than assuming either way.
11. **Guide slug naming inconsistency** — the one built guide article lives at `/commercial/guides/business-term-loans/`, without the "-guide" suffix the other 8 planned guide slugs use (`business-term-loans-guide`, `business-overdraft-guide`, etc.). Keep the already-built page's real slug as-is, or rename for consistency before more guides get built? Cheaper to decide now than after 8 more guides exist.
12. **`/commercial/lenders/`, `/home-shared/privacy/`, `/home-shared/contact/`, `/connect/for-vendors/`, `/connect/for-customers/`** — none of these have a Phase 4 mockup. See Phase 5 for how each is being handled.

---

## 3. SEO risk — now the full-scope scenario, not the narrower one

An earlier revision of this plan assumed Commercial's ~30 existing pages would stay flat at root, which would have limited the SEO blast radius to just the homepage. **Option A changes that: every Commercial page genuinely moves** to a `/commercial/...` URL. `oldsite/docs/research-notes.md` records the existing Commercial homepage carrying 97.1% of the site's organic clicks — under Option A, that page's full content (not just the homepage) is what's actually migrating.

Mitigation, now scoped to the full migration:
- **Complete 301 redirect map** for every old flat-root Commercial URL (`/business-term-loans.html`, `/compare.html`, `/repayment-calculator.html`, etc. — see `oldsite/commercial/` for the full legacy inventory) to its new `/commercial/...` path. This is now the single most consequential technical artifact in Phase 9, not an optional refinement.
- **Updated `robots.txt`/`sitemap.xml`**, submitted to Search Console on launch day.
- **New homepage `/` gets its own meta title/description and structured data.**
- **Internal linking** — footer and Channel Toggle both link back to `/`.
- **4–6 week Search Console monitoring window post-launch** (Phase 12).

---

## 4. Phases

### Phase 0 — Archive & Environment Reset — 💻 Claude Code — ✅ **DONE**
Unchanged from prior revisions. Next.js 16 + Payload 3.88.0 scaffolded, `oldsite/` quarantined, local build/dev/admin verified. Node 22 required — `.nvmrc`/`engines` pin still outstanding, carried to Phase 8.

### Phase 1 — Design Tokens & Brand Deviation Sign-off — 💬 Claude Chat — ✅ **DONE**
`tokens.md`/`tokens.css` reflects the Design Corrections addendum correctly — confirmed against the live file this revision: DM Sans only (both heading and body), zero 800/900 weights, colours unchanged. The earlier "needs a revision pass" flag from a prior revision is now closed — the revision happened and is verified.

### Phase 2 — Homepage Wireframe & Approval — 🎨 Claude Design — ✅ **DONE**
Structural wireframe approved. Prior flag about icon usage in the original mockup screenshot is superseded — the actual built Home page (`index.html`) carries zero icons, confirmed clean in the QA audit.

### Phase 3 — IA, Routing & Redirect Lock — 💬 Claude Chat — ✅ **DONE**
Satisfied by `Master Information Architecture & Sitemap.md` v2. **Needs a follow-up note added**, not a reopening: Option A's confirmation and the `/commercial/products/` hub addition (§2 item 9) should be reflected in that canonical document, since it currently doesn't mention either.

### Phase 4 — UI Mockups — 🎨 Claude Design — ✅ **DONE**

Reconciled against the real `ui-mockups/` folder this revision. **17 numbered templates + 2 standalone components**, not the 18 this plan previously assumed:

| # | Template | Confirmed built as real page(s) |
|---|---|---|
| 01 | Home | ✅ `index.html` |
| 02 | Channel Hub — Commercial | ✅ `commercial/index.html` |
| 03 | Channel Hub — Connect | ✅ `connect/index.html` |
| 04 | Channel Hub — Personal & Property | ✅ `personal-and-property/index.html` |
| 05 | Compare | ✅ built, but a pre-redesign stub — see Phase 5 |
| 06 | Products Hub | ✅ `commercial/products/index.html` |
| 07 | Individual Product (Commercial) | ✅ 1 of 16 built (`business-term-loans`) |
| 08 | Guides Hub | ✅ `commercial/guides/index.html` |
| 09 | Individual Guide Article | ✅ 1 of 9 built (`business-term-loans`) |
| 10 | Calculator Tool | ✅ 1 of 2 built (`repayment-calculator`) |
| 11 | FAQ (Connect) | ✅ `connect/faqs/index.html` — has a confirmed icon violation, see Phase 5 |
| 12 | Connect Process/Audience | ✅ 1 of 3 built (`how-it-works`) — `for-vendors`/`for-customers` have neither mockup nor page, see Phase 5 |
| 13 | About Us (full) | ✅ `home-shared/about/index.html` |
| 14 | Broker Portal | ✅ `home-shared/broker-portal/index.html` |
| 15 | Credit Guide | ✅ `home-shared/credit-guide/index.html` |
| 16 | Terms | ✅ `home-shared/terms/index.html` |
| 17 | 404 | ✅ `404.html` |
| — | Apply/Intake | ✅ `home-shared/apply/index.html` — one page, `?purpose=` parameterized, not the per-channel entry-page pattern this plan previously assumed |
| — | Service Category (P&P) | ✅ all 9 built — confirmed genuinely distinct content, not a copy-paste stub |
| — | Channel Toggle (component) | ✅ built, home-icon-included by design |
| — | Products mega-menu (component) | ✅ built, confirmed identical across every page that carries it |

**Templates dropped from the plan, confirmed not needed:** "About (thin)" — every channel links straight to the shared About Us page instead. "Legal Page" as one shared template — Credit Guide and Terms turned out to be two separate bespoke mockups (15 and 16 above), not one shared template as this plan previously assumed.

**Pages with no mockup at all yet** — genuine gaps, not a deferred/blocked status like Lenders: `/home-shared/privacy/`, `/home-shared/contact/`, `/connect/for-vendors/`, `/connect/for-customers/`. Carried into Phase 5 as work that still needs design attention, not just assembly.

- **Deliverable:** ✅ 17 templates + 2 components, `ui-mockups/` folder complete as delivered.

### Phase 5 — Site Assembly — 💻 Claude Code — 🔵 **IN PROGRESS**

No `/site/` folder, no build script — this phase is about **completing the real repo root directly**, informed by the exact gaps above and the QA audit's confirmed defect list.

#### Part 1 — Folder sanitation

1. **Confirm root cleanliness.** Only `index.html` and `404.html` may sit loose at repo root. Everything else — `/home-shared/`, `/commercial/`, `/connect/`, `/personal-and-property/`, `/assets/`, `/ui-mockups/`, `/oldsite/`, `/qa/`, `/docs/`, `/branding/`, plus the untouched Payload app's own folders — must be a properly organized top-level folder. Audit for anything currently loose or misplaced before adding new pages.
2. **Move `ui-mockups/` into the project folder and commit** (Jana's own step, not a Claude Code task — noted here for sequencing only).

#### Part 2 — Remaining pages to produce

| Group | Still needed | Count |
|---|---|---|
| Commercial — Individual Product Pages | 15 of 16 remaining: `business-line-of-credit`, `overdraft`, `charge-card`, `chattel-mortgage`, `finance-lease`, `operating-lease`, `invoice-finance`, `fund-an-invoice`, `trade-finance`, `export-finance`, `supply-chain-funding`, `merchant-cash-advance`, `r-and-d-funding` (Second Mortgage and Self-Employed Home Loan excluded — confirmed migrated to P&P) | 15 |
| Commercial — Guide Articles | 8 of 9 remaining: `compare-business-loans`, `best-line-of-credit`, `business-line-of-credit-guide`, `business-charge-card-guide`, `business-overdraft-guide`, `business-loan-bad-credit`, `invoice-vs-debtor-finance`, `lease-vs-buy` | 8 |
| Commercial — Calculator | `equipment-calculator` | 1 |
| Commercial — Lenders | `/commercial/lenders/` — reconfirm blocked/unblocked status (§2 item 10) before building | 0 or 1 |
| Connect — Process/Audience | `for-vendors`, `for-customers` — **no mockup exists for either**, needs Phase 4-equivalent design attention before or during this build, not just assembly | 2 |
| Home/Shared | `privacy`, `contact` — **no mockup exists for either** | 2 |

**For every page above wrapping an existing tool or form** (both calculators, the Apply engine) — adapt the working mechanism from `oldsite/`, not the visuals. See `buildspec.md` §11 note on the Apply engine's confirmed-working `?purpose=` logic — reuse that, don't rebuild it.

#### Part 3 — Fix the confirmed defects (from `qa/2026-08-24-site-audit.md`)

Priority order, full detail in `buildspec.md` §11:

1. Rebuild `/commercial/compare/`'s nav and footer — it's still a pre-redesign stub.
2. Standardize the footer across `/commercial/`, `/connect/`, `/personal-and-property/`, `/commercial/compare/` to match the 4-column pattern already correct on the 7 brand-neutral pages.
3. Remove the 5 chevron icons from `/connect/faqs/` — genuine zero-icon violation, no exemption.
4. Fix dead `href="#"` anchors sitewide, prioritizing the ones that resolve once `/home-shared/privacy/` and `/home-shared/contact/` exist.
5. Fix WCAG contrast failures — Commercial's `.btn-primary` needs the same navy-text override Connect already has; peach CTAs need a darker background or navy swap.
6. Fix touch-target sizes in the shared CSS classes — this is the one place a single edit *does* propagate everywhere, since CSS is shared even though HTML isn't.
7. Add active-nav-state indicators — mechanical, per-page, no shared partial to edit once.

- **Deliverable:** every page in §2's production table exists at its correct `/commercial/`-nested (Option A) or `/personal-and-property/`-hyphenated route; every confirmed defect in Part 3 resolved; root folder confirmed clean.

### Phase 6 — Copy Pass — 💬 Claude Chat (drafting) + 💻 Claude Code (applying)
Homepage: finalize master statement, subhead, Commercial/P&P hover lines, resolve the "why we exist" question. Subsites: apply locked taglines verbatim, write copy for every newly-produced page against the "less is more" guardrail.

### Phase 7 — Vercel Stakeholder Review — 💻 Claude Code
Deploy the completed static site (now living at the real repo root, no `/site/` prefix) as a preview and get Matt/Ben's review before the heavier audit pass.

### Phase 8 — Pre-Launch Technical Audits — 💻 Claude Code
UI/UX & accessibility (re-verify Phase 5 Part 3's fixes actually landed), performance (Core Web Vitals baseline), link/redirect audit, folder hygiene, `.nvmrc`/`engines` pin confirmation. CSP/Turnstile/form-integrity/rate-limiting deferred to Phase 9, same as before.

### Phase 9 — Payload Conversion — 💻 Claude Code
Convert the completed static repo root (not a `/site/` subfolder) into the already-scaffolded Payload app. Implement the full Option A redirect map from §3 — every flat-root Commercial URL in `oldsite/` needs a corresponding 301 to its `/commercial/...` path. Re-run deferred security audits.

### Phase 10 — Vercel Launch — 💻 Claude Code
Unchanged from prior revisions — GitHub push, `PAYLOAD_SECRET`, Vercel deploy with Neon + Blob, verify live admin, share link with Matt and Ben.

### Phase 11 — Domain Cutover & Legacy Export — 💻 Claude Code
Unchanged — export from WordPress and Google Analytics before cutover, then point `tradefunding.com.au` at the new site via Cloudflare DNS.

### Phase 12 — Post-Launch — 💬 Claude Chat (analysis) + 💻 Claude Code (tracking setup)
Unchanged — SEO monitoring, ICP/journey definition, conversion case study.

---

## 5. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Full-scope SEO migration under Option A (§3) — larger blast radius than previously scoped | Complete redirect map treated as Phase 9's top artifact, not an afterthought |
| No build script means shared-markup drift has no automatic guard — **already materialized**, per the QA audit's 4-different-footers finding | Phase 5 Part 3 fixes the existing drift; every future page-adding prompt in `prompts.md` explicitly checks against sibling pages sharing the same markup, since there's no script to do it automatically |
| `for-vendors`, `for-customers`, `privacy`, `contact` have no Phase 4 mockup, but Phase 4 is marked done | Called out explicitly in Phase 4's own inventory table and carried into Phase 5 as real work, not silently absorbed into "already done" |
| Guide slug naming inconsistency (§2 item 11) compounds if 8 more guides get built before it's decided | Flagged now, before more guides exist, not after |
| Lender Panel's blocked status may be stale — assets exist now | Flagged as needing reconfirmation (§2 item 10) rather than assumed still-blocked or assumed ready |
| Node version mismatch (Node 22 required, system default Node 26 crashes Payload's config loader) | `.nvmrc`/`engines` pin — still outstanding, checked in Phase 8 |

---

## 6. What "done" looks like at each gate

- **Phases 0–4:** ✅ done, per instruction — reconciled against the real repo this revision, gaps carried forward explicitly rather than hidden.
- **End of Phase 5:** every page in the Part 2 production table exists at its Option A route; every Part 3 defect resolved; root folder audited clean (only `index.html`/`404.html` loose).
- **End of Phase 8:** static-site and re-verified Phase 5 fixes all pass; CMS-specific items explicitly deferred to Phase 9.
- **End of Phase 9:** full Option A redirect map implemented and tested; converted app verified locally.
- **End of Phase 10:** live on `.vercel.app`, admin works against the live DB, Matt + Ben have the link.
- **End of Phase 11:** WordPress/GA exported, domain pointing at the new site.
