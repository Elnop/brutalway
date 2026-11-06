# Architecture

The intent behind every template of the series and the general principles they borrow from (Feature-Sliced Design, Screaming Architecture, fitness functions...) are in [the brutalway docs](https://github.com/Elnop/brutalway/tree/main/docs). This page covers what is specific to a React front end.

## Container and presentational components

From [Dan Abramov](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0) (2015): components that know where the data comes from are kept apart from components that only render what they are given.

We take the split, under other names. Orchestrators (`XContainer`, `XLayout`, `XPage`) read stores and pass data and callbacks down. Presenters, everything else, only get props.

We leave out higher-order components, which was how containers were written in 2015. Since 2019, Abramov's post says hooks make the split unnecessary. We keep it anyway: a presenter can be tested alone through its props, and an agent knows which components may touch state from the file name alone.

Enforced by `@brutalway/dependency-cruiser-config` (a presenter imports no store and no shared-feature hook) and `@brutalway/oxlint-config-react` (no orchestrator under `shared-features/`).

## Sub-features

From Feature-Sliced Design, extended. A feature can hold its own features in `features/<x>/features/<y>/`, with the same rules one level down: sub-features never import each other or their parent, and what they share goes into the parent's `shared/` folder.

Enforced by `@brutalway/dependency-cruiser-config`.
