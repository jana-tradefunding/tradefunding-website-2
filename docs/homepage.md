# Homepage Spec — Extracted from Matt's Direction

**Status: v1.** Every structural decision below is sourced directly from the 2026-08-21 sprint transcript and the shared mockup screenshot — not invented. Where Matt was explicitly unsure or undecided, that's called out rather than papered over. Cross-reference `plan.md` §1–§2 for the locked-vs-open decision split, and `claude.md` for why these patterns are proven (Shift/Prospa) rather than novel.

---

## 0. What the homepage is *for*

Not a landing page for any single product. It's a short, fast, brand-level directory: "here are the three ways we help business owners — pick yours." Per Matt: *"the homepage is a page which allows you to navigate to the [three]... it's literally just a small page... explain the value proposition of choice and the ability to compare... a holistic value prop."*

Everything on this page should pass Matt's own test, stated directly: *"private capital, intelligent, connected — that's about the max I reckon a brain spends... quickly looking at stuff."* If a section requires reading more than a caption to understand, it's in the wrong place on this page — push it to the "why we exist" section (§3) or off the homepage entirely.

---

## 1. Nav row + Hero

**Nav (single row, no two-tier header):**
- Logo, left.
- Center: `Products` / `Choice` (or `Guidance` — Matt was genuinely unsure which word, see note below) / `About`.
- Right: a CTA button. **Not "Get started"** — Matt was explicit this was Claude taking liberties in the original mockup and isn't the real CTA. Real label/destination is an open decision (`plan.md` §2, item 1).

> **Note on "Choice" vs. "Guidance":** Matt floated both words for the same nav item — a section that helps a confused visitor figure out *which* product/channel applies to them ("is this for me / my business / my customers?"). He was upfront he hadn't seen this pattern used elsewhere in the comparison-site space and wasn't sure it was even needed: *"I haven't really seen that used... it's just probably a question of whether we need that."* Treat this nav item, and the underlying matching-tool idea, as **unbuilt until confirmed** — don't default to building it just because it's in the mockup.

**Hero:**
- Master statement, big, short: **"Business capital, from every angle."**
- One-line subhead underneath (exact wording is an open decision — see `plan.md` §2, item 3). Matt's directional framing for what it should communicate: *"we help businesses either support the customers get funding themselves review the funding they've got or you know personally get money."*
- **No calculator in the hero.** It existed in the earlier mockup; Matt and Jana agreed to remove it and re-platform it onto the Commercial subsite instead, where it's contextually relevant to the compare/apply flow. Homepage hero is copy-only.
- **No photography or gradient background.** Plain white/`--bg-soft`, matching the Carta/Prospa-influenced "less is more" direction (see `claude.md` §2–§3). Explicitly rejected the Shift-style photo-behind-hero treatment during the call.
- Font: Work Sans for the headline (unchanged brand font), but Matt specifically flagged the *current* Work Sans cut as reading "too vertical" against a bold heading and asked for something "a bit more roundish" for body/UI text — resolved as the DM Sans decision documented in `buildspec.md` §4. This does not change the *headline* typeface, only body/UI text.

---

## 2. Three-card section (the core of the homepage)

Directly under the hero, per the screenshot:

| Card | Icon | Label | One-liner | Link |
|---|---|---|---|---|
| 1 | Bank/building icon | **Commercial** | "Fund my business" | Explore → `/commercial/` |
| 2 | Handshake/connect icon | **Connect** | "Funding for my customers" | Explore → `/connect/` |
| 3 | House/dollar icon | **Personal and property** | "Business owner funding" | Explore → `/personal-and-property/` |

**Equal visual weight — this is deliberate, not a placeholder.** Even though Connect is a lower-recognition, partner-facing channel and Personal & Property is customer-facing like Commercial (the "2+1" split described in the original shared chat), Matt was explicit that on *this specific page*, all three get identical card treatment: same size, same icon style, same copy length, same CTA style. The audience-weighting between the three shows up in each subsite's own depth and in nav prominence elsewhere — not here. Direct quote: *"when that... site... only got three icons at the top and it says... fund me, my business or... the three things... people would quickly relate to that."*

Each card's one-liner should answer "what do I get" in the same short, parallel grammar across all three — this directly solves the "no one knows what Connect is" recognition problem Matt named, by explaining it in context rather than relying on the name alone: *"funding for my customers... is kind of cool... personal property arguably explains itself, but... this is kind of a clear way to get to where you want."*

**Hover/interaction:** each card should preview its destination channel's accent color (skyblue/gold/peach per `buildspec.md` §4) on hover/focus — small detail, not a full-card color wash, since the homepage itself stays neutral.

---

## 3. "Why we exist" section

Sits directly below the three cards. This is where the more detailed, purpose-driven explanation lives — explicitly *not* competing with the fast/scannable path above it. Matt's own framing for this section:

> *"For the more detailed people... why we're on this journey, why we're doing this... we've got to try and work out how to break a customer down really really quickly to go 'I get what you do and I value that.'"*

Content direction:
- Company "why" — the transparency/choice/access story already established in the brand guidelines (ghost mascot, "nothing scary," "you can see right through us").
- Should read as one cohesive narrative across all three channels — reinforcing that Commercial, Connect, and Personal & Property are one company's answer to different funding moments, not three unrelated products bolted together.
- Longer-form copy is acceptable *here specifically* — same principle as Prospa's FAQ placement (`claude.md` §3): sequence depth after scannable content, don't mix them.

---

## 4. Sticky channel dial (NOT on the homepage itself)

The screenshot shows a "sticky nav dial" below the fold, but per the transcript this only activates **inside a subsite**, once scrolled past that subsite's own hero — it is not a homepage element. On the homepage, the three-card section (§2) *is* the navigation; there's no need for a persistent dial since the visitor hasn't chosen a channel yet.

Behavior once inside a subsite (e.g., `/commercial/`):
- Appears in the header row once the visitor scrolls past that subsite's hero.
- Always shows all three channels plus an explicit way back to the homepage (`/`) — not just the two channels the visitor isn't currently on.
- Current channel gets an active-state treatment tinted to its own accent color.
- Full spec: `buildspec.md` §5, component `StickyChannelDial.tsx`.

---

## 5. What's explicitly NOT on the homepage

- No calculator (moved to Commercial subsite).
- No product-level detail (business loan types, Connect vendor mechanics, P&P loan types) — that's subsite content.
- No lender logos, no detailed trust badges beyond what fits the "why we exist" section's tone.
- No FAQ accordion — that pattern (seen on Prospa) belongs on subsites where it answers product-specific questions, not on a brand-level directory page.

---

## 6. Copy tone guardrails (apply when Phase 6 writes real copy)

Direct from Matt, and worth repeating verbatim because it's an unusually clear instruction:

> *"98% of people don't read... it's like 2% of the population that are super detailed that read through... people painstakingly spend all this time writing crap that no one reads... it's really got to be more visual and super simple."*

Practical guardrails this implies:
- Headlines and card labels: aim for what's readable in a single glance — Matt's own benchmark is roughly a 3–4 word phrase ("private capital, intelligent, connected" as his example of the ceiling).
- One-liners under cards: one short sentence, no compound clauses.
- Any copy longer than a sentence belongs in the "why we exist" section, not above it.

---

## 7. Open items still needing Matt's input before this can be called final

Repeated here from `plan.md` §2 for convenience — do not resolve these unilaterally:

1. CTA button label + destination (nav row).
2. Whether the "Products" nav-hover matching tool ships at all.
3. Final hero headline/subhead wording.
4. Final per-card CTA copy ("Explore →" is a mockup placeholder).
