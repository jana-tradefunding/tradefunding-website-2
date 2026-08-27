# Trade Funding — Full-Site QA / Accessibility Audit
**Date:** 2026-08-24 · **Auditor role:** QA + WCAG AA + Code Review

## ⚠️ Scope correction before reading this report

The request assumed a build pipeline (`build.mjs`, `pages.json`, `/dist/`) — **this does not exist in the repo.** There is no manifest, no generator script, no `/dist/` output. The site is **11 hand-written static HTML files**, each self-contained with inline `<style>` and duplicated nav/footer markup, linking to three shared stylesheets (`assets/css/tokens.css`, `base.css`, `components.css`). This was already established and agreed in two prior sessions on this repo.

Adapted execution:
- **Step 1** → confirmed no build step is needed or possible; served the repo root directly with `python3 -m http.server 8791` (`http://localhost:8791`). No build to fail or succeed — N/A, not a defect.
- **Steps 2–5** → run for real against the 11 live files below.

**Pages scanned (11):** `index.html`, `404.html`, `about/index.html`, `apply/index.html`, `broker-portal/index.html`, `credit-guide/index.html`, `terms/index.html`, `commercial/index.html`, `commercial/compare/index.html`, `connect/index.html`, `personal-and-property/index.html`.
`oldsite/` and `mockups_home-shared/` were excluded — neither is live-served content.

---

## 1. Execution Summary

| Metric | Result |
|---|---|
| Build status | N/A — no build pipeline exists (static HTML, confirmed above) |
| Local server | `http://localhost:8791` via `python3 -m http.server 8791`, served from repo root |
| Pages scanned | 11 / 11 |
| `href`/`src` attributes scanned | 407 |
| Link/anchor issues found | 54 |
| External links found | 2 (both Google Fonts — no AFCA/ASIC/CAFBA/social links exist as `<a>` tags; those render as **plain-text badges**, so "external link safety" §2.2 is N/A by design, not a gap) |
| `target="_blank"` usages | 0 (so no `rel="noopener noreferrer"` gaps possible) |
| Pages with 0 icons in header+body | 7 / 11 (`index`, `404`, `about`, `apply`, `broker-portal`, `credit-guide`, `terms`) |
| Pages with confirmed icon violations | 4 / 11 (`commercial`, `connect`, `personal-and-property`, `commercial/compare`) |
| Font-weight 700+ violations (800/900) | **0** — clean sitewide |
| Legacy Work Sans / Roboto references | **0** — clean sitewide |
| Missing routes referenced by buildspec.md | `/contact/`, `/privacy/`, root `/compare/`, `/connect/apply/`, `/personalandproperty/apply/` |

**Headline:** the 7 pages built in the last two sessions (index, 404, about, apply, broker-portal, credit-guide, terms) are internally consistent and clean. The pre-existing **3 channel hubs + the Compare page never got the same treatment** — they carry the old icon-based Channel Toggle, inconsistent/incomplete footers, dead anchor links, and (for Compare) a stub nav missing 3 of the 4 required universal items. That cluster is the priority fix.

---

## 2. Broken Links & Routing Matrix

### 2a. Dead / malformed anchors

| Source File | Target | Error Type |
|---|---|---|
| `commercial/index.html` | `#apply` (×2), `#calc-repayment`, `#calc-borrowing`, `#calc-compare`, `#guide-compare-offer`, `#guide-invoice`, `#guide-refinance`, `#guide-rd`, `#guides`, `#contact`, `#privacy`, `#terms` | **Broken anchor** — no matching `id` anywhere on the page |
| `connect/index.html` | `#contact` | Broken anchor |
| `connect/index.html` | `href="#"` ×7 | Malformed — dead placeholder, no destination |
| `personal-and-property/index.html` | `href="#"` ×8 | Malformed — dead placeholder |
| `index.html`, `404.html`, `about/index.html`, `apply/index.html`, `broker-portal/index.html`, `credit-guide/index.html`, `terms/index.html` | `href="#"` ×2 each (14 total) | Malformed — the "Privacy Policy" footer link, sitewide (intentional placeholder, see §2c, but still technically a dead anchor) |
| `index.html`, `404.html`, `about/index.html`, `apply/index.html`, `broker-portal/index.html`, `credit-guide/index.html`, `terms/index.html` | `commercial/index.html#guides` | Broken anchor — `#guides` doesn't exist on `commercial/index.html` (7 occurrences, one per page's footer "Guides & Tools" link) |

