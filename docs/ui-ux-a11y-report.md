# UI, UX, & Accessibility Review — Trade Funding Site

## Your reported issues — verified against the code

### 1. Hero content hidden behind the fixed header (Commercial, Connect, Personal & Property)
**Confirmed, root cause found.** The header is two stacked fixed elements: `.trust-bar` (`shared/styles/chrome.css:213-224`, `height: var(--utility-bar-height, 37px); position: fixed; top: 0;`) plus `.navbar` (`chrome.css:288-297`, `position: fixed; top: var(--utility-bar-height, 37px); padding: 16px 0;` with a 36px logo → roughly 68–70px tall). That's **~105–107px of real fixed-header height**, but `commercial/index.html`'s `.hero` rule only reserves `padding: 90px 0 0` (line 476). The shortfall is worse than it looks on first read because the channel-switcher's "Home" text (see item 2 below) can force the navbar row to wrap on narrower viewports, growing its real height beyond the ~70px assumed. This lines up exactly with what you're seeing: the ★★★★★ trust line and lender-count line, plus the hero image, sit right at the clipped edge.
**Fix:** increase `.hero`'s top padding to `calc(var(--utility-bar-height, 37px) + 80px + 32px)` (i.e., trust-bar + navbar + a comfortable buffer) instead of a bare `90px`, and verify the same math on Connect (`connect/styles/main.css:163`, currently `padding:clamp(64px,8vw,112px) 0 ...` — already more generous, but confirm it clears the trust-bar+navbar stack on mobile too) and on Personal & Property's `.pp-hero`.

### 2. Channel-switcher "Home" — contradiction to flag, not silently resolve
You asked for the Home toggle to be icon-only, no text. But `CLAUDE.md` rule 13 explicitly locks: *"Home icon + 'Home' text (Commercial, never the word 'Commercial')"* and calls out that an earlier ambiguous instruction already caused a two-tier header mistake once — i.e., this exact area has been re-specified before. Per your own rule 11 ("flag contradictions instead of silently resolving them"), I'm surfacing this rather than picking a side: removing the "Home" label directly contradicts a currently-locked rule, so it needs an explicit re-confirmation (a `CLAUDE.md` update) before it's implemented, not a silent code change. Functionally, removing the text is also the more defensible fix for the hero-overlap problem above (a shorter switcher never wraps), so if you confirm the change, `commercial/components/navbar.html:107-110`'s `<span class="channel-switch__full">Home</span>` is the single line to remove (plus its equivalent, if duplicated, in the 63 non-synced pages — see the architecture report's Finding 1).

### 3. "Funding Solutions" dropdown still uses emoji icons
**Confirmed, unresolved.** `commercial/components/navbar.html` lines 53–93 — every single sub-item still carries an emoji `<span class="dd-icon ...">`, e.g.:
```html
<a href="/commercial/business-term-loans.html"><span class="dd-icon icon--sky">&#128176;</span> Term Loan</a>
```
The requested redesign (grouped list — Term Loans / Credit Lines / Invoice / Trade / Equipment / Mortgage / Other, hover-to-expand) **is already structurally in place** — the categories exist exactly as specified, and product pages remain live and linked (satisfying the "don't delete for nav decluttering" requirement, since e.g. `second-mortgage.html` and `self-employed-home-loan.html` stay linked from within the dropdown). The only thing not done is removing the icon glyphs themselves.
**Fix:** delete the seven `<span class="dd-icon ...">&#...;</span>` icon spans in `navbar.html` (lines 53, 54, 55, 59, 60, 61, 65, 66, 70, 71, 72, 76, 77, 78, 82, 83, 84, 88, 92, 93), leaving the plain text labels, and re-propagate to every page (again, only 3 of 66 pages will pick this up automatically — see architecture report).

**Also confirmed:** there is **no dedicated Products page** yet at a distinct URL — the dropdown IS the only "menu-style" view. Since the dropdown already groups everything correctly, the cheapest path is to build `commercial/products.html` (or repurpose `commercial/business-loans.html`, which already has include-sync wired up) as that dedicated page, reusing the same category grouping markup, with each category as a full section with CTAs rather than a hover menu.

