---
'@brutalway/oxlint-config-next': minor
---

The files Next.js names, everything under `src/app/` and the files at the root of `src/`, are left out of the rules on file names, exports and props. This replaces the lists of route files, kebab-case names and route segment exports, which missed the generated images (`icon.tsx`, `opengraph-image.tsx` with `alt`, `size` and `contentType`), `mdx-components.tsx`, the Next.js 16 segment exports (`prefetch`, `instant`) and the `reset` prop of `error.tsx`. `'use client'` is allowed in any file of `src/app/`, where Next.js decides. A fixture holds every file convention of Next.js 16 and must lint clean.