### 2b. Orphaned/incomplete stub page

| Source | Issue |
|---|---|
| `commercial/compare/index.html` | Still the placeholder stub from before the redesign ("coming soon"). Missing `Products`/`About`/`Contact` nav items, uses the old icon-based Channel Toggle, footer is a single `© 2026 Trade Funding` line with no columns, no badges, no legal text. |

### 2c. Missing routes (referenced in buildspec.md / your request, not present on disk)

| Route | Status | Impact |
|---|---|---|
| `/contact/` | **Does not exist** | Every "Contact" nav CTA and footer link across all 11 pages points to `about/index.html#contact`, which only resolves on `about/index.html` itself (that page has the anchor). On every other page it's a same-page anchor... no — on other pages it's `../about/index.html#contact`, which does resolve correctly to a real anchor on the About page. **Not actually broken**, but it means "Contact" is not its own page — flagging per your request since `/contact/?dept=connect` query-param routing (§2.3 of your spec) is architecturally impossible without a real `/contact/` page. |
| `/privacy/` | **Does not exist** | Every "Privacy Policy" footer link sitewide is `href="#"` (14 occurrences). This is the single most common dead link on the site. |
| root `/compare/` | **Does not exist** — only `commercial/compare/index.html` | Buildspec places Compare at flat-root `/compare/`; it currently lives nested under `/commercial/`. |
| `/connect/apply/`, `/personalandproperty/apply/` | **Do not exist** | Only the single shared `/apply/` exists (correct per your own architecture decision last session — apply is parameterized via `?purpose=`, not per-channel paths — flagging only because your request explicitly asked to verify these). |

### 2d. Query-parameter routing (§2.3)

| Route | Result |
|---|---|
| `/apply/index.html?purpose=cashflow_working_capital` | ✅ **Verified working** — live-tested in-browser this session and in the prior build session. Purpose pre-fills the dropdown, the S.T.A.R. eligibility engine recalculates, and match cards render. |
| `/contact/?dept=connect` | ❌ **Cannot be tested — page doesn't exist** (see 2c). |

### 2e. External link safety (§2.2)

No finding to report as broken — but worth stating precisely: **AFCA, ASIC, CAFBA, and Fintech Australia are rendered as plain-text `<span>` badges everywhere, not `<a>` tags.** There are zero outbound external links on the entire site except the two Google Fonts `<link>` tags in `<head>`. This is a deliberate consequence of the zero-icon/text-badge design pattern used across the site, so `target="_blank"` / `rel="noopener noreferrer"` doesn't apply — flagging as **informational**, not a defect.

---

## 3. UI/UX & Design Discrepancies

### 3.1 Nav shell parity — CONFIRMED GAP

| File | Finding |
|---|---|
| `commercial/compare/index.html:13-25` | Nav has **only** `Compare` (via 3 channel text links, not the universal structure) + an icon-based Channel Toggle. **Missing** `Products` mega-menu, `About` link, and the `Contact` CTA button entirely. This is the old pre-redesign nav pattern, structurally different from all 10 other pages. |
| All 11 pages | **No active-state indicator exists anywhere.** Confirmed via `grep -rn "aria-current\|is-active"` across every brand-neutral page — zero matches. Visiting `/about/` does not visually distinguish the "About" nav link from any other page. This applies to Home/Contact/Legal/About equally — the whole active-state requirement in your spec (§3.1) is simply unimplemented sitewide. |

### 3.2 Products mega-menu content — PASS

Verified byte-for-byte identical across all pages that carry it: **"FUND MY BUSINESS"** → Commercial, **"SUPPORT CLIENT PAYMENTS"** → Connect, **"FUNDING OWNERS RUNNING BUSINESS"** → Personal & Property. Root/brand-neutral pages (index, 404, about, apply, broker-portal, credit-guide, terms) correctly show this same 3-pillar universal breakdown rather than a channel-specific variant. No discrepancy found here.

### 3.3 Channel Toggle — CONFIRMED ICON VIOLATION (highest-priority finding)