### 4. Casper logo distorted in the footer
**Confirmed, likely root cause found.** `connect/components/footer.html:28`:
```html
<img src="/connect/branding/cashper-gradient-transparent.png" alt="" style="height:56px;width:auto;" aria-hidden="true">
```
The source PNG is 400×632px (checked directly). The parent, `.footer__brand-col` (`connect/styles/main.css:736`), is `display:flex; flex-direction:column;` with no `align-items` override — the flex default is `align-items: stretch`, which stretches a column-flex child's cross-axis size (its **width**) to fill the container, overriding the inline `width:auto` in practice for many browsers' flex algorithms once a fixed cross-size sibling forces a stretch context. That squashes/stretches the tall, narrow ghost mascot horizontally — exactly "completely distorted."

Telling piece of supporting evidence: `connect/styles/main.css:760` already has a **correctly-built, unused** rule for exactly this problem —
```css
.footer__cashper{width:28px;height:28px;opacity:0.5;flex-shrink:0;object-fit:contain}
```
— but **no HTML anywhere in the repo actually has `class="footer__cashper"`** on an `<img>` (confirmed via full-repo grep). This looks like a fix that was written into the CSS but never wired to the markup.
**Fix:** add `class="footer__cashper"` to the `<img>` at `connect/components/footer.html:28` and drop the inline `style="height:56px;width:auto;"` in favor of that class (which already has `object-fit:contain` and `flex-shrink:0` to prevent exactly this distortion). If 28×28px reads too small against the current 56px-tall design intent, adjust the class's dimensions rather than reintroducing an inline override.

### 5. Personal & Property has no startup/entrance animation, unlike Home and Connect
**Confirmed.** Connect's hero elements each carry `reveal`/`reveal delay-N` classes (`connect/index.html:246,255,256,257,258,263`); Commercial's hero uses a dedicated `@keyframes ghostFloat` animation plus its own entrance treatment. Personal & Property's hero block (`personal-and-property/index.html:122-160`, the `.pp-hero*` elements) has **no `reveal` class and no animation class at all** — the entrance animation only starts appearing further down the page, on the `.section-header` and `.pp-card` elements (lines 183 onward), which do correctly use `reveal`/`reveal delay-1/2/3`.
**Fix:** add the same `reveal`/`reveal delay-N` classes used elsewhere in this file to the `.pp-hero__eyebrow`, `.pp-hero__title`, `.pp-hero__lead`, `.pp-hero__cta-group`, `.pp-hero__trust`, and `.pp-hero__card` elements, matching Connect's stagger pattern — the CSS/JS driving `.reveal` is already shared and already loaded on this page (it's used below the fold), so this is a markup-only change.

### 6. Footer emoji removal
**Confirmed, unresolved.** The canonical footer (`commercial/components/footer.html:20-22`) still uses:
```html
<div class="footer__contact-item">&#128222; 1300 161 641</div>
<div class="footer__contact-item">&#128231; support@tradefunding.com.au</div>
<div class="footer__contact-item">&#128205; [address]</div>
```
Same pattern repeats in `connect/components/footer.html` and `personal-and-property/components/footer.html`. **Fix:** delete the three emoji entity references (`&#128222;`, `&#128231;`, `&#128205;`) from all three canonical footer components. Since these ARE among the 63 pages not covered by include-sync, this still needs a manual propagation pass afterward (see architecture report Finding 1) — or better, use this fix as the forcing function to finally wire the remaining 63 pages into the sync system.

### 7. Address / T&Cs / email updates
Covered in detail in the Security report (Finding 6) — status: `commercial/credit-guide.html` and `commercial/terms.html` already have the real address filled in; 59 other files, plus `commercial/privacy.html:369`, still show the `[BLOCKED]` placeholder. `support@tradefunding.com.au` is already used sitewide (102 occurrences); the handful of `hello@` references are confined to the out-of-scope `_internal/_DO-NOT-DEPLOY-design-baseline/` reference folder.

