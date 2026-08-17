# Trade Funding Vendor Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a public, single-page Trade Funding landing page that mirrors the vendor-deck brand, replaces the deck's static $480K example with an interactive ROI calculator, and converts via a custom "Request a call" form plus a placeholder "Register your business" link — accompanied by privacy and terms pages.

**Architecture:** Pure static HTML + external CSS + vanilla JS, no build step. Three HTML pages share one stylesheet (`styles/main.css`) and three deferred scripts (`scripts/main.js`, `scripts/calculator.js`, `scripts/form.js`). Brand tokens, components, and section rhythm are inherited verbatim from `vendor-deck/index.html`. Public copy never uses the phrase "vendor partner."

**Tech Stack:** HTML5 · CSS3 (CSS custom properties, `clamp()`, CSS Grid/Flexbox) · Vanilla JS (IntersectionObserver, requestAnimationFrame, sessionStorage) · Google Fonts (Work Sans + Roboto). No frameworks. No bundler. No package.json.

**Spec:** [`docs/superpowers/specs/2026-05-06-vendor-landing-design.md`](../specs/2026-05-06-vendor-landing-design.md)

**Source content:** `C:\Users\BenLyons\TradeFunding-Projects\vendor-deck\index.html`

---

## Approach notes for the implementing engineer

- **Brand tokens are non-negotiable.** Copy the `:root` custom-property block from `vendor-deck/index.html` into `styles/main.css` verbatim. Don't invent new colours or fonts.
- **Public-language scrub:** the words "Vendor Partner" do not appear anywhere on rendered pages. Page `<title>`, hero eyebrow, "growth manager" copy — all per the spec §5.2.
- **Confidentiality strip is dropped.** This is public-facing.
- **Where the spec says "verbatim from the deck,"** copy the existing markup pattern from `vendor-deck/index.html` and adapt class names where the deck used slide-scoped classes (e.g., `.who-grid`, `.problem-stats`, `.flow`, `.how-grid`, `.shift-grid`, `.upside-grid`, `.why-grid` are landing-page-named already and can be kept).
- **Testing strategy:** for pure logic (calculator math), use a tiny no-framework browser-runnable test page that asserts and logs PASS/FAIL. For visual sections, verify by opening `index.html` in Chrome and Firefox at 1440×900, 768×1024, 375×812. For accessibility, verify with browser DevTools Lighthouse + manual keyboard nav.
- **Frequent commits:** every task ends with a commit. Don't batch.
- **Working directory for all tasks:** `C:\Users\BenLyons\TradeFunding-Projects\vendor-landing\`

---

## File map

| File | Responsibility |
|---|---|
| `index.html` | Main landing page. All 12 sections + nav + footer. |
| `privacy.html` | Privacy policy. Shares nav + footer + CSS. Placeholder legal copy. |
| `terms.html` | Terms of use. Shares nav + footer + CSS. Placeholder legal copy. |
| `styles/main.css` | Single shared stylesheet. Tokens, reset, typography, components, sections, responsive, a11y. |
| `scripts/main.js` | IntersectionObserver reveal, smooth-scroll, sticky nav state, mobile menu toggle, prefers-reduced-motion guard. |
| `scripts/calculator.js` | Pure calc functions + slider→tile binding + animated counter + sessionStorage. |
| `scripts/form.js` | Form validation + mock submission + success state swap. |
| `branding/logo-navy.png` | Copied from `vendor-deck/branding/`. |
| `branding/logo-white.png` | Copied from `vendor-deck/branding/`. |
| `branding/cashper-gradient-transparent.png` | Copied from `vendor-deck/branding/`. |
| `branding/dylan.jpg` | Copied from `vendor-deck/branding/`. |
| `tests/calculator-test.html` | Browser-runnable assertion harness for `calculator.js` math. |
| `README.md` | Stack, structure, deploy, deferred items. |

---

## Phase 1 — Scaffold

### Task 1: Initialize project, copy branding assets, create README, git init

**Files:**
- Create: `vendor-landing/.gitignore`
- Create: `vendor-landing/README.md`
- Copy: 4 files from `vendor-deck/branding/` into `vendor-landing/branding/`

- [ ] **Step 1: Create directory structure**

```bash
cd /c/Users/BenLyons/TradeFunding-Projects/vendor-landing
mkdir -p branding styles scripts tests
```

- [ ] **Step 2: Copy branding assets from vendor-deck**

```bash
cp ../vendor-deck/branding/logo-navy.png branding/
cp ../vendor-deck/branding/logo-white.png branding/
cp ../vendor-deck/branding/cashper-gradient-transparent.png branding/
cp ../vendor-deck/branding/dylan.jpg branding/
ls -la branding/
```

Expected: 4 files listed.

- [ ] **Step 3: Create `.gitignore`**

```
.DS_Store
Thumbs.db
*.log
node_modules/
.vscode/
.idea/
*.swp
.env
.env.local
```

- [ ] **Step 4: Create `README.md`**

```markdown
# Trade Funding Vendor Landing

Public-facing single-page landing for businesses that sell to other businesses.

## Stack

Static HTML + external CSS + vanilla JS. No build step. No package.json.

## Structure

- `index.html` — landing page
- `privacy.html`, `terms.html` — legal pages
- `styles/main.css` — shared stylesheet
- `scripts/` — deferred JS (`main.js`, `calculator.js`, `form.js`)
- `branding/` — logo + Cashper mascot + Dylan portrait
- `docs/superpowers/specs/` — design spec
- `docs/superpowers/plans/` — implementation plan
- `tests/calculator-test.html` — browser-runnable calc math assertions

## Run locally

Open `index.html` in a browser. No server needed.

For a live-reload dev experience:
```bash
npx serve .
```

## Deploy

Static deploy to Vercel/Netlify. Drag-and-drop the folder, or connect this repo.

## Deferred items

- **Form submission endpoint** — `scripts/form.js` ships with a console-mock. TODO marker flags where to wire the real backend.
- **`#register` link target** — placeholder anchor; final URL TBD.
- **Legal copy** — `privacy.html` and `terms.html` contain `[TBD: legal counsel to provide]` markers.
- **OG image** — placeholder for v1.
```

- [ ] **Step 5: Initialise git and commit**

```bash
git init
git add .gitignore README.md branding/ docs/
git commit -m "chore: scaffold vendor-landing project with branding assets"
git status
```

Expected: working tree clean, branch `main` created.

---

### Task 2: CSS foundation — tokens, reset, typography, base components

**Files:**
- Create: `styles/main.css`

- [ ] **Step 1: Create `styles/main.css` with the full foundation**

Copy the `:root` token block verbatim from `vendor-deck/index.html` lines 12–37, then add reset, typography utilities, badges, dividers, buttons, and section rhythm.

```css
/* ============================================================
   Trade Funding Vendor Landing — Shared Stylesheet
   ============================================================ */

:root{
  --navy:#001C44;
  --navy-blue:#1C1998;
  --navy-deep:#000C22;
  --skyblue:#54B4F6;
  --skyblue-soft:#EAF4FE;
  --peach:#FF5D5C;
  --peach-soft:#FFF0F0;
  --gold:#FBB766;
  --gold-soft:#FFF7EC;
  --white:#FFFFFF;
  --ink-900:#0B1220;
  --ink-600:#3C4B63;
  --ink-400:#7A8AA3;
  --ink-200:#B7C2D3;
  --bg-soft:#F5F8FC;
  --border:rgba(0,28,68,0.08);
  --success:#10B981;
  --radius:14px;
  --radius-lg:20px;
  --font-heading:'Work Sans',-apple-system,BlinkMacSystemFont,sans-serif;
  --font-body:'Roboto','Work Sans',-apple-system,sans-serif;
  --ease:cubic-bezier(0.22,1,0.36,1);
  --shadow-soft:0 10px 40px rgba(0,28,68,0.08);
  --shadow-lg:0 20px 60px rgba(0,28,68,0.12);
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--white);color:var(--navy);line-height:1.5}
img{max-width:100%;display:block}
a{color:inherit;text-decoration:none}
button{font:inherit;cursor:pointer;border:none;background:none}

/* ---------- Skip link (a11y) ---------- */
.skip-link{position:absolute;left:-9999px;top:0;background:var(--navy);color:var(--white);padding:12px 16px;z-index:1000;border-radius:0 0 8px 0;font-weight:600}
.skip-link:focus{left:0}

/* ---------- Container ---------- */
.wrap{max-width:1280px;width:100%;margin:0 auto;padding:0 clamp(20px,5vw,48px)}
.wrap-sm{max-width:1040px;width:100%;margin:0 auto;padding:0 clamp(20px,5vw,48px)}

/* ---------- Section rhythm ---------- */
.section{padding:clamp(72px,9vw,120px) 0;position:relative}
.section--light{background:var(--white);color:var(--navy)}
.section--soft{background:var(--bg-soft);color:var(--navy)}
.section--dark{background:linear-gradient(135deg,var(--navy) 0%,var(--navy-blue) 100%);color:var(--white)}
.section--hero{background:radial-gradient(ellipse at top left,var(--navy-blue) 0%,var(--navy) 40%,var(--navy-deep) 100%);color:var(--white)}
.section--deep{background:var(--navy-deep);color:var(--white)}

/* ---------- Typography ---------- */
.s-eyebrow{font-family:var(--font-heading);font-weight:600;font-size:0.8rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--skyblue);margin-bottom:20px;display:block}
.s-eyebrow--peach{color:var(--peach)}
.s-eyebrow--gold{color:var(--gold)}
.s-eyebrow--success{color:var(--success)}
.s-headline{font-family:var(--font-heading);font-weight:800;font-size:clamp(2.4rem,4.4vw,4.2rem);line-height:1.04;letter-spacing:-0.025em;margin:0 0 24px;color:inherit}
.s-headline--xl{font-size:clamp(3rem,5.2vw,5rem);font-weight:900}
.s-subhead{font-family:var(--font-heading);font-weight:700;font-size:clamp(1.4rem,2.2vw,2rem);line-height:1.2;margin:0 0 16px}
.s-body{font-size:1.05rem;line-height:1.6;max-width:720px}
.s-body--lg{font-size:1.2rem;line-height:1.55}
.s-caption{font-size:0.78rem;color:var(--ink-400);letter-spacing:0.02em}
.section--dark .s-body,.section--hero .s-body,.section--deep .s-body{color:rgba(255,255,255,0.75)}
.section--dark .s-caption,.section--hero .s-caption,.section--deep .s-caption{color:rgba(255,255,255,0.4)}
.text-skyblue{color:var(--skyblue)}
.text-peach{color:var(--peach)}
.text-gold{color:var(--gold)}
.text-white{color:var(--white)}
.text-navy{color:var(--navy)}
.text-success{color:var(--success)}
.text-muted{color:var(--ink-400)}

/* ---------- Reveal animation ---------- */
.reveal{opacity:0;transform:translateY(16px);transition:opacity 600ms var(--ease),transform 600ms var(--ease)}
.reveal.is-visible{opacity:1;transform:none}
.reveal.delay-1{transition-delay:100ms}
.reveal.delay-2{transition-delay:200ms}
.reveal.delay-3{transition-delay:300ms}
.reveal.delay-4{transition-delay:400ms}
.reveal.delay-5{transition-delay:500ms}

/* ---------- Badges ---------- */
.badge{display:inline-flex;align-items:center;padding:6px 14px;border-radius:100px;font-family:var(--font-heading);font-weight:600;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase}
.badge--skyblue{background:rgba(84,180,246,0.12);color:var(--skyblue)}
.badge--peach{background:rgba(255,93,92,0.12);color:var(--peach)}
.badge--gold{background:rgba(251,183,102,0.14);color:#B8801F}
.badge--success{background:rgba(16,185,129,0.12);color:var(--success)}
.badge--light{background:rgba(255,255,255,0.1);color:var(--white);border:1px solid rgba(255,255,255,0.15)}
.badge--navy{background:rgba(0,28,68,0.08);color:var(--navy)}

/* ---------- Dividers ---------- */
.divider{height:3px;width:72px;border-radius:2px;background:var(--skyblue);margin:0 0 24px}
.divider--peach{background:var(--peach)}
.divider--gold{background:var(--gold)}
.divider--success{background:var(--success)}
.divider--white{background:rgba(255,255,255,0.3)}
.divider--center{margin-left:auto;margin-right:auto}

/* ---------- Buttons ---------- */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 24px;border-radius:100px;font-family:var(--font-heading);font-weight:600;font-size:0.95rem;letter-spacing:0.01em;transition:transform 200ms var(--ease),box-shadow 200ms var(--ease),background 200ms var(--ease);min-height:44px}
.btn--primary{background:var(--peach);color:var(--white);box-shadow:0 6px 20px rgba(255,93,92,0.32)}
.btn--primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(255,93,92,0.42)}
.btn--secondary{background:var(--white);color:var(--navy);border:1px solid var(--border)}
.btn--secondary:hover{background:var(--bg-soft)}
.btn--outline{background:transparent;color:var(--white);border:1px solid rgba(255,255,255,0.4)}
.btn--outline:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.7)}
.btn--lg{padding:18px 32px;font-size:1.05rem}
.btn:focus-visible{outline:3px solid var(--skyblue);outline-offset:3px}

/* ---------- Cards (shared) ---------- */
.card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px;box-shadow:var(--shadow-soft);transition:transform 300ms var(--ease),box-shadow 300ms var(--ease)}
.card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.section--dark .card,.section--deep .card{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.08);color:var(--white);box-shadow:none}
.section--dark .card:hover,.section--deep .card:hover{background:rgba(255,255,255,0.06);transform:translateY(-4px)}

