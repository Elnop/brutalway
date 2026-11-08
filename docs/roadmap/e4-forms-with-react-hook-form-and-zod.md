# E4. Forms with react-hook-form and Zod

Source: bedrock (rule `forms-must-use-zod`, `.agents/rules/state.md`).

`TodoInput.tsx` and `TodoEditor.tsx` exist once per styling value, so the form logic stays out of them, as the data does in E3. Both read their field through `src/features/todo-list/shared/useTitleForm.ts`, which returns the props of the input, the error and the submit handler. The default project implements it with `useState` and `normalizeTitle`, `--forms` with `react-hook-form` and `zodResolver`, and the markup is the same in both. That changes the default project too: the submit button stays enabled, and submitting a blank title shows "The title is blank" under the field (`role="alert"`, `aria-invalid`, `aria-describedby`) instead of a disabled button with no explanation.

The schema is `TodoDraftSchema` in `src/shared-features/todos/TodosSchemas.ts`, written like the one of template-fastify: trimmed, inner spaces merged, 1 to 200 characters. With `--server-state` it joins the schemas of the API in the same file, and `todosClient.create` takes the type inferred from it, so the form and the request describe the same thing once.

As built: the schema reuses `normalizeTitle` in its `transform`, so trimming and merging spaces is written once for the store, the default form and the schema. Toggling a task with `--server-state` patches the cache a few microtasks after the click, so the e2e test clicks the checkbox and waits for `toBeChecked()` instead of calling `check()`, which reads the state at once. After the edits, the CLI rewrites `knip.json` the way Prettier would, since several options add names to `ignoreDependencies` and the line can pass 200 columns.

**E4-S1. Forms as an option.** As someone creating a project, I want `--forms`, so that forms come with validation and typed values.
- `src/features/todo-list/shared/useTitleForm.ts` uses `react-hook-form` with `zodResolver(TodoDraftSchema)`. `TodoInput.tsx` and `TodoEditor.tsx` do not change between the default project and `--forms`, in any styling value.
- `TodoDraftSchema` sits in `src/shared-features/todos/TodosSchemas.ts`. With `--server-state`, it joins the API schemas there and `todosClient.create` takes its inferred type.
- In every project, a blank title shows "The title is blank" under the field, announced to screen readers (`role="alert"`, `aria-invalid`, `aria-describedby`), and axe in the e2e test stays clean.

**E4-S2. Every form has a schema.** As someone working on the project, I want an error when a form validates anywhere but in its Zod schema, so that the form type always matches what is validated.
- New package `@brutalway/oxlint-config-react-hook-form`, added with `--forms`.
- `useForm` without `resolver: zodResolver(...)` is reported.
- Validation outside the schema is reported: options passed to `register` (`register('title', { required: true })`) and the `rules` prop of a `Controller`.