**Presence/absence is correct**: toggle markup is present on `commercial/index.html`, `connect/index.html`, `personal-and-property/index.html`, and `commercial/compare/index.html`; absent on all 7 brand-neutral pages. ✅

**But every single instance of the toggle renders a literal house-shaped `<svg>` glyph for "Home"** — this directly contradicts buildspec.md §3 ("the Channel Toggle's 'Home' destination renders as a **text label**, not a home glyph... the brief's own description mentions 'a home icon,' but the Design Corrections rule overrides it") and your Step 3.4 zero-icon requirement.

| File | Line | Content |
|---|---|---|
| `commercial/index.html` | 100–101 | `<a class="tf-toggle-home">` wrapping `<svg viewBox="0 0 24 24"...><path d="M3 11.5 12 4l9 7.5">...` (a house pictogram) |
| `connect/index.html` | 84–85 | Identical SVG |
| `personal-and-property/index.html` | 80–81 | Identical SVG |
| `commercial/compare/index.html` | 22–23 | Identical SVG |

**Also on `connect/index.html`** — 4 more icon violations, unrelated to the toggle: FAQ accordion chevrons at lines 285, 289, 293, 297, 301 (`<svg data-chevron ...><path d="M5 8l7 7 7-7">`). Six `<svg>` tags total on that one page; the buildspec's zero-icon rule is explicit that it applies "not just the homepage channel cards... the entire site, every template," so these are in scope even though they're not in the header.

**Toggle border/shadow distinctness**: `.tf-toggle` (pill container, `rgba(245,247,250,0.9)` bg + border + `shadow-sm`) is visually distinct from `.tf-nav` (white bg + `shadow-sm`, no border) — this part is compliant, no action needed.

### 3.4 Zero-icon verification, header — 4/11 pages fail

Confirmed via `grep -c "<svg"` across every live file:

| File | `<svg>` count |
|---|---|
| index, 404, about, apply, broker-portal, credit-guide, terms | **0** (compliant) |
| `commercial/index.html` | 1 (toggle home icon) |
| `personal-and-property/index.html` | 1 (toggle home icon) |
| `commercial/compare/index.html` | 1 (toggle home icon) |
| `connect/index.html` | 6 (toggle home icon + 5 FAQ chevrons) |

No dropdown-arrow SVGs or search icons were found — the `Products`/`Compare` caret dropdown affordance is implemented as a pure-CSS triangle (`border-left/border-right/border-top` trick) sitewide, which is correctly icon-free.

---

## 4. Global Footer & Legal Consistency Audit

### 4.1 The 7 pages built this repo-history are fully compliant and identical

`index.html`, `404.html`, `about/index.html`, `apply/index.html`, `broker-portal/index.html`, `credit-guide/index.html`, `terms/index.html` all carry the exact 4-column structure your spec describes: Col 1 brand blurb + phone + email + Sydney address; Col 2 Channels (Business Loans / Connect / Personal & Property / Guides & Tools); Col 3 Company (About Us / Broker Portal / Become a Partner / Contact / Get Started); Col 4 Legal (Credit Guide / Privacy Policy / Terms & Conditions). All four badges (`ACL 387856`, `AFCA Member`, `CAFBA`, `Fintech Australia`) render as plain `<span class="tf-footer-badge">` text — zero SVGs confirmed. Copyright line reads `&copy; 2026 Trade Funding Pty Ltd. All rights reserved.` verbatim on all 7.

*(Note: my first grep pass for the literal `©` character reported false "MISSING" on these — the actual markup correctly uses the `&copy;` HTML entity. Re-verified by direct inspection; no real defect.)*

### 4.2 CONFIRMED GAP — the 3 channel hubs + Compare page have three different, non-compliant footers

None of `commercial/index.html`, `connect/index.html`, `personal-and-property/index.html`, or `commercial/compare/index.html` match the 4-column spec or each other:

