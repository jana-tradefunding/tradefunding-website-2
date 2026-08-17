# Phase 5.5 — Pre-Conversion Cleanup Report

**Date:** 2026-08-17
**Scope:** `plan.md` §8 + `buildspec.md` §11
**Status: All three blockers from the first audit pass are now resolved.** Phase 6 (Payload conversion) is clear to start, subject to the smaller open items noted in §6 below.

---

## 0. Planning-doc corruption (resolved earlier this pass)

The commit before this cleanup work had overwritten `docs/Master Information Architecture & Sitemap.md` with a v5 draft of `plan.md` instead of the real IA/sitemap content. Jana supplied the correct canonical content directly and it's been restored. It matches what had independently been recovered from git history and confirms the same verdicts used throughout this report (`apply.html` wins outright, `invoice-finance.html` wins pending the content merge below, `resources.html` → `/guides/`).

---

## 1. Files deleted

| File | Verdict | Redirect logged |
|---|---|---|
| `commercial/trade-funding-website-application.html` | Superseded by `apply.html` (strict subset, zero internal references) | `/trade-funding-website-application/` → `/apply/` |
| `commercial/debtor-finance.html` | Content merged into `invoice-finance.html` (see §2), then deleted | `/debtor-finance/` → `/invoice-finance/` |
| `commercial/resources.html` | Content already fully absorbed into the Guides Hub; internal links repointed first (see §3), then deleted | `/resources/` → `/guides/` |

---

## 2. `debtor-finance.html` → `invoice-finance.html`: merge completed

**On the numeric conflicts (rates, eligibility thresholds, turnaround times):** I checked both `docs/Master Information Architecture & Sitemap.md` and `plan.md` as instructed, and neither document actually adjudicates which page's numbers were correct — §9 only says qualitatively "merge unique whole-ledger content in before retiring," not which figures win. Since no source of truth resolves this, I did **not** import `debtor-finance.html`'s conflicting numbers (the $500K/$1M eligibility tiers, the "80–90% advance / 5–10 days" info-bar stats, the "3–6 months" bank statements line). `invoice-finance.html` is the page the Duplicate Resolution Log already names as the winner, its numbers plausibly reflect its broader post-consolidation scope (three product types, not just whole-ledger factoring), and guessing between two unreconciled figures for a regulated financial product isn't something to do silently. **This is flagged for Matt/Ben to sanity-check post-migration, not resolved by me.**

**Content that was genuinely missing and safe to merge (no numbers involved) — merged in:**
- Added a new FAQ item to `invoice-finance.html`, "What is notification vs non-notification factoring?", using that exact terminology (both in the visible FAQ list and its FAQPage JSON-LD schema) — this specific disclosed/confidential terminology existed only on `debtor-finance.html` before.
- Added "Sample invoices" to the "Documents you'll need" checklist (purely additive, no conflict with the existing five items).
- The Recourse vs. Non-Recourse distinction itself was already covered on `invoice-finance.html` (its "What happens if my customer doesn't pay?" FAQ), so no separate cards were added — restructuring the page's 3-card "Types of Invoice Finance" grid to 5 cards wasn't necessary to preserve the underlying fact.

**Structural fixes required by the deletion:**
- `invoice-finance.html` had its own "vs Debtor Finance" comparison-widget pill and matching JS data entry (comparing the page to the product now merged into itself) — removed, since it no longer makes sense once the pages are one.
- Updated the 3 files with real inbound links to `debtor-finance.html` (`commercial/about.html`, `commercial/guides/business-line-of-credit-guide.html`, `commercial/guides/invoice-vs-debtor-finance.html`) to point to `/commercial/invoice-finance.html`.
- Removed the stale `/debtor-finance.html` entry from `commercial/sitemap.xml`.

---

## 3. `resources.html` → Guides Hub: links repointed, then deleted

Content was already fully absorbed (confirmed in the first audit pass — diff showed only meta/canonical/breadcrumb changes). The blocker was structural: 41 files still hardcoded `href="/commercial/resources.html"`, including both canonical shared components.

**Updated to point at the guides hub in all 41 files**, including `commercial/components/navbar.html` and `commercial/components/footer.html` (both primary-nav and footer "Guides & Tools" links), plus every commercial product/guide page and `commercial/404.html`.

**Implementation note — used the real file path, not the eventual clean URL:** the task asked for `/guides/`, but this is still a static pre-Payload site with no clean-URL rewrites configured anywhere except `connect/vercel.json` (which only covers Connect). Every other internal link in the repo already uses real root-relative file paths (e.g. `/commercial/guides/index.html`), per CLAUDE.md hard rule 15. Pointing bare `/guides/` right now would 404 immediately. I used `/commercial/guides/index.html` — the working path today. `/guides/` becomes correct automatically once Phase 6's Next.js routing exists (or via the Phase 6 redirect below in the interim).

Verified zero remaining internal references before deleting the file. Updated the stale explanatory comment at the top of `commercial/guides/index.html` (it described `resources.html` as "stays live... until Phase 5.5 formally retires it" — now past tense).

