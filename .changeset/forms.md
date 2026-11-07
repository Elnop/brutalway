---
'create-brutal': minor
'@brutalway/oxlint-config-react-hook-form': minor
---

New `forms` option on vite, off by default: the title fields of the example go through `react-hook-form` with `zodResolver(TodoDraftSchema)`. `@brutalway/oxlint-config-react-hook-form` is a new package with `zod-resolver` (every `useForm` takes `resolver: zodResolver(...)`) and `validation-in-schema` (no validation passed to `register`, `useController` or a `Controller`). With `server-state`, `TodoDraftSchema` joins the API schemas and `todosClient.create` takes its inferred type. The CLI now writes `knip.json` the way Prettier formats it, so a long `ignoreDependencies` list no longer fails `prettier --check`.
