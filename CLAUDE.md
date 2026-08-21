# Research Notes — Inspiration Sites (Shift, Carta, Prospa)

**Status: v1.** This is the research handoff behind the design direction locked in `plan.md` §1 and the visual rules in `buildspec.md`. Two of the three sites below were checked live; one was not (see note).

---

## Method note (read this before trusting the detail level below)

- **Shift (shift.com.au)** and **Prospa (prospa.com)** were checked live — the structural notes below are pulled directly from their current published pages.
- **Carta (carta.com/sg/en)** could not be accessed live in this session (the browsing tool was denied permission for that domain). The notes on Carta below are reconstructed from what Matt and Jana already said about it directly in the shared transcript and chat log — "super clean," "super cool," plain typography, less-is-more, professional rather than rounded/soft fonts. Treat the Carta section as **directional, not verified**, and re-check the live site yourself before treating any specific layout claim about Carta as fact.

---

## 1. Shift (shift.com.au) — the "three audience cards" reference

**What Matt likes here specifically:** the hero's three-way audience split (Brokers / Suppliers / Businesses) is structurally the closest existing thing to what he wants for Trade Funding's homepage.

**Confirmed structure (from live site):**
- Header: logo, primary nav (Products / Brokers / Suppliers / About us / Contact us), Login utility link — clean, single-row.
- Hero headline: **"Made for business"** — short, declarative, sits above a one-sentence subhead ("Credit and payment solutions for Australian businesses to trade, pay and access funds").
- Immediately below the hero: **three audience cards**, each with a short label + one-line description + "Learn more" link:
  - *Brokers* — with SME clients
  - *Suppliers* — with business customers
  - *Businesses* — needing finance
- Below that: a **product grid** (Business Overdraft, Equipment Line, Asset Finance, Trade Account), each with icon-style label + one-line benefit + "Learn more."
- Social proof section ("Their stories") — real named customer case studies with photos, rotating carousel.
- Trust stat line: "Supporting the growth aspirations of more than 30,000 Australian businesses."
- Footer: full product list, resources, contact — the "everything lives somewhere, just not on the homepage" pattern.

**What this validates for Trade Funding:** the "three audience cards directly under a short master statement" pattern is exactly what Matt is asking for — this isn't a novel idea, it's a proven B2B-lending pattern. The one meaningful difference: Shift's three cards are three *audience types* (Brokers/Suppliers/Businesses) feeding into **one shared product set** below. Trade Funding's three cards are three *separate product/service tracks* (Commercial/Connect/Personal & Property), each with its own distinct subsite. That's a bigger structural split than Shift's — which is exactly why Matt's "why we exist" section matters more for Trade Funding than it does for Shift: Shift doesn't need to explain why three audiences share one product set, but Trade Funding does need to explain why three different tracks are one company.

**What to leave behind:** Shift's homepage is long and product-grid-heavy immediately below the fold. Matt has been explicit that Trade Funding's homepage should stay short — hero, three cards, one "why" section, done. Don't import Shift's product-grid density onto the new homepage; that belongs on the Commercial subsite instead.

---

## 2. Carta (carta.com/sg/en) — the "plain heading style" reference

*(Directional only — see method note above.)*

**What Matt likes here specifically (per his own description in the transcript):** plain, professional typography over a photo- or gradient-heavy hero. He contrasted this directly against a version of the Trade Funding mockup that felt "vioded" (his phrasing for vibe-coded) — Jana's read on *why* Carta looks more professional was specifically **typeface choice and restraint**, not layout complexity: a more vertical/geometric sans rather than a rounded one, set on a plain white field with minimal ornamentation.

**What this validates for Trade Funding:** the "plain white background, navy headline, minimal color until the accent kicks in" direction already locked in `tokens.md`'s per-channel accent system is the right instinct — Carta is cited as evidence that restraint reads as *more* credible in a financial-services context, not less. This directly supports the Work Sans (headings) + DM Sans (body) typography decision: DM Sans was chosen specifically because its rounder, more geometric letterforms contrast well against Work Sans's heavier display weights without competing — the same "let typography carry the polish" principle Carta was cited for.

