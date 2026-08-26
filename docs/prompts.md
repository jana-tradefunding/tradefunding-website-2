# Prompt Library — Trade Funding Homepage-First Rebuild

**Status: v8.** Phases 0–4 are done (see `plan.md` §4 for the reconciled reality). This revision rewrites Phase 5 entirely: no `/site/` folder, no build script, no `pages.json`/`build.mjs` prompts — those never got adopted. Every Phase 5 prompt below is listed in the exact order to send them, and **every single one ends with an explicit instruction to triple-check the work and ask before executing file operations** — not just the risky ones.

| Tag | Venue | What that means practically |
|---|---|---|
| 💬 | **Claude Chat** | A conversation. No repo access needed. |
| 🎨 | **Claude Design** | Visual mockup tooling. Not this repo's codebase. |
| 💻 | **Claude Code** | Real repo work. |

---

## Phase 0 — Archive & Environment Reset — 💻 Claude Code — ✅ DONE
*(Done — see `plan.md` §4, Phase 0.)*

## Phase 1 — Design Tokens & Brand Deviation Sign-off — 💬 Claude Chat — ✅ DONE
*(Done and verified against the live `tokens.css` this revision — DM Sans only, weight cap correct. No further prompt needed.)*

## Phase 2 — Homepage Wireframe & Approval — 🎨 Claude Design — ✅ DONE
*(Done — confirmed zero icons in the built Home page.)*

## Phase 3 — IA, Routing & Redirect Lock — 💬 Claude Chat — ✅ DONE

**Prompt 3.3 — Add Option A and the Products Hub to the canonical IA doc** *(follow-up, not a reopening)*
> 💬 Update `Master Information Architecture & Sitemap.md` v2 to reflect two things that are already true in the built repo but not yet documented there: (1) Option A is confirmed — Commercial's products, guides, tools, and Compare all nest under `/commercial/`, not flat at root; (2) `/commercial/products/` (the Products Hub) is a real page and needs its own entry. Triple-check every existing route in that document against what's actually in the repo before making changes, and ask me to confirm before saving if anything else looks out of date.

## Phase 4 — UI Mockups — 🎨 Claude Design — ✅ DONE
*(Done — reconciled against the real `ui-mockups/` folder in `plan.md` §4. 17 templates + 2 components, not 18. No further prompt needed — remaining gaps like `for-vendors`/`for-customers`/`privacy`/`contact` are handled inside Phase 5 below, not as a Phase 4 reopening.)*

---

## Phase 5 — Site Assembly — 💻 Claude Code — 🔵 IN PROGRESS

### Part 1 — Folder sanitation (do this first, before anything else)

**Prompt 5.1 — Inspect the current repo state and reconcile against this doc set**
> 💻 Before touching any files: inspect the current repo root and every subfolder. Report back a full tree, and specifically confirm or flag any discrepancy against `buildspec.md` §2's routing table and folder structure — don't assume the docs are accurate, verify against what's actually on disk. List anything you find that isn't accounted for in `plan.md` or `buildspec.md`. **Do not make any changes in this prompt** — this is inspection only. Ask me for clarification on anything ambiguous before we move to Prompt 5.2.

**Prompt 5.2 — Sanitize the repo root**
> 💻 Confirm that only `index.html` and `404.html` sit loose at the repo root — everything else must live inside `/home-shared/`, `/commercial/`, `/connect/`, `/personal-and-property/`, `/assets/`, `/ui-mockups/`, `/oldsite/`, `/qa/`, `/docs/`, `/branding/`, or the existing Payload app folders. If anything is misplaced, propose exactly where it should move — **do not move or delete anything until I confirm the plan.** Triple-check your proposed moves don't break any relative links in existing HTML files before listing them. Ask me before executing any file operation.

