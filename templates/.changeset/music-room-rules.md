---
'template-fastify': patch
'template-next': patch
'template-package': patch
'template-react-native': patch
'template-vite': patch
---

The templates use the new rules from music-room: `@ts-ignore`, `@ts-nocheck` and `new Function` are refused, a store is read with a selector, an orchestrator reads server data through a hook, `src/app/` imports the orchestrators of a feature, and on react-native colors are checked anywhere outside the theme, `fontWeight` is refused and AsyncStorage lives in an `xStorage.ts`. The react-native page frame is `src/features/page-layout/PageLayout.tsx`, and the todos are persisted through `src/shared/todos/lib/todosStorage.ts`.