**Caveat to carry forward:** because this section wasn't independently verified, don't cite specific Carta layout details (grid structure, spacing values, exact component patterns) as fact when briefing a designer or Claude Code — cite the *principle* (typographic restraint, plain surfaces) which is well-evidenced by the transcript, not specific pixel-level claims about Carta's actual page.

---

## 3. Prospa (prospa.com) — the "plain aesthetic + hover effects" reference

**What Matt likes here specifically:** the overall clean/plain aesthetic and interactive hover treatments.

**Confirmed structure (from live site):**
- Hero: **"Take your business further"** — short headline, one-sentence subhead, two CTAs side by side ("Get started" primary, "Talk to a specialist" secondary — a pattern worth noting since Trade Funding's own CTA wording is still an open decision per `plan.md` §2).
- Immediately below: **"One platform — A range of funding solutions"** section, presented as a **product comparison strip** (Small Business Loan / Business Loan Plus / Line of Credit), each a card with a one-line benefit and "Explore" link, plus a lighter-weight "Compare products" utility link and a "already know what you're after? Apply now" shortcut for returning/decided visitors.
- A second, near-identical pattern repeats for **payments solutions** (Business Account / Pay by Card / Tap to Pay) — Prospa uses this repeated card-grid pattern consistently across different product families rather than inventing a new layout per section.
- Trust/credibility stat block: "#1 online lender," "14+ years," "$5B small business loans," "50K+ businesses funded" — stated as bare numbers, no supporting paragraph, directly in line with Matt's "people read captions, not paragraphs" instinct.
- FAQ accordion near the bottom — dense, text-heavy, but deliberately placed *after* the visual/scannable content, for the minority of visitors who do want detail. This is a strong direct match for what Matt described wanting for the "why we exist" section: something for "the more detailed people," positioned after the fast/visual path, not competing with it.

**What this validates for Trade Funding:**
1. The repeated card-grid pattern (icon/label + one-liner + link) used for *both* products and payments on Prospa is the same shape Matt is asking for with the three Trade Funding cards — reinforces that this is a well-worn, low-risk pattern, not a novel design bet.
2. The "bare stat block, no paragraph" trust-signal pattern directly supports Matt's instruction to keep everything scannable and push explanatory depth into a clearly separate, later section (Trade Funding's "why we exist," Prospa's FAQ accordion) — both sites solve the same "some people want depth, most don't" problem the same way: sequence, not simultaneous density.
3. A **shortcut for decided visitors** ("already know what you're after? Apply now") is a pattern Trade Funding doesn't currently have anywhere in the plan — worth raising with Matt as a candidate for the homepage or the Commercial subsite hero, since it directly serves the highest-intent segment of traffic without adding visual weight for everyone else.

---

## 4. Cross-cutting takeaways applied to `plan.md` / `buildspec.md`

| Pattern seen in research | Where it shows up in this project |
|---|---|
| Short master headline + subhead, no long copy in the hero | Homepage hero spec, `homepage.md` §1 |
| Card grid: icon/label + one-liner + "Explore"/"Learn more" link, repeated consistently | The three-card section, `homepage.md` §2 |
| Explanatory/trust depth sequenced *after* the scannable content, not mixed into it | The "why we exist" section placement, `homepage.md` §3 |
| Bare stat blocks over descriptive paragraphs for trust signals | Recommended treatment for any trust/proof content on the homepage — flag to Matt as a copy-style guardrail for Phase 6 |
| Plain, typography-led surfaces over photography/gradients in the hero | Locked in `tokens.md` (Work Sans + DM Sans, minimal color until accent), reinforced by both Carta and Prospa references |
| A dedicated shortcut for high-intent/returning visitors | **Not yet in the plan** — flagged as a candidate open decision, not yet built or approved |
