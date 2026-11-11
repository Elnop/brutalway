# Architecture

The intent behind every template of the series and the general principles they borrow from (Feature-Sliced Design, Screaming Architecture, fitness functions...) are in [the brutalway docs](https://github.com/Elnop/brutalway/tree/main/docs/concepts). This page covers what is specific to a React Native app.

## Container and presentational components

From [Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) (2015): components that know where the data comes from are kept apart from components that only render what they are given.

We take the split, under other names. Orchestrators (`XContainer`, `XLayout`, `XPage`) read stores and pass data and callbacks down. Presenters, everything else, only get props. `src/features/todo-list/components/TodoListLayout.tsx` reads the todos through `src/features/todo-list/useTodoList.ts` and hands them to the presenters in `src/features/todo-list/components/presenters/`.

We leave out higher-order components, which was how containers were written in 2015. Since 2019, Abramov's post says hooks make the split unnecessary. We keep it anyway: a presenter can be tested alone through its props, as `src/features/todo-list/components/presenters/TodoInput.test.tsx` does, and an agent knows which components may touch state from the file name alone.

Enforced by `@brutalway/dependency-cruiser-config` (a presenter imports no store and no shared-feature hook) and `@brutalway/oxlint-config-react` (no orchestrator under `shared-features/`).

## Styles from a theme

From the design tokens of the web templates: every color, size and font has a name, and the components only use the names.

React Native has no CSS, so the tokens are a TypeScript object, `THEME` in `src/shared/ThemeConfig.ts`, and each component declares its styles in a `StyleSheet.create` at the bottom of its file. The pressable look of the series (border, hard shadow, the press that moves the button onto its shadow) is written once, in `src/shared/Button.tsx`.

We leave out styling libraries (NativeWind, Tamagui, styled-components): the theme object covers the example, and nothing has to be learned on top of React Native.

## Store, actions and selectors

From Flux and Redux: state lives in a store, changes go through named actions, and derived data is computed by selectors.

We take the three roles, each in its own file. `src/shared-features/todos/todosStore.ts` only exports `todosStore` and `todosActions`, `src/shared-features/todos/todosSelectors.ts` only exports `selectX` functions, and components read the store through `src/shared-features/todos/useTodos.ts`.

We leave out reducers, action objects and dispatch. With zustand, an action is a plain function that sets the state, and a selector is a plain function that can be tested without React.

The todos are kept on the device through the `persist` middleware of zustand, on [AsyncStorage](https://docs.expo.dev/versions/latest/sdk/async-storage/), which falls back to `localStorage` on the web build. The filter is left out of what is saved.

Enforced by `@brutalway/oxlint-config-zustand` and `@brutalway/dependency-cruiser-config` (a store lives at the root or in the `stores/` folder of its level).

## Sub-features

From Feature-Sliced Design, extended. A feature can hold its own features in `features/<x>/features/<y>/`, with the same rules one level down: sub-features never import each other or their parent, and what they share goes into the parent's `shared/` folder.

Renaming a task is a sub-feature of the list: `src/features/todo-list/features/todo-editor/`.

Enforced by `@brutalway/dependency-cruiser-config`.
