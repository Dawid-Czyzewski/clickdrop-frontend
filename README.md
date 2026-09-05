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

- `NEXT_PUBLIC_SITE_URL` — public origin for canonical/OG/sitemap
- `NEXT_PUBLIC_API_BASE_URL` — leave empty (recommended) so the browser calls same-origin `/api`
- `API_BACKEND_URL` — auth-service origin used by the Next.js API proxy (`http://localhost:8081`)

Browser → `localhost:3000/api/*` → Next proxy → auth-service (no CORS issues).

## SEO

Each route exports Next.js `metadata` (title, description, canonical, Open Graph, Twitter, robots).
Public routes are listed in `/sitemap.xml`; auth pages are disallowed in `/robots.txt`.

## i18n

Translations live in `src/i18n/locales/` (`en.json`, `pl.json`).
Language is detected from `localStorage` / browser and can be switched in the UI.
