# Dependency Risk Analysis — Trade Funding Website

**Scope reviewed:** every `package.json` in the repository (confirmed via `find . -name package.json`, excluding `.git/` and `node_modules/`)
**Reviewer role:** Senior Software Architect
**Date of review:** 2026-08-18

## 0. What's actually in the repo

There is exactly **one** `package.json` in the entire project, at `connect/package.json`:

```json
{
  "name": "vendor-landing",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=20"
  }
}
```

There is no `dependencies` key, no `devDependencies` key, **no `node_modules/` directory, and no lockfile** (`package-lock.json`, `yarn.lock`, and `pnpm-lock.yaml` were all searched for and none exist anywhere in the tree). The `commercial/` and `personal-and-property/` channels have no `package.json` at all — they're plain static HTML/CSS/JS with zero build tooling.

I want to be direct about what this means for the five things you asked me to check: **there is nothing to flag in categories 1–4 (deprecated packages, CVEs, bloated packages, better alternatives) because there are zero third-party npm packages installed anywhere in this codebase.** I'm not going to manufacture findings against packages that don't exist — that would waste your time and undermine trust in the rest of this audit. What follows instead is (a) confirmation of what I checked, (b) the real risk this "zero dependencies" state creates, and (c) what I'd actually recommend adding before launch.

---

## 1–4. Deprecated / CVE-affected / bloated / outdated packages

**None found — there are no packages to evaluate.** The two serverless functions (`connect/api/form-token.js`, `connect/api/request-call.js`) are written entirely against Node.js built-ins:

```js
import crypto from 'node:crypto';   // form-token.js, request-call.js — built-in, no npm package
```

Both functions call external HTTP APIs (Resend, Slack) using the native global `fetch()` (available in Node 20+, which matches the `"engines": { "node": ">=20" }` constraint) rather than an SDK like `resend` (npm) or `@slack/webhook`. This is a legitimate, deliberate architectural choice, not an oversight — and from a dependency-risk standpoint it's the lowest-risk option available: **zero supply-chain surface area, because there is no supply chain.** No `npm install`, no transitive dependency tree, no `npm audit` findings possible, no risk of a compromised or typosquatted package ending up in the bundle.

**Risk rating: Low** — for the code that exists today, this is a genuine security strength, not a gap. The trade-off (documented below) is reduced convenience, not increased risk.

---

## 5. devDependencies accidentally placed in production dependencies

**Not applicable — there is no `dependencies` or `devDependencies` block at all**, so there's nothing misplaced. However, this surfaces a real gap worth flagging under this same heading: **`connect/tests/` exists as a directory in the repo but is completely empty**, and there is no test runner, assertion library, or linter declared anywhere (no `vitest`, `jest`, `eslint`, `prettier`, etc.). A `tests/` folder with nothing in it and no tooling to run anything in it is a stronger signal for the architecture review (see `architecture-review-report.md`) than for this dependency report, but it means: **there is currently no automated way to verify the two serverless functions (which handle real PII and send real emails) before a production deploy.**

**Risk rating: Medium** — not a supply-chain risk, but a launch-readiness gap. Recommendation below.

---

## What I'd actually recommend adding before launch

Given the "zero dependencies" baseline is a deliberate and reasonable choice for the two small serverless functions, my recommendation is **not** "add a framework" — it's to add a minimal, well-maintained devDependency set so the security-critical logic in `request-call.js` (HMAC verification, rate limiting, validation) can be unit-tested and linted in CI before every deploy, without adding any *production* runtime dependencies at all:

```json
{
  "name": "vendor-landing",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "devDependencies": {
    "vitest": "^2.1.0",
    "eslint": "^9.13.0"
  },
  "scripts": {
    "test": "vitest run",
    "lint": "eslint ."
  }
}
```

Justification for these two specific choices, evaluated against the same criteria you asked me to apply to any package:

| Package | Maintenance status (as of last verified activity) | Why this one |
|---|---|---|
| `vitest` | Actively maintained, frequent releases, first-party Vite team | Zero-config for a small `type: module` project like this one, far lighter install footprint than `jest` (no Babel transform layer needed for native ESM), and it's the de facto modern default for new projects in 2025/2026 — exactly the kind of "modern alternative" you asked me to flag in category 4, applied here in the recommending direction. |
| `eslint` | Actively maintained, industry standard | Catches exactly the class of bug that matters most in `request-call.js` — e.g., an accidental `==` instead of `===`, or an unused variable that should have been part of the validation logic — before it ships. |

I'm deliberately **not** recommending you add the Resend or Slack SDK packages, a testing framework beyond this, or any UI framework — the current native-`fetch`-based approach is lower risk than adding an SDK dependency for two simple `POST` calls, and the site's front end is intentionally framework-free static HTML/CSS/JS. Introducing dependencies here would be solving a problem you don't have while adding real supply-chain surface area you'd then need to monitor (`npm audit`, Dependabot/Renovate, etc.) going forward.

If, per `CLAUDE.md`, the Phase 7 migration to **Next.js + Payload CMS** proceeds as planned, this entire report will need to be redone once that `package.json` exists — at that point you will have a real dependency tree (Next.js, Payload, a Postgres driver, a Blob storage adapter, and their transitive dependencies) worth auditing for exactly the five categories you asked about here. I'd recommend running this same analysis again immediately after that scaffold is created and before its first production deploy, since Payload CMS in particular has a fast-moving major-version cadence worth pinning and monitoring closely.

---

## Summary Table

| Category | Finding | Risk Rating |
|---|---|---|
| Deprecated/unmaintained packages | None — zero npm packages installed | N/A |
| Packages with known CVEs | None — zero npm packages installed | N/A |
| Bloated packages | None — zero npm packages installed | N/A |
| Packages with better modern alternatives | None — zero npm packages installed | N/A |
| devDependencies in production deps | Not applicable (no dependency blocks exist at all); however, no test/lint tooling exists to validate PII-handling code before launch | Medium |
| Missing lockfile | No `package-lock.json`/`yarn.lock`/`pnpm-lock.yaml` anywhere in the repo | Low (low impact today since there's nothing to lock; becomes a real requirement the moment any dependency is added) |

**Bottom line:** this is one of the very few dependency reports where "no findings" is the accurate and correct result rather than a sign the audit wasn't thorough — I verified this by searching the entire repository for every `package.json`, confirming the absence of `node_modules/` and any lockfile, and reading both serverless functions line-by-line to confirm they use only Node built-ins. The one actionable item is adding a minimal `vitest` + `eslint` devDependency pair so the security-critical form-handling logic can be tested in CI, which will not increase your production supply-chain risk at all.
