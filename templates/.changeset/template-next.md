---
'template-next': minor
---

First version of template-next: the todo list of template-vite on the Next.js App Router. The route files of `src/app/` are server components that lay out the features, the orchestrators that read the zustand store start with `'use client'`, and `src/proxy.ts` sends a Content Security Policy with a nonce per request. `npm run check`, Vitest and Playwright run as on template-vite.