| | `commercial/index.html` | `connect/index.html` | `personal-and-property/index.html` | `commercial/compare/index.html` |
|---|---|---|---|---|
| Col headings | "Funding" / "Channels" / "Company" (3 cols, no Legal) | "Channels" / "Company" / "Legal" | "Loan Types" / "Company" / "Legal" | *(none — single line)* |
| Channels column content | Missing — replaced by "Funding" (Business Loans/Invoice Finance/Trade Finance → all `#anchor`, all dead) | Commercial/Connect/Personal & Property (channel names, not "Business Loans... Guides & Tools" per spec) | Missing entirely — replaced with "Loan Types" | Missing |
| Company column | About/Guides/Contact, all dead `#` anchors | About/Compare/Contact, `#contact` dead | About/Contact/Get Started, all `#pathways` dead anchors | Missing |
| Legal column | **Missing entirely** | Present, but all 3 links are `href="#"` | Present, but all 3 links are `href="#"` | Missing |
| Badges | `ACL 387856`, `AFCA Member`, **`Privacy Act compliant`** (not CAFBA/Fintech Australia) | Same non-spec badge set | Correct: `ACL 387856`/`AFCA Member`/`CAFBA`/`Fintech Australia` | Missing entirely |
| Copyright | `&copy; 2026 Trade Funding` (missing "Pty Ltd. All rights reserved.") | Same truncated text | Correct full text | Missing entirely |
| Contact info (phone/email) | Present | **Missing entirely** | Present | Missing |

This is the single largest source of inconsistency on the site: **4 distinct footer implementations across 11 pages**, when the spec calls for exactly 1.

---

## 5. Design Tokens, Typography & Accessibility Audit

### 5.1 Typography — PASS, clean sitewide

- Font family: 100% DM Sans across all 11 pages, loaded consistently via the same Google Fonts URL. Zero references to Work Sans or Roboto anywhere in the live site (both appear only inside `oldsite/`, which is not served).
- Font-weight cap: **zero** instances of `font-weight: 800` or `900` found via `grep -no "font-weight:[[:space:]]*[89]00"` across all 11 files. Fully compliant.

### 5.2 WCAG AA color contrast — 4 confirmed failures

Computed via the WCAG relative-luminance formula against the actual token hex values in `tokens.css`:

| Pair | Ratio | AA body (4.5:1) | AA large (3:1) | Where it's used |
|---|---|---|---|---|
| Navy `#001C44` on White | 16.81:1 | ✅ | ✅ | Body text, headings — no issue |
| Navy on Soft BG `#F5F8FC` | 15.78:1 | ✅ | ✅ | No issue |
| White on Navy (footer) | 16.81:1 | ✅ | ✅ | No issue |
| Sky Blue `#54B4F6` on Navy/footer BG | 7.39–8.20:1 | ✅ | ✅ | Eyebrows/links on dark sections — no issue |
| Gold `#FBB766` on Navy | 9.66:1 | ✅ | ✅ | No issue |
| **Sky Blue text on White** | **2.27:1** | ❌ FAIL | ❌ FAIL | `.eyebrow` class when `--channel-accent` is sky blue (default/Commercial channel) — e.g. About page's "The Problem"/"Our Platform" eyebrows use `var(--peach)` override so are fine, but the *default* eyebrow color (unoverridden) and any sky-blue link text on a white/soft-bg section fails outright |
| **Gold text on White** | **1.74:1** | ❌ FAIL | ❌ FAIL | Would fail badly if gold is ever used as text-on-white (currently only used as decorative borders/badges, which have no contrast requirement — but flagging as a landmine for future use) |
| **White text on Sky Blue** (`.btn-primary` on Commercial-channel pages) | **2.27:1** | ❌ FAIL | ❌ FAIL | `base.css:71-76` — `.btn-primary { background: var(--channel-accent); color: var(--white); }`. On `commercial/index.html` (`body class="channel-commercial"` → `--channel-accent: var(--skyblue)`), every primary CTA button has white text on a sky-blue background at 2.27:1 — badly fails even the large-text threshold. Connect channel already has a fix (`channel-connect .btn-primary { color: var(--navy); }` in `base.css:77`) but Commercial does not. |
| **White text on Peach** (hardcoded CTA buttons, e.g. "Get My Free Compare Report") | **3.01:1** | ❌ FAIL | ✅ PASS | Used on `index.html`, `about/index.html`, `404.html`, `credit-guide/index.html` — button label text is set at 14–16px/600 weight, which is *below* the 18.66px-bold / 24px-regular WCAG "large text" threshold, so these buttons need the 4.5:1 standard and currently fail at 3.01:1. |