*(Jana's own step, not a Claude Code prompt: move `ui-mockups/` into the project folder and commit, if not already done.)*

### Part 2 — Produce the remaining pages

**Prompt 5.3 — Commercial: remaining Individual Product Pages**
> 💻 Using `commercial/business-term-loans/index.html` as the reference template (already built and correct), produce the remaining 15 Individual Product Pages: `business-line-of-credit`, `overdraft`, `charge-card`, `chattel-mortgage`, `finance-lease`, `operating-lease`, `invoice-finance`, `fund-an-invoice`, `trade-finance`, `export-finance`, `supply-chain-funding`, `merchant-cash-advance`, `r-and-d-funding`. Each at `/commercial/[slug]/index.html`, matching the reference page's structure exactly — real, distinct content per product, not a copy with only the title swapped (the same way the 9 Personal & Property category pages are already genuinely distinct, not stubs). **Triple-check each new page's nav, footer, and Channel Toggle markup matches the reference page byte-for-byte in structure** before considering it done — there's no build script to catch drift, so this check is on you. Ask me for clarification on any product's content basis you're unsure of before writing it, rather than guessing.

**Prompt 5.4 — Commercial: remaining Guide Articles**
> 💻 Using `commercial/guides/business-term-loans/index.html` as the reference, produce the remaining 8 guide articles: `compare-business-loans`, `best-line-of-credit`, `business-line-of-credit-guide`, `business-charge-card-guide`, `business-overdraft-guide`, `business-loan-bad-credit`, `invoice-vs-debtor-finance`, `lease-vs-buy`. Note the reference page's own slug doesn't carry the "-guide" suffix the other 8 use — flag this inconsistency back to me and ask whether to keep it as-is or rename it, before writing 8 more pages that would make the inconsistency permanent. Same nav/footer/toggle fidelity check as Prompt 5.3. Ask before finalizing if any guide's content basis is unclear.

**Prompt 5.5 — Commercial: equipment-calculator**
> 💻 Using `commercial/repayment-calculator/index.html` as the reference (both the markup pattern and its working JS logic, adapted from `oldsite/commercial/equipment-calculator.html`'s original calculation mechanism), produce `/commercial/equipment-calculator/index.html`. Reuse the old calculator's actual formula/logic — don't rebuild the math from scratch — but present it inside the current design system, not the old site's look. Triple-check the calculation logic against the old page's behavior before considering it done, and ask me to confirm the expected output for at least one test case if you're not fully certain the math is right.

**Prompt 5.6 — Connect: for-vendors and for-customers**
> 💻 `/connect/for-vendors/` and `/connect/for-customers/` have neither a Phase 4 mockup nor a built page — this is new design work, not just assembly. Using `connect/how-it-works/index.html` as the closest structural reference (same channel, same nav/footer/toggle pattern) and `Matt-Website-Brief.md`'s Connect page brief for content direction, propose a structure for both pages and **show it to me before writing the full pages** — don't build 2 pages' worth of content on a structural guess I haven't confirmed.

**Prompt 5.7 — Home/Shared: privacy**
> 💻 `/home-shared/privacy/` doesn't exist yet — every footer's "Privacy Policy" link across the site points at a dead `href="#"` because of this (14 occurrences, per `qa/2026-08-24-site-audit.md`). Using `home-shared/terms/index.html` as the closest structural reference (both are long-form legal text pages), draft `/home-shared/privacy/index.html`. Flag to me whether you have a real privacy policy content source to work from, or whether this needs placeholder legal text pending real copy — don't invent binding legal language without confirming the source.

**Prompt 5.8 — Home/Shared: contact**
> 💻 `/home-shared/contact/` doesn't exist — currently every "Contact" link sitewide points at an anchor on the About page, which the QA audit flagged as blocking the department-selector routing (`?dept=connect` etc.) the original spec called for. Using `home-shared/broker-portal/index.html` as a structural reference (similar page weight/simplicity), build a real Contact page with a department selector (general / Connect / Personal & Property). Triple-check every sitewide "Contact" link and footer reference — list them all before changing any — then propose updating them to point at the new real page, and ask me to confirm before executing that sitewide change.

### Part 3 — Fix the confirmed QA defects

**Prompt 5.9 — Rebuild the Compare page's nav and footer**
> 💻 `/commercial/compare/index.html` is still a pre-redesign stub per `qa/2026-08-24-site-audit.md` §2b/3.1 — missing the Products mega-menu, About link, and Contact CTA in its nav, and its footer is a single unstyled line. Copy the exact nav and footer structure from `home-shared/credit-guide/index.html` (one of the confirmed-compliant pages), adjusting relative paths for Compare's folder depth. Triple-check the adjusted paths actually resolve before finishing — test at least the About, Contact, and one Products mega-menu link. Ask me before overwriting the existing stub content if you're not certain which parts of the current page are worth preserving versus replacing outright.

**Prompt 5.10 — Standardize the four inconsistent footers**
> 💻 `qa/2026-08-24-site-audit.md` §4.2 documents four different, mutually-inconsistent footer implementations on `commercial/index.html`, `connect/index.html`, `personal-and-property/index.html`, and `commercial/compare/index.html` — none match each other or the compliant 4-column pattern on the other 7 pages. Replace all four with the exact structure from `home-shared/credit-guide/index.html`'s footer, keeping each page's own channel-appropriate "Channels" column content but matching the column headings, badge set (ACL 387856 / AFCA Member / CAFBA / Fintech Australia), and full copyright line exactly. Triple-check all four are now byte-for-byte identical in structure (not just visually similar) before finishing. Ask me first if any page's current footer content has something worth preserving that the reference pattern doesn't account for.

**Prompt 5.11 — Remove the Connect FAQ chevron icons**
> 💻 `connect/faqs/index.html` has 5 chevron SVG icons on its accordion — the one confirmed, unexempted zero-icon violation on the site (per `buildspec.md` §1a, only the Channel Toggle's home icon is exempt). Replace them with the CSS-only `+`/`–` text-state pattern per `qa/2026-08-24-site-audit.md` §6.2. Triple-check no other SVG icons exist on that page after the fix (`grep -c "<svg"` should return the expected count for the toggle only, if the toggle is present on this page — confirm whether it is before assuming). Ask me if the toggle's presence/absence on this specific page is unclear.

**Prompt 5.12 — Fix dead anchors sitewide**
> 💻 Per `qa/2026-08-24-site-audit.md` §2a/2c/6.4: fix the ~54 dead/malformed anchor links. Prioritize the ones that resolve automatically now that Prompts 5.7 and 5.8 exist — every footer's Privacy Policy link and every Contact link. For `commercial/index.html`'s own internal dead anchors (`#apply`, `#calc-*`, `#guide-*`, etc.) — these need a per-link decision, not a blind find-and-replace, since each implies different intended behavior. List every one you find with your proposed fix, and **ask me to confirm the full list before executing any changes** — do not run a sitewide regex without review.

**Prompt 5.13 — Fix WCAG contrast failures**
> 💻 Per `qa/2026-08-24-site-audit.md` §5.2/6.5: add the missing `.channel-commercial .btn-primary { color: var(--navy); }` override in `assets/css/base.css` (mirroring the existing `.channel-connect` pattern), and fix the peach CTA button contrast (currently 3.01:1, needs 4.5:1) — either darken to `--peach-hover` and verify the resulting ratio, or switch to a navy background. Show me the calculated contrast ratio for whichever fix you choose before considering this done, not just the CSS change. Ask me to pick between the two peach-fix approaches if the darkened version doesn't clear 4.5:1.

**Prompt 5.14 — Fix touch target sizes**
> 💻 Per `qa/2026-08-24-site-audit.md` §5.3/6.6: increase padding on `.tf-nav-link`, `.tf-toggle-tab`, `.tf-footer-col a`, and `.ap-pill`/`.ap-toggle` in the shared CSS files so each reaches the 44×44px minimum. This is a shared-CSS change, so it should propagate to every page automatically — triple-check that by spot-checking at least 3 different pages after the change, not just the one you tested first. Ask me before changing any class that's used in more places than the 4 listed here, if your investigation turns up additional usages.

**Prompt 5.15 — Add active-nav-state indicators**
> 💻 Per `qa/2026-08-24-site-audit.md` §3.1/6.6: no page currently distinguishes its own nav item visually. Add a per-page `aria-current="page"` attribute plus styling to whichever nav link matches each page (e.g. `about/index.html`'s own "About" link). This has to be done per-file since there's no shared nav partial. List every file you're changing and which nav item gets the active state on each before executing — confirm the list matches your expectation, and ask me about any page where the "correct" active nav item isn't obvious (e.g. individual product pages — should "Products" show as active?).

**Prompt 5.16 — Final link and route audit**
> 💻 Crawl every page now in the repo (built in Phases 4–5) and confirm zero broken internal links, every route in `buildspec.md` §2 either exists or is explicitly still pending, and the root folder still contains only `index.html`/`404.html` loose. Report the full list of what's still outstanding after this pass — don't mark Phase 5 done if anything from `plan.md` §4 Phase 5's production table is still missing. Ask me before declaring the phase complete if anything is ambiguous.

---

## Phase 6 — Copy Pass — 💬 Claude Chat (draft) → 💻 Claude Code (apply)

**Prompt 6.1 — Homepage copy finalization**
> 💬 Draft final copy for the homepage master statement, subhead, and the still-open Commercial/P&P hover-reveal lines (Connect's is locked). Resolve whether "why we exist" exists — ask if genuinely unclear.

**Prompt 6.2 — Subsite copy**
> 💬 Draft page-level copy for every newly-produced page from Phase 5 against the "less is more" guardrail, applying the locked family taglines verbatim. Produce as `docs/copy-final.md`.

**Prompt 6.3 — Apply copy**
> 💻 Apply the approved `docs/copy-final.md` into the actual pages. Triple-check each page's copy update didn't accidentally alter its nav/footer/toggle markup — ask me before proceeding if a copy change would require touching shared-pattern markup.

---

## Phase 7 — Vercel Stakeholder Review — 💻 Claude Code

**Prompt 7.1 — Deploy for review**
> 💻 Deploy the current repo root (no `/site/` prefix) to a lightweight static preview. Prepare a summary of what's ready vs. still placeholder. Ask me before deploying if you're unsure whether something is ready.

---

## Phase 8 — Pre-Launch Technical Audits — 💻 Claude Code

**Prompt 8.1 — Re-verify Phase 5's fixes actually landed**
> 💻 Re-run the same checks `qa/2026-08-24-site-audit.md` used (icon count, footer structure comparison, dead-anchor scan, contrast calculation, touch-target measurement) against the current repo state, and confirm every defect from `buildspec.md` §11 is actually resolved, not just attempted. Report any that still fail. Triple-check your own re-verification methodology matches the original audit's before concluding something passed.

**Prompt 8.2 — UI/UX & accessibility, performance, links, folder hygiene**
> 💻 Standard pre-launch pass: WCAG AA across all channel accents, Core Web Vitals baseline, full link/route crawl, `oldsite/`/Payload-scaffold separation confirmed, `.nvmrc`/`engines` Node pin confirmed present. Ask me before marking anything as passed if you're not fully certain.

*(CSP, Turnstile, form-submission integrity, rate limiting — deferred to Phase 9, same as before.)*

---

## Phase 9 — Payload Conversion — 💻 Claude Code

**Prompt 9.0 — Decide what's editable** *(your call, not Claude's)*
> Beyond `pages`/`channelCards`/`siteNav`/`productsMenu`/`channelToggle`/`footerLegal`, decide whether Team Members, Lender logos/partners, or News/blog posts need their own Payload collection.

**Prompt 9.1 — Build the full Option A redirect map**
> 💻 Enumerate every legacy flat-root Commercial URL in `oldsite/commercial/` and produce a complete 301 redirect table to its new `/commercial/...` path under Option A. This is now the single most consequential artifact before launch, per `plan.md` §3's SEO risk assessment. Triple-check the mapping against `oldsite/commercial/`'s actual file list, not memory. Ask me to confirm before finalizing if any legacy URL's new destination isn't obvious.

**Prompt 9.2 — Run the conversion**
> 💻 Convert the completed static repo root into the already-scaffolded Payload app at the repo root (not a `/site/` subfolder). Use the official Payload docs as reference. Match the static site exactly — no redesign. Wire pages to Payload using the collections from Prompt 9.0. Implement the Prompt 9.1 redirect map. Ask me before running anything that would modify the existing Payload scaffold's config in a way that isn't a straightforward content-wiring change.

**Prompt 9.3 — Re-run the deferred security audits**
> 💻 Now that the app layer exists: CSP, Turnstile, form-submission integrity, rate limiting. Report findings with file/line references.

---

## Phase 10 — Vercel Launch — 💻 Claude Code

**Prompt 10.1 — Prep for GitHub + Vercel**
> 💻 Private GitHub repo, `PAYLOAD_SECRET`, numbered Vercel deploy checklist including Neon Postgres and Blob storage.

**Prompt 10.2 — Verify the live deploy**
> 💻 Confirm live `/admin` loads, admin account creation, content-edit round-trip. Report the live URL.

*(Checkpoint: share the `.vercel.app` link with Matt and Ben here.)*

---

## Phase 11 — Domain Cutover & Legacy Export — 💻 Claude Code

**Prompt 11.1 — Export from WordPress**
> 💻 Confirm export scope with me, then export the current live WordPress site's content before cutover.

**Prompt 11.2 — Export from Google Analytics**
> 💻 Pull historical reports, decide tracking continuity (same property or new).

**Prompt 11.3 — Domain cutover** *(only after Matt/Ben approve and 11.1/11.2 are done)*
> 💻 Point `tradefunding.com.au` at the new site via Cloudflare, one step at a time, confirming after each.

---

## Phase 12 — Post-Launch — 💬 Claude Chat (analysis) + 💻 Claude Code (tracking setup)

**Prompt 12.1 — SEO monitoring setup**
> 💻 Search Console tracking for brand-term ranking and click-share, 4–6 week window.

**Prompt 12.2 — ICP, journey, and conversion case study**
> 💬 Define ideal customer profile and user journey per channel; before/after conversion comparison.