/* ---------- Reduced motion ---------- */
@media (prefers-reduced-motion: reduce){
  *,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}
  .reveal{opacity:1;transform:none}
}
```

- [ ] **Step 2: Verify CSS parses cleanly**

Open `styles/main.css` in a browser via a tiny test HTML, or paste into https://csslint.net (visual check). No syntax errors expected.

- [ ] **Step 3: Commit**

```bash
git add styles/main.css
git commit -m "feat(styles): add CSS foundation — tokens, reset, typography, components"
```

---

### Task 3: HTML shell — index.html with head, semantic skeleton

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create `index.html` with the complete head + empty semantic shell**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="description" content="Finance at every point of sale. Trade Funding helps businesses turn more quotes into transactions by bringing 70+ lenders to the moment your customer needs to buy."/>
<meta name="robots" content="index,follow"/>
<title>Trade Funding · Finance at every point of sale</title>

<!-- Open Graph -->
<meta property="og:type" content="website"/>
<meta property="og:title" content="Win more business — Trade Funding"/>
<meta property="og:description" content="Finance at every point of sale. 70+ lenders. $0 cost. 24-48 hour decisions."/>
<meta property="og:image" content="branding/og-image.png"/>
<meta name="twitter:card" content="summary_large_image"/>

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet"/>

<!-- Stylesheet -->
<link rel="stylesheet" href="styles/main.css"/>

<!-- Favicon -->
<link rel="icon" type="image/png" href="branding/logo-navy.png"/>

<!-- JSON-LD Organization schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Trade Funding",
  "url": "https://tradefunding.com.au",
  "logo": "https://tradefunding.com.au/branding/logo-navy.png",
  "description": "Finance at every point of sale. Trade Funding scans 70+ lenders to power business transactions.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Level 7, 233 Castlereagh Street",
    "addressLocality": "Sydney",
    "addressRegion": "NSW",
    "addressCountry": "AU"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+61-483-944-824",
    "contactType": "sales",
    "email": "dylan.d@tradefunding.com.au"
  }
}
</script>
</head>
<body>

<a href="#main" class="skip-link">Skip to main content</a>

<!-- ============================================================
     NAV — Task 4
     ============================================================ -->
<header id="site-nav"><!-- nav goes here --></header>

<main id="main">
  <!-- Sections inserted in Tasks 5–12 + 15 + 17 -->
</main>

<!-- ============================================================
     FOOTER — Task 13
     ============================================================ -->
<footer id="site-footer"><!-- footer goes here --></footer>

<!-- Scripts (deferred) -->
<script src="scripts/main.js" defer></script>
<script src="scripts/calculator.js" defer></script>
<script src="scripts/form.js" defer></script>

</body>
</html>
```

- [ ] **Step 2: Open `index.html` in a browser**

Expected: blank page, no console errors, fonts loading visibly via network tab.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat(html): scaffold index.html with head, OG meta, JSON-LD, skip link"
```

---

## Phase 2 — Static sections (top to bottom)

### Task 4: Sticky nav + mobile hamburger

**Files:**
- Modify: `index.html` — replace `<header id="site-nav">` block
- Modify: `styles/main.css` — append nav styles
- Create: `scripts/main.js` — initial file with nav-state and mobile-menu toggle

- [ ] **Step 1: Replace `<header id="site-nav">` in `index.html`**

```html
<header id="site-nav" class="nav">
  <div class="nav__inner wrap">
    <a href="#top" class="nav__brand" aria-label="Trade Funding home">
      <img src="branding/logo-navy.png" alt="Trade Funding" class="nav__logo nav__logo--navy"/>
      <img src="branding/logo-white.png" alt="" class="nav__logo nav__logo--white" aria-hidden="true"/>
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="#how-it-works">How it works</a>
      <a href="#the-maths">The maths</a>
      <a href="#why-us">Why us</a>
    </nav>
    <div class="nav__cta">
      <a href="#register" class="btn btn--secondary nav__btn-secondary">Register your business</a>
      <a href="#request-a-call" class="btn btn--primary">Request a call</a>
    </div>
    <button class="nav__hamburger" id="navHamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobileMenu">
      <span></span><span></span><span></span>
    </button>
  </div>
  <div class="nav__mobile" id="mobileMenu" hidden>
    <a href="#how-it-works">How it works</a>
    <a href="#the-maths">The maths</a>
    <a href="#why-us">Why us</a>
    <a href="#register" class="btn btn--secondary btn--lg">Register your business</a>
    <a href="#request-a-call" class="btn btn--primary btn--lg">Request a call</a>
  </div>
</header>
```

- [ ] **Step 2: Append nav styles to `styles/main.css`**

```css
/* ============================================================
   NAV
   ============================================================ */
.nav{position:sticky;top:0;z-index:100;background:rgba(255,255,255,0.92);backdrop-filter:saturate(180%) blur(12px);-webkit-backdrop-filter:saturate(180%) blur(12px);border-bottom:1px solid transparent;transition:border-color 200ms var(--ease),box-shadow 200ms var(--ease)}
.nav.is-scrolled{border-bottom-color:var(--border);box-shadow:0 4px 20px rgba(0,28,68,0.04)}
.nav__inner{display:flex;align-items:center;justify-content:space-between;gap:24px;padding-top:14px;padding-bottom:14px}
.nav__brand{display:inline-flex;align-items:center}
.nav__logo{height:32px;width:auto}
.nav__logo--white{display:none}
.nav__links{display:flex;gap:28px;align-items:center}
.nav__links a{font-family:var(--font-heading);font-weight:500;font-size:0.95rem;color:var(--ink-600);transition:color 150ms var(--ease)}
.nav__links a:hover{color:var(--navy)}
.nav__cta{display:flex;gap:10px;align-items:center}
.nav__hamburger{display:none;flex-direction:column;gap:5px;padding:10px;width:44px;height:44px;align-items:center;justify-content:center}
.nav__hamburger span{display:block;width:22px;height:2px;background:var(--navy);transition:transform 200ms var(--ease),opacity 200ms var(--ease)}
.nav__mobile{display:none;flex-direction:column;gap:16px;padding:24px;background:var(--white);border-top:1px solid var(--border)}
.nav__mobile a{font-family:var(--font-heading);font-weight:500;font-size:1.05rem;color:var(--ink-600);padding:8px 0}
.nav__mobile a.btn{padding:14px 24px;color:inherit}
.nav__mobile[hidden]{display:none}
.nav__mobile.is-open{display:flex}

@media (max-width:899px){
  .nav__links,.nav__cta{display:none}
  .nav__hamburger{display:flex}
}
```

- [ ] **Step 3: Create `scripts/main.js` with nav scroll state + mobile menu toggle**

```javascript
(function(){
  'use strict';

  // ---------- Sticky nav scroll state ----------
  const nav = document.getElementById('site-nav');
  if(nav){
    const setScrolled = () => {
      if(window.scrollY > 8){
        nav.classList.add('is-scrolled');
      } else {
        nav.classList.remove('is-scrolled');
      }
    };
    setScrolled();
    window.addEventListener('scroll', setScrolled, {passive:true});
  }

  // ---------- Mobile menu toggle ----------
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if(hamburger && mobileMenu){
    const close = () => {
      mobileMenu.classList.remove('is-open');
      mobileMenu.hidden = true;
      hamburger.setAttribute('aria-expanded','false');
      hamburger.setAttribute('aria-label','Open menu');
    };
    const open = () => {
      mobileMenu.hidden = false;
      mobileMenu.classList.add('is-open');
      hamburger.setAttribute('aria-expanded','true');
      hamburger.setAttribute('aria-label','Close menu');
    };
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      isOpen ? close() : open();
    });
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }
})();
```

- [ ] **Step 4: Verify in browser**

Open `index.html` in Chrome. Expected:
- Logo + 3 anchor links + 2 CTA buttons visible at desktop width.
- Scrolling causes nav to gain a subtle bottom border.
- Resize to <900px: anchor links + CTAs hide, hamburger appears.
- Click hamburger: mobile panel slides down with all links + CTAs.
- Click any link: panel closes.

- [ ] **Step 5: Commit**

```bash
git add index.html styles/main.css scripts/main.js
git commit -m "feat(nav): sticky brand nav with mobile hamburger menu"
```

---

### Task 5: Hero section

**Files:**
- Modify: `index.html` — insert hero inside `<main>`
- Modify: `styles/main.css` — append hero styles

- [ ] **Step 1: Insert hero into `<main>` in `index.html`**

```html
<section class="section section--hero hero" id="top">
  <img src="branding/cashper-gradient-transparent.png" alt="" class="hero__cashper" aria-hidden="true"/>
  <div class="wrap hero__inner">
    <span class="badge badge--light reveal">For businesses that sell to businesses</span>
    <h1 class="s-headline s-headline--xl reveal delay-1">Win more business.</h1>
    <p class="s-body s-body--lg reveal delay-2 hero__sub">Finance at your fingertips. At every point of sale.<br/>More customers move. More transactions proceed.</p>
    <div class="hero__cta reveal delay-3">
      <a href="#request-a-call" class="btn btn--primary btn--lg">Request a call</a>
      <a href="#register" class="btn btn--outline btn--lg">Register your business</a>
    </div>
    <div class="hero__trust reveal delay-4">
      <span><strong>70+</strong> lenders</span>
      <span class="hero__trust-sep" aria-hidden="true">·</span>
      <span><strong>$0</strong> cost</span>
      <span class="hero__trust-sep" aria-hidden="true">·</span>
      <span><strong>24–48 hr</strong> decisions</span>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append hero styles to `styles/main.css`**

```css
/* ============================================================
   HERO
   ============================================================ */
.hero{min-height:calc(100vh - 64px);display:flex;align-items:center;overflow:hidden;padding:clamp(80px,10vw,140px) 0}
.hero__cashper{position:absolute;right:-120px;bottom:-160px;width:560px;max-width:60vw;opacity:0.08;pointer-events:none}
.hero__inner{position:relative;max-width:980px}
.hero__sub{margin-top:8px;color:rgba(255,255,255,0.78);max-width:680px}
.hero__cta{display:flex;flex-wrap:wrap;gap:14px;margin-top:36px}
.hero__trust{display:flex;flex-wrap:wrap;gap:14px;margin-top:48px;color:rgba(255,255,255,0.55);font-size:0.9rem;letter-spacing:0.02em}
.hero__trust strong{color:var(--white);font-weight:700;margin-right:4px}
.hero__trust-sep{color:rgba(255,255,255,0.25)}
@media (max-width:599px){
  .hero__cta{flex-direction:column;align-items:stretch}
  .hero__cta .btn{width:100%}
  .hero__trust{flex-direction:column;gap:8px}
  .hero__trust-sep{display:none}
}
```

- [ ] **Step 3: Verify in browser**

