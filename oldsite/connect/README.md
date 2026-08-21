# Trade Funding Connect — Landing Page

Public marketing site for Trade Funding Connect: a single-page landing that explains
point-of-sale finance for B2B businesses, with legal pages and a "request a call"
enquiry form.

Live at **https://connect.tradefunding.com.au**.

---

## Tech stack

- **Frontend:** static HTML, one shared CSS file, vanilla JavaScript. No build step,
  no framework, no bundler.
- **Backend:** two serverless functions in `/api` (Node.js, ES modules). These power
  the enquiry form. On Vercel they deploy automatically as serverless functions; on
  any other host you need an equivalent Node serverless/Edge runtime for `/api/*`.
- **Fonts:** Work Sans + Roboto, loaded from Google Fonts.

If you only need the static marketing pages and will wire your own backend, the
`/api` folder and the two form scripts are the only server-dependent pieces.

---

## Project structure

```
index.html            Landing page
privacy.html          Privacy policy
terms.html            Terms & conditions
robots.txt            Crawler rules (currently blocks ALL indexing — see note below)
vercel.json           Clean URLs + security headers (host-agnostic reference config)
package.json          Declares Node >= 20 for the serverless functions
.env.example          Required environment variables (copy to .env.local)

styles/
  main.css            Entire stylesheet (cache-busted via ?v= query in the HTML)

scripts/
  main.js             Nav behaviour, cookie consent bar, misc interactions
  calculator.js       ROI calculator on the landing page
  form.js             Request-a-call form: fetches a token, validates, submits

api/
  form-token.js       Issues a short-lived signed token on page load (anti-spam)
  request-call.js     Receives the form, verifies the token, emails + Slacks the lead

branding/             All images (see "Assets" below)

docs/
  design-spec.md      Original design specification
  implementation-plan.md  Original build plan

tests/
  calculator-test.html    Browser-runnable assertions for the ROI calculator maths
```

---

## Run locally

The marketing pages are pure static files:

```bash
npx serve .
# then open the printed http://localhost:xxxx
```

Opening `index.html` directly with `file://` also works for layout, but the enquiry
form calls `/api/*`, which needs a server. To run the full site including the form:

```bash
npm i -g vercel      # once
vercel dev           # serves the static site AND the /api functions locally
```

Create a `.env.local` from `.env.example` first (see below).

---

## Environment variables

The enquiry form needs these. See `.env.example` for descriptions. Set them in
`.env.local` for local dev and in your host's dashboard for production.

| Variable | Required | Purpose |
|---|---|---|
| `RESEND_API_KEY` | Yes | Sends the enquiry email (via Resend) |
| `FORM_TOKEN_SECRET` | Yes | HMAC secret for the anti-spam token (any long random string) |
| `SLACK_WEBHOOK_URL` | No | Posts the enquiry to Slack; skipped if unset |
| `LEAD_EMAIL_TO` | No | Recipient inbox (defaults to support@tradefunding.com.au) |
| `LEAD_EMAIL_FROM` | No | Sender address (must be on a Resend-verified domain) |

No secrets are committed anywhere in this repo. Everything sensitive is read from
the environment at runtime.

---

## How the enquiry form works

1. On page load, `form.js` calls `GET /api/form-token`, which returns a short-lived
   token signed with `FORM_TOKEN_SECRET` (format: `timestamp.nonce.hmac`).
2. On submit, `form.js` posts the form data plus the token to `POST /api/request-call`.
3. `request-call.js` enforces several checks before doing anything:
   - **CORS allow-list** — only the production origin is accepted (see note below).
   - **Signed token** — HMAC verified with a constant-time compare.
   - **Timing** — submissions faster than 3 seconds are treated as bots; tokens
     older than 30 minutes are rejected.
   - **Per-IP rate limit** — 3/hour and 10/day.
   - **Body size cap** — 4 KB max.
   - **Validation + sanitisation** — fields are trimmed, length-capped, HTML-escaped.
4. If it passes, the lead is emailed via Resend and (optionally) posted to Slack.

### Things to change for a new environment

- **CORS origin.** `api/request-call.js` and `api/form-token.js` each hold an
  `ALLOWED_ORIGINS` set. Add your own domain(s) there (staging, preview, etc.).
  It is currently locked to `https://connect.tradefunding.com.au` plus the Vercel
  preview URL.
- **Rate limiting is in-memory.** The per-IP counter lives in a `Map` inside the
  function instance, so it resets on cold starts and is not shared across instances.
  It is a reasonable baseline for low traffic. For stronger guarantees, back it with
  a shared store (Vercel KV, Upstash Redis, etc.).

---

## Deploy

### Vercel (how it runs today)

1. Import the project (drag-and-drop the folder, or connect a Git repo).
2. No build command needed — it is served as static files, and `/api/*` deploy as
   serverless functions automatically.
3. Add the environment variables from the table above under
   **Settings → Environment Variables**.
4. Add the custom domain and point DNS at Vercel. The current setup uses a Cloudflare
   CNAME: `connect` → `cname.vercel-dns.com`, set to **DNS only** (not proxied).
5. `vercel.json` already applies clean URLs (`/terms` instead of `/terms.html`) and a
   set of security headers (`X-Content-Type-Options`, `X-Frame-Options`,
   `Referrer-Policy`, `Permissions-Policy`).

### Any other static host

The pages work on any static host (Netlify, Cloudflare Pages, S3+CloudFront, etc.).
You will need to reimplement the two `/api` functions on that host's function runtime,
or point the form at a backend of your own. If you replace the backend, keep the
token + validation checks described above.

---

## Important notes

- **Indexing is switched OFF.** `robots.txt` contains `Disallow: /`, which blocks all
  search engines. This is deliberate for now. Remove or edit it when you want the site
  to be publicly indexable. Canonical tags and Open Graph metadata are already in place.
- **CSS cache-busting.** The stylesheet is linked as `styles/main.css?v=YYYYMMDD-n`.
  Bump that query string in all three HTML files whenever you change the CSS so users
  and CDNs pick up the new version.
- **Social share image.** `branding/og-image.png` (and `.jpg`) is the link-preview card
  referenced by the Open Graph tags. Regenerate it if the messaging changes.

---

## Assets (`branding/`)

| File | Use |
|---|---|
| `logo-navy.png` | Trade Funding wordmark, navy — light backgrounds |
| `logo-white.png` | Trade Funding wordmark, white — dark backgrounds (nav + footer) |
| `cashper-gradient-transparent.png` | Cashper ghost mascot |
| `og-image.png` / `og-image.jpg` | Social share / link-preview card (1200x630) |
| `favicon-32.png`, `favicon-192.png`, `favicon-256.png` | Favicons |
| `apple-touch-icon.png` | iOS home-screen icon |
| `dylan.jpg` | Portrait asset. Not currently referenced in the pages — included for reuse |

All logos are tightly cropped (the glyphs fill the full image height), so size them by
`height` in CSS. The nav uses 30px and the footer 34px.
