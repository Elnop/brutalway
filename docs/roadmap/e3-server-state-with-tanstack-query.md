# E3. Server state with TanStack Query

Source: bedrock (`.agents/rules/state.md`, `lib/query/keys.ts`, `lib/query/stale-times.ts`, semgrep rules `no-inline-query-key`, `no-magic-stale-time`, `no-fetch-in-use-effect`).

bedrock splits state by what it is: data from an API goes through TanStack Query, UI state goes into zustand, and a store must never hold server data. Query keys come from a `xKeys` factory, cache windows come from named profiles. The series already has an API with the same todo list (template-fastify), so the example talks to its routes: `GET /todos?filter=`, `POST /todos`, `PATCH /todos/:id`, `DELETE /todos/:id`, `DELETE /todos/completed` and `GET /stats`.

Requests live in `xClient.ts` files, the convention template-fastify already uses for HTTP calls (its dependency-cruiser rule `http-in-clients`, check-tree's `clients/` category). The client parses every response with the Zod schemas of `TodosSchemas.ts`, and the types come from `z.infer`, so a response that drifts from the API fails at the boundary instead of deep in a component. E4 reuses the same schemas for the forms. Ids become numbers, as in the API.

The `/stats` query lives in `src/shared-features/todos/` next to the list, under the same factory (`todosKeys.all`, `todosKeys.list(filter)`, `todosKeys.stats()`): a mutation on the list has to refresh the counters, and a shared feature cannot import `src/features/todo-stats/`. Invalidating `todosKeys.all` refreshes both.

Without `API_URL`, a Vite plugin answers `/api` with an in-memory list, in `npm run dev` and in the `vite preview` the e2e tests run against. Each browser gets its own list through a cookie, so the e2e tests stay isolated without a reset step. With `API_URL`, the same place in `vite.config.ts` proxies `/api` to template-fastify instead, which has no CORS. The mock only lives in the config: the app has no idea it can be mocked, and the e2e tests run the production build. MSW was the first idea, but its service worker file in `public/`, its start-up code in `main.tsx` and the special build it needs for e2e buy nothing here: presenters get everything through props, so no component test makes a request.

As built: the styled components are shared by every styling value, so the data stays out of them. `TodoListLayout.tsx` reads the list through `src/features/todo-list/useTodoList.ts` in every project, and the option only swaps that hook and `TodoStatsContainer.tsx`. Toggling a task patches the cached lists right away (`onMutate`) and refetches once the server answers, otherwise the checkbox snaps back until the refetch. `API_URL` is read from the environment of the command (`API_URL=http://localhost:3000 npm run dev`), not from a `.env` file.

**E3-S1. TanStack Query as an option.** As someone creating a project, I want `--server-state`, so that the app reads and writes its data through an API.
- The example reads and writes todos through `@tanstack/react-query` against the routes of template-fastify: the list is filtered by the API (`?filter=`), the counters come from `GET /stats`, and each mutation invalidates `todosKeys.all`.
- `src/shared-features/todos/todosClient.ts` holds the requests and parses each response with the Zod schemas of `TodosSchemas.ts`. Types come from `z.infer`, ids are numbers.
- Without `API_URL`, a Vite plugin in `apiMock.ts` answers `/api` in `npm run dev` and `vite preview`, with one in-memory list per browser (cookie). With `API_URL`, `vite.config.ts` proxies `/api` to the API instead. Nothing in `src/` knows about the mock.
- zustand keeps the filter only. With the option off, the example stays as it is today. Without the example, the option only brings the `QueryClientProvider`, `QueryConfig.ts` and the rules.

**E3-S2. Query keys from a factory.** As someone working on the project, I want an error when I write a query key inline, so that an invalidation never misses its query.
- Keys live in `xKeys.ts`, which only exports `xKeys`. check-tree learns `xKeys.ts` as a named file with a `keys/` category.
- Rule in a new `@brutalway/oxlint-config-tanstack-query`: `queryKey` and `invalidateQueries` only take a call or a member of an `xKeys` object.
- To check: whether `@tanstack/eslint-plugin-query` runs as an oxlint JS plugin. If it does, take `exhaustive-deps` and `stable-query-client` from it instead of writing them.

**E3-S3. Named cache windows.** As someone working on the project, I want `staleTime` and `gcTime` to come from named profiles, so that the cache can be tuned from one file.
- `QueryConfig.ts` holds the profiles. A number literal for `staleTime` or `gcTime` is reported, in `useQuery`, `queryOptions` and the `QueryClient` defaults.

**E3-S4. No fetch in an effect, no server data in a store.** As someone working on the project, I want an error when I call `fetch` in `useEffect` or put API data in a zustand store, so that each kind of state stays with its tool.
- `fetch` inside a `useEffect` callback is reported by `@brutalway/oxlint-config-react`, since it holds for any React project, with or without TanStack Query.
- `fetch` outside an `xClient.ts` is reported, as template-fastify does with `http-in-clients`.
- dependency-cruiser: a store imports no `xClient.ts` and no query hook. Presenters already import no store, the same rule extends to query hooks, so only orchestrators call them.
