# Trade Funding — Design Token System

**Status:** Spec only. No HTML/CSS touched.
**Source of truth for base tokens:** `connect/docs/design-spec.md` §4 ("Brand system"), described there as "Inherited verbatim from `vendor-deck/index.html` and locked per the **TF Brand Tokens** memory. No deviation."
**Governing plan section:** `plan.md` → Phase 1 — Channels & Branding.

This file defines the **one shared base token set** used by all three channels (Commercial, Connect, Personal & Property), plus the **per-channel accent overrides** that give each pillar its own identity on top of that shared base — per Matt's "one underlying brand" instruction. Nothing here invents a new base token; the base section below is copied as-is from the Connect design spec.

---

## 1. Shared base tokens (verbatim, do not modify)

These are reused across **all three channels**. This is the full existing system from `connect/docs/design-spec.md` §4 — no new base tokens invented, no values changed.

### 1.1 Colour tokens

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

/* Ink scale */
--ink-900: /* darkest text */;
--ink-600: /* secondary text */;
--ink-400: /* muted text */;
--ink-200: /* faint / disabled text */;

--bg-soft: #F5F8FC;
```

> Note: the design-spec source names an "Ink scale 900/600/400/200" without listing hex values. Carry the four ink steps forward as named tokens; pull the literal hex values from `commercial/shared-styles.css` or `connect/styles/main.css` when this spec is implemented in code — do not invent hex values here.

### 1.2 Type

- **Headings:** Work Sans, weights 700–900, letter-spacing `-0.025em` on display sizes
- **Body:** Roboto, weights 400/500
- **Display headline:** `clamp(2.4rem, 4.4vw, 4.2rem)`
- **Display headline (xl variant):** `clamp(3rem, 5.2vw, 5rem)`

### 1.3 Spacing / layout

- **Breakpoints:**
  - Desktop: ≥1240px
  - Tablet: 900–1239px
  - Mobile: <900px
- Multi-column grids collapse to a single column below 900px
- Touch-target minimum: 44×44px on all interactive elements

### 1.4 Shared component class names

These class names are shared across channels; only the *tint they resolve to* changes per-channel via the accent override (§2).

- `.s-eyebrow`, `.s-headline`, `.s-subhead`, `.s-body`, `.s-caption`
- `.badge--skyblue` · `.badge--peach` · `.badge--gold` · `.badge--success` · `.badge--light` · `.badge--navy`
- `.divider`, `.divider--peach` · `.divider--gold` · `.divider--success` · `.divider--white` · `.divider--center`
- `.reveal` with stagger delays: `.delay-1` through `.delay-5`
- Card surfaces: `--shadow-soft`, `--shadow-lg`

### 1.5 Shared motion / behaviour tokens

- Reveal animation: IntersectionObserver, `rootMargin: -10%`; content fades in + rises 16px; staggered 100ms delays; runs once per element
- Respect `prefers-reduced-motion`: disables reveal animations and any number-tween effects sitewide

---

## 2. Per-channel accent overrides

🟡 **PLACEHOLDER note carried from plan.md:** the Personal & Property and Connect assignments below are locked per the color values supplied for this task; treat as the working default until design sign-off. This is a token-swap, not a rebuild, if it changes.

### 2.1 Commercial — stays as-is

Commercial is the hero channel and keeps the existing primary palette unchanged:

```css
--tf-commercial-primary: var(--navy);      /* #001C44 */
--tf-commercial-primary-alt: var(--navy-blue); /* #1C1998 */
--tf-commercial-accent: var(--skyblue);    /* #54B4F6 */
--tf-commercial-accent-soft: var(--skyblue-soft); /* #EAF4FE */
```

No change from the current `commercial/shared-styles.css` / `product-styles.css` values — Phase 4 extracts these into tokens, it does not redesign them.

### 2.2 Connect — yellow / gold primary, navy accent

```css
--tf-connect-primary: var(--gold);        /* #FBB766 */
--tf-connect-primary-soft: var(--gold-soft); /* #FFF7EC */
--tf-connect-accent: var(--navy);         /* #001C44 */
--tf-connect-accent-alt: var(--navy-blue); /* #1C1998 */
```

Gold (#FBB766) becomes Connect's **primary** — its dominant section/background/CTA color — with navy as the accent (dividers, secondary badges, ink-on-gold contrast details). This is a bigger shift than a simple accent swap: it inverts Connect's existing "dark section = navy, accent = gold/peach" rhythm (design-spec §4) to "dark/dominant section = gold, accent = navy." When Phase 4/5 touches the code, this means re-checking contrast on any text or icon currently set as navy-on-dark — navy text/detailing needs to sit *on* gold surfaces now, not the reverse, so verify the ≥4.5:1 contrast ratio (§12 of the design spec) still holds with the roles flipped. Connect's existing dual gold/peach accent use also narrows to gold-only — peach is reassigned to Personal & Property below, so no peach should remain anywhere in the Connect build.

### 2.3 Personal & Property — peach primary, navy accent

```css
--tf-personalproperty-primary: var(--peach);        /* #FF5D5C */
--tf-personalproperty-primary-soft: var(--peach-soft); /* #FFF0F0 */
--tf-personalproperty-accent: var(--navy);          /* #001C44 */
--tf-personalproperty-accent-alt: var(--navy-blue); /* #1C1998 */
```

Peach (#FF5D5C) is Personal & Property's **primary** color, with navy as the accent. This supersedes the Phase 1 placeholder in `plan.md` ("muted teal/green, unused across the two existing channels") — peach is available precisely because it's moving off Connect, and since Personal & Property is new-build there's no existing-page churn from picking it. As with Connect, since this is a new build there's no legacy contrast pairing to unwind — just design components peach-forward from the start, with navy carrying the same accent/detail role it plays for Connect.

### 2.4 Summary table

| Channel | Primary | Primary hex | Accent | Accent hex |
|---|---|---|---|---|
| Commercial | `--navy` / `--navy-blue` | `#001C44` / `#1C1998` | `--skyblue` | `#54B4F6` |
| Connect | `--gold` | `#FBB766` | `--navy` | `#001C44` |
| Personal & Property | `--peach` | `#FF5D5C` | `--navy` | `#001C44` |

Commercial is the one channel that keeps navy as its **primary**, since it's the hero and its existing identity is unchanged. Connect and Personal & Property both now lead with their own primary tint and use navy purely as the accent/detail color — this still satisfies "one underlying brand" (per plan.md) since navy runs through all three channels, but its *role* differs: base identity for Commercial, accent/grounding color for the other two.

---

## 3. Logo / lockup rule (per plan.md Phase 1)

- The core Trade Funding logo/mark stays present sitewide on every channel ("one underlying brand").
- Each pillar additionally gets its own landing-page identity built from its accent color above — this is a colour/tint distinction, not a separate logo system.
- Connect's mascot rule carries forward unchanged: Cashper mascot (hero watermark + footer mark) — per existing memory, never remove, on any channel it currently appears on.

---

## 4. What this file does not do

- Does not modify any `.css` or `.html` file — token values above are extracted from existing sources, not newly authored.
- Does not resolve the ink-scale hex values — those need pulling from the actual stylesheets before Phase 4 implementation.
- Does not decide the Commercial nav-label question (home icon vs. "Commercial" label) — that's a Phase 2 nav-spec item, not a token.