Open `index.html`. Expected:
- Dark radial-gradient hero fills viewport.
- Cashper mascot watermark bottom-right at very low opacity.
- Eyebrow → headline → sub → CTAs → trust strip stack with breathing room.
- Buttons visible: peach "Request a call", outlined white "Register your business".
- At <600px, CTAs stack full-width.
- (Reveal animations stay invisible until Task 14 — that's OK.)

For now, temporarily add `.is-visible` to all `.reveal` elements via DevTools to confirm they look right when revealed.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(hero): add dark radial hero with dual CTAs and trust strip"
```

---

### Task 6: Who it's for section

**Files:**
- Modify: `index.html` — insert section after hero
- Modify: `styles/main.css` — append who styles

- [ ] **Step 1: Insert section into `<main>` after hero**

```html
<section class="section section--light" id="who-its-for">
  <div class="wrap">
    <div class="reveal">
      <span class="badge badge--skyblue">Who it's for</span>
      <h2 class="s-headline" style="margin-top:20px">Whatever you sell,<br/>we've got you covered.</h2>
      <div class="divider"></div>
      <p class="s-body text-muted">Stock, assets, or services — every transaction your customer is ready to make has a funding path. We bring it to them at your point of sale.</p>
    </div>
    <div class="who-grid reveal delay-1">
      <article class="who-card">
        <div class="who-card__ico who-card__ico--skyblue" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
        </div>
        <h3 class="who-card__title">Stock &amp; Supplies</h3>
        <p class="who-card__desc">Materials, trade goods, inventory — the things your customers buy to build and run their business.</p>
        <ul class="who-card__list">
          <li>Timber, concrete &amp; steel</li>
          <li>Wholesale &amp; trade supplies</li>
          <li>Retail inventory finance</li>
        </ul>
      </article>
      <article class="who-card">
        <div class="who-card__ico who-card__ico--peach" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF5D5C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
        </div>
        <h3 class="who-card__title">Assets &amp; Equipment</h3>
        <p class="who-card__desc">Vehicles, machinery, fit-out, commercial equipment — the things your customers need to grow.</p>
        <ul class="who-card__list">
          <li>Commercial vehicles &amp; trucks</li>
          <li>Machinery &amp; plant</li>
          <li>Office &amp; fit-out equipment</li>
        </ul>
      </article>
      <article class="who-card">
        <div class="who-card__ico who-card__ico--gold" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FBB766" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 7h-3V5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8a1 1 0 0 0-1-1z"/><path d="M3 13a20 20 0 0 0 18 0"/><path d="M12 11v4"/></svg>
        </div>
        <h3 class="who-card__title">Professional Services</h3>
        <p class="who-card__desc">Consulting, agency work, installations, professional engagements — the expertise your customers invest in.</p>
        <ul class="who-card__list">
          <li>Consulting &amp; advisory</li>
          <li>Agencies &amp; installation</li>
          <li>Professional engagements</li>
        </ul>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append who styles to `styles/main.css`**

```css
/* ============================================================
   WHO IT'S FOR
   ============================================================ */
.who-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:56px}
.who-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:36px;box-shadow:var(--shadow-soft);transition:transform 300ms var(--ease),box-shadow 300ms var(--ease)}
.who-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.who-card__ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:24px}
.who-card__ico--skyblue{background:var(--skyblue-soft)}
.who-card__ico--peach{background:var(--peach-soft)}
.who-card__ico--gold{background:var(--gold-soft)}
.who-card__title{font-family:var(--font-heading);font-weight:700;font-size:1.35rem;margin-bottom:12px;letter-spacing:-0.01em}
.who-card__desc{color:var(--ink-600);font-size:1rem;line-height:1.55;margin-bottom:20px}
.who-card__list{list-style:none;padding:0;margin:0;border-top:1px solid var(--border);padding-top:18px}
.who-card__list li{font-size:0.9rem;color:var(--ink-600);padding:6px 0;display:flex;align-items:center;gap:8px}
.who-card__list li::before{content:'';width:6px;height:6px;border-radius:50%;background:var(--ink-200);flex-shrink:0}
@media (max-width:899px){.who-grid{grid-template-columns:1fr;gap:20px}}
```

- [ ] **Step 3: Verify in browser**

Three cards in a row at desktop, stacked on mobile. Icons visible in tinted squares. Bullet lists render with dot bullets.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(who): add three-card section with icon, description, bullets"
```

---

### Task 7: The Problem section

**Files:**
- Modify: `index.html` — insert section
- Modify: `styles/main.css` — append problem styles

- [ ] **Step 1: Insert section after Who it's for**

```html
<section class="section section--soft" id="the-problem">
  <div class="wrap">
    <div class="reveal">
      <span class="badge badge--peach">The Problem</span>
      <h2 class="s-headline" style="margin-top:20px">Transactions stall when the<br/>customer's cashflow can't support the sale.</h2>
      <div class="divider divider--peach"></div>
    </div>
    <div class="problem-stats reveal delay-1">
      <article class="p-stat p-stat--peach">
        <div class="p-stat__num">3 in 4</div>
        <div class="p-stat__label">of transactions are delayed by cash flow</div>
        <p class="p-stat__note">Your customers want to buy. The decision is made. But the cash isn't there to move.</p>
        <div class="p-stat__src">Source: Upflow B2B Payments Report</div>
      </article>
      <article class="p-stat p-stat--gold">
        <div class="p-stat__num">1 in 5</div>
        <div class="p-stat__label">quotes actually proceeds to a sale</div>
        <p class="p-stat__note">80% of the quotes you send never become transactions. Most stall on timing, budget, or cash flow.</p>
        <div class="p-stat__src">Source: B2B SMB opportunity-to-close benchmark</div>
      </article>
      <article class="p-stat p-stat--skyblue">
        <div class="p-stat__num">+40%</div>
        <div class="p-stat__label">more transactions completed</div>
        <p class="p-stat__note">When you give customers a path to fund the transaction at the point of sale, deals proceed instead of stalling.</p>
        <div class="p-stat__src">Source: Allianz Trade / Juniper Research</div>
      </article>
    </div>
    <p class="problem-closer reveal delay-2">Unlike Zip, Afterpay, or a single lender — we scan the <strong>entire market</strong> to find the right way to power each transaction. <strong>More coverage. More approvals. More deals that move.</strong></p>
  </div>
</section>
```

- [ ] **Step 2: Append problem styles to `styles/main.css`**

```css
/* ============================================================
   THE PROBLEM
   ============================================================ */
.problem-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
.p-stat{background:var(--white);border-radius:var(--radius-lg);padding:36px;border-top:4px solid var(--ink-200);box-shadow:var(--shadow-soft)}
.p-stat--peach{border-top-color:var(--peach)}
.p-stat--gold{border-top-color:var(--gold)}
.p-stat--skyblue{border-top-color:var(--skyblue)}
.p-stat__num{font-family:var(--font-heading);font-weight:900;font-size:clamp(2.6rem,4vw,3.4rem);line-height:1;margin-bottom:14px;letter-spacing:-0.03em}
.p-stat--peach .p-stat__num{color:var(--peach)}
.p-stat--gold .p-stat__num{color:var(--gold)}
.p-stat--skyblue .p-stat__num{color:var(--skyblue)}
.p-stat__label{font-family:var(--font-heading);font-weight:700;font-size:1.1rem;margin-bottom:14px;color:var(--navy)}
.p-stat__note{font-size:0.95rem;color:var(--ink-600);line-height:1.55;margin-bottom:20px}
.p-stat__src{font-size:0.75rem;color:var(--ink-400);letter-spacing:0.04em;border-top:1px solid var(--border);padding-top:14px}
.problem-closer{margin-top:48px;padding:28px 32px;background:var(--white);border-radius:var(--radius-lg);border-left:4px solid var(--navy);font-size:1.05rem;line-height:1.6;color:var(--ink-600);max-width:920px}
.problem-closer strong{color:var(--navy);font-weight:600}
@media (max-width:899px){.problem-stats{grid-template-columns:1fr;gap:18px}}
```

- [ ] **Step 3: Verify in browser**

Three stat tiles with coloured top borders. Big numerals. Source lines render small and muted.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(problem): add three stat tiles with sources and closer paragraph"
```

---

### Task 8: The Solution section (4-step flow + pills)

**Files:**
- Modify: `index.html`
- Modify: `styles/main.css`

- [ ] **Step 1: Insert section after Problem**

```html
<section class="section section--dark" id="the-solution">
  <div class="wrap">
    <div class="reveal" style="text-align:center">
      <span class="badge badge--light">The Solution</span>
      <h2 class="s-headline" style="margin-top:20px">We bring the whole lending<br/>market to your point of sale.</h2>
      <div class="divider divider--white divider--center"></div>
      <p class="s-body" style="margin:0 auto">Not one lender. Not one product. Over 70 lenders, every credit policy, scanned in minutes to find the best way to fund each transaction.</p>
    </div>
    <div class="flow reveal delay-1">
      <div class="flow__step">
        <div class="flow__ico flow__ico--skyblue" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </div>
        <h3 class="flow__title">QR at Point of Sale</h3>
        <p class="flow__desc">On your invoice, quote, or checkout — wherever the transaction happens.</p>
      </div>
      <div class="flow__arrow" aria-hidden="true"><svg width="36" height="20" viewBox="0 0 40 24" fill="none"><path d="M0 12h32M26 6l6 6-6 6" stroke="#54B4F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="flow__step">
        <div class="flow__ico flow__ico--gold" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FBB766" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
        </div>
        <h3 class="flow__title">Market Scanned</h3>
        <p class="flow__desc">70+ lenders and every product type evaluated for best fit.</p>
      </div>
      <div class="flow__arrow" aria-hidden="true"><svg width="36" height="20" viewBox="0 0 40 24" fill="none"><path d="M0 12h32M26 6l6 6-6 6" stroke="#FBB766" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="flow__step">
        <div class="flow__ico flow__ico--peach" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5D5C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
        <h3 class="flow__title">Best Path Identified</h3>
        <p class="flow__desc">Compare Report in 24–48 hrs with the best way to power this transaction.</p>
      </div>
      <div class="flow__arrow" aria-hidden="true"><svg width="36" height="20" viewBox="0 0 40 24" fill="none"><path d="M0 12h32M26 6l6 6-6 6" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="flow__step">
        <div class="flow__ico flow__ico--success" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <h3 class="flow__title">Transaction Powered</h3>
        <p class="flow__desc">Deal funded, transaction proceeds — and you get paid.</p>
      </div>
    </div>
    <div class="solution-pills reveal delay-2">
      <div class="s-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg><span>Not one lender — over 70</span></div>
      <div class="s-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FBB766" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg><span>Every credit policy scanned</span></div>
      <div class="s-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FF5D5C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 5-5"/></svg><span>Maximum conversion coverage</span></div>
      <div class="s-pill"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg><span>Banks, non-banks &amp; private credit</span></div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append solution styles to `styles/main.css`**

```css
/* ============================================================
   THE SOLUTION
   ============================================================ */
.flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;gap:16px;align-items:start;margin-top:64px}
.flow__step{text-align:center}
.flow__ico{width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
.flow__ico--skyblue{background:rgba(84,180,246,0.12)}
.flow__ico--gold{background:rgba(251,183,102,0.12)}
.flow__ico--peach{background:rgba(255,93,92,0.12)}
.flow__ico--success{background:rgba(16,185,129,0.12)}
.flow__title{font-family:var(--font-heading);font-weight:700;font-size:1.05rem;margin-bottom:8px;color:var(--white)}
.flow__desc{font-size:0.88rem;line-height:1.5;color:rgba(255,255,255,0.65);max-width:200px;margin:0 auto}
.flow__arrow{display:flex;align-items:center;justify-content:center;padding-top:24px}

.solution-pills{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin-top:64px}
.s-pill{display:inline-flex;align-items:center;gap:10px;padding:10px 18px;border-radius:100px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.85);font-size:0.88rem}

@media (max-width:899px){
  .flow{grid-template-columns:1fr;gap:24px}
  .flow__arrow{transform:rotate(90deg);padding:0}
  .flow__desc{max-width:none}
}
```

- [ ] **Step 3: Verify in browser**

Four steps in a row at desktop with arrows between. On mobile, steps stack and arrows rotate to point downward.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(solution): add four-step flow with arrows and pills row"
```

---

### Task 9: How it works section (three mockups)

**Files:**
- Modify: `index.html`
- Modify: `styles/main.css`

- [ ] **Step 1: Insert section after Solution**

Use `id="how-it-works"` so the nav anchor lands here.

```html
<section class="section section--light" id="how-it-works">
  <div class="wrap">
    <div class="reveal" style="text-align:center">
      <span class="badge badge--skyblue">How it works</span>
      <h2 class="s-headline" style="margin-top:20px">Three steps. The deal proceeds.</h2>
      <div class="divider divider--center"></div>
    </div>
    <div class="how-grid reveal delay-1">
      <article class="how-step">
        <div class="how-step__vis">
          <span class="how-step__num">Step 1</span>
          <div class="mock-invoice" aria-hidden="true">
            <div class="mock-invoice__hd">INVOICE #4812</div>
            <div class="mock-invoice__ln"></div>
            <div class="mock-invoice__ln" style="width:80%"></div>
            <div class="mock-invoice__ln" style="width:60%"></div>
            <div class="mock-invoice__qr">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="3" height="3"/><rect x="18" y="14" width="3" height="3"/><rect x="14" y="18" width="3" height="3"/><rect x="18" y="18" width="3" height="3"/></svg>
              <span>Scan for<br/>finance<br/>options</span>
            </div>
          </div>
        </div>
        <h3 class="how-step__title">Place at the point of sale</h3>
        <p class="how-step__desc">QR code on your invoice, quote, or checkout. The moment a customer hesitates, they have a path forward.</p>
      </article>
      <article class="how-step">
        <div class="how-step__vis">
          <span class="how-step__num how-step__num--gold">Step 2</span>
          <div class="mock-phone" aria-hidden="true">
            <div class="mock-phone__scr">
              <div class="mock-phone__hd">Trade Funding</div>
              <div class="mock-phone__q">What do you need finance for?</div>
              <div class="mock-phone__opt mock-phone__opt--active">Equipment</div>
              <div class="mock-phone__opt mock-phone__opt--idle">Working Capital</div>
              <div class="mock-phone__opt mock-phone__opt--idle">Vehicle / Asset</div>
              <div class="mock-phone__ind">Indicative: from $1,847/mo</div>
            </div>
          </div>
        </div>
        <h3 class="how-step__title">We scan the whole market</h3>
        <p class="how-step__desc">Over 70 lenders, every product type, every credit policy — scanned to find the best way to power this transaction.</p>
      </article>
      <article class="how-step">
        <div class="how-step__vis">
          <span class="how-step__num how-step__num--success">Step 3</span>
          <div class="mock-report" aria-hidden="true">
            <div class="mock-report__hd">COMPARE REPORT</div>
            <div class="mock-report__sub">3 matched lenders</div>
            <div class="mock-report__rows">
              <div class="mock-report__row mock-report__row--a"><div class="mock-report__lnd">Lender A</div><div class="mock-report__rate">7.9%</div><div class="mock-report__pay">$1,847/mo</div></div>
              <div class="mock-report__row mock-report__row--b"><div class="mock-report__lnd">Lender B</div><div class="mock-report__rate">8.4%</div><div class="mock-report__pay">$1,912/mo</div></div>
              <div class="mock-report__row mock-report__row--c"><div class="mock-report__lnd">Lender C</div><div class="mock-report__rate">9.1%</div><div class="mock-report__pay">$1,983/mo</div></div>
            </div>
          </div>
        </div>
        <h3 class="how-step__title">Transaction proceeds</h3>
        <p class="how-step__desc">Customer picks the best option, gets funded, and the deal moves forward. 24–48 hours.</p>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append how-it-works styles to `styles/main.css`**

```css
/* ============================================================
   HOW IT WORKS
   ============================================================ */
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:64px}
.how-step{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:32px;box-shadow:var(--shadow-soft)}
.how-step__vis{background:var(--bg-soft);border-radius:var(--radius);padding:28px;margin-bottom:28px;min-height:240px;position:relative;display:flex;align-items:center;justify-content:center}
.how-step__num{position:absolute;top:14px;left:14px;font-family:var(--font-heading);font-weight:700;font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--skyblue);background:var(--white);padding:4px 10px;border-radius:100px;box-shadow:var(--shadow-soft)}
.how-step__num--gold{color:var(--gold)}
.how-step__num--success{color:var(--success)}
.how-step__title{font-family:var(--font-heading);font-weight:700;font-size:1.2rem;margin-bottom:10px;letter-spacing:-0.01em}
.how-step__desc{color:var(--ink-600);font-size:0.95rem;line-height:1.55}