---

## 4. Header/footer parity — propagated and verified

**Source of truth:** `commercial/components/navbar.html` (fixed in commit `7eddabe`, Prompt 5-fix Step 1) and `commercial/components/footer.html` (already canonical, not part of the original regression).

**Propagation:** Wrote a script that, per page: extracted the `<div class="channel-switch">` markup from inside the drifted `<div class="utility-bar">` wrapper, deleted the entire `utility-bar` block (and its now-inaccurate "top tier, ChannelSwitcher only" comment), and re-inserted the channel-switch markup into `<div class="navbar__right">` immediately before the hamburger button — matching the canonical single-strip order exactly, re-indented to match. Page-specific state was preserved everywhere: each channel's own `active`/`active--connect`/`active--personalproperty` class on its own channel-switch option, each channel's own primary-nav links (Connect and Personal & Property never had Commercial's Products dropdown, by design — only the wrapper structure needed to match, per `navbar.html`'s own header comment), and page-specific `<nav>` classes like `navbar transparent` on hero pages.

**Ran across all 57 affected pages, zero failures:**
```
commercial: 28 pages
commercial/guides: 10 pages
connect: 8 pages
personal-and-property: 11 pages
```
(`commercial/apply.html` and `connect/tests/calculator-test.html` were already correctly excluded — the former is an intentionally minimal funnel page with no full header, the latter is a dev-only test harness, not a production route.)

**Verification (the "final gate" from Prompt 5-fix):**
- Zero occurrences of `utility-bar` remain anywhere in the repo.
- Every page has exactly one `.channel-switch` div, positioned immediately before the hamburger button inside `.navbar__right`.
- Diffed a fixed page's full `<nav>...</nav>` against the canonical component directly — byte-identical except the page-specific `transparent` class, as expected.
- Ran a full HTML tag-balance check (`<div>`/`</div>`, `<nav>`/`</nav>`, `<footer>`/`</footer>`) across all 58 HTML files touched — no imbalances, no orphaned tags left by the propagation pass.

**Extra footer drift found and fixed (not part of the original regression, but the same class of parity bug):** `commercial/about.html` was still running the pre-"Phase 5 Part 1" legacy 4-column footer (`footer__grid`, no `--condensed`, with an extra `footer__links--more` block not present anywhere else in the repo) — every other page had already been migrated to the condensed 2-column canonical footer. Replaced `about.html`'s entire footer with the canonical component body; it's now byte-identical to `commercial/components/footer.html`.

**Found but deliberately not touched — flagging per hard rule 11:** a footer content-hash comparison across all pages shows 3 legitimately different (not broken) variants — Commercial's generic footer, Connect's (which links `Terms & Conditions` to `/connect/terms.html` instead of the shared `/commercial/terms.html`), and Personal & Property's (its own "Loan Types" link column, its own About link, an extra link to tradefunding.com.au). The Connect one is worth a decision: `docs/Master Information Architecture & Sitemap.md` §8 describes Terms & Conditions as one sitewide page "referenced in every footer, including Connect's," which reads as Connect should link to the shared page rather than maintain its own `connect/terms.html`. That's a page-consolidation decision (deleting a live page) on the same order as the debtor-finance/resources decisions above — not something to fold into a mechanical header-propagation pass. Flagging for your call, not deleting `connect/terms.html` myself.

---

## 5. Redirect ledger (for Phase 6 Vercel/Next.js config — not configured yet)

| From | To | Status |
|---|---|---|
| `/trade-funding-website-application/` | `/apply/` | Ready — file deleted, no content merge needed |
| `/debtor-finance/` | `/invoice-finance/` | Ready — content merged (with the numeric-conflict caveat in §2 flagged for the team), file deleted, internal links repointed |
| `/resources/` | `/guides/` | Ready — file deleted, all 41 internal references repointed |

---

## 6. Open items carried forward (not blockers, but need your input)

1. **Numeric conflicts between the old `debtor-finance.html` and `invoice-finance.html` content** (eligibility thresholds, advance rates, turnaround times) were never reconciled — no planning doc adjudicates them, so `invoice-finance.html`'s existing numbers were kept as-is and the debtor-finance numbers were retired along with the page. Worth a quick sanity check with Matt/Ben before this becomes the CMS source of truth.
2. **Connect's own `/connect/terms.html`** vs. linking to the shared `/commercial/terms.html` — the restored IA doc's §8 suggests the latter; not changed pending your confirmation, since it means deleting a live page.
3. Everything flagged-but-not-deleted from the first audit pass still stands: **53 unreferenced lender logo images**, a handful of other orphaned images, and the **~139-selector dead `.product-*`/`.hiw-*` CSS block** in `product-styles.css`.

Per CLAUDE.md hard rule 18, `docs/cleanup-report.md` now exists and the three original blockers are resolved — Phase 6 can proceed once you've weighed in on items 1–2 above (item 3 is cleanup, not a blocker).
