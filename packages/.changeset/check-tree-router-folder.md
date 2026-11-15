---
'@brutalway/check-tree': patch
---

`app/` belongs to the router: its files stay where they are, whatever their kind. `src/app/` holding `sitemap.ts`, `robots.ts` and `manifest.ts` (Next.js), or `hello+api.ts` and `+middleware.ts` (Expo Router), used to be told to move them into `lib/`, where the router no longer finds them. Empty folders under `app/` are still reported.
