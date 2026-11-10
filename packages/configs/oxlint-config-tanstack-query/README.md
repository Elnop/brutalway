# @brutalway/oxlint-config-tanstack-query

Oxlint config for TanStack Query. Query keys come from one factory per domain and cache windows from named profiles.

## Install

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-tanstack-query
```

```ts
import { reactConfig } from '@brutalway/oxlint-config-react';
import { tanstackQueryConfig } from '@brutalway/oxlint-config-tanstack-query';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, tanstackQueryConfig],
});
```

## Rules

### `query-conventions/query-key-factory`

A `queryKey`, and the key passed to `getQueryData`, `setQueryData`, `getQueryState`, `getQueriesData` or `setQueriesData`, is a call or a member of an object whose name ends with `Keys`:

```ts
useQuery({ queryKey: todosKeys.list(filter), queryFn: () => todosClient.list(filter) });
queryClient.invalidateQueries({ queryKey: todosKeys.all });
```

`queryKey: ['todos', filter]` is reported. The factory itself lives in an `xKeys.ts` file, where the rule is off.

### `query-conventions/named-cache-windows`

`staleTime` and `gcTime` never take a number (`30_000`, `5 * 60_000`, `Infinity`). They come from a profile declared in a `QueryConfig.ts` file, where the rule is off:

```ts
useQuery({ queryKey: todosKeys.stats(), queryFn: todosClient.stats, ...QUERY_CACHE.standard });
```

### From `@tanstack/eslint-plugin-query`

`tanstack-query/exhaustive-deps` reports a variable used by `queryFn` and missing from the key, `tanstack-query/stable-query-client` reports a `QueryClient` created inside a component. The plugin needs `eslint` to load, which this package installs.

## Why

With every key built by a factory, an invalidation never misses its query. With cache windows in named profiles, the cache is tuned from one file.
