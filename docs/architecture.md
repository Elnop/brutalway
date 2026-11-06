# Architecture

The intent behind every template of the series and the general principles they borrow from (Feature-Sliced Design, Screaming Architecture, fitness functions...) are in [elnop-stacks/docs](https://github.com/Elnop/elnop-stacks/tree/main/docs). This page covers what is specific to a React front end.

## Container and presentational components

From [Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) (2015): components that know where the data comes from are kept apart from components that only render what they are given.

We take the split, under other names. Orchestrators (`XContainer`, `XLayout`, `XPage`) read stores and pass data and callbacks down. Presenters, everything else, only get props. `src/features/todo-list/components/TodoListLayout.tsx` reads the todos and hands them to the presenters in `src/features/todo-list/components/presenters/`.

We leave out higher-order components, which was how containers were written in 2015. Since 2019, Abramov's post says hooks make the split unnecessary. We keep it anyway: a presenter can be tested alone through its props, as `src/features/todo-list/components/presenters/TodoInput.test.tsx` does, and an agent knows which components may touch state from the file name alone.

Enforced by `@elnop/dependency-cruiser-config` (a presenter imports no store and no shared-feature hook) and `@elnop/oxlint-config-react` (no orchestrator under `shared-features/`).

## Store, actions and selectors

From Flux and Redux: state lives in a store, changes go through named actions, and derived data is computed by selectors.

We take the three roles, each in its own file. `src/shared-features/todos/todosStore.ts` only exports `todosStore` and `todosActions`, `src/shared-features/todos/todosSelectors.ts` only exports `selectX` functions, and components read the store through `src/shared-features/todos/useTodos.ts`.

We leave out reducers, action objects and dispatch. With zustand, an action is a plain function that sets the state, and a selector is a plain function that can be tested without React.

Enforced by `@elnop/oxlint-config-zustand` and `@elnop/dependency-cruiser-config` (a store lives at the root or in the `stores/` folder of its level).
