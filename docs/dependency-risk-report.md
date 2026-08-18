# Dependency Risk Analysis — Trade Funding Site

**Scope:** the only `package.json` in the repository is `connect/package.json`. There is no root-level `package.json` — `commercial/` and `personal-and-property/` are pure static HTML/CSS/JS with no package manager involvement at all. This is worth stating up front because it changes what this report *can* flag: there is very little dependency surface to audit today, and that's a good thing.

```json
{
  "name": "vendor-landing",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "dependencies": {
    "@upstash/ratelimit": "^2.0.8",
    "@upstash/redis": "^1.38.2"
  },
  "scripts": {
    "build:includes": "node scripts/build-includes.mjs",
    "build:includes:check": "node scripts/build-includes.mjs --check"
  }
}
```

## Package-by-package review

### `@upstash/ratelimit` `^2.0.8`
- **Latest published version:** `2.0.8` (checked live against the npm registry) — the pin is exactly current, not behind.
- **Maintenance:** actively maintained by Upstash; a `2.1.0-rc` prerelease already exists upstream, so the maintainers are actively shipping.
- **Known CVEs:** none found.
- **Fit for purpose:** this is a small, single-purpose rate-limiting client built specifically for Upstash's REST API and serverless/edge runtimes — appropriately scoped for a Vercel serverless function, not oversized.
- **Risk Rating: Low.** No action needed.

### `@upstash/redis` `^1.38.2`
- **Latest published version:** `1.38.2` — again, exactly current.
- **Maintenance:** actively maintained, frequent release cadence.
- **Known CVEs:** none found.
- **Fit for purpose:** a lightweight REST-based Redis client purpose-built for edge/serverless (no persistent TCP connection, which matters for Vercel functions) — correct architectural choice, not bloated.
- **Risk Rating: Low.** No action needed.

## Categories checked, with findings

- **Deprecated / unmaintained packages (12+ months no update):** none — both packages are current.
- **Known CVEs:** none found in either package.
- **Bloated packages for their function:** none — both dependencies are minimal REST clients, already the lightest reasonable choice for this use case (no heavier ORM-style Redis client was pulled in, for example).
- **Better-maintained 2025/2026 alternatives:** none needed; Upstash's own SDKs are the standard choice for this exact stack (Vercel serverless + Redis-backed rate limiting), and Vercel KV — mentioned as a documented alternative directly in `connect/.env.example` — is a drop-in replacement, not an upgrade, so there's no compelling reason to switch.
- **devDependencies misplaced in production dependencies:** not applicable — there is no `devDependencies` block at all, and nothing in the two listed dependencies (a rate limiter and a Redis client) belongs there anyway; there's no linter, test runner, or build tool declared as a dependency to misplace.
- **Lockfile presence:** ⚠️ **Flagged separately below.**

## Finding — No lockfile committed
**Risk Rating: Medium**

I found no `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock` anywhere in `connect/` (or the repo). With caret ranges (`^2.0.8`, `^1.38.2`) and no lockfile, a fresh `npm install` on a new machine or in CI can silently pick up a newer minor/patch version than what was last tested — for two packages that are actively shipping releases (a `2.1.0-rc` already exists for `@upstash/ratelimit`), that's not a hypothetical drift risk.

**Justification for fix:** Given `CLAUDE.md`'s own note that "`connect/package.json` gets `npm test` / `npm run lint` added in Phase 7," a lockfile should be committed at the same time so CI and local installs are guaranteed reproducible before those scripts start running in an automated pipeline.

**The Fix:** Run `npm install` inside `connect/` and commit the resulting `package-lock.json`. Nothing in `.gitignore` currently excludes it (`connect/.gitignore` only excludes `node_modules/`), so this is a one-line addition.

## Finding — `scripts` section has no `test` or `lint` entry, and `connect/tests/` exists but is empty
**Risk Rating: Low (process gap, not a dependency risk per se, but adjacent)**

`connect/tests/` is present in the tree but contains zero files. `package.json`'s only scripts are `build:includes` and `build:includes:check`. This means there is currently no automated way to catch a regression in `_lib/form-token.js`'s HMAC logic or `_lib/origin-check.js`'s allow-list before it ships. `CLAUDE.md` already flags this as planned ("Phase 7 — `npm test` / `npm run lint` added ... see buildspec.md §13"), so this is confirmation that the plan is not yet executed rather than a new finding — call this out to whoever runs Phase 7 as still outstanding.

## Summary table

| Package | Current? | CVEs | Bloat | Rating |
|---|---|---|---|---|
| `@upstash/ratelimit` | ✅ latest | None | No | Low |
| `@upstash/redis` | ✅ latest | None | No | Low |
| *(no lockfile committed)* | — | — | — | **Medium** |
| *(no test/lint scripts yet — planned, not done)* | — | — | — | Low |

**Overall assessment:** this is about as clean a dependency footprint as a project can have — two small, current, purpose-built packages and nothing else. The only real action items are process hygiene (commit a lockfile, follow through on the already-planned Phase 7 test/lint scripts), not package selection.
