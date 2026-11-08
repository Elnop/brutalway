# Roadmap: more options for template-vite

Today `npm create brutal` offers six yes/no options on the vite stack, and each one removes something from a template that already holds everything. This roadmap adds options that bring something in: a styling system, server state, forms, UI primitives, translations. Each option follows the Atomic axiom: it is an overlay that can be added or left out, every combination passes `npm run check`, and the conventions it brings are checked by a tool, with an error that says what to change.

Most of the ideas come from two repositories by JCluzet:

- [bedrock](https://github.com/JCluzet/bedrock), a Next.js 16 + Tailwind v4 starter built on the same idea as brutalway (one `pnpm check` gate, 34 custom ESLint rules, semgrep, ast-grep, jscpd, knip, dependency-cruiser). Its `.agents/rules/` folder documents each rule, and every lint message points to the matching section.
- [Wizcard](https://github.com/JCluzet/Wizcard), a Next.js app in production (Supabase, next-intl, PostHog, CSS Modules), which shows how these conventions hold up on a real codebase of about 800 files.

Both are Next.js projects. What is specific to Next (server components, `next/link`, route groups, `withEvlog` on route handlers) is left out or rewritten for a Vite single page app. ePong, the other React project in the list, is a 2023 Create React App with four UI kits installed at once, so nothing is taken from it.

- [Order](order.md)
- [E0. Options that add things and options with several values](e0-options-that-add-things-and-options-with-several-values.md)
- [E1. Tailwind CSS](e1-tailwind-css.md)
- [E2. CSS Modules](e2-css-modules.md)
- [E3. Server state with TanStack Query](e3-server-state-with-tanstack-query.md)
- [E4. Forms with react-hook-form and Zod](e4-forms-with-react-hook-form-and-zod.md)
- [E5. UI primitives with shadcn/ui](e5-ui-primitives-with-shadcnui.md)
- [E6. Translations](e6-translations.md)
- [E7. More checks on React code](e7-more-checks-on-react-code.md)
- [E8. Smaller options](e8-smaller-options.md)
- [E9. Docs that stay readable](e9-docs-that-stay-readable.md)