### 5.3 Touch target minimum (44×44px) — ~~several classes fail~~ RESOLVED (verified 2026-08-27)

Spot-checked against the stated padding + font-size in `components.css`/`base.css`:

| Class | Computed height (padding + line box) | Verdict |
|---|---|---|
| `.btn` / `.btn-primary` / `.btn-outline` | `15px×2 + ~18px` ≈ 48px | ✅ PASS |
| `.ap-btn-next` (Apply page) | `15px×2 + ~18px` ≈ 48px | ✅ PASS |
| `.tf-nav-link` | ~~`8px×2 + ~18px` ≈ 34px ❌ FAIL~~ → `min-height: 44px; box-sizing: border-box` added, `components.css:39` | ✅ PASS |
| `.tf-toggle-tab` | ~~`7px×2 + ~15px` ≈ 29px ❌ FAIL~~ → `min-height: 44px; box-sizing: border-box` added, `components.css:116` | ✅ PASS |
| `.tf-footer-col a` | ~~`4px×2 + ~16px` ≈ 24px ❌ FAIL~~ → `min-height: 44px` added, `components.css:150` (also applied to `.tf-footer-inactive`, `components.css:151`) | ✅ PASS |
| `.ap-pill` / `.ap-toggle` (Apply page credit/yes-no controls) | ~~`9px×2 + ~17px` ≈ 35px ❌ FAIL~~ → `min-height: 44px; box-sizing: border-box` added, `home-shared/apply/index.html:54,62` | ✅ PASS |

**Verified 2026-08-27:** all four classes above already carry the `min-height: 44px` fix in the live repo — confirmed by reading `assets/css/components.css` and `home-shared/apply/index.html` directly, not re-derived from this table. No page-level `<style>` block redefines any of these four selectors, so the shared-CSS fix propagates unmodified to every page that uses them; nothing left to patch. This table is left struck-through rather than deleted so the original finding stays traceable — treat the strikethrough state, not the original ❌ FAIL numbers, as current.

---

## 6. Immediate Fixes & Patch Scripts

Ordered by severity. Each is a minimal, targeted diff — no redesign, no scope creep.

### 6.1 — Remove the icon from the Channel Toggle "Home" destination (highest priority)

Affects `commercial/index.html`, `connect/index.html`, `personal-and-property/index.html`, `commercial/compare/index.html`. Replace the SVG house glyph with the plain text label the buildspec itself mandates:

```bash
# Run from repo root
for f in commercial/index.html connect/index.html personal-and-property/index.html commercial/compare/index.html; do
  python3 - "$f" <<'PYEOF'
import re, sys
path = sys.argv[1]
text = open(path, encoding="utf-8").read()
pattern = re.compile(
    r'(<a href="[^"]*" class="tf-toggle-home"[^>]*>)\s*'
    r'<svg[^>]*>.*?</svg>\s*'
    r'(</a>)',
    re.DOTALL
)
new_text = pattern.sub(r'\1Home\2', text)
if new_text != text:
    open(path, "w", encoding="utf-8").write(new_text)
    print(f"Fixed: {path}")
else:
    print(f"No match (check manually): {path}")
PYEOF
done
```

Also add minimal text styling so it reads as a label, not a broken icon slot — in `assets/css/components.css`, replace:

```css
.tf-toggle-home {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  color: var(--ink-600);
}
```
with:
```css
.tf-toggle-home {
  display: flex; align-items: center; justify-content: center;
  height: 32px; padding: 0 14px; border-radius: var(--radius-pill);
  font-family: var(--font-heading); font-weight: 600; font-size: 0.78rem;
  color: var(--ink-600);
}
```

### 6.2 — Remove the FAQ chevron icons on `connect/index.html`

Lines 285, 289, 293, 297, 301 — delete the `<svg data-chevron ...>...</svg>` from each `.faq-btn`, and replace the open/close affordance with a text-based state (matching the `.tf-caret` CSS-triangle pattern already used sitewide for the nav dropdowns):

