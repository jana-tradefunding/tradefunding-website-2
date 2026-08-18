# Performance, Animation, & SEO Audit — Trade Funding Site

## Rendering & Performance

### Finding 1 — Every image on the Commercial homepage is missing explicit `width`/`height` (CLS risk)
**Severity: High.** Counted directly: `commercial/index.html` has 73 `<img>` tags; **0 of the 73** carry `width`/`height` attributes. 70 of the 73 do correctly carry `loading="lazy"` — so lazy-loading discipline is good, but without explicit dimensions the browser can't reserve layout space before the image downloads, which is a direct CLS (Cumulative Layout Shift) contributor, particularly for images that load in above the fold before the layout has settled.
**Fix:** add explicit `width`/`height` (matching intrinsic aspect ratio) to every `<img>` tag, or at minimum use CSS `aspect-ratio` alongside a `width: 100%` rule for responsive images, so the browser reserves space immediately. Given how many images this touches, this is a good candidate for a small script pass (read each image's real dimensions from disk, inject the attributes) rather than manual editing 73 tags by hand.

### Finding 2 — No modern image formats (WebP/AVIF) anywhere on the sampled pages
**Severity: Medium.** Zero `.webp`, `.avif`, or `<picture>` elements found across `commercial/index.html`, `connect/index.html`, `personal-and-property/index.html`. Asset inventory in `commercial/assets/`: 52 PNG, 7 JPG, 44 SVG. The heaviest single asset is `commercial/assets/founders.jpg` at **2.0MB** — for a photo used in an `about`/trust context, that's a meaningful chunk of LCP budget on a mobile connection if it's anywhere near the fold.
**Fix:** convert `founders.jpg` and the other JPG/PNG photos to WebP (with a JPG/PNG `<picture>` fallback only if IE/legacy support is actually required — otherwise WebP alone is safe for 2026 browser support) and re-encode at a sane max width for its rendered size rather than serving a full-resolution source image.

### Finding 3 — Broken Open Graph image on the Commercial homepage
**Severity: Medium (SEO/social, not runtime performance, but grouped here per the report's own "Rendering... & SEO" scope).** `commercial/index.html`'s `og:image` tag points to:
```html
<meta property="og:image" content="https://tradefunding.com.au/assets/og-image.png">
```
That file does not exist anywhere in the repository — the only `og-image.png`/`og-image.jpg` files that exist live at `connect/branding/og-image.png` and `connect/branding/og-image.jpg`. This means any social share of the Commercial homepage (LinkedIn, Facebook, Slack unfurl, etc.) will show a broken image.
**Fix:** create a Commercial-specific OG image at `commercial/assets/og-image.png` (don't just point Commercial's meta tag at Connect's branding — visually they should differ) and confirm the path resolves once deployed, since `content` URLs for OG tags must be absolute and reachable regardless of routing changes in Phase 8.

### Finding 4 — `personal-and-property/index.html` has no `og:image`, no Twitter Card, and no `sitemap.xml`/`robots.txt` for the channel at all
**Severity: Medium.** Confirmed: `personal-and-property/index.html` has exactly 1 Open Graph tag total (title only, no `og:image`) and 0 `twitter:card` tags — versus Connect, which has a complete OG set including `og:image:width`/`og:image:height`/`og:image:alt`. There is also no `sitemap.xml` or `robots.txt` anywhere under `personal-and-property/` (Commercial has both; Connect has `robots.txt` but no `sitemap.xml`).
**Fix:** bring Personal & Property's `<head>` metadata up to the same standard already set by Connect (it's a good template to copy from), and add both a `sitemap.xml` and `robots.txt` for the channel before it's indexed. Also add `sitemap.xml` to Connect while at it, since it's currently the one channel missing that specific file.

### Finding 5 — No bundler/route-splitting today — expected and fine, not a defect
This is a static multi-page HTML site with no JS framework or bundler in the current phase, so "route-based splitting" and "dynamic imports for heavy libs" don't apply yet — each page naturally only loads its own inline `<script>`/`<style>` content, which is the static-site equivalent of code-splitting. This becomes a real, trackable guardrail once Phase 8's Next.js app exists; flagging now only so it's on the Phase 8 checklist rather than treated as a current gap.

### Finding 6 — Hydration safety: not applicable in current phase
No server-rendered/client-hydrated framework exists yet (confirmed: no React/Vue/Next.js runtime anywhere in `commercial/`, `connect/`, or `personal-and-property/` — all plain HTML+vanilla JS). This guardrail becomes relevant starting Phase 8; no current-phase finding.

## Animation

### Finding 7 — `prefers-reduced-motion` is broadly, correctly respected — good state, one thing to keep an eye on
37 files across the repo reference `prefers-reduced-motion`, and the one JS-driven animation I checked in depth — the hero invoice-cycling effect in `connect/scripts/main.js:52` — correctly gates its `setInterval` behind `!window.matchMedia('(prefers-reduced-motion: reduce)').matches`. `.channel-switch__option` transitions are also disabled under reduced motion (`shared/styles/chrome.css:523-525`). No fix needed here; call this out as a genuine strength to preserve as new animated components get added (e.g., the P&P hero entrance animation recommended in Report 4 — make sure it's added with the same reduced-motion gate the rest of the `.reveal` system already has, not as a one-off).

### Finding 8 — Animated properties are correctly GPU-friendly where sampled
The `ghostFloat` keyframe animation in `commercial/index.html` (`transform: translateY(...)`) and the `.reveal` system (used across Connect and Personal & Property) both animate composited-friendly properties (`transform`/`opacity`) rather than layout-triggering properties like `top`/`width`/`margin`. No fix needed in the samples reviewed.

## SEO & Discoverability

### Finding 9 — Metadata: strong where present, inconsistent across channels
Canonical tags: present and correct on all three sampled homepages (1 each). JSON-LD: present on all three (Commercial has 6 separate schema blocks, Connect 2, Personal & Property 1) — worth a follow-up check that Commercial's 6 blocks don't contain duplicate/conflicting `Organization` entries, since that's a common side effect of accumulating schema blocks over multiple edits, but I did not have time to diff all 6 in this pass. Title tags across all 11 Personal & Property pages are unique and well-formed (checked directly — no templated duplicates). The main gap is the OG/Twitter inconsistency documented in Findings 3–4 above.

### Finding 10 — Structured data present, but worth a dedicated pass once Findings 3–4 are fixed
Since `JSON-LD` blocks typically embed `image`/`logo` URLs alongside the OG tags, the broken `og-image.png` reference in Finding 3 is worth checking against Commercial's own JSON-LD blocks too — a broken image reference duplicated into structured data compounds the same bug in two places instead of one. Recommend re-checking JSON-LD image URLs in the same pass as the OG fix.

## Summary table

| # | Finding | Severity |
|---|---|---|
| 1 | 0/73 images on Commercial homepage have width/height | High |
| 2 | No WebP/AVIF anywhere; 2MB unoptimized founders.jpg | Medium |
| 3 | Commercial's `og:image` points to a file that doesn't exist | Medium |
| 4 | Personal & Property missing og:image, Twitter Card, sitemap.xml, robots.txt | Medium |
| 5 | No route splitting (N/A — static site, revisit at Phase 8) | — |
| 6 | Hydration safety (N/A — no framework yet) | — |
| 7 | `prefers-reduced-motion` handling | ✅ Good, no fix needed |
| 8 | GPU-friendly animated properties | ✅ Good, no fix needed |
| 9 | Metadata mostly strong, OG/Twitter inconsistent across channels | Medium |
| 10 | JSON-LD may duplicate the broken image reference — needs a follow-up pass | Low |