/* Invoice mockup */
.mock-invoice{width:100%;max-width:200px;background:var(--white);border:1px solid var(--border);border-radius:8px;padding:18px;box-shadow:var(--shadow-soft)}
.mock-invoice__hd{font-family:var(--font-heading);font-weight:700;font-size:0.7rem;letter-spacing:0.14em;color:var(--ink-600);margin-bottom:14px}
.mock-invoice__ln{height:6px;background:var(--ink-200);border-radius:3px;margin-bottom:8px;width:100%}
.mock-invoice__qr{margin-top:14px;padding-top:14px;border-top:1px dashed var(--border);display:flex;align-items:center;gap:10px}
.mock-invoice__qr span{font-size:0.7rem;color:var(--ink-600);line-height:1.3}

/* Phone mockup */
.mock-phone{width:160px;height:230px;border-radius:24px;background:var(--navy);padding:8px;box-shadow:var(--shadow-lg)}
.mock-phone__scr{background:var(--white);border-radius:18px;padding:14px;height:100%;display:flex;flex-direction:column;gap:6px}
.mock-phone__hd{font-family:var(--font-heading);font-weight:700;font-size:0.65rem;letter-spacing:0.1em;color:var(--skyblue);text-align:center}
.mock-phone__q{font-size:0.7rem;color:var(--ink-600);margin:6px 0;line-height:1.3}
.mock-phone__opt{font-size:0.7rem;padding:6px 10px;border-radius:8px;font-weight:600}
.mock-phone__opt--active{background:var(--skyblue-soft);color:var(--skyblue)}
.mock-phone__opt--idle{background:var(--bg-soft);color:var(--ink-400)}
.mock-phone__ind{margin-top:auto;background:var(--gold-soft);color:#B8801F;font-size:0.7rem;font-weight:700;padding:6px 10px;border-radius:8px;text-align:center}

/* Compare Report mockup */
.mock-report{width:100%;max-width:220px;background:var(--white);border:1px solid var(--border);border-radius:10px;padding:16px;box-shadow:var(--shadow-soft)}
.mock-report__hd{font-family:var(--font-heading);font-weight:700;font-size:0.7rem;letter-spacing:0.14em;color:var(--success);margin-bottom:4px}
.mock-report__sub{font-size:0.7rem;color:var(--ink-400);margin-bottom:12px}
.mock-report__row{display:grid;grid-template-columns:1fr auto auto;gap:8px;padding:8px 10px;border-radius:6px;align-items:center;font-size:0.72rem;margin-bottom:4px}
.mock-report__row--a{background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.2)}
.mock-report__row--b{background:var(--bg-soft)}
.mock-report__row--c{background:var(--bg-soft)}
.mock-report__lnd{font-weight:600;color:var(--navy)}
.mock-report__rate{color:var(--ink-600)}
.mock-report__pay{font-weight:700;color:var(--navy)}

@media (max-width:899px){.how-grid{grid-template-columns:1fr;gap:24px}}
```

- [ ] **Step 3: Verify in browser**

Three cards. Each card's mockup (invoice, phone, compare report) renders in the soft-grey vis area. Step labels in coloured pills.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(how): add three step-cards with invoice/phone/report mockups"
```

---

### Task 10: The Shift section (4 cards, dark)

**Files:**
- Modify: `index.html`
- Modify: `styles/main.css`

- [ ] **Step 1: Insert section**

```html
<section class="section section--dark" id="the-shift">
  <div class="wrap">
    <div class="reveal">
      <span class="badge badge--light">The Shift</span>
      <h2 class="s-headline" style="margin-top:20px">Finance is how<br/>businesses buy.</h2>
      <div class="divider divider--white"></div>
      <p class="s-body">Every major purchase — equipment, vehicles, fit-out, materials — uses funding. Your customers are already thinking this way. If you're not offering it, a competitor is.</p>
    </div>
    <div class="shift-grid reveal delay-1">
      <article class="shift-card">
        <div class="shift-card__ico shift-card__ico--gold" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FBB766" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg></div>
        <div><h3 class="shift-card__title">Your competitors are offering it</h3><p class="shift-card__desc">When your quote has a funding option and theirs doesn't, you're not selling harder — you're selling smarter.</p></div>
      </article>
      <article class="shift-card">
        <div class="shift-card__ico shift-card__ico--skyblue" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 11h-6"/></svg></div>
        <div><h3 class="shift-card__title">Customers expect the option</h3><p class="shift-card__desc">SMEs routinely finance growth. They want to know if funding is available — and how quickly.</p></div>
      </article>
      <article class="shift-card">
        <div class="shift-card__ico shift-card__ico--peach" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5D5C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 11l-5-5-5 5"/><path d="M12 6v15"/><path d="M5 3h14"/></svg></div>
        <div><h3 class="shift-card__title">Remove the awkward money moment</h3><p class="shift-card__desc">No more chasing budgets. The customer self-serves; you stay on selling, not following up on timing.</p></div>
      </article>
      <article class="shift-card">
        <div class="shift-card__ico shift-card__ico--success" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 11 12 14 15 11"/></svg></div>
        <div><h3 class="shift-card__title">Zero cost, zero risk to you</h3><p class="shift-card__desc">No fees. No integration lift. No exposure. We handle finance end to end while you keep running your business.</p></div>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append shift styles**

```css
/* ============================================================
   THE SHIFT
   ============================================================ */