---

## Additional findings from the UI/UX/A11y guardrail checklist

### Touch targets below 44×44px on mobile (channel switcher)
**Severity: Medium.** At `max-width: 640px` (`chrome.css:512-519`), `.channel-switch__option` drops to `padding: 7px 10px; font-size: 0.72rem`. With a single-line label ("P&P", "Connect") at that font size and padding, the resulting tap target is well under 44px in height (roughly 28-30px including line-height). This is precisely the breakpoint where `.channel-switch__full` is hidden and `.channel-switch__short` ("P&P") is shown — so the shortened label doesn't come with a compensating size increase.
**Fix:** add `min-height: 44px` to `.channel-switch__option` at this breakpoint (increase vertical padding, not just rely on font-size) — this also gives more headroom against Finding 1 above.

### Color-contrast check already done correctly in code (positive note)
`chrome.css:487-490` contains a genuinely good practice: a code comment justifying the *navy*-on-peach ink choice for the active Personal & Property pill specifically because "white-on-peach measures 3.01:1 (fails the 4.5:1 bar), navy-on-peach measures 5.58:1." This is exactly the kind of contrast diligence the guardrails ask for — no fix needed, flagged only so it isn't miscounted as a gap during review.

### One `<h1>` per page — passes
Sampled all three channel homepages (`commercial/index.html`, `connect/index.html`, `personal-and-property/index.html`): each has exactly one `<h1>`. No violation found in the sample.

### `prefers-reduced-motion` — broadly respected, one gap
Widely honored: 37 files reference `prefers-reduced-motion`, including `connect/scripts/main.js:52`, which correctly gates the hero invoice-cycling `setInterval` behind `!window.matchMedia('(prefers-reduced-motion: reduce)').matches`, and `.channel-switch__option` transitions are disabled under reduced motion (`chrome.css:523-525`). No sitewide gap found in the areas sampled — this guardrail is in noticeably better shape than CSP/consent coverage.

### Native semantics — mostly good, one gap worth a mention
The hamburger menu in `connect/scripts/main.js:27-46` correctly toggles `aria-expanded` and `aria-label` (Open/Close menu) — good pattern. The dropdown mega-menu in `commercial/components/navbar.html`, however, is a plain `<div class="dropdown-menu">` shown via hover/CSS with no `aria-expanded` state on its trigger and no keyboard-accessible open/close handling visible in the markup (it relies on CSS `:hover`). **Fix:** add `aria-expanded` toggling and a click/focus-based open state (not hover-only) so keyboard and screen-reader users can reach the Funding Solutions submenu — this matters more once the emoji-icon fix (item 3) ships, since that's the same interactive element.

### Form resilience — Connect's request-call form is a good example (positive note)
`connect/scripts/form.js` validates on blur, re-validates on input only after an error is already showing (avoids nagging a user mid-type), preserves focus on the first invalid field on submit, and disables the submit button with a "Sending…" label during the request rather than allowing double-submits. This matches the "inline validation on blur, clear failure recovery" guardrail well. No fix needed.

## Summary table

| # | Issue | Status | Severity |
|---|---|---|---|
| 1 | Hero hidden behind fixed header | Confirmed, root cause found | High |
| 2 | Home icon+text vs icon-only | **Contradiction — needs your decision**, not code | — |
| 3 | Emoji icons still in Funding Solutions dropdown | Confirmed, unresolved | Medium |
| 3b | No dedicated Products page yet | Confirmed gap | Medium |
| 4 | Casper logo distorted (Connect footer) | Confirmed, root cause + unused fix found | Medium |
| 5 | No entrance animation on P&P hero | Confirmed | Low |
| 6 | Footer emoji still present | Confirmed, unresolved | Low |
| 7 | Address/email placeholders | Partially fixed — see security report | Low–Medium |
| 8 | Channel-switch touch targets <44px on mobile | New finding | Medium |
| 9 | Dropdown menu not keyboard/AT accessible (hover-only) | New finding | Medium |
