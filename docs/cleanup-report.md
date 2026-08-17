# Phase 5.5 — Pre-Conversion Cleanup Report

**Date:** 2026-08-17
**Scope:** `plan.md` §8 + `buildspec.md` §11
**Verdict: Phase 6 is NOT clear to start.** Three blockers below require your input before this phase can be closed out.

---

## 0. Planning-doc corruption — found and fixed

While confirming redirects against `docs/Master Information Architecture & Sitemap.md` §9, I found that the **commit before this cleanup pass (`dca2fbb`, "Bump planning docs to v5") had overwritten this file's real content with a v5 draft of `plan.md`** instead. The file no longer contained the actual IA/sitemap material — including the real "§9 Duplicate Resolution — Consolidated Log" that `plan.md` and `buildspec.md` both cite as the single source of truth for redirects.

**Resolved:** Jana supplied the correct canonical content directly and it's been restored to `docs/Master Information Architecture & Sitemap.md`. It matches what I'd already recovered from git history (commit `2b5f8f4`) and cross-checked against the live HTML for this report, so none of the findings below changed as a result — the restored §9 confirms the same verdicts already used throughout this report (`apply.html` wins outright, `invoice-finance.html` wins pending the content merge, `resources.html` → `/guides/`). `plan.md` itself is still v4 and was never touched by the bad commit — no action needed there.

---

## 1. Duplicate folder check

`personal and property/` (space-containing duplicate of `personal-and-property/`) — **confirmed absent.** Re-verified via `find` across the repo; only the correctly-named `personal-and-property/` exists.

---

## 2. Retired-file deletions

| File | Verdict | Action taken |
|---|---|---|
| `commercial/trade-funding-website-application.html` | ✅ Confirmed superseded by `apply.html` (strict subset — `apply.html` has everything the legacy file has plus an ABN-autofill flow and a thank-you step; zero other files in the repo link to the legacy file). | **Deleted.** |
| `commercial/debtor-finance.html` | 🔴 **Not deleted — merge is incomplete.** See §3. | Left in place. |
| `commercial/resources.html` | 🔴 **Not deleted — internal links not yet repointed.** See §3. | Left in place. |

### Redirect log (for Phase 6 Vercel/Next.js config — not configured yet, per instructions)

| From | To | Status |
|---|---|---|
| `/trade-funding-website-application/` (`trade-funding-website-application.html`) | `/apply/` | Ready — file deleted, no content merge needed. |
| `/debtor-finance/` (`debtor-finance.html`) | `/invoice-finance/` | **Blocked** — do not configure until content gap in §3 is resolved and file is deleted. |
| `/resources/` (`resources.html`) | `/guides/` | **Blocked** — do not configure until internal links in §3 are repointed and file is deleted. |

---

## 3. Why the other two deletions are blocked

### `debtor-finance.html` → `invoice-finance.html`: merge is not actually complete

Diffed both files in full. The merge is partial, not done:

- **Missing card-level detail:** `debtor-finance.html`'s dedicated "Recourse Factoring" / "Non-Recourse Factoring" cards (each with its own feature list and "best for" framing) don't exist in `invoice-finance.html`'s parallel section — it only has one generic "Debtor Finance / Factoring" card. The underlying fact survives in an FAQ answer, but the card-level copy is lost.
- **Missing FAQ terminology:** `debtor-finance.html` has a distinct FAQ — *"What is notification (disclosed) vs non-notification (confidential) factoring?"* — using that specific terminology. `invoice-finance.html`'s closest FAQ covers the concept but never uses or defines "notification"/"non-notification."
- **Contradictory numbers, not just gaps** (flagging per CLAUDE.md hard rule 11 rather than silently picking one):
  - Eligibility tier 2 ("Specialist"): debtor-finance.html says **$500K+ annual revenue**; invoice-finance.html says **$250K+ annual turnover**.
  - Eligibility tier 3 ("Bank Lenders"): debtor-finance.html says **$1M+ annual revenue**; invoice-finance.html says **$500K+ annual turnover**.
  - Info-bar stats: debtor-finance.html shows "80–90% advance / whole ledger / ~1.5% per month / 5–10 days"; invoice-finance.html shows "Up to 90% advance / flexible / ~8% discount / 3–7 days."
  - Documents checklist: debtor-finance.html lists "Sample invoices" and "3–6 months bank statements"; invoice-finance.html lists "Recent BAS," "Financial statements," and a flat "6 months" bank statements — "Sample invoices" doesn't appear on the new page.