.shift-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-top:56px}
.shift-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-lg);padding:28px;display:flex;gap:20px;align-items:flex-start;transition:background 200ms var(--ease)}
.shift-card:hover{background:rgba(255,255,255,0.06)}
.shift-card__ico{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.shift-card__ico--gold{background:rgba(251,183,102,0.14)}
.shift-card__ico--skyblue{background:rgba(84,180,246,0.14)}
.shift-card__ico--peach{background:rgba(255,93,92,0.14)}
.shift-card__ico--success{background:rgba(16,185,129,0.14)}
.shift-card__title{font-family:var(--font-heading);font-weight:700;font-size:1.1rem;margin-bottom:8px;color:var(--white)}
.shift-card__desc{color:rgba(255,255,255,0.7);font-size:0.95rem;line-height:1.5}
@media (max-width:899px){.shift-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verify**

2×2 grid on desktop, single column on mobile. Cards have icon left, title+desc right.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(shift): add 4-card 2x2 grid on dark section"
```

---

### Task 11: The Upside section (4 cards, light)

**Files:**
- Modify: `index.html`
- Modify: `styles/main.css`

- [ ] **Step 1: Insert section**

```html
<section class="section section--light" id="the-upside">
  <div class="wrap">
    <div class="reveal">
      <span class="badge badge--success">The Upside</span>
      <h2 class="s-headline" style="margin-top:20px">Four ways funding supports your business.</h2>
      <div class="divider divider--success"></div>
      <p class="s-body text-muted">When funding is a normal way to pay, four things happen immediately.</p>
    </div>
    <div class="upside-grid reveal delay-1">
      <article class="u-card">
        <div class="u-card__ico u-card__ico--skyblue" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg></div>
        <div><h3 class="u-card__title">Larger basket sizes</h3><p class="u-card__desc">Customers upgrade the spec, add the upgrade, take the full quote — because monthly payments replace lump-sum sticker shock.</p></div>
      </article>
      <article class="u-card">
        <div class="u-card__ico u-card__ico--peach" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF5D5C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
        <div><h3 class="u-card__title">Greater pipeline conversion</h3><p class="u-card__desc">Quotes that used to stall on budget or cashflow now move. The same effort converts a higher share of pipeline.</p></div>
      </article>
      <article class="u-card">
        <div class="u-card__ico u-card__ico--gold" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FBB766" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
        <div><h3 class="u-card__title">Cut costly finance fees</h3><p class="u-card__desc">If you're currently wearing Zip, Afterpay, or BNPL merchant fees to enable transactions, those come off your P&amp;L.</p></div>
      </article>
      <article class="u-card">
        <div class="u-card__ico u-card__ico--success" aria-hidden="true"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
        <div><h3 class="u-card__title">No more budget conversations</h3><p class="u-card__desc">Customers don't tell you they can't afford it. A funding path at the point of sale means they don't have to.</p></div>
      </article>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append upside styles**

```css
/* ============================================================
   THE UPSIDE
   ============================================================ */
.upside-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-top:56px}
.u-card{background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:28px;display:flex;gap:20px;align-items:flex-start;box-shadow:var(--shadow-soft);transition:transform 300ms var(--ease),box-shadow 300ms var(--ease)}
.u-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg)}
.u-card__ico{width:52px;height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.u-card__ico--skyblue{background:var(--skyblue-soft)}
.u-card__ico--peach{background:var(--peach-soft)}
.u-card__ico--gold{background:var(--gold-soft)}
.u-card__ico--success{background:rgba(16,185,129,0.12)}
.u-card__title{font-family:var(--font-heading);font-weight:700;font-size:1.15rem;margin-bottom:8px}
.u-card__desc{color:var(--ink-600);font-size:0.95rem;line-height:1.55}
@media (max-width:899px){.upside-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verify**

2×2 grid, light cards with hover lift.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(upside): add 4-card 2x2 grid on light section"
```

---

### Task 12: Why Trade Funding section (4 cards, dark)

**Files:**
- Modify: `index.html`
- Modify: `styles/main.css`

- [ ] **Step 1: Insert section** (use `id="why-us"` so nav anchor lands here)

```html
<section class="section section--dark" id="why-us">
  <div class="wrap">
    <div class="reveal">
      <span class="badge badge--light">Why Trade Funding</span>
      <h2 class="s-headline" style="margin-top:20px">Built for your business.<br/>Powered by our technology.</h2>
      <div class="divider divider--white"></div>
      <p class="s-body">We've built lending businesses. We know what's broken. Our technology fixes it — for business owners, not banks.</p>
    </div>
    <div class="why-grid reveal delay-1">
      <article class="why-card">
        <div class="why-card__ico why-card__ico--skyblue" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <div><h3 class="why-card__title">Over 70 lenders checked</h3><p class="why-card__desc">Every transaction matched against every relevant lender and product type — no one credit policy dictates the outcome.</p></div>
      </article>
      <article class="why-card">
        <div class="why-card__ico why-card__ico--gold" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FBB766" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
        <div><h3 class="why-card__title">Proprietary matching engine</h3><p class="why-card__desc">Scans every lender's actual policy against each transaction — finding the best path in hours, not weeks of manual shopping.</p></div>
      </article>
      <article class="why-card">
        <div class="why-card__ico why-card__ico--peach" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF5D5C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg></div>
        <div><h3 class="why-card__title">We handle everything</h3><p class="why-card__desc">From customer enquiry to funds disbursed — credit applications, lender negotiation, settlement. You stay focused on selling.</p></div>
      </article>
      <article class="why-card">
        <div class="why-card__ico why-card__ico--success" aria-hidden="true"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg></div>
        <div><h3 class="why-card__title">Dedicated growth manager</h3><p class="why-card__desc">Onboarding, marketing collateral, customer comms, dedicated growth manager. You launch in days, not months.</p></div>
      </article>
    </div>
  </div>
</section>
```

Note: "partner manager" → "growth manager" per spec §5.2.

- [ ] **Step 2: Append why styles**

```css
/* ============================================================
   WHY TRADE FUNDING
   ============================================================ */
.why-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-top:56px}
.why-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-lg);padding:28px;display:flex;gap:20px;align-items:flex-start;transition:background 200ms var(--ease)}
.why-card:hover{background:rgba(255,255,255,0.06)}
.why-card__ico{width:52px;height:52px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.why-card__ico--skyblue{background:rgba(84,180,246,0.14)}
.why-card__ico--gold{background:rgba(251,183,102,0.14)}
.why-card__ico--peach{background:rgba(255,93,92,0.14)}
.why-card__ico--success{background:rgba(16,185,129,0.14)}
.why-card__title{font-family:var(--font-heading);font-weight:700;font-size:1.15rem;margin-bottom:8px;color:var(--white)}
.why-card__desc{color:rgba(255,255,255,0.7);font-size:0.95rem;line-height:1.55}
@media (max-width:899px){.why-grid{grid-template-columns:1fr}}
```

- [ ] **Step 3: Verify**

2×2 grid, dark cards.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(why): add 4-card Why Trade Funding section with growth-manager rename"
```

---

### Task 13: Footer

**Files:**
- Modify: `index.html` — replace `<footer id="site-footer">`
- Modify: `styles/main.css` — append footer styles

- [ ] **Step 1: Replace `<footer id="site-footer">` block**

```html
<footer id="site-footer" class="footer">
  <div class="wrap footer__inner">
    <div class="footer__top">
      <a href="#top" class="footer__brand" aria-label="Trade Funding home">
        <img src="branding/logo-white.png" alt="Trade Funding" class="footer__logo"/>
      </a>
      <nav class="footer__links" aria-label="Footer">
        <a href="#who-its-for">Who it's for</a>
        <a href="#how-it-works">How it works</a>
        <a href="#the-maths">The maths</a>
        <a href="#why-us">Why us</a>
        <a href="#request-a-call">Request a call</a>
        <a href="#register">Register</a>
      </nav>
    </div>
    <div class="footer__bottom">
      <img src="branding/cashper-gradient-transparent.png" alt="" class="footer__cashper" aria-hidden="true"/>
      <span class="footer__copy">© 2026 Trade Funding</span>
      <div class="footer__legal">
        <a href="privacy.html">Privacy</a>
        <span aria-hidden="true">·</span>
        <a href="terms.html">Terms</a>
      </div>
    </div>
  </div>
</footer>
```

- [ ] **Step 2: Append footer styles**

```css
/* ============================================================
   FOOTER
   ============================================================ */
.footer{background:var(--navy-deep);color:rgba(255,255,255,0.7);padding:56px 0 32px}
.footer__inner{display:flex;flex-direction:column;gap:32px}
.footer__top{display:flex;justify-content:space-between;align-items:center;gap:32px;flex-wrap:wrap;padding-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.08)}
.footer__logo{height:32px;width:auto}
.footer__links{display:flex;flex-wrap:wrap;gap:24px}
.footer__links a{font-family:var(--font-heading);font-weight:500;font-size:0.92rem;color:rgba(255,255,255,0.65);transition:color 150ms var(--ease)}
.footer__links a:hover{color:var(--white)}
.footer__bottom{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;font-size:0.82rem;color:rgba(255,255,255,0.45)}
.footer__cashper{width:32px;height:32px;opacity:0.4}
.footer__legal{display:flex;gap:10px;align-items:center}
.footer__legal a{color:rgba(255,255,255,0.6)}
.footer__legal a:hover{color:var(--white)}
@media (max-width:599px){.footer__top,.footer__bottom{flex-direction:column;align-items:flex-start;text-align:left}}
```

- [ ] **Step 3: Verify**

Logo + nav links in top row, copyright + legal links in bottom row. On mobile, both rows stack.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(footer): add brand footer with anchor links and legal pages"
```

---

## Phase 3 — Interactive features

### Task 14: Reveal animation observer + smooth-scroll guard

**Files:**
- Modify: `scripts/main.js` — append reveal observer
- (No HTML/CSS changes — `.reveal` and `.is-visible` are already styled)

- [ ] **Step 1: Append to `scripts/main.js`**

Add this **inside the existing IIFE** (before the closing `})()`):

```javascript
  // ---------- Reveal-on-scroll observer ----------
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = document.querySelectorAll('.reveal');
  if(reduceMotion){
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else if('IntersectionObserver' in window){
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {rootMargin:'-10% 0px -10% 0px', threshold:0.1});
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }
```

- [ ] **Step 2: Verify in browser**

Reload `index.html`. Scroll from top. Expected:
- Hero content fades in immediately (since it starts in view).
- As each section scrolls into view, its `.reveal` blocks fade in with stagger.
- In DevTools, simulate `prefers-reduced-motion: reduce` (Rendering panel → Emulate CSS media feature). Reload. All `.reveal` elements should be visible immediately, no transitions.

- [ ] **Step 3: Commit**

```bash
git add scripts/main.js
git commit -m "feat(main): add IntersectionObserver reveal-on-scroll with reduced-motion guard"
```

---

### Task 15: Calculator HTML structure

**Files:**
- Modify: `index.html` — insert calculator section between Upside and Why us
- Modify: `styles/main.css` — append calculator styles

- [ ] **Step 1: Insert calculator section after Upside, before Why us**

`id="the-maths"` so nav anchor lands here.

```html
<section class="section section--soft" id="the-maths">
  <div class="wrap">
    <div class="reveal" style="text-align:center">
      <span class="badge badge--success">The Maths</span>
      <h2 class="s-headline" style="margin-top:20px">See your numbers.</h2>
      <div class="divider divider--success divider--center"></div>
      <p class="s-body" style="margin:0 auto;color:var(--ink-600)">Adjust the sliders. Watch the uplift.</p>
    </div>
    <div class="calc-grid reveal delay-1">
      <div class="calc-inputs">
        <div class="calc-input">
          <label for="calc-quotes">Quotes per month <span class="calc-input__val" id="calc-quotes-val">30</span></label>
          <input type="range" id="calc-quotes" min="5" max="200" step="1" value="30" aria-describedby="calc-quotes-help"/>
          <span class="calc-input__help" id="calc-quotes-help">Total quotes you send each month</span>
        </div>
        <div class="calc-input">
          <label for="calc-value">Average transaction value <span class="calc-input__val" id="calc-value-val">$20,000</span></label>
          <input type="range" id="calc-value" min="5000" max="200000" step="1000" value="20000"/>
          <span class="calc-input__help">What an average won deal is worth</span>
        </div>
        <div class="calc-input">
          <label for="calc-conv">Current conversion rate <span class="calc-input__val" id="calc-conv-val">17%</span></label>
          <input type="range" id="calc-conv" min="5" max="50" step="1" value="17"/>
          <span class="calc-input__help">Share of quotes that become sales today</span>
        </div>
        <div class="calc-input">
          <label for="calc-uplift">Uplift you'd unlock <span class="calc-input__val" id="calc-uplift-val">+10%</span></label>
          <input type="range" id="calc-uplift" min="5" max="30" step="1" value="10"/>
          <span class="calc-input__help">Extra conversion when funding is offered</span>
        </div>
      </div>
      <div class="calc-tiles" aria-live="polite">
        <article class="calc-tile calc-tile--current">
          <div class="calc-tile__label">Current</div>
          <div class="calc-tile__num" id="calc-out-current-jobs">5<span class="calc-tile__unit">jobs</span></div>
          <div class="calc-tile__sub">~17% conversion<br/>from 30 quotes / month</div>
          <div class="calc-tile__divider"></div>
          <div class="calc-tile__money" id="calc-out-current-rev">$100,000 / mo</div>
        </article>
        <article class="calc-tile calc-tile--impact">
          <div class="calc-tile__tag">The Impact</div>
          <div class="calc-tile__label" id="calc-out-impact-label">+2 extra / month</div>
          <div class="calc-tile__num" id="calc-out-impact-jobs">7<span class="calc-tile__unit">jobs</span></div>
          <div class="calc-tile__sub">same pipeline, same effort</div>
          <div class="calc-tile__divider"></div>
          <div class="calc-tile__money" id="calc-out-impact-rev">$140,000 / mo</div>
        </article>
        <article class="calc-tile calc-tile--annual">
          <div class="calc-tile__label">Annual uplift</div>
          <div class="calc-tile__num calc-tile__num--big" id="calc-out-annual">~$480,000</div>
          <div class="calc-tile__sub">extra revenue / year<br/>from the same quoting effort</div>
          <div class="calc-tile__divider"></div>
          <div class="calc-tile__money" id="calc-out-extra-mo">$40,000 extra every month</div>
        </article>
      </div>
    </div>
    <div class="calc-narrative reveal delay-2">
      <p>Same pipeline. Same effort. Different outcome — <strong id="calc-narr-annual">~$480,000</strong> more revenue per year from just <strong id="calc-narr-extra">2 extra transactions</strong> a month.</p>
    </div>
    <div class="calc-cta reveal delay-3">
      <a href="#request-a-call" class="btn btn--primary btn--lg">Like what you see? Request a call →</a>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append calculator styles**

```css
/* ============================================================
   CALCULATOR
   ============================================================ */
.calc-grid{display:grid;grid-template-columns:1fr 1.2fr;gap:48px;margin-top:64px;align-items:start}
.calc-inputs{display:flex;flex-direction:column;gap:32px;background:var(--white);border:1px solid var(--border);border-radius:var(--radius-lg);padding:36px;box-shadow:var(--shadow-soft)}
.calc-input{display:flex;flex-direction:column;gap:10px}
.calc-input label{font-family:var(--font-heading);font-weight:600;font-size:0.95rem;color:var(--navy);display:flex;justify-content:space-between;align-items:baseline;gap:12px}
.calc-input__val{font-weight:800;color:var(--success);font-size:1.1rem;font-variant-numeric:tabular-nums}
.calc-input input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:6px;background:var(--bg-soft);border-radius:3px;outline:none}
.calc-input input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:var(--success);cursor:pointer;box-shadow:0 2px 8px rgba(16,185,129,0.4);transition:transform 150ms var(--ease)}
.calc-input input[type=range]::-webkit-slider-thumb:hover{transform:scale(1.1)}
.calc-input input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--success);cursor:pointer;border:none;box-shadow:0 2px 8px rgba(16,185,129,0.4)}
.calc-input input[type=range]:focus-visible{outline:3px solid var(--skyblue);outline-offset:4px}
.calc-input__help{font-size:0.8rem;color:var(--ink-400)}

.calc-tiles{display:flex;flex-direction:column;gap:16px}
.calc-tile{background:var(--white);border-radius:var(--radius-lg);padding:28px;box-shadow:var(--shadow-soft);border-left:4px solid var(--ink-200);position:relative;transition:box-shadow 200ms var(--ease)}
.calc-tile--current{border-left-color:var(--skyblue)}
.calc-tile--impact{border-left-color:var(--peach);transform:scale(1.02)}
.calc-tile--annual{border-left-color:var(--gold);background:linear-gradient(135deg,var(--white) 0%,var(--gold-soft) 100%)}
.calc-tile__tag{position:absolute;top:14px;right:14px;background:var(--peach);color:var(--white);font-family:var(--font-heading);font-weight:700;font-size:0.65rem;letter-spacing:0.14em;text-transform:uppercase;padding:4px 10px;border-radius:100px}
.calc-tile__label{font-family:var(--font-heading);font-weight:600;font-size:0.85rem;color:var(--ink-600);margin-bottom:8px;letter-spacing:0.04em}
.calc-tile__num{font-family:var(--font-heading);font-weight:900;font-size:2.6rem;line-height:1;color:var(--navy);letter-spacing:-0.025em;font-variant-numeric:tabular-nums}
.calc-tile__num--big{font-size:3rem;color:var(--gold)}
.calc-tile--current .calc-tile__num{color:var(--skyblue)}
.calc-tile--impact .calc-tile__num{color:var(--peach)}
.calc-tile__unit{font-size:0.45em;font-weight:700;margin-left:6px;color:var(--ink-400);letter-spacing:0}
.calc-tile__sub{font-size:0.85rem;color:var(--ink-600);margin-top:8px;line-height:1.4}
.calc-tile__divider{height:1px;background:var(--border);margin:14px 0}
.calc-tile__money{font-family:var(--font-heading);font-weight:700;font-size:0.9rem;color:var(--navy);font-variant-numeric:tabular-nums}

.calc-tile.is-pulsing{box-shadow:0 0 0 4px rgba(16,185,129,0.2),var(--shadow-lg)}

.calc-narrative{margin-top:48px;padding:28px 32px;background:var(--white);border-radius:var(--radius-lg);border-left:4px solid var(--success);max-width:920px;margin-left:auto;margin-right:auto;text-align:center}
.calc-narrative p{font-size:1.05rem;line-height:1.6;color:var(--ink-600)}
.calc-narrative strong{color:var(--navy);font-weight:800;font-variant-numeric:tabular-nums}

.calc-cta{margin-top:32px;text-align:center}

@media (max-width:899px){
  .calc-grid{grid-template-columns:1fr;gap:32px}
  .calc-tile--impact{transform:none}
  .calc-tile__num--big{font-size:2.4rem}
}
```

- [ ] **Step 3: Verify**

Open page. Calculator visible with sliders on left, three tiles on right. Sliders functional but tiles don't yet update (Task 16). Default values visible.

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(calc): add interactive calculator section markup and styles"
```

---

### Task 16: Calculator JS logic

**Files:**
- Create: `scripts/calculator.js`
- Create: `tests/calculator-test.html`

- [ ] **Step 1: Write `tests/calculator-test.html` first (TDD-lite for the math)**

```html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>Calculator Tests</title>
<style>body{font-family:monospace;padding:24px;line-height:1.6}.pass{color:green}.fail{color:red;font-weight:bold}</style>
</head>
<body>
<h1>Calculator Tests</h1>
<div id="results"></div>
<script type="module">
import {compute, formatMoney, formatJobs} from '../scripts/calculator.js';

const out = document.getElementById('results');
let pass=0, fail=0;
function assert(name, expected, actual){
  const ok = JSON.stringify(expected) === JSON.stringify(actual);
  out.innerHTML += `<div class="${ok?'pass':'fail'}">${ok?'PASS':'FAIL'} — ${name}${ok?'':` — expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`}</div>`;
  ok ? pass++ : fail++;
}

// Default deck example: 30 quotes, $20K avg, 17% conv, +10% uplift
// current_jobs = round(30 * 0.17) = 5
// impact_jobs = round(30 * 0.27) = 8
// extra_per_month = (8 - 5) * 20000 = 60000
// annual = 720000
// (Note: deck example uses ~17% which rounds 5.1 → 5, and 30 * 0.27 = 8.1 → 8.
//  Our calc is more accurate than the deck's hand-rounded figures; that's expected.)
const r1 = compute({quotes:30, avgValue:20000, currentConv:17, uplift:10});
assert('default current_jobs', 5, r1.currentJobs);
assert('default impact_jobs', 8, r1.impactJobs);
assert('default extra_per_month', 60000, r1.extraPerMonth);
assert('default annual', 720000, r1.annualUplift);
assert('default current_revenue', 100000, r1.currentRevenue);
assert('default impact_revenue', 160000, r1.impactRevenue);

// Edge: very small numbers
const r2 = compute({quotes:5, avgValue:5000, currentConv:5, uplift:5});
assert('small current_jobs', 0, r2.currentJobs); // round(5*0.05) = round(0.25) = 0
assert('small impact_jobs', 1, r2.impactJobs);   // round(5*0.10) = round(0.5) = 1 (banker's? plain Math.round = 1)

// Edge: very large
const r3 = compute({quotes:200, avgValue:200000, currentConv:50, uplift:30});
assert('large impact_jobs', 160, r3.impactJobs); // round(200*0.80) = 160
assert('large annual', (160-100)*200000*12, r3.annualUplift);

// Formatting
assert('formatMoney 480000', '$480,000', formatMoney(480000));
assert('formatMoney 1500000', '$1,500,000', formatMoney(1500000));
assert('formatMoney 0', '$0', formatMoney(0));
assert('formatJobs 1', '1 extra transaction', formatJobs(1));
assert('formatJobs 3', '3 extra transactions', formatJobs(3));
assert('formatJobs 0', '0 extra transactions', formatJobs(0));

out.innerHTML = `<h2>${pass} passed, ${fail} failed</h2>` + out.innerHTML;
</script>
</body>
</html>
```

