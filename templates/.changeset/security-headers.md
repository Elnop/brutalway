---
'template-vite': minor
---

`securityHeaders.ts` holds the HTTP headers of the app, with an enforced Content Security Policy (`default-src 'self'`), HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` and `Permissions-Policy`. A Vite plugin sends them from `vite preview`, so the e2e tests run under them, and writes them into `dist/_headers` at build time for Netlify and Cloudflare Pages.