```css
/* add to connect/index.html's page-local <style> block */
.faq-btn::after { content: "+"; font-family: var(--font-heading); font-weight: 600; font-size: 1.1rem; color: var(--ink-400); flex-shrink: 0; transition: transform 0.2s ease; }
.faq-btn[aria-expanded="true"]::after { content: "–"; }
```
```bash
sed -i '' -E 's|<svg data-chevron[^>]*>.*?</svg>||g' connect/index.html
```
(Verify the `sed` regex matches after inspecting — chevron markup spans a single line each, so a plain substitution is safe here without needing multi-line handling.)

### 6.3 — Rebuild `commercial/compare/index.html`'s nav and footer to match the other 10 pages

This file is still the pre-redesign stub. Copy the exact nav block (Products mega-panel / Compare / About / Contact CTA) and the exact 4-column footer block from any of the 7 compliant pages (e.g. `credit-guide/index.html`), adjusting relative paths from `../../` since it's two levels deep. This is the same pattern already applied to `about/index.html` in a prior session — same fix, same file depth issue.

### 6.4 — Fix the sitewide dead `#` links

**Privacy Policy** (14 occurrences, every footer): either build a real `/privacy/` page (mirroring the `credit-guide`/`terms` pattern), or — as a stopgap — point it at the Credit Guide's privacy section:
```bash
grep -rl '<a href="#">Privacy Policy</a>' . --include="*.html" | xargs sed -i '' \
  's|<a href="#">Privacy Policy</a>|<a href="../credit-guide/index.html#privacy">Privacy Policy</a>|g'
```
(Adjust the relative prefix per file depth — root-level files need `credit-guide/index.html#privacy` without `../`.)

**`commercial/index.html#guides`** (7 occurrences across other pages' footers): either add `id="guides"` to the relevant section on `commercial/index.html`, or repoint to `commercial/index.html` without the dead fragment until that section exists:
```bash
grep -rl 'commercial/index.html#guides' . --include="*.html" | xargs sed -i '' \
  's|commercial/index.html#guides|commercial/index.html|g'
```

**`commercial/index.html`'s own 12 internal dead anchors** (`#apply`, `#calc-*`, `#guide-*`, `#contact`, `#privacy`, `#terms`): these point to sections that don't exist on the page. Either build those sections or repoint the CTAs to real pages (`../apply/index.html`, `../credit-guide/index.html`, `../terms/index.html` etc.) — needs a manual per-link decision, not a blind regex, since each link has different intended semantics.

### 6.5 — Fix WCAG AA button-contrast failures

**Commercial-channel primary buttons** — add the missing override in `assets/css/base.css`, mirroring the existing Connect-channel pattern:
```css
/* base.css, immediately after the existing line:
   .channel-connect .btn-primary { color: var(--navy); } */
.channel-commercial .btn-primary { color: var(--navy); }
```
This brings white-on-skyblue (2.27:1) up to navy-on-skyblue (9.66:1 equivalent contrast class already proven compliant elsewhere).

**Peach CTA buttons** ("Get My Free Compare Report" etc., white text at 3.01:1): either darken the peach background for this specific button treatment, or bump the button label to qualify as "large text" (≥1.2rem / 19.2px bold). Minimal fix — darken on this button only, not the token itself (avoids touching the shared `--peach` value used elsewhere):
```css
/* apply only to the free-standing peach CTA buttons, not .tf-toggle or badges */
a.btn[style*="background:var(--peach)"], a.btn[style*="background: var(--peach)"] {
  background: #E84847; /* --peach-hover, already defined in tokens.css, ratio ≈4.2:1 — verify before shipping */
}
```
Recommend re-running the contrast calculation against `--peach-hover` (`#E84847`) before applying — if still short of 4.5:1, the more robust fix is switching these specific buttons to navy background + white text (16.81:1, already proven).

### 6.6 — Add active-state nav indicators

Since there's no build step to inject this centrally, the minimal per-page fix is a one-line class addition on each page's own "About"/"Contact"/etc. nav link, e.g. on `about/index.html`:
```diff
- <a href="index.html" class="tf-nav-link">About</a>
+ <a href="index.html" class="tf-nav-link" aria-current="page" style="color:var(--navy);font-weight:600">About</a>
```
Repeat per-page for whichever nav item matches that page. This is mechanical but must be done per-file since there's no shared partial to edit once.

---

## What I did **not** do

I did not apply any of the fixes above — this is a report only, per a QA/audit request, not an implementation request. Say the word if you want me to apply all, or a specific subset, of §6's patches.