- **Still actively linked internally** — `commercial/index.html`, `about.html`, `apply.html`, `resources.html`, `guides/index.html`, `guides/invoice-vs-debtor-finance.html`, and `guides/business-line-of-credit-guide.html` all still link directly to `debtor-finance.html`. These need repointing to `/invoice-finance/` as part of the merge, not left to a Phase 6 redirect to catch.

**Needs from you:** resolve which numbers are correct (looks like the two pages describe genuinely different eligibility bands, not a typo — worth confirming with Matt/Ben rather than me guessing), then merge the missing FAQ/card content in, then repoint the internal links, then this is safe to delete.

### `resources.html` → Guides Hub: content is absorbed, but links aren't repointed

The content itself checks out — `resources.html` and `guides/index.html` are near-identical (diff shows only meta description wording, canonical URL, and breadcrumb label changes; `guides/index.html` even carries a comment confirming this is intentional pending Phase 5.5).

The blocker is structural: **the canonical `navbar.html` and `footer.html` components, plus roughly 40 individual Commercial pages, still hardcode `href="/commercial/resources.html"`** rather than linking to `/commercial/guides/`. Since this is still a static site with no redirect layer configured (redirects are explicitly a Phase 6 task), deleting `resources.html` right now would 404 every one of those nav/footer links sitewide — not just leave a dangling old URL, but break live navigation.

Also worth a small flag: while both pages are live, they have different canonical URLs (`resources.html` → `https://www.tradefunding.com.au/resources`, `guides/index.html` → `https://tradefunding.com.au/guides/` — note the `www` mismatch too), which is a live duplicate-content risk for as long as both remain published.

**Needs from you:** confirm you want me to repoint all internal `resources.html` links (nav, footer, ~40 pages) to `/commercial/guides/` in a follow-up pass, after which `resources.html` is safe to delete.

---

## 4. Unused-asset audit (flagged only — nothing deleted)

### Images — confident, high-volume finding

`commercial/assets/lenders/` contains a `.png` and `.svg` (sometimes `.jpg`) version of most lender logos, but only one format is actually referenced per lender across all HTML/CSS/JS. **53 files in this folder are unreferenced anywhere in the live site** — largely the redundant format for lenders that use the other one (e.g. `cba.png` when only `cba.svg` is used), plus a few fully orphaned one-offs (`grow-finance-temp.jpg`, `anz-new.png`). Full list:

```
commercial/assets/lenders/angle.svg, anz.svg, banjo-loans.png, bigga.png, bigga.svg,
bizcap.png, bizcap.svg, butn.png, butn.svg, capify.svg, capital-boost.png, cba.png,
cogsflow.svg, dyna-money.png, earlypay.png, finance-one.png, finstro.png, funding.png,
getcapital.png, grow-finance.png, grow-finance.svg, grow-finance-temp.jpg, hadrian.png,
hadrian.svg, judo-bank.png, lend.png, lend.svg, liberty.png, lumi.png, metro-finance.png,
moneytech.png, morris-finance.png, nab.png, nab.svg, octet.png, ondeck.png,
pepper-money.png, prospa.png, sail-funding.png, selfco.jpg, selfco.png, shift.png,
thinktank.png, thinktank.svg, westpac.png, zip.png, zip.svg, anz-new.png
```

Per CLAUDE.md hard rule 5 (never invent/discard lender logo assets without confirmation), **not deleted** — flagging for your review. Some of these may be intentionally kept as fallback/retina variants; worth a quick confirm before removal.

Other unreferenced images (checked against every `.html`/`.css`/`.js` file, and against the `design baseline/` and `docs/` planning-doc mentions to rule out false positives from in-flight copy work):

```
commercial/assets/logo-blc-white.svg   — no references anywhere
commercial/assets/logo-blc.svg          — no references anywhere
commercial/assets/founders.jpg          — no references anywhere
commercial/assets/logo-white.png        — referenced only in old connect/docs planning
                                            files and design baseline/, not in live pages
connect/branding/dylan.jpg              — no references anywhere
connect/branding/og-image.jpg           — no references anywhere (og-image.png is used instead)
connect/branding/logo-white.png         — same pattern as commercial's logo-white.png
```

### CSS — one confident finding, rest inconclusive

