---
'create-brutal': patch
---

A created project runs `knip --production` in `npm run check` and keeps test helpers in `test-utils/`. On react-native without the example, `src/shared-features/theme/Button.tsx` stays a production entry of knip even with the component tests, since only its test uses it.
