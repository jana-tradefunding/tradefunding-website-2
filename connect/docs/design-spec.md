# Trade Funding Vendor Landing Page — Design Spec

**Date:** 2026-05-06
**Project path:** `C:\Users\BenLyons\TradeFunding-Projects\vendor-landing\`
**Source content:** `C:\Users\BenLyons\TradeFunding-Projects\vendor-deck\index.html` (10-slide deck)

---

## 1. Purpose

Standalone marketing landing page for businesses that sell to other businesses, positioning Trade Funding as the way to embed financing at every point of sale. The page converts on two paths:

1. **Request a call** — primary CTA, custom lead-capture form with preferred date + time-of-day fields
2. **Register your business** — secondary CTA, placeholder link (`href="#register"`) to be wired later

The page is **public-facing**. The phrase "vendor partner" — used internally and across the deck — does **not** appear in public copy. Public language: "businesses that sell to businesses", "register your business", "growth manager".

## 2. Audience

Broad: any B2B vendor whose customers may need finance to complete a transaction. Includes equipment/asset sellers, software/SaaS, trades, professional services, and stock/supplies wholesalers. Copy stays vertical-agnostic.

## 3. Stack & deployment

- **Stack:** static HTML + external CSS + vanilla JS. No build step. No framework.
- **Files:** three HTML pages (landing, privacy, terms) sharing one stylesheet.
- **Fonts:** Google Fonts — Work Sans (700/800/900) + Roboto (300/400/500/700), preconnected.
- **Deployment:** Vercel/Netlify-ready static deploy. Domain TBD at deploy time.
- **Performance target:** Lighthouse ≥95 across Performance / Accessibility / Best Practices / SEO.

## 4. Brand system

Inherited verbatim from `vendor-deck/index.html` and locked per the **TF Brand Tokens** memory. No deviation.

**Colour tokens:**
- `--navy: #001C44`, `--navy-blue: #1C1998`, `--navy-deep: #000C22`
- `--skyblue: #54B4F6`, `--skyblue-soft: #EAF4FE`
- `--peach: #FF5D5C`, `--peach-soft: #FFF0F0`
- `--gold: #FBB766`, `--gold-soft: #FFF7EC`
- `--success: #10B981`
- Ink scale 900/600/400/200; `--bg-soft: #F5F8FC`

**Type:**
- Headings: Work Sans 700–900, letter-spacing −0.025em on display sizes
- Body: Roboto 400/500
- Display headline `clamp(2.4rem, 4.4vw, 4.2rem)`; xl variant `clamp(3rem, 5.2vw, 5rem)`

**Components reused (class names match deck):**
- `.s-eyebrow`, `.s-headline`, `.s-subhead`, `.s-body`, `.s-caption`
- `.badge--skyblue|peach|gold|success|light|navy`
- `.divider`, `.divider--peach|gold|success|white|center`
- `.reveal` with stagger delays (`delay-1` through `delay-5`)
- Card surfaces with `--shadow-soft` / `--shadow-lg`

**Section rhythm:** alternating light/dark mirrors the deck — hero (dark) → who-for (light) → problem (light) → solution (dark) → how (light) → shift (dark) → upside (light) → calculator (light) → why (dark) → conversion (dark) → footer (dark deeper).

**Cashper mascot:** watermark in hero (bottom-right, 8% opacity) and small mark in footer. Per memory, never remove.

**Confidentiality strip:** the deck's `· Confidential` foot is **dropped** for the public landing page.

## 5. Page anatomy

1. **Sticky top nav** — TF logo · anchors (How it works · The maths · Why us) · "Register your business" (secondary) · "Request a call" (primary peach)
2. **Hero** (dark) — eyebrow "For businesses that sell to businesses" · headline *"Win more business."* · sub-slogan · dual CTA · Cashper watermark · trust strip "70+ lenders · $0 cost · 24-48 hr decisions"
3. **Who it's for** (light) — three cards: Stock & Supplies (sky) · Assets & Equipment (peach) · Professional Services (gold)
4. **The Problem** (light) — three stat tiles: 3 in 4 (peach) · 1 in 5 (gold) · +40% (sky); closer paragraph re: market-scan differentiator
5. **The Solution** (dark) — 4-step horizontal flow with arrows: QR → Market Scanned → Best Path → Transaction Powered; pills row
6. **How it works** (light) — three step-cards with mockups (invoice+QR · phone wizard with `from $1,847/mo` · Compare Report with three lender rows). Mockups ported verbatim from deck slide 5.
7. **The Shift** (dark) — 4 cards in 2×2: Competitors offering it · Customers expect it · Remove awkward money moment · Zero cost zero risk
8. **The Upside** (light) — 4 cards: Larger basket · Greater conversion · Cut finance fees · No more budget conversations
9. **Interactive ROI Calculator** (light) — see §6
10. **Why Trade Funding** (dark) — 4 cards: 70+ lenders checked · Proprietary matching engine · We handle everything · Dedicated growth manager
11. **Conversion module** (dark) — see §7
12. **Footer** (dark deeper) — see §8