`commercial/product-styles.css` (3,150 lines) contains two generations of the same page-template styling: an older `.product-*` / `.hiw-*` naming convention (roughly lines 1–1982) and a newer `.pc-*` convention (lines 1983 onward) that's what `invoice-finance.html`, `debtor-finance.html`, etc. actually use today. **139 selectors in the old block never appear in any live HTML class attribute or JS token** — this reads as a superseded template that never got cleaned up after the `.pc-*` rewrite. Flagging the whole block rather than listing 139 individual selectors; happy to enumerate if useful.

I also ran a shallow classname-matching pass across `shared-styles.css` and `connect/styles/main.css` looking for more dead rules, but it throws too many false positives to trust (BEM base classes that only ever appear combined with a modifier, classes toggled via inline `<script>` blocks per-page rather than the shared JS files, breakpoint-mixin artifacts) — e.g. it initially flagged `.open`, `.scrolled`, `.visible` as dead, all three of which turned out to be applied via `classList.add()` in per-page inline scripts. Not reporting individual findings from that pass; a proper unused-CSS run would need a headless-browser coverage tool, not grep.

### JS — nothing unused

All JS files are referenced: `cookie-consent.js`, `product-page.js` (via `<script src>` across pages), and Connect's `calculator.js`/`form.js`/`main.js` (via `<script src>`), plus `connect/api/form-token.js` and `request-call.js`, which are serverless endpoints fetched by path from `form.js`, not `<script src>` includes — correctly in use, just not visible to a naive src-tag search.

---

## 5. Folder structure check

Matches the expected shape:
- `commercial/` — root-level pages + `guides/` + `components/` + `assets/` ✅
- `connect/` — own `branding/`, `styles/`, `api/`, plus `docs/` and a `tests/` folder (`connect/tests/calculator-test.html` — a dev-only harness page, not a production route; excluded from the header-parity count below) ✅
- `personal-and-property/` — single, correctly named, no duplicates, all 8 loan-type pages + `about`/`apply`/`index` present ✅

---

## 6. Header/footer parity check — **gate failed, not just re-run**

Re-ran the check from Prompt 5-fix. Result: **the two-tier header regression is still live on 60 of 62 production pages.**

`commercial/components/navbar.html` (the canonical component) was correctly fixed in commit `7eddabe` ("Collapse two-tier header into single navbar strip") — it now has exactly one `.navbar` strip and no `.utility-bar`. That was Step 1 of the two-step fix described in `prompts.md` (Prompt 5-fix).

**Step 2 — re-propagating that fix out to the actual pages — has not happened.** A repo-wide scan for the literal `utility-bar` class shows it's still present in every page except `commercial/apply.html` (and the `connect/tests/` dev harness, which was already clean):

```
commercial: 30/32 pages (all except apply.html)
connect: 8/8 pages
personal-and-property: 12/12 pages
guides: 10/10 pages
= 60 pages still carrying the two-tier header
```

This matches CLAUDE.md's own tracked count exactly. Footer markup was not part of the reported regression and checked out fine on the pages sampled.

**This means the header/footer parity gate does not currently pass.** Per CLAUDE.md hard rule 10 ("one phase, one prompt, one review cycle") I have not attempted the batch re-propagation myself as part of this cleanup pass — that's Prompt 5-fix Step 2, a separate, larger prompt in its own right, not a Phase 5.5 cleanup task. Flagging it here as a blocking gate failure rather than quietly fixing it.

---

## 7. Summary — what's actually blocking Phase 6

1. **`debtor-finance.html` merge is incomplete** — contradictory numbers and missing FAQ/card content need resolving with the team before the file can be deleted and the `/invoice-finance/` redirect configured.
2. **`resources.html` can't be deleted yet** — ~40 internal links (including the shared nav/footer components) still point at it directly; they need repointing to `/guides/` first.
3. **The two-tier header regression is not fixed** — only the canonical component is; Prompt 5-fix Step 2 (batch re-propagation across all 60 affected pages) still needs to run as its own pass.
4. **53 lender logo images and a handful of other assets are unreferenced** — flagged for your confirmation, not deleted, per hard rule 5.
5. **A superseded `.product-*`/`.hiw-*` CSS block (~139 selectors) in `product-styles.css`** is dead weight — flagged, not deleted.

Per CLAUDE.md hard rule 18, Phase 6 (Payload conversion) should not start until items 1–3 above are resolved with you.
