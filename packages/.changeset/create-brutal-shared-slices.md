---
'create-brutal': minor
---

The projects follow the single `src/shared/` split into slices of the templates, where each file of a slice has two consumers, whatever the options:

- `analyticsClient.ts` goes into `src/shared/analytics/`
- with server state, the cache profiles sit next to their user: `standard` in `src/features/query-client/QueryConfig.ts`, and with the example `live` in `src/features/todo-stats/QueryConfig.ts`. In the example, `src/shared/todos/` keeps the client, the keys, the schemas, the types and `useTodoMutations.ts`, which both features use. The filter store moves into `src/features/todo-list/`, `useTodoList.ts` reads it and the list query itself, and `useTodoStatsQuery.ts` moves into `src/features/todo-stats/`
- with forms and without server state, `TodosSchemas.ts` sits next to `useTitleForm.ts` in `src/features/todo-list/shared/title-form/`
- `normalizeTitle.ts` stays in `src/shared/todos/` unless only the title form uses it, with server state and without forms, where it moves into `src/features/todo-list/shared/title-form/`
- on react-native with i18n, `pickLanguage.ts` and `languageStorage.ts` move into `src/features/i18n/lib/`, next to `createI18n.ts`
- on react-native without the example, the theme moves into `src/features/page-shell/configs/` next to `StackConfig.ts`, or, with i18n, the `Button` and `ThemeTypes.ts` move into the language switch

A folder left empty under `src/` once the options are applied is removed, and a project without the example no longer gets an empty `src/shared/` with a `.gitkeep`.
