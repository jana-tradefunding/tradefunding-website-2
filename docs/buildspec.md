# Build Spec — Trade Funding Homepage-First Rebuild

**Status: v1 — fresh build.** Replaces the old `buildspec.md` (v11). `plan.md` explains *what and why*; this explains *how to build it*. If this ever contradicts `plan.md`, `plan.md` wins and this file needs updating.

---

## 1. Stack

- **Framework:** Next.js (App Router), TypeScript.
- **CMS:** Payload CMS 3.x, installed in the same Next.js app.
- **Database:** Postgres (Vercel Postgres or Neon) via Payload's Postgres adapter.
- **Media storage:** Payload's Vercel Blob storage adapter.
- **Styling:** Fresh CSS/token system per §4 below — not ported from `oldsite/`'s stylesheets, not a Tailwind rewrite. Plain CSS custom properties + component-scoped styles, matching the existing project convention.
- **Hosting:** One Vercel project, sub-path routing for all channels (unchanged principle from the old build — still correct here).

---

## 2. Routing architecture

```
/                          → NEW homepage (neutral, brand-level entry point)
/commercial/*              → Commercial subsite (MOVED from root)
/connect/*                 → Connect subsite (unchanged path)
/personal-and-property/*   → Personal & Property subsite (unchanged path)
```

```
/site
  /app
    /page.tsx                    → new homepage
    /commercial/                 → route group, was app/(commercial)/ at root previously
    /connect/
    /personal-and-property/
  /collections
  /globals
  /components
    HomeHero.tsx
    ChannelCards.tsx             → the three-card section
    WhyWeExist.tsx
    SubsiteNav.tsx               → shared nav shell used by all three subsites
    StickyChannelDial.tsx        → renamed/rebuilt ChannelSwitcher equivalent
    Footer.tsx
  /payload.config.ts
  /redirects.ts                  → the Phase 1 redirect map, see §3
```

Each subsite route group applies its own accent theme (§4) and its own nav state, sharing the same component library. Switching channels is always a same-origin route change — never a cross-domain redirect — preserving the domain's accumulated SEO authority.

---

## 3. Redirect map (critical — see `plan.md` §3 for why)

Every existing Commercial URL currently resolving at `/` moves to `/commercial/`. This must be implemented as permanent (301) redirects in `next.config.js` (`redirects()` function) or Vercel's `vercel.json`, **not** left as 404s or silently unhandled.

Minimum required mappings (expand against the full old sitemap before Phase 1 sign-off — this list is a starting skeleton, not exhaustive):

```
/                              → /commercial/            (unless / is claimed by the new homepage — see note)
/about.html                    → /commercial/about/
/apply.html                    → /commercial/apply/
/business-loans.html           → /commercial/business-loans/
/business-line-of-credit.html  → /commercial/business-line-of-credit/
/business-term-loans.html      → /commercial/business-term-loans/
/charge-card.html               → /commercial/charge-card/
/chattel-mortgage.html         → /commercial/chattel-mortgage/
/comparison-report.html        → /commercial/comparison-report/
/contact.html                  → /commercial/contact/
/credit-guide.html             → /commercial/credit-guide/
/equipment-calculator.html     → /commercial/equipment-calculator/
/export-finance.html           → /commercial/export-finance/
/finance-lease.html            → /commercial/finance-lease/
/fund-an-invoice.html          → /commercial/fund-an-invoice/
/invoice-finance.html          → /commercial/invoice-finance/
/merchant-cash-advance.html    → /commercial/merchant-cash-advance/
/operating-lease.html          → /commercial/operating-lease/
/overdraft.html                → /commercial/overdraft/
/privacy.html                  → /commercial/privacy/
/r-and-d-funding.html          → /commercial/r-and-d-funding/
/repayment-calculator.html     → /commercial/repayment-calculator/
/second-mortgage.html          → /commercial/second-mortgage/
/self-employed-home-loan.html  → /commercial/self-employed-home-loan/  (or /personal-and-property/ — the old plan flagged this page's channel placement as an open call; re-decide it here, don't default silently)
/supply-chain-funding.html     → /commercial/supply-chain-funding/
/terms.html                    → /commercial/terms/
/trade-finance.html            → /commercial/trade-finance/
```

**Important note on `/` itself:** `/` cannot both redirect to `/commercial/` and serve the new homepage. The new homepage *is* the content at `/` going forward — there is no redirect needed for the root URL itself, only for the pages that used to live directly under it. Double-check this distinction doesn't get lost when the redirect table is implemented.

- Redirects must be one-to-one — no chains (A→B→C). Test every entry in this table against the live `oldsite/` file list before calling Phase 1 done; the list above was hand-derived from `oldsite/commercial/*.html` and should be reconciled against the actual file inventory, not assumed complete.
- Connect and Personal & Property URLs are unchanged — no redirects needed for those two channels.

---

## 4. Design tokens

Carried forward unchanged from the previous build's `tokens.md` — these values are correct for this pivot and should not be reinvented:

```css
--navy: #001C44;
--navy-blue: #1C1998;
--navy-deep: #000C22;

--skyblue: #54B4F6;
--skyblue-soft: #EAF4FE;

--peach: #FF5D5C;
--peach-soft: #FFF0F0;

--gold: #FBB766;
--gold-soft: #FFF7EC;

--success: #10B981;
--bg-soft: #F5F8FC;
```

### Per-channel accent (unchanged)

| Channel | Primary | Accent |
|---|---|---|
| Commercial | `--navy` / `--navy-blue` | `--skyblue` |
| Connect | `--gold` | `--navy` |
| Personal & Property | `--peach` | `--navy` |