- [ ] **Step 2: Run the test before writing implementation — verify it fails**

Open `tests/calculator-test.html` in a browser.
Expected: page shows 0 passed, 0 failed (because the import fails — script will error in console). Confirm a 404 or module-resolution error in DevTools console for `../scripts/calculator.js`.

- [ ] **Step 3: Create `scripts/calculator.js`**

```javascript
// ============================================================
// Trade Funding Vendor Landing — ROI Calculator
// ============================================================

// ---------- Pure math (testable) ----------
export function compute({quotes, avgValue, currentConv, uplift}){
  const currentRate = currentConv / 100;
  const impactRate = (currentConv + uplift) / 100;
  const currentJobs = Math.round(quotes * currentRate);
  const impactJobs = Math.round(quotes * impactRate);
  const extraJobs = impactJobs - currentJobs;
  const currentRevenue = currentJobs * avgValue;
  const impactRevenue = impactJobs * avgValue;
  const extraPerMonth = extraJobs * avgValue;
  const annualUplift = extraPerMonth * 12;
  return {currentJobs, impactJobs, extraJobs, currentRevenue, impactRevenue, extraPerMonth, annualUplift};
}

export function formatMoney(n){
  return '$' + Math.round(n).toLocaleString('en-AU');
}

export function formatJobs(n){
  return `${n} extra transaction${n === 1 ? '' : 's'}`;
}

// ---------- DOM binding (only when running in the page) ----------
(function(){
  if(typeof document === 'undefined') return;
  const inputs = {
    quotes: document.getElementById('calc-quotes'),
    value: document.getElementById('calc-value'),
    conv: document.getElementById('calc-conv'),
    uplift: document.getElementById('calc-uplift')
  };
  // Bail if calculator isn't on this page.
  if(!inputs.quotes) return;

  const labels = {
    quotes: document.getElementById('calc-quotes-val'),
    value: document.getElementById('calc-value-val'),
    conv: document.getElementById('calc-conv-val'),
    uplift: document.getElementById('calc-uplift-val')
  };
  const out = {
    currentJobs: document.getElementById('calc-out-current-jobs'),
    currentRev: document.getElementById('calc-out-current-rev'),
    impactJobs: document.getElementById('calc-out-impact-jobs'),
    impactRev: document.getElementById('calc-out-impact-rev'),
    impactLabel: document.getElementById('calc-out-impact-label'),
    annual: document.getElementById('calc-out-annual'),
    extraMo: document.getElementById('calc-out-extra-mo'),
    narrAnnual: document.getElementById('calc-narr-annual'),
    narrExtra: document.getElementById('calc-narr-extra')
  };
  const tiles = document.querySelectorAll('.calc-tile');

  const STORAGE_KEY = 'tf-vl-calc-v1';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Tween a numeric counter ----------
  const tweens = new WeakMap();
  function tweenNumber(el, from, to, format, duration=400){
    if(reduceMotion){
      el.textContent = format(to);
      return;
    }
    const existing = tweens.get(el);
    if(existing) cancelAnimationFrame(existing);
    const start = performance.now();
    function frame(now){
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const value = from + (to - from) * eased;
      el.textContent = format(value);
      if(t < 1){
        tweens.set(el, requestAnimationFrame(frame));
      } else {
        tweens.delete(el);
      }
    }
    tweens.set(el, requestAnimationFrame(frame));
  }

  // ---------- Read inputs ----------
  function readInputs(){
    return {
      quotes: parseInt(inputs.quotes.value, 10),
      avgValue: parseInt(inputs.value.value, 10),
      currentConv: parseInt(inputs.conv.value, 10),
      uplift: parseInt(inputs.uplift.value, 10)
    };
  }

  // ---------- Render ----------
  let lastResult = null;
  function render(){
    const vals = readInputs();
    const r = compute(vals);

    // Slider value labels
    labels.quotes.textContent = vals.quotes;
    labels.value.textContent = formatMoney(vals.avgValue);
    labels.conv.textContent = `${vals.currentConv}%`;
    labels.uplift.textContent = `+${vals.uplift}%`;

    // Tile numbers (with tweening)
    const fromCJ = lastResult ? lastResult.currentJobs : r.currentJobs;
    const fromIJ = lastResult ? lastResult.impactJobs : r.impactJobs;
    const fromCR = lastResult ? lastResult.currentRevenue : r.currentRevenue;
    const fromIR = lastResult ? lastResult.impactRevenue : r.impactRevenue;
    const fromEM = lastResult ? lastResult.extraPerMonth : r.extraPerMonth;
    const fromAU = lastResult ? lastResult.annualUplift : r.annualUplift;

    tweenNumber(out.currentJobs, fromCJ, r.currentJobs, v => `${Math.round(v)}<span class="calc-tile__unit">jobs</span>`);
    tweenNumber(out.impactJobs, fromIJ, r.impactJobs, v => `${Math.round(v)}<span class="calc-tile__unit">jobs</span>`);
    tweenNumber(out.currentRev, fromCR, r.currentRevenue, v => `${formatMoney(v)} / mo`);
    tweenNumber(out.impactRev, fromIR, r.impactRevenue, v => `${formatMoney(v)} / mo`);
    tweenNumber(out.annual, fromAU, r.annualUplift, v => `~${formatMoney(v)}`);
    tweenNumber(out.extraMo, fromEM, r.extraPerMonth, v => `${formatMoney(v)} extra every month`);
    tweenNumber(out.narrAnnual, fromAU, r.annualUplift, v => `~${formatMoney(v)}`);

    // Static text
    out.impactLabel.textContent = `+${r.extraJobs} extra / month`;
    out.narrExtra.textContent = formatJobs(r.extraJobs);

    // Pulse impact tile on change
    if(lastResult && r.extraJobs !== lastResult.extraJobs){
      tiles.forEach(t => {
        t.classList.add('is-pulsing');
        setTimeout(() => t.classList.remove('is-pulsing'), 200);
      });
    }

    // Persist
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(vals)); } catch(e){}
    lastResult = r;
  }

  // ---------- Restore from sessionStorage ----------
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if(saved){
      const v = JSON.parse(saved);
      if(v && typeof v === 'object'){
        if(typeof v.quotes === 'number') inputs.quotes.value = v.quotes;
        if(typeof v.avgValue === 'number') inputs.value.value = v.avgValue;
        if(typeof v.currentConv === 'number') inputs.conv.value = v.currentConv;
        if(typeof v.uplift === 'number') inputs.uplift.value = v.uplift;
      }
    }
  } catch(e){}

  // ---------- Bind ----------
  Object.values(inputs).forEach(el => el.addEventListener('input', render));
  render();
})();
```

- [ ] **Step 4: Run tests again — verify all pass**

Open `tests/calculator-test.html` in browser.
Expected: heading "13 passed, 0 failed" (12 assertions in the test file plus the heading).

If any FAIL: check `compute()` math or `formatMoney`/`formatJobs` and fix. Re-run.

- [ ] **Step 5: Verify in `index.html`**

Reload `index.html`. Adjust each slider. Expected:
- Slider value labels update live.
- Three tiles' numbers tween smoothly.
- Narrative paragraph numbers update.
- Refresh page mid-session: values persist (sessionStorage).
- Open new tab → values reset (sessionStorage scoped to tab).
- DevTools simulate `prefers-reduced-motion: reduce` → tweens become instant.

- [ ] **Step 6: Update `<script>` tag in `index.html`**

The calculator file uses `export`, so the `<script>` for it must be a module. Edit `index.html` script tags (currently at the bottom, before `</body>`):

Change:
```html
<script src="scripts/calculator.js" defer></script>
```
To:
```html
<script type="module" src="scripts/calculator.js"></script>
```

(`defer` is implicit on modules.)

Reload, verify still works.

- [ ] **Step 7: Commit**

```bash
git add scripts/calculator.js tests/calculator-test.html index.html
git commit -m "feat(calc): add interactive calculator with tween, sessionStorage, math tests"
```

---

### Task 17: Conversion module HTML (form + Dylan card)

**Files:**
- Modify: `index.html` — insert section after Why us, before footer
- Modify: `styles/main.css` — append conversion styles

- [ ] **Step 1: Insert section after Why us**

```html
<section class="section section--deep" id="request-a-call">
  <div class="wrap">
    <div class="conv-recap reveal">
      <div class="conv-recap__cell"><div class="conv-recap__num text-skyblue">70+</div><div class="conv-recap__label">lenders compared</div></div>
      <div class="conv-recap__sep" aria-hidden="true"></div>
      <div class="conv-recap__cell"><div class="conv-recap__num text-success">$0</div><div class="conv-recap__label">cost to you</div></div>
      <div class="conv-recap__sep" aria-hidden="true"></div>
      <div class="conv-recap__cell"><div class="conv-recap__num text-gold">~$480K</div><div class="conv-recap__label">annual revenue potential</div></div>
    </div>
    <div class="conv-grid">
      <div class="conv-form-wrap reveal delay-1">
        <span class="badge badge--light">Get started</span>
        <h2 class="s-headline" style="margin-top:20px">Request a call.</h2>
        <div class="divider divider--white"></div>
        <p class="s-body" style="margin-bottom:32px">Tell us about your business. We'll be in touch within one business day.</p>
        <form id="request-call-form" class="conv-form" novalidate>
          <div class="conv-form__row">
            <div class="conv-field">
              <label for="rc-name">Full name</label>
              <input type="text" id="rc-name" name="name" required autocomplete="name"/>
              <span class="conv-field__error" data-for="rc-name"></span>
            </div>
            <div class="conv-field">
              <label for="rc-business">Business name</label>
              <input type="text" id="rc-business" name="business" required autocomplete="organization"/>
              <span class="conv-field__error" data-for="rc-business"></span>
            </div>
          </div>
          <div class="conv-form__row">
            <div class="conv-field">
              <label for="rc-email">Email</label>
              <input type="email" id="rc-email" name="email" required autocomplete="email"/>
              <span class="conv-field__error" data-for="rc-email"></span>
            </div>
            <div class="conv-field">
              <label for="rc-phone">Phone</label>
              <input type="tel" id="rc-phone" name="phone" required autocomplete="tel"/>
              <span class="conv-field__error" data-for="rc-phone"></span>
            </div>
          </div>
          <div class="conv-field">
            <label for="rc-sell">What you sell</label>
            <input type="text" id="rc-sell" name="sell" maxlength="120" required placeholder="e.g. commercial vehicles, fit-out services, software subscriptions"/>
            <span class="conv-field__error" data-for="rc-sell"></span>
          </div>
          <div class="conv-form__row">
            <div class="conv-field">
              <label for="rc-date">Preferred date</label>
              <input type="date" id="rc-date" name="date" required/>
              <span class="conv-field__error" data-for="rc-date"></span>
            </div>
            <div class="conv-field">
              <label for="rc-time">Preferred time</label>
              <select id="rc-time" name="time" required>
                <option value="">Select…</option>
                <option value="morning">Morning (9am – 12pm)</option>
                <option value="midday">Midday (12pm – 2pm)</option>
                <option value="afternoon">Afternoon (2pm – 5pm)</option>
              </select>
              <span class="conv-field__error" data-for="rc-time"></span>
            </div>
          </div>
          <div class="conv-field">
            <label for="rc-message">Brief message <span class="conv-field__optional">(optional)</span></label>
            <textarea id="rc-message" name="message" maxlength="500" rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn--primary btn--lg conv-form__submit">Request a call</button>
          <p class="conv-form__privacy">We'll only use these details to schedule your call. See our <a href="privacy.html">Privacy Policy</a>.</p>
        </form>
        <div class="conv-form__success" id="conv-form-success" hidden>
          <div class="conv-form__success-ico" aria-hidden="true"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
          <h3>Thanks — we'll be in touch.</h3>
          <p>One of our growth team will reach out within one business day to confirm your call.</p>
        </div>
      </div>
      <aside class="conv-contact reveal delay-2">
        <img src="branding/dylan.jpg" alt="Dylan Dovico" class="conv-contact__photo"/>
        <div class="conv-contact__name">Dylan Dovico</div>
        <div class="conv-contact__role">Senior Growth Partner</div>
        <ul class="conv-contact__details">
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg><a href="tel:+61483944824">0483 944 824</a></li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><a href="mailto:dylan.d@tradefunding.com.au">dylan.d@tradefunding.com.au</a></li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg><a href="https://tradefunding.com.au">tradefunding.com.au</a></li>
          <li><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#54B4F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><span>Level 7, 233 Castlereagh St, Sydney</span></li>
        </ul>
        <div class="conv-contact__divider"></div>
        <a href="#register" class="btn btn--outline btn--lg conv-contact__cta">Or register your business</a>
        <p class="conv-contact__caption">Skip the call — register your business and we'll onboard you directly.</p>
      </aside>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append conversion styles**

```css
/* ============================================================
   CONVERSION MODULE
   ============================================================ */
