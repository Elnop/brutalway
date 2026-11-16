# Architecture

The intent behind every template of the series and the general principles they borrow from (Feature-Sliced Design, Screaming Architecture, fitness functions...) are in [the brutalway docs](https://github.com/Elnop/brutalway/tree/main/docs/concepts). This page covers what is specific to a React front end.

## Container and presentational components

From [Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) (2015): components that know where the data comes from are kept apart from components that only render what they are given.

We take the split, under other names. Orchestrators (`XContainer`, `XLayout`, `XPage`) read stores and pass data and callbacks down. Presenters, everything else, only get props. `src/features/todo-list/components/TodoListLayout.tsx` reads the todos through `src/features/todo-list/useTodoList.ts` and hands them to the presenters in `src/features/todo-list/components/presenters/`.

We leave out higher-order components, which was how containers were written in 2015. Since 2019, Abramov's post says hooks make the split unnecessary. We keep it anyway: a presenter can be tested alone through its props, as `src/features/todo-list/components/presenters/TodoInput.test.tsx` does, and an agent knows which components may touch state from the file name alone.

Enforced by `@brutalway/dependency-cruiser-config` (a presenter reaches no store through any chain of imports, and imports no orchestrator) and `@brutalway/oxlint-config-react` (no orchestrator in a `shared/`).

## Server and client components

From the App Router: a component renders on the server unless its file starts with `'use client'`, and everything it imports then runs in the browser too.

The route files stay on the server, and `'use client'` goes on the orchestrators that read a store: `src/features/todo-list/components/TodoListLayout.tsx` and `src/features/todo-stats/components/TodoStatsContainer.tsx`. The presenters they render become client components without saying so, which keeps them plain functions of their props.

The todos stay in a zustand store in the browser, like in template-vite: the example app has no server data. We leave out server actions and route handlers until an app needs them.

## Store, actions and selectors

From Flux and Redux: state lives in a store, changes go through named actions, and derived data is computed by selectors.

We take the three roles, each in its own file. `src/shared/todos/todosStore.ts` only exports `todosStore` and `todosActions`, `src/shared/todos/lib/todosSelectors.ts` only exports `selectX` functions, and components read the store through `src/shared/todos/useTodos.ts`.

We leave out reducers, action objects and dispatch. With zustand, an action is a plain function that sets the state, and a selector is a plain function that can be tested without React.

Enforced by `@brutalway/oxlint-config-zustand` and `@brutalway/dependency-cruiser-config` (a store lives at the root or in the `stores/` folder of its level).

## Sub-features

From Feature-Sliced Design, extended. A feature or a slice can hold its own features in `features/<y>/` and its own slices in `shared/<y>/`, with the same rules one level down: sub-features never import each other or their parent, and what they share goes into a slice of the parent's `shared/`, named after its concept.

Renaming a task is a sub-feature of the list: `src/features/todo-list/features/todo-editor/`.

Enforced by `@brutalway/dependency-cruiser-config`.