### 5.1 Per-section reveal animation

On scroll into view (IntersectionObserver, `rootMargin: -10%`), eyebrow → headline → divider → body fade in and rise 16px with staggered 100ms delays, mirroring the deck's `.reveal` pattern. Sections themselves don't animate; only their content blocks. Animation runs **once** per element (no re-trigger on scroll-up).

### 5.2 Public-language scrub

- Slide 1 deck eyebrow "Vendor Partner Program" → **"For businesses that sell to businesses"**
- Slide 9 deck card "partner manager" → **"dedicated growth manager"**
- Page `<title>` → "Trade Funding · Finance at every point of sale"
- All other deck copy is already vendor-neutral and ported verbatim.

## 6. Interactive ROI Calculator

Replaces the deck's static $480K example with live, interactive computation.

**Layout:** two-column, stacks on mobile.

**Inputs (left column):** four `<input type="range">` sliders, each with live numeric label.
- Quotes per month — range 5–200, step 1, default 30
- Average transaction value — range $5,000–$200,000, step $1,000, default $20,000
- Current conversion rate — range 5%–50%, step 1%, default 17%
- Uplift you'd unlock — range +5%–+30% extra conversion, step 1%, default +10%

**Outputs (right column):** three live tiles mirroring the deck's Current / Impact / Annual aesthetic.
- **Current** (sky tint): `current_jobs` jobs/month · `$current_revenue` /mo
- **The Impact** (peach tint, larger, "+N extra/month" tag): `impact_jobs` jobs/month · `$impact_revenue` /mo
- **Annual uplift** (gold tint): **`$annual_uplift`** extra revenue/year, animated counter

**Math:**
```
current_jobs     = round(quotes × current_conv)
impact_jobs      = round(quotes × (current_conv + uplift))
extra_per_month  = (impact_jobs − current_jobs) × avg_value
annual_uplift    = extra_per_month × 12
current_revenue  = current_jobs × avg_value
impact_revenue   = impact_jobs × avg_value
```

**Below tiles:** narrative paragraph that re-renders dynamic numbers inline:
> *"Same pipeline. Same effort. Different outcome — **$annual_uplift** more revenue per year from just **N extra transactions** a month."*

**CTA strip below calculator:** "Like what you see? **Request a call** →" (peach button, smooth-scrolls to conversion module).

**Behaviour:**
- Outputs recompute on every `input` event (not `change`).
- Numbers tween over 400ms with ease-out via `requestAnimationFrame`.
- Tile background tint pulses subtly (200ms) on each value change.
- State persists in `sessionStorage` so values survive scroll-away/return within session.

**Accessibility:**
- Native `<input type="range">` with visible value labels and `aria-label`.
- Keyboard arrows step naturally; PageUp/PageDown step ×10.
- `aria-live="polite"` region announces updated annual uplift to screen readers (debounced 500ms).

## 7. Conversion module

Two-column dark section, the page's primary lead-capture surface.

**Recap stats above split:** centred row, mirrors deck slide 10:
> 70+ lenders compared · $0 cost to you · ~$480K annual revenue potential

### 7.1 Left — Request a call form (60% width)

**Headline:** "Request a call."
**Sub:** "Tell us about your business. We'll be in touch within one business day."

**Fields (in order, all required unless marked optional):**
| Field | Type | Validation |
|---|---|---|
| Full name | text | non-empty |
| Business name | text | non-empty |
| Email | email | RFC-compliant |
| Phone | tel | AU phone pattern (loose) |
| What you sell | text | non-empty, max 120 chars |
| Preferred date | date | ≥ today, ≤ today+60d |
| Preferred time | select | Morning / Midday / Afternoon |
| Brief message (optional) | textarea | max 500 chars |

**Submit:** peach button "Request a call". Inline error messages below each invalid field. Disabled state while submitting.

**Submission target:** placeholder endpoint `/api/request-call`. **Not wired in this build.** For Phase 1 ship, the form will:
- POST to a console-mock that resolves with success after 600ms (configurable in `scripts/form.js` via a single constant)
- Show a polite success state replacing the form: "Thanks — we'll be in touch within one business day."
- Optionally `console.log` payload for testing
- A clearly-marked TODO comment in `form.js` flags where to wire the real endpoint

**Privacy microcopy below submit:**
> We'll only use these details to schedule your call. See our [Privacy Policy](privacy.html).

### 7.2 Right — Dylan's contact card + secondary CTA (40% width)

- Dylan's photo (`branding/dylan.jpg`)
- Name: "Dylan Dovico"
- Role: "Senior Growth Partner"
- Phone: 0483 944 824
- Email: dylan.d@tradefunding.com.au
- Website: tradefunding.com.au
- Address: Level 7, 233 Castlereagh St, Sydney
- Divider
- Outline button: **"Or register your business"** → `href="#register"` placeholder
- Sub-caption: "Skip the call — register your business and we'll onboard you directly."

## 8. Footer