.conv-recap{display:flex;justify-content:center;align-items:center;gap:32px;flex-wrap:wrap;margin-bottom:64px;padding-bottom:48px;border-bottom:1px solid rgba(255,255,255,0.08)}
.conv-recap__cell{text-align:center}
.conv-recap__num{font-family:var(--font-heading);font-weight:900;font-size:clamp(2rem,3.4vw,2.8rem);line-height:1;letter-spacing:-0.025em;margin-bottom:6px}
.conv-recap__label{font-size:0.85rem;color:rgba(255,255,255,0.55);letter-spacing:0.04em;text-transform:uppercase}
.conv-recap__sep{width:1px;height:48px;background:rgba(255,255,255,0.1)}

.conv-grid{display:grid;grid-template-columns:1.5fr 1fr;gap:48px;align-items:start}

.conv-form-wrap{padding:0}
.conv-form{display:flex;flex-direction:column;gap:18px;margin-top:8px}
.conv-form__row{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.conv-field{display:flex;flex-direction:column;gap:6px}
.conv-field label{font-family:var(--font-heading);font-weight:600;font-size:0.88rem;color:rgba(255,255,255,0.85)}
.conv-field__optional{color:rgba(255,255,255,0.45);font-weight:400}
.conv-field input,.conv-field select,.conv-field textarea{font-family:var(--font-body);font-size:1rem;padding:12px 14px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:10px;color:var(--white);transition:border-color 150ms var(--ease),background 150ms var(--ease)}
.conv-field input:focus,.conv-field select:focus,.conv-field textarea:focus{outline:none;border-color:var(--skyblue);background:rgba(255,255,255,0.1)}
.conv-field input::placeholder,.conv-field textarea::placeholder{color:rgba(255,255,255,0.35)}
.conv-field input[type=date],.conv-field select{color-scheme:dark}
.conv-field.is-error input,.conv-field.is-error select,.conv-field.is-error textarea{border-color:var(--peach)}
.conv-field__error{font-size:0.8rem;color:var(--peach);min-height:0;display:none}
.conv-field.is-error .conv-field__error{display:block;min-height:1em}
.conv-form__submit{margin-top:8px;align-self:flex-start}
.conv-form__submit:disabled{opacity:0.6;cursor:not-allowed}
.conv-form__privacy{font-size:0.82rem;color:rgba(255,255,255,0.5);margin-top:8px}
.conv-form__privacy a{color:var(--skyblue);text-decoration:underline}

.conv-form__success{padding:48px 32px;background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.2);border-radius:var(--radius-lg);text-align:center}
.conv-form__success-ico{margin-bottom:18px}
.conv-form__success h3{font-family:var(--font-heading);font-weight:800;font-size:1.6rem;margin-bottom:10px;color:var(--white)}
.conv-form__success p{color:rgba(255,255,255,0.75)}

.conv-contact{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--radius-lg);padding:32px;text-align:center}
.conv-contact__photo{width:96px;height:96px;border-radius:50%;object-fit:cover;margin:0 auto 16px;border:3px solid rgba(255,255,255,0.1)}
.conv-contact__name{font-family:var(--font-heading);font-weight:800;font-size:1.25rem;color:var(--white);margin-bottom:4px}
.conv-contact__role{font-size:0.9rem;color:var(--skyblue);letter-spacing:0.04em;margin-bottom:24px}
.conv-contact__details{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px;text-align:left}
.conv-contact__details li{display:flex;align-items:center;gap:10px;font-size:0.88rem;color:rgba(255,255,255,0.75)}
.conv-contact__details a{color:rgba(255,255,255,0.85);transition:color 150ms var(--ease)}
.conv-contact__details a:hover{color:var(--white)}
.conv-contact__divider{height:1px;background:rgba(255,255,255,0.1);margin:24px 0 20px}
.conv-contact__cta{width:100%;justify-content:center}
.conv-contact__caption{font-size:0.78rem;color:rgba(255,255,255,0.45);margin-top:12px;line-height:1.4}

@media (max-width:899px){
  .conv-grid{grid-template-columns:1fr;gap:32px}
  .conv-form__row{grid-template-columns:1fr}
  .conv-recap{gap:20px}
  .conv-recap__sep{display:none}
}
```

- [ ] **Step 3: Verify**

Conversion section renders with form on left (60%) and Dylan card on right (40%). Recap stats centred above. Form fields styled for dark background. Submit button doesn't yet do anything (Task 18).

- [ ] **Step 4: Commit**

```bash
git add index.html styles/main.css
git commit -m "feat(conv): add conversion module with form, Dylan card, recap stats"
```

---

### Task 18: Form validation + mock submit

**Files:**
- Create: `scripts/form.js`

- [ ] **Step 1: Create `scripts/form.js`**

```javascript
// ============================================================
// Trade Funding Vendor Landing — Request-a-call form
// ============================================================
(function(){
  'use strict';

  const form = document.getElementById('request-call-form');
  if(!form) return;

  const successEl = document.getElementById('conv-form-success');
  const submitBtn = form.querySelector('.conv-form__submit');

  // TODO: replace with real backend endpoint when available
  // Expected payload: { name, business, email, phone, sell, date, time, message }
  const FORM_ENDPOINT = null; // set to e.g. '/api/request-call' to enable real submit
  const MOCK_DELAY_MS = 600;

  // ---------- Validators ----------
  const validators = {
    name: v => v.trim().length >= 2 || 'Please enter your full name',
    business: v => v.trim().length >= 2 || 'Please enter your business name',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email',
    phone: v => /^[\d\s+()\-]{8,}$/.test(v.trim()) || 'Please enter a valid phone number',
    sell: v => v.trim().length >= 2 || 'Tell us briefly what you sell',
    date: v => {
      if(!v) return 'Please pick a date';
      const picked = new Date(v);
      const today = new Date(); today.setHours(0,0,0,0);
      if(picked < today) return 'Date must be today or later';
      const max = new Date(); max.setDate(max.getDate() + 60);
      if(picked > max) return 'Pick a date within the next 60 days';
      return true;
    },
    time: v => !!v || 'Pick a preferred time'
  };

  // ---------- Set min/max on date input ----------
  const dateInput = form.querySelector('#rc-date');
  if(dateInput){
    const today = new Date();
    const max = new Date(); max.setDate(today.getDate() + 60);
    dateInput.min = today.toISOString().split('T')[0];
    dateInput.max = max.toISOString().split('T')[0];
  }

  // ---------- Show / clear error ----------
  function setError(fieldName, message){
    const field = form.querySelector(`[name="${fieldName}"]`);
    const wrap = field.closest('.conv-field');
    const err = form.querySelector(`.conv-field__error[data-for="${field.id}"]`);
    if(message){
      wrap.classList.add('is-error');
      if(err) err.textContent = message;
      field.setAttribute('aria-invalid','true');
    } else {
      wrap.classList.remove('is-error');
      if(err) err.textContent = '';
      field.removeAttribute('aria-invalid');
    }
  }

  // ---------- Validate one field ----------
  function validateField(name){
    const field = form.querySelector(`[name="${name}"]`);
    const result = validators[name](field.value);
    if(result === true){
      setError(name, null);
      return true;
    }
    setError(name, result);
    return false;
  }

  // ---------- Validate all ----------
  function validateAll(){
    let ok = true;
    Object.keys(validators).forEach(name => {
      if(!validateField(name)) ok = false;
    });
    return ok;
  }

  // ---------- Live-clear errors as user types ----------
  Object.keys(validators).forEach(name => {
    const field = form.querySelector(`[name="${name}"]`);
    field.addEventListener('input', () => {
      if(field.closest('.conv-field').classList.contains('is-error')){
        validateField(name);
      }
    });
    field.addEventListener('blur', () => validateField(name));
  });

  // ---------- Submit ----------
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if(!validateAll()){
      const firstError = form.querySelector('.conv-field.is-error input, .conv-field.is-error select, .conv-field.is-error textarea');
      if(firstError) firstError.focus();
      return;
    }

    submitBtn.disabled = true;
    const originalLabel = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    const payload = {
      name: form.querySelector('#rc-name').value.trim(),
      business: form.querySelector('#rc-business').value.trim(),
      email: form.querySelector('#rc-email').value.trim(),
      phone: form.querySelector('#rc-phone').value.trim(),
      sell: form.querySelector('#rc-sell').value.trim(),
      date: form.querySelector('#rc-date').value,
      time: form.querySelector('#rc-time').value,
      message: form.querySelector('#rc-message').value.trim()
    };

    try {
      if(FORM_ENDPOINT){
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload)
        });
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // Mock submission
        console.log('[request-call mock submit]', payload);
        await new Promise(r => setTimeout(r, MOCK_DELAY_MS));
      }
      // Success state
      form.hidden = true;
      successEl.hidden = false;
      successEl.scrollIntoView({behavior: 'smooth', block: 'center'});
    } catch(err){
      console.error('Form submit failed', err);
      submitBtn.disabled = false;
      submitBtn.textContent = originalLabel;
      alert('Sorry — something went wrong. Please email dylan.d@tradefunding.com.au directly.');
    }
  });
})();
```

- [ ] **Step 2: Verify in browser — happy path**

Reload `index.html`. Scroll to form. Fill all required fields with valid values. Click submit.
Expected:
- Button shows "Sending…", disabled.
- After ~600ms, form replaced by green success state.
- DevTools console shows `[request-call mock submit]` log with payload.

- [ ] **Step 3: Verify in browser — validation paths**

- Submit empty form → first field gets focus, errors shown under each field.
- Type invalid email (e.g. `foo`) → blur → error message.
- Pick date in the past → error.
- Phone with letters → error.

- [ ] **Step 4: Commit**

```bash
git add scripts/form.js
git commit -m "feat(form): add validation, error display, and mock submission"
```

---

## Phase 4 — Legal pages

### Task 19: privacy.html

**Files:**
- Create: `privacy.html`

- [ ] **Step 1: Create `privacy.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="description" content="Privacy Policy — Trade Funding"/>
<meta name="robots" content="index,follow"/>
<title>Privacy Policy · Trade Funding</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="styles/main.css"/>
<link rel="icon" type="image/png" href="branding/logo-navy.png"/>
</head>
<body>

<a href="#main" class="skip-link">Skip to main content</a>

<header id="site-nav" class="nav">
  <div class="nav__inner wrap">
    <a href="index.html" class="nav__brand" aria-label="Trade Funding home">
      <img src="branding/logo-navy.png" alt="Trade Funding" class="nav__logo nav__logo--navy"/>
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="index.html#how-it-works">How it works</a>
      <a href="index.html#the-maths">The maths</a>
      <a href="index.html#why-us">Why us</a>
    </nav>
    <div class="nav__cta">
      <a href="index.html#register" class="btn btn--secondary">Register your business</a>
      <a href="index.html#request-a-call" class="btn btn--primary">Request a call</a>
    </div>
  </div>
</header>

<main id="main" class="legal">
  <div class="wrap-sm legal__inner">
    <span class="s-eyebrow">Legal</span>
    <h1 class="s-headline">Privacy Policy</h1>
    <div class="divider"></div>
    <p class="legal__updated">Last updated: 6 May 2026</p>

    <p class="legal__intro">Trade Funding ("we", "us", "our") respects your privacy and is committed to protecting the personal information you share with us. This policy explains what information we collect, how we use it, and your rights.</p>

    <h2>What we collect</h2>
    <p>When you submit the "Request a call" form, we collect: your name, business name, email address, phone number, what your business sells, your preferred meeting date and time, and any optional message you provide. When you browse this site, our hosting provider may automatically log standard request metadata (IP address, browser, referrer, timestamp).</p>

    <h2>How we use it</h2>
    <p>We use the information you submit to contact you about your enquiry, schedule a call, and follow up on the conversation. We do not sell your personal information.</p>
    <p class="legal__tbd">[TBD: legal counsel to provide — full description of any secondary uses, e.g. analytics, retargeting, internal performance reporting.]</p>

    <h2>Sharing</h2>
    <p>We share your information only with our team members and service providers who help us operate the business (for example, our customer relationship management system and email infrastructure provider).</p>
    <p class="legal__tbd">[TBD: legal counsel to provide — list of named sub-processors, cross-border transfer disclosures, lawful basis under the Privacy Act 1988 (Cth).]</p>

    <h2>Cookies</h2>
    <p>This page uses session storage to remember calculator inputs while you browse. We do not use third-party advertising or tracking cookies.</p>
    <p class="legal__tbd">[TBD: legal counsel to provide — full cookie/storage disclosure consistent with Australian Privacy Principles.]</p>

    <h2>Your rights</h2>
    <p>Under Australian privacy law, you have the right to access the personal information we hold about you, request a correction, or ask us to delete it. To exercise any of these rights, email us at the contact address below.</p>
    <p class="legal__tbd">[TBD: legal counsel to provide — process for handling complaints to the Office of the Australian Information Commissioner (OAIC).]</p>

    <h2>Contact</h2>
    <p>For privacy questions or requests, email <a href="mailto:dylan.d@tradefunding.com.au">dylan.d@tradefunding.com.au</a> or write to Level 7, 233 Castlereagh Street, Sydney NSW 2000, Australia.</p>
  </div>
