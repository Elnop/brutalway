---
'create-brutal': patch
---

A created project runs `knip --production` in `npm run check` and keeps test helpers in `test-utils/`. Without the example, `knip.json` names no file of `src/` any more: with `--analytics`, the app sends an `app_opened` event at startup (from `src/main.tsx` on vite, `src/instrumentation-client.ts` on next, the root layout on react-native), so `analyticsClient.ts` is used from the start, and react-native without i18n drops `Button.tsx` and `ThemeTypes.ts`, which nothing imports. With `--ui shadcn` or `--analytics`, the project keeps the `@brutalway/dependency-cruiser-config` of its template instead of going back to 0.6.0.
