# Trade Funding — Design Token System

**Status:** Spec only. No HTML/CSS touched.
**Source of truth:** `buildspec.md` §4 ("Design tokens") — values carried forward unchanged from the previous build's `tokens.md`, per that section's own note: "these values are correct for this pivot and should not be reinvented."
**Governing plan section:** `plan.md` → Phase 1 — Design Tokens & Brand Deviation Sign-off.
**Prompt:** Phase 1, Prompt 1.1 (`prompts.md`).

This is a fresh rebuild of `tokens.md`, not an edit of the old one — the old file was scoped to the previous 3-channel-at-root architecture. This version reflects the current homepage-first site architecture: a neutral homepage at `/` with three subsites hanging off it.

---

## 0. Site architecture (for context — not a token)

```
/                          → Homepage (neutral, brand-level entry point)
/commercial/*              → Commercial subsite
/connect/*                 → Connect subsite
/personal-and-property/*   → Personal & Property subsite
```

The homepage is not a fourth channel and carries no channel accent of its own — see §3.

---

## 1. Shared base tokens (verbatim from `buildspec.md` §4 — do not modify)

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
--bg-soft: #F5F8FC;
```

No ink-scale (900/600/400/200) hex values are listed in `buildspec.md` §4 — that gap carries forward from the old spec and is still unresolved. Pull those literal values from the actual stylesheets when this is implemented in code; do not invent them here.

### 1.2 Typography

**This section contains a flagged deviation from the brand guidelines — not a silent change.**

- **Headings:** Work Sans, weights 700–900. Unchanged from brand guidelines.
- **Body / UI text:** **DM Sans**, weights 400/500. **This replaces Roboto** as specified in `Trade Funding — Brand Guidelines.pdf`.
  - Matt verbally approved this for the website specifically. Rationale per `buildspec.md` §4: the current Work Sans cut reads "too vertical" against a bold heading, and Roboto's brand-guideline status today really only applies to the site.
  - **Open action item, not yet done:** get the brand guidelines PDF formally updated to DM Sans, or get written confirmation this stays a site-only exception. Do not let this remain a verbal-only decision (see `prompts.md` Prompt 1.2 — the follow-up note to Matt).
- **Display headline:** `clamp(2.4rem, 4.4vw, 4.2rem)` — carried forward unchanged, still appropriate for the shorter homepage hero.

### 1.3 Spacing / layout

- **Breakpoints:**
  - Desktop: ≥1240px
  - Tablet: 900–1239px
  - Mobile: <900px
- Touch-target minimum: 44×44px on all interactive elements — matters more now that homepage nav-hover interactions (if the Products mega-menu ships) need a real tap equivalent, not just hover.

---

## 2. Per-channel accent tokens

Unchanged from `buildspec.md` §4 — no new colors introduced, no values altered.

### 2.1 Commercial

```css
--tf-commercial-primary: var(--navy);          /* #001C44 */
--tf-commercial-primary-alt: var(--navy-blue); /* #1C1998 */
--tf-commercial-accent: var(--skyblue);        /* #54B4F6 */
--tf-commercial-accent-soft: var(--skyblue-soft); /* #EAF4FE */
```

### 2.2 Connect

```css
--tf-connect-primary: var(--gold);         /* #FBB766 */
--tf-connect-primary-soft: var(--gold-soft); /* #FFF7EC */
--tf-connect-accent: var(--navy);          /* #001C44 */
--tf-connect-accent-alt: var(--navy-blue); /* #1C1998 */
```

### 2.3 Personal & Property

```css
--tf-personalproperty-primary: var(--peach);          /* #FF5D5C */
--tf-personalproperty-primary-soft: var(--peach-soft); /* #FFF0F0 */
--tf-personalproperty-accent: var(--navy);            /* #001C44 */
--tf-personalproperty-accent-alt: var(--navy-blue);   /* #1C1998 */
```

### 2.4 Summary table

| Channel | Primary | Primary hex | Accent | Accent hex |
|---|---|---|---|---|
| Commercial | `--navy` / `--navy-blue` | `#001C44` / `#1C1998` | `--skyblue` | `#54B4F6` |
| Connect | `--gold` | `#FBB766` | `--navy` | `#001C44` |
| Personal & Property | `--peach` | `#FF5D5C` | `--navy` | `#001C44` |

---

## 3. Homepage tokens (new — not present in the old channel-only `tokens.md`)

Per `buildspec.md` §4: **"The Homepage itself uses the shared base only** (navy on white) — it does not carry any single channel's accent color, since it's neutral by design."

- Background: white / `--bg-soft`
- Heading color: `--navy`
- No hero photography or gradient — plain background per the Carta/Prospa "less is more" direction (`homepage.md` §1).
- **Three-card section exception:** each of the three homepage cards may preview its *own* destination channel's accent (skyblue / gold / peach) as a small hover/focus detail — icon tint or underline, not a full-card color wash. This is the only place a channel accent appears on the homepage, and it's scoped to interaction state, not the resting page background.

---

## 4. What this file does not do

- Does not modify any `.css` or `.html` file — all values above are carried forward from `buildspec.md` §4, not newly authored.
- Does not resolve the ink-scale hex values — still pending, pull from actual stylesheets before implementation.
- Does not resolve the Roboto → DM Sans brand-guidelines sign-off — that's a separate note to Matt (`prompts.md` Prompt 1.2), not a token decision this file can close on its own.
- Does not touch routing, redirects, or component structure — see `buildspec.md` §2–§3 and `homepage.md` for those.
