# Architecture & Project Structure Review — Trade Funding Site

## Finding 1 — The "canonical component" system only actually covers 3 of 66 pages
**This is the single most important structural finding in this review**, and it very likely explains several of the live bugs reported separately (emoji nav regression, footer address placeholder inconsistency, Casper logo).

`connect/scripts/build-includes.mjs` is a well-designed include-sync tool: it walks every `.html` file in the repo, finds `<!-- include:start src="..." --> ... <!-- include:end -->` marker pairs, and re-inlines the canonical partial (e.g. `/commercial/components/navbar.html`) into every page that references it, with a `--check` mode for CI. Running it:
```
$ node connect/scripts/build-includes.mjs --check
All managed includes are in sync (66 file(s) checked).
```
This *passes* — but only because almost no pages use the marker syntax in the first place. Grepping for actual usage:
```
$ for f in $(find . -name "*.html" ! -path "./_internal/*" ! -path "./.git/*"); do
    grep -q "include:start" "$f" && echo "$f"
  done
personal-and-property/personal-loans.html
connect/for-vendors.html
commercial/business-loans.html
```
**Only these 3 of 66 real pages** — including neither of the three channel home pages — actually use the automated sync mechanism. The other 63 pages have the navbar/footer markup **hand-copied** into each file. `CLAUDE.md` rule 14 ("diff against the canonical component after touching any page") and rule 19 ("any shared markup... gets re-propagated everywhere") both describe a *manual* discipline that has to be followed by a human (or an agent) every single time, for 63 files, with no automated enforcement. Rule 19 itself documents a real instance of this failing (`contact.html` at the repo root was missed by an earlier propagation pass).

**Why this matters concretely:** the "Funding Solutions" nav still shows emoji icons in `commercial/components/navbar.html` (lines 53–93) despite an instruction to remove them — but because 63 of 66 pages don't sync against that canonical file at all, even fixing `navbar.html` today would require a manual copy-paste pass across every Commercial/Connect/Personal & Property page, and any single page missed during that pass reintroduces exactly the kind of regression already reported.

**Proposed fix:** Convert the remaining 63 pages to use the same `<!-- include:start src="..." -->` marker pattern already proven in the 3 pages that use it, then wire `build:includes:check` into a pre-commit hook or CI step so a page that drifts from its canonical component fails the build instead of silently shipping. This is meaningfully cheaper than the alternative (waiting for Phase 8's Next.js migration to fix it structurally via real `<Navbar />` / `<Footer />` components) and removes an entire class of recurring bugs in the meantime.

## Finding 2 — Monolithic, multi-thousand-line HTML files mixing structure, styling, and business copy
**Quote:** `commercial/index.html` is 6,399 lines; `commercial/chattel-mortgage.html` is 4,109 lines; `commercial/business-line-of-credit.html` is 3,866 lines. Each of these files contains multiple `<style>` blocks inline in the document (`commercial/index.html` has 4 separate `<style>` blocks, one of which — lines 4370–4390 — is explicitly commented `LIGHT HERO OVERRIDES (preview variant)`, i.e., a second, overriding copy of `.hero` rules stacked on top of the first `.hero` definition at line 469).

**Critique:** Having page-specific CSS overrides live as a *second, later* `<style>` block that redefines the same selector (`.hero` appears at both line 469 and line 4376) is a maintainability trap — a future editor changing the "base" hero rule at line 469 has no way of knowing a later block silently overrides part of it unless they read the entire 6,399-line file top to bottom. This is exactly the kind of coupling that makes the file resistant to any kind of automated testing or safe refactor.

**Proposed fix:** at minimum before Phase 8, consolidate each page's inline `<style>` blocks into one block per file, placed together, with override blocks clearly namespaced (e.g. `.hero--light-preview` as a modifier class rather than a same-selector override further down the file). The real fix is Phase 8's move to component-scoped CSS, but that's several phases out — this is a low-cost intermediate step.

## Finding 3 — Business logic, routing, and presentation are inseparable in the serverless handlers (minor, but worth flagging before Phase 8)
`connect/api/request-call.js` mixes four concerns in one 187-line file: HTTP method/shape validation, anti-abuse orchestration (Turnstile/rate-limit/origin/token — correctly delegated to `_lib/`), **business validation rules** (`validate()`, lines 25–42), and **presentation** (the HTML email template, lines 50–62, and the Slack message template, lines 87–97). The anti-abuse delegation to `_lib/` is a good pattern already applied — the same treatment hasn't been applied to the email/Slack templating.

**Critique:** if a second form is ever added (the repo's own `.env.example` already anticipates a `/api/broker-lead` endpoint — see `_lib/form-token.js`'s header comment), the email/Slack HTML templates will very likely be copy-pasted into a new handler rather than reused, reproducing the exact duplication problem `_lib/` was created to solve for the anti-abuse logic.

**Proposed fix:** extract `sendEmail`/`sendSlack`'s templating into `connect/api/_lib/notify.js`, parameterized by a "kind" or template name, before a second form handler is written — not urgent, but cheap to do now versus expensive to unwind after two handlers duplicate it.

## Finding 4 — Duplicate/legacy consent implementations, now correctly consolidated, but evidence of the old anti-pattern is still instructive
`shared/scripts/consent.js`'s own header comment documents that it replaced **two incompatible prior implementations** — a `localStorage`-based one in `connect/scripts/main.js` and a `document.cookie`-based one in a now-deleted `commercial/cookie-consent.js` — each with a different storage key, meaning a user who consented on one channel would be re-prompted on another. This has been fixed correctly (one shared module, one cookie key, cross-subdomain `domain=` attribute). No action needed here, but it's a useful case study for Finding 1 above: this is what happens when "shared" logic isn't actually enforced as shared, and it's the same failure mode currently present in the navbar/footer propagation gap, just already fixed for consent specifically.

## Finding 5 — `personal and property/` vs `personal-and-property/` duplicate folder (already resolved, confirmed)
`CLAUDE.md` rule 17 references this as a Phase 5.5 flagged issue. I confirmed the live tree only contains `personal-and-property/` (hyphenated, no spaces) — the duplicate does not exist in this snapshot. No action needed; noted only so this doesn't get re-flagged as new.

## Finding 6 — Folder that will become a bottleneck at scale: `commercial/` as a flat 30+ file directory with no sub-grouping beyond `guides/`
**Quote:** `commercial/` currently holds ~30 top-level `.html` files (product pages, legal pages, calculators, `broker-portal.html`, `meet-cashper.html`, etc.) all in one flat directory, with only `guides/` broken out as a subfolder. `connect/` and `personal-and-property/` are proportionally smaller today, but the site's own nav model (Report 4/CLAUDE.md's "Term Loans, Credit Lines, Invoice, Trade, Equipment, Mortgage, Other" grouping) already implies a natural product-category structure that the file layout doesn't reflect.