Dark-deeper background. Two rows.

**Row 1:** TF logo (white) · anchor links (Who it's for · How it works · The maths · Why us · Request a call · Register)

**Row 2:** small Cashper mascot · "© 2026 Trade Funding" · Privacy (`privacy.html`) · Terms (`terms.html`)

No newsletter signup. No social icons. No address line. (Restrained per BLC-style guidance and the "no unsolicited additions" rule.)

## 9. Legal pages

`privacy.html` and `terms.html` share the brand shell (sticky nav + footer) and a centred 760px max-width content column.

**Body type:** Roboto 18px / 1.7, ink-900.

**Header:** TF eyebrow "Legal" · headline ("Privacy Policy" / "Terms of Use") · last-updated date.

**Content:** placeholder structure with clearly marked `[TBD: legal counsel to provide]` for any clause requiring enforceable legal language. **No invented legal text.**

**Privacy sections:** What we collect · How we use it · Sharing · Cookies · Your rights · Contact

**Terms sections:** Acceptance · Eligibility · Use of service · Intellectual property · Disclaimers · Limitation of liability · Governing law (NSW Australia) · Contact

## 10. Responsive behaviour

**Breakpoints:**
- Desktop: ≥1240px
- Tablet: 900–1239px
- Mobile: <900px

**Behaviour:**
- Hero headline `clamp(2.4rem, 5.2vw, 5rem)` (deck pattern)
- All multi-column grids collapse to single column at <900px
- Sticky nav collapses to a hamburger button at <900px → slide-down panel with anchors + both CTAs
- Solution flow: 4-step horizontal flow → vertical stack with down-arrows on mobile
- Calculator: two columns → vertical stack, sliders full width
- Conversion module: two columns → vertical stack, form first
- Touch-target minimum 44×44px on all interactive elements

## 11. Performance & SEO

- Single render-blocking stylesheet target ≤30kb
- Three deferred scripts: `main.js` (reveal + nav + smooth-scroll), `calculator.js`, `form.js`
- `<meta name="robots" content="index,follow">` (deck had noindex — strip for landing)
- OG + Twitter card meta with hero headline and brand-composition image (image generation deferred; placeholder OK for v1)
- JSON-LD `Organization` schema: TF business details (name, url, logo, sameAs, address, contactPoint)
- Self-hosted Google Fonts deferred (Phase 2 if Lighthouse demands)
- Image lazy-loading on all non-critical images (hero mascot eager)

## 12. Accessibility

- Semantic HTML: `<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`, `<form>`
- Visible focus rings on all interactive elements (`:focus-visible`)
- Colour contrast ≥4.5:1 for body text against backgrounds
- Form fields with `<label>` association; errors with `aria-describedby`
- Calculator with `aria-live="polite"` for output announcements
- Skip-to-content link (visually hidden until focused)
- Respect `prefers-reduced-motion`: disable reveal animations and number tweens

## 13. Project structure

```
TradeFunding-Projects/vendor-landing/
├── index.html              ← single landing page
├── privacy.html            ← legal page
├── terms.html              ← legal page
├── styles/
│   └── main.css            ← shared across all three pages
├── scripts/
│   ├── main.js             ← reveal observer, smooth-scroll, sticky nav, mobile menu
│   ├── calculator.js       ← ROI calculator logic + sessionStorage
│   └── form.js             ← booking form validation + submit (mock; TODO real endpoint)
├── branding/
│   ├── logo-navy.png       ← copied from vendor-deck/branding/
│   ├── logo-white.png
│   ├── cashper-gradient-transparent.png
│   └── dylan.jpg
├── docs/
│   └── superpowers/
│       └── specs/
│           └── 2026-05-06-vendor-landing-design.md   ← this file
└── README.md               ← stack, deploy, structure, deferred items
```

## 14. Deferred items (not blocking the build)

These are intentionally left for a follow-up pass:

- **Form submission endpoint** — Phase 1 ships with a console-mock that resolves successfully. A clearly-marked TODO in `scripts/form.js` flags where to wire the real backend (likely a Vercel serverless function or a Formspree/Tally/HubSpot endpoint).
- **`#register` link target** — placeholder anchor; will be wired when the registration flow URL is finalised.
- **Legal copy** — `[TBD: legal counsel to provide]` markers in `privacy.html` and `terms.html`. No invented enforceable text.
- **Real domain + Vercel project name** — set at deploy time. Tentative working assumption: `vendor.tradefunding.com.au` or similar subdomain.
- **OG image asset** — placeholder for v1; final composition (Cashper + headline) generated post-build.
- **Self-hosted Google Fonts** — only if Lighthouse Performance score demands it.

## 15. Out of scope

- Authenticated areas, user accounts, dashboards
- Backend infrastructure beyond the placeholder form endpoint
- Analytics integration (PostHog/GA) — to be added post-launch
- A/B testing infrastructure
- Multilingual support
- Live chat widget
- Blog or content hub
- The `#register` registration flow itself (this page only links to it)