</main>

<footer id="site-footer" class="footer">
  <div class="wrap footer__inner">
    <div class="footer__top">
      <a href="index.html" class="footer__brand"><img src="branding/logo-white.png" alt="Trade Funding" class="footer__logo"/></a>
      <nav class="footer__links" aria-label="Footer">
        <a href="index.html#who-its-for">Who it's for</a>
        <a href="index.html#how-it-works">How it works</a>
        <a href="index.html#the-maths">The maths</a>
        <a href="index.html#why-us">Why us</a>
        <a href="index.html#request-a-call">Request a call</a>
        <a href="index.html#register">Register</a>
      </nav>
    </div>
    <div class="footer__bottom">
      <img src="branding/cashper-gradient-transparent.png" alt="" class="footer__cashper" aria-hidden="true"/>
      <span class="footer__copy">© 2026 Trade Funding</span>
      <div class="footer__legal"><a href="privacy.html">Privacy</a><span aria-hidden="true">·</span><a href="terms.html">Terms</a></div>
    </div>
  </div>
</footer>

<script src="scripts/main.js" defer></script>

</body>
</html>
```

- [ ] **Step 2: Append legal-page styles to `styles/main.css`**

```css
/* ============================================================
   LEGAL PAGES
   ============================================================ */
.legal{padding:clamp(64px,8vw,96px) 0}
.legal__inner{max-width:760px}
.legal__updated{color:var(--ink-400);font-size:0.9rem;margin-bottom:32px;letter-spacing:0.02em}
.legal__intro{font-size:1.1rem;line-height:1.7;color:var(--ink-600);margin-bottom:32px}
.legal h2{font-family:var(--font-heading);font-weight:700;font-size:1.4rem;margin:40px 0 12px;color:var(--navy);letter-spacing:-0.01em}
.legal p{font-size:1.02rem;line-height:1.7;color:var(--ink-600);margin-bottom:14px}
.legal a{color:var(--navy-blue);text-decoration:underline}
.legal__tbd{padding:12px 16px;background:var(--peach-soft);border-left:3px solid var(--peach);color:var(--ink-600);font-size:0.92rem;font-style:italic;border-radius:6px}
```

- [ ] **Step 3: Verify**

Open `privacy.html`. Expected: shared nav + footer, centred 760px column, `[TBD]` markers visibly highlighted in peach. Nav anchor links go back to `index.html#section`.

- [ ] **Step 4: Commit**

```bash
git add privacy.html styles/main.css
git commit -m "feat(legal): add privacy.html with placeholder copy and shared shell"
```

---

### Task 20: terms.html

**Files:**
- Create: `terms.html`

- [ ] **Step 1: Create `terms.html`**

Use `privacy.html` as the template — same nav, footer, head. Replace only the `<main>` block.

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="description" content="Terms of Use — Trade Funding"/>
<meta name="robots" content="index,follow"/>
<title>Terms of Use · Trade Funding</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800;900&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet"/>
<link rel="stylesheet" href="styles/main.css"/>
<link rel="icon" type="image/png" href="branding/logo-navy.png"/>
</head>
<body>

<a href="#main" class="skip-link">Skip to main content</a>

<header id="site-nav" class="nav">
  <div class="nav__inner wrap">
    <a href="index.html" class="nav__brand" aria-label="Trade Funding home">
      <img src="branding/logo-navy.png" alt="Trade Funding" class="nav__logo nav__logo--navy"/>
    </a>
    <nav class="nav__links" aria-label="Primary">
      <a href="index.html#how-it-works">How it works</a>
      <a href="index.html#the-maths">The maths</a>
      <a href="index.html#why-us">Why us</a>
    </nav>
    <div class="nav__cta">
      <a href="index.html#register" class="btn btn--secondary">Register your business</a>
      <a href="index.html#request-a-call" class="btn btn--primary">Request a call</a>
    </div>
  </div>
</header>

<main id="main" class="legal">
  <div class="wrap-sm legal__inner">
    <span class="s-eyebrow">Legal</span>
    <h1 class="s-headline">Terms of Use</h1>
    <div class="divider"></div>
    <p class="legal__updated">Last updated: 6 May 2026</p>

    <p class="legal__intro">These Terms govern your use of the Trade Funding website ("the site"). By accessing the site you accept these Terms. If you do not accept them, please do not use the site.</p>

    <h2>Acceptance</h2>
    <p>Your continued use of the site constitutes acceptance of these Terms and any updates we publish. We may change these Terms from time to time; the "last updated" date above will reflect the most recent revision.</p>

    <h2>Eligibility</h2>
    <p>The site is intended for use by Australian businesses and their authorised representatives. You must be at least 18 years old to submit any form on this site.</p>
    <p class="legal__tbd">[TBD: legal counsel to provide — eligibility criteria specific to Trade Funding's regulated activities, including any AFSL or credit licence references.]</p>

    <h2>Use of service</h2>
    <p>You may use the site for lawful purposes only. You agree not to attempt to interfere with the site's operation, gain unauthorised access, or use automated tools to scrape content.</p>

    <h2>Intellectual property</h2>
    <p>All content on this site — including text, graphics, logos, the Cashper mascot, and the Trade Funding name — is the property of Trade Funding or its licensors and is protected by Australian and international copyright and trademark law.</p>

    <h2>Disclaimers</h2>
    <p>The information on this site is provided for general informational purposes only and does not constitute financial product advice or a recommendation. Specific finance offers are subject to credit assessment, lender criteria, and acceptance of relevant terms.</p>
    <p class="legal__tbd">[TBD: legal counsel to provide — full ASIC-aligned disclosure language, general advice warning, and any product-specific disclaimers required under Trade Funding's licensing.]</p>

    <h2>Limitation of liability</h2>
    <p class="legal__tbd">[TBD: legal counsel to provide — limitation-of-liability language including statutory consumer guarantees under the Australian Consumer Law and any contractual exclusions Trade Funding wishes to assert.]</p>

    <h2>Governing law</h2>
    <p>These Terms are governed by the laws of New South Wales, Australia. The courts of New South Wales have exclusive jurisdiction over any dispute arising from these Terms or your use of the site.</p>

    <h2>Contact</h2>
    <p>For questions about these Terms, email <a href="mailto:dylan.d@tradefunding.com.au">dylan.d@tradefunding.com.au</a> or write to Level 7, 233 Castlereagh Street, Sydney NSW 2000, Australia.</p>
  </div>
</main>

<footer id="site-footer" class="footer">
  <div class="wrap footer__inner">
    <div class="footer__top">
      <a href="index.html" class="footer__brand"><img src="branding/logo-white.png" alt="Trade Funding" class="footer__logo"/></a>
      <nav class="footer__links" aria-label="Footer">
        <a href="index.html#who-its-for">Who it's for</a>
        <a href="index.html#how-it-works">How it works</a>
        <a href="index.html#the-maths">The maths</a>
        <a href="index.html#why-us">Why us</a>
        <a href="index.html#request-a-call">Request a call</a>
        <a href="index.html#register">Register</a>
      </nav>
    </div>
    <div class="footer__bottom">
      <img src="branding/cashper-gradient-transparent.png" alt="" class="footer__cashper" aria-hidden="true"/>
      <span class="footer__copy">© 2026 Trade Funding</span>
      <div class="footer__legal"><a href="privacy.html">Privacy</a><span aria-hidden="true">·</span><a href="terms.html">Terms</a></div>
    </div>
  </div>
</footer>

<script src="scripts/main.js" defer></script>

</body>
</html>
```

- [ ] **Step 2: Verify**

Open `terms.html`. Same shell as privacy. `[TBD]` markers visible.

- [ ] **Step 3: Commit**

```bash
git add terms.html
git commit -m "feat(legal): add terms.html with placeholder clauses"
```

---

## Phase 5 — Polish

### Task 21: Final QA pass — Lighthouse, accessibility, cross-browser

**Files:** none (verification + small fixes only)

- [ ] **Step 1: Run Lighthouse on `index.html`**

Open Chrome DevTools → Lighthouse → analyse the local file (or run `npx serve .` first). Run for both Mobile and Desktop.

Targets:
- Performance ≥ 95
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

Common fixes if you fall short:
- **Performance:** lazy-load `dylan.jpg` if it's below the fold; preload Cashper PNG; check fonts are using `font-display: swap` (handled by Google Fonts URL).
- **Accessibility:** check colour contrast on form `__help` text and footer links; ensure all interactive elements have visible focus.
- **SEO:** confirm meta description, title, OG tags present.

- [ ] **Step 2: Manual keyboard navigation check**

Reload `index.html`. Press Tab from page load:
- Skip link should appear visible.
- All nav links, CTAs, form fields, sliders reachable.
- Focus rings visible on every interactive element.
- Escape closes mobile menu (already wired? if not, skip — not required).

- [ ] **Step 3: Manual responsive check**

Open in Chrome at:
- 1440×900 — full desktop layout
- 1024×768 — tablet (between desktop and mobile breakpoints)
- 768×1024 — tablet portrait
- 375×812 — mobile (iPhone X)

Check at each:
- Nav collapses correctly at <900px.
- Hero CTAs stack at <600px.
- All grids collapse to single column at <900px.
- Calculator stacks vertically.
- Conversion form fields stack.
- No horizontal scroll on any page.

- [ ] **Step 4: Cross-browser quick check**

Open `index.html` in Firefox. Verify:
- Layout matches Chrome.
- Form fields render acceptably.
- Sliders work.
- No console errors.

- [ ] **Step 5: Final spec coverage check**

Walk through `docs/superpowers/specs/2026-05-06-vendor-landing-design.md` and confirm:
- §5 anatomy: all 12 items rendered.
- §5.2 public-language scrub: search the rendered page text — "Vendor Partner" must not appear.
- §6 calculator: 4 sliders, 3 tiles, narrative, CTA strip — all present.
- §7 conversion: form, Dylan card, recap stats, secondary CTA — all present.
- §9 legal pages: privacy + terms exist with `[TBD]` markers.
- §10 responsive: passed.
- §12 accessibility: skip link, aria-live, focus rings — all present.

If anything's missing, fix it in a small follow-up commit.

- [ ] **Step 6: Fix any issues found, commit**

```bash
git add -p
git commit -m "polish: address Lighthouse/a11y findings from final QA pass"
```

(If nothing needed fixing, skip the commit and proceed.)

- [ ] **Step 7: Final git log review**

```bash
git log --oneline
```

Expected: ~21 well-named commits showing the build progression.

---

## Self-Review Notes

### Spec coverage check
- §1 Purpose — covered by Tasks 5 (hero CTA) and 17 (conversion form + register link). ✓
- §2 Audience — copy ports vertical-agnostic deck content. ✓
- §3 Stack & deployment — Task 1 sets up structure; no build step. ✓
- §4 Brand system — Task 2 ports tokens verbatim. ✓
- §5 Page anatomy — Tasks 4–13 + 15 + 17. ✓
- §5.1 Reveal animation — Task 14. ✓
- §5.2 Public-language scrub — Task 5 (hero eyebrow), Task 12 (growth manager), Task 3 (page title). ✓
- §6 Calculator — Tasks 15–16. ✓
- §7 Conversion — Tasks 17–18. ✓
- §8 Footer — Task 13. ✓
- §9 Legal pages — Tasks 19–20. ✓
- §10 Responsive — built into every section task; Task 21 verifies. ✓
- §11 Performance & SEO — Task 3 (meta + JSON-LD); Task 21 (Lighthouse). ✓
- §12 Accessibility — Task 3 (skip link), Task 4 (aria-expanded), Task 14 (reduced-motion), Task 15 (aria-live, aria-describedby), Task 18 (aria-invalid), Task 21 (verification). ✓
- §13 Project structure — Task 1. ✓
- §14 Deferred items — Task 1 (README), Task 18 (TODO marker in form.js), all `[TBD]` in legal pages. ✓
- §15 Out of scope — none built. ✓

### Type / name consistency check
- `compute()` signature `{quotes, avgValue, currentConv, uplift}` consistent across Tasks 16 (impl) and 16 Step 1 (test).
- DOM IDs (`calc-quotes`, `calc-out-current-jobs`, etc.) consistent between Task 15 (HTML) and Task 16 (JS).
- Form field names (`name`, `business`, `email`, `phone`, `sell`, `date`, `time`, `message`) consistent between Task 17 (HTML) and Task 18 (JS validators).
- Section IDs (`top`, `who-its-for`, `the-problem`, `the-solution`, `how-it-works`, `the-shift`, `the-upside`, `the-maths`, `why-us`, `request-a-call`) consistent between Task 4 (nav anchors), Task 13 (footer anchors), and the section tasks themselves.

### Placeholder scan
- `[TBD]` markers exist only in legal pages (Tasks 19–20) — these are intentional and clearly attributed to legal counsel.
- `TODO` in `scripts/form.js` (Task 18) is a single, clearly-marked line indicating where to set `FORM_ENDPOINT`.
- No vague "implement later" language anywhere in tasks.

Plan reviewed clean. Ready for execution.

---

## Plan complete

Saved to `docs/superpowers/plans/2026-05-06-vendor-landing.md`.
