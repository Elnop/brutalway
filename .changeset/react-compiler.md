---
'create-brutal': minor
---

New `react-compiler` option on vite, off by default: `vite.config.ts` runs `babel-plugin-react-compiler` 1.0 through `@rolldown/plugin-babel` and `reactCompilerPreset()`, outside Vitest, and `oxlint.config.ts` reports `useMemo`, `useCallback` and `memo` imported from `react`.
