# ClickDrop Frontend

Next.js + React + TypeScript + Tailwind CSS + i18next.

## Scripts

```bash
npm install
npm run dev
npm run build
npm test
```

## Environment

Copy `.env.example` to `.env` for local work.

- `NEXT_PUBLIC_SITE_URL` - public origin for canonical tags, Open Graph, and the sitemap
- `NEXT_PUBLIC_API_BASE_URL` - leave empty (recommended) so the browser calls same-origin `/api`
- `API_BACKEND_URL` - auth-service origin used by the Next.js API proxy (`http://localhost:8081`)
- `API_ECONOMY_URL` - economy-service origin (`http://localhost:8082`)
- `API_INVENTORY_URL` - inventory-service origin (`http://localhost:8083`)

Browser calls `localhost:3000/api/*`. The App Router proxy in `src/app/api/[...path]/route.ts` forwards:

- `/api/economy/inventory/**` and `/api/economy/trade-up` to inventory-service
- `/api/economy/**` to economy-service
- everything else under `/api` (including `/api/auth/**` and `/api/users/**`) to auth-service

Set `API_*` only on the server. They are not exposed to the browser when `NEXT_PUBLIC_API_BASE_URL` is empty. `NEXT_PUBLIC_SITE_URL` is inlined at build time, so production builds must set it before `npm run build`.

## Production on MyDevil

Live site: `https://clickdrop.dawid-developer.pl`

The frontend runs as a Node.js / Phusion Passenger app (Node 22, one process), similar to Evently:

- App root: `/usr/home/SatoshiDC/domains/clickdrop.dawid-developer.pl/public_nodejs/`
- Entry: CommonJS `app.js` (Passenger `require`s this file). Do not use top-level await in `app.js`.
- `next.config.mjs` is used on the server because loading `next.config.ts` needs a native SWC binary, which is not available on FreeBSD.
- Runtime env is `.env.production` (API URLs point at `127.0.0.1` and the reserved auth/economy/inventory ports).
- Remove the default `public/index.html` placeholder that MyDevil creates, or `/` will never reach Next.js.
- SSL is Let's Encrypt with `sslonly` on. HTTP redirects to HTTPS.

Build the production `.next` output on a machine that has SWC (for example Windows or Linux), then upload it. `npm run build` on the MyDevil FreeBSD host fails because `@next/swc-freebsd-x64` does not exist.

## SEO

Each route exports Next.js `metadata` (title, description, canonical, Open Graph, Twitter, robots).
Public routes are listed in `/sitemap.xml`. Auth pages are disallowed in `/robots.txt`.

## i18n

Translations live in `src/i18n/locales/` (`en.json`, `pl.json`).
Language is detected from `localStorage` / the browser and can be switched in the UI.