**Homepage itself uses the shared base only** (navy on white) — it does not carry any single channel's accent color, since it's neutral by design. Each of the three cards on the homepage may use its *own* channel's accent as a small detail (icon color, hover state) to preview which subsite it leads to, without tinting the whole homepage.

### Typography (changed from brand guidelines — flagged, not silent)

- **Headings:** Work Sans, weights 700–900. Unchanged from brand guidelines.
- **Body/UI text:** **DM Sans**, weights 400/500. **This replaces Roboto as specified in `Trade Funding — Brand Guidelines.pdf`.** Matt verbally approved this for the website specifically, on the basis that Roboto's brand-guideline status only really applies to the site today, and updating the guidelines document is a small follow-up rather than a blocker. **Action item, not yet done: get the actual brand guidelines PDF updated to reflect DM Sans, or get written confirmation this stays a site-only exception.** Don't let this stay a verbal-only decision.
- Display headline size: `clamp(2.4rem, 4.4vw, 4.2rem)` — carried forward from prior spec, still appropriate for the shorter homepage hero.

### Layout

- Breakpoints: Desktop ≥1240px, Tablet 900–1239px, Mobile <900px.
- Touch targets: 44×44px minimum, all interactive elements — this matters more now that the homepage's nav-hover interactions (if the Products mega-menu ships, see `plan.md` open decision #2) need a real tap equivalent on mobile, not just a hover fallback.

---

## 5. Homepage component spec

See `homepage.md` for the full content/structure detail. Technical notes only here:

- **`HomeHero`**: headline + subhead only, no calculator, no imagery per the Carta/Prospa direction in `claude.md`. Plain white/`--bg-soft` background.
- **`ChannelCards`**: three equal-width cards (stack on mobile). Each card: icon (from that channel's existing icon set — reuse SVGs from `oldsite/` assets, they don't need to be redrawn), label, one-line description, "Explore →" link styled in that channel's accent color. Cards must have equal DOM weight — same markup structure, same heading level, no visual hierarchy implying one channel outranks another on this page specifically (subsite-level weighting per the 2+1 model happens elsewhere, not here).
- **`WhyWeExist`**: text-forward section, below the cards. Longer-form copy is acceptable here specifically because it's positioned *after* the scannable content — mirrors the Prospa FAQ-placement pattern from `claude.md` §3.
- **`StickyChannelDial`**: renders only on subsite pages (`/commercial/*`, `/connect/*`, `/personal-and-property/*`), not on the homepage. Appears once scrolled past that subsite's own hero. Shows current channel (active state, tinted to that channel's accent) plus the other two channels plus an explicit Home icon/link back to `/`. This is a rebuild of the concept behind the old `ChannelSwitcher` component — same behavioral spec (always-three-visible, active state, icon+label desktop / icon-only mobile), new implementation, not ported code.

---

## 6. Payload collections & globals

Broadly unchanged in shape from the prior build, adjusted for the new homepage:

**`pages`**
- `title`, `slug`
- `channel` (select: `home` / `commercial` / `connect` / `personal-and-property`) — `home` is a new value, since the homepage is no longer just Commercial's root.
- `hero` (group: eyebrow, headline, subhead, CTA link/label) — homepage's hero uses this same shape, just without a calculator field.
- `parent` (relationship, breadcrumbs/grouping only, no URL effect)

**`channelCards`** (new collection or global — homepage-specific)
- `channel` (select: commercial / connect / personal-and-property)
- `icon` (media reference)
- `label`, `description`, `ctaLabel`, `ctaHref`

**Globals**
- `siteNav` (shared nav shell config used by homepage + all subsites)
- `redirects` (if managing the Phase 1 redirect table via CMS rather than hardcoded `next.config.js` — decide this explicitly, don't let it default to whichever is easiest to ship first)

---

## 7. Deployment

- One Vercel project, this repo.
- Environment variables: reuse existing `.env.local` structure where the underlying service (Payload DB, Blob storage, Turnstile keys) is unchanged; rotate/reconfirm any secret that was tied to the old deployment if the Vercel project itself is being recreated rather than reused.
- Preview deployments for every phase gate (Phase 3 wireframe, Phase 4 homepage, Phase 5 subsites, Phase 7 stakeholder review) — don't wait until Phase 9 for the first real Vercel URL Matt sees.
- Never run an actual production deploy without asking first in chat — carried forward from the old `CLAUDE.md` hard rule, still correct.

---

## 8. Accessibility & performance baseline

- WCAG contrast ≥4.5:1 for all text, checked per-channel-accent — Connect's gold-dominant surfaces need explicit re-checking since gold is a lighter primary than the old navy-dominant Connect design.
- Every hover-only interaction (nav mega-menu, card hover states) needs a working tap/focus equivalent — no mouse-only affordances.
- Every `<img>`/`next/image` needs explicit width/height or aspect-ratio — carried forward as a hard rule from the prior build's audit findings.
- Core Web Vitals baseline captured for the new homepage specifically at Phase 8, since it's genuinely new and has no prior baseline to compare against.

---

## 9. What this build explicitly does not do

- Does not port any CSS, component code, or markup from `oldsite/` verbatim — `oldsite/` is a content/product-data reference only, per the "full rebuild" decision in `plan.md`.
- Does not resolve the homepage CTA label/destination or the Products-nav-hover matching-tool question (`plan.md` §2, open decisions) — those need Matt's input before implementation.
- Does not change Connect's or Personal & Property's URLs — only Commercial's root-level URLs move.