**Critique:** this isn't broken today, but as more products are added (the nav dropdown already groups into 7 categories; the file tree groups into 1), whoever edits this repo has to hold the category-to-file mapping in their head rather than have it reflected in the folder structure. It also means any future migration script (e.g., Phase 8's URL-to-collection mapping) has to consult a lookup table instead of walking a folder.

**Proposed fix:** not urgent enough to do as a big-bang rename before Phase 8 (renaming risks breaking the root-relative links Report elsewhere confirms are used correctly throughout — see `CLAUDE.md` rule 15), but worth modeling as sub-collections/categories in Payload during the Phase 8 conversion rather than replicating the flat structure into the CMS.

## Finding 7 — Tight coupling risk for future testing: DOM-ID-based JS wiring with no test harness
`connect/scripts/form.js` and `connect/scripts/main.js` both query the DOM directly by ID (`document.getElementById('request-call-form')`, `document.getElementById('hv-invoice-body')`, etc.) with no abstraction layer, and `connect/tests/` exists as an empty folder with no actual test files. This is a completely reasonable pattern for the current static-HTML stack — introducing a testing framework for this specific code would be premature — but it means any refactor of the HTML structure during Phase 8's Next.js conversion will silently break this JS unless each ID is manually cross-checked. Worth a checklist item in the Phase 8 migration plan rather than a change today.

## Positive notes (no fix needed)
- Root-relative linking (`CLAUDE.md` rule 15) is consistently followed everywhere I sampled — no `../` or bare-filename links found.
- The extraction of `_lib/origin-check.js`, `_lib/rate-limit.js`, `_lib/form-token.js`, `_lib/html-escape.js`, `_lib/turnstile.js` out of the original two duplicated handlers is a genuinely good refactor and a template for Finding 3 above.
- `connect/vercel.json`'s `cleanUrls`/`trailingSlash` config is sensible and consistent with the root-relative linking convention.

## Summary table

| # | Finding | Impact |
|---|---|---|
| 1 | Include-sync only covers 3/66 pages | High — root cause of recurring regressions |
| 2 | Multi-thousand-line HTML files with stacked/overriding inline `<style>` blocks | Medium |
| 3 | Email/Slack templating not extracted to `_lib/`, unlike anti-abuse logic | Low |
| 4 | Legacy dual consent implementations | ✅ Already fixed, no action |
| 5 | Space-vs-hyphen folder duplicate | ✅ Already fixed, no action |
| 6 | Flat `commercial/` folder vs. 7-category nav model | Low — plan for Phase 8, not urgent now |
| 7 | ID-based JS with no test harness | Low — flag for Phase 8 migration checklist |
