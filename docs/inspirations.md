# Inspirations

None of the ideas in these templates is new. This page lists where each one comes from, what we take, what we leave out and which check enforces it. The principles that only apply to one stack are in that template's `docs/architecture.md`: [template-vite](https://github.com/Elnop/template-vite/blob/main/docs/architecture.md) and [template-fastify](https://github.com/Elnop/template-fastify/blob/main/docs/architecture.md).

The first four justify the axioms of [intent.md](intent.md). The others justify the folder layout.

## Fitness functions

From *Building Evolutionary Architectures* (Neal Ford, Rebecca Parsons, Patrick Kua, O'Reilly, 2017): an architectural property is protected by an automated test that fails when the property breaks. [ArchUnit](https://www.archunit.org/) does it for Java.

We take the whole idea. It is the Reproducible axiom: layers, import directions, file names and folder kinds are all fitness functions, run on every commit.

We leave out the broader practice around them (evolutionary change, metrics over time). Our checks are pass or fail.

Enforced by dependency-cruiser, check-tree, alint and the `@elnop/*` lint plugins.

## Poka-yoke

From the Toyota Production System (Shigeo Shingo): design the process so a mistake is either impossible or flagged at once, where it happens.

We take the "at once": the Claude Code hook lints each file right after the agent writes it, and the pre-commit hook runs `npm run check`. This is the Teaching axiom.

We leave out nothing in particular, but we rarely make mistakes impossible. Most of the time we flag them.

Enforced by `@elnop/agent-hook` and the git hook in `.githooks/` of each template.

## One obvious way to do it

From the Zen of Python ([PEP 20](https://peps.python.org/pep-0020/)) and Prettier's [option philosophy](https://prettier.io/docs/option-philosophy): when there is one way to write something, nobody spends time choosing or arguing.

We take it beyond formatting, to code constructs: function declarations, `type` over `interface`, `for...of` over `forEach`. This is the Unified axiom.

We leave out the "obvious" part. A rule here can be arbitrary, as long as it is the only one.

Enforced by Prettier and `@elnop/oxlint-config-typescript`.

## Convention over configuration

From the [Rails doctrine](https://rubyonrails.org/doctrine): the framework decides where files go and what they are called, so the developer does not have to.

We take the default layout and the naming rules, which make the Legible axiom work.

We leave out the implicit magic. Rails finds a file because of its name at runtime and fails silently when it is misnamed. Here nothing is loaded by convention: imports are explicit, and a misnamed file fails the check.

Enforced by `@elnop/eslint-plugin-file-named-after-export` and check-tree.

## Feature-Sliced Design

[Feature-Sliced Design](https://feature-sliced.design/) splits a front end into layers (`app`, `pages`, `widgets`, `features`, `entities`, `shared`), each importing only the layers below it, and slices of the same layer never import each other.

We take the layers and the import rules, which are the Bounded axiom. Our four layers are `app`, `features`, `shared-features` and `shared`, and they apply to the API as well as to the front end.

We leave out three of the layers (`pages`, `widgets`, `entities`), which are hard to tell apart in a small app, and the public API of each slice, an `index.ts` that re-exports what the slice exposes. We forbid barrel files: an import points to the file that defines the export.

Enforced by `@elnop/dependency-cruiser-config`.

## Screaming Architecture

From [Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html) (2011): the folder tree should tell what the application does, not which framework it uses.

We take the domain names inside the layers: `features/todo-list/`, `shared-features/todos/`. A feature reads as one unit and can be deleted as one.

We leave out two things. The top level of `src/` shows the layers, not the domain. And the framework stays visible in file names (`todosStore.ts`, `TodosSchemas.ts`), because a predictable name is worth more to us than hiding the framework.

Enforced by `@elnop/dependency-cruiser-config` (no import between features).

## Vertical Slice Architecture

From [Jimmy Bogard](https://www.jimmybogard.com/vertical-slice-architecture/): group code by feature, from the endpoint to the database, instead of by technical layer.

We take the cohesion of a feature: its routes, service, components and styles sit together.

We leave out one handler per request and the mediator that dispatches them. Shared business code goes to `shared-features/` instead of being duplicated between slices.

Enforced by `@elnop/dependency-cruiser-config`.

## Clean Architecture and Hexagonal Architecture

From [Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) and [Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/): dependencies point toward the business code, and the outside world (database, HTTP, UI) plugs in through ports and adapters.

We take the dependency rule in its simplest form: a layer depends only on the layers below it, and the database driver is only imported by queries.

We leave out ports and adapters as a layer of their own, and entities and use case classes. In a template, they double the number of files before there is anything to abstract. The closest thing to a port is the type of the queries object a service receives in template-fastify.

Enforced by `@elnop/dependency-cruiser-config`.

## Domain-Driven Design

From Eric Evans (*Domain-Driven Design*, 2003): the code uses the words of the domain, the ubiquitous language.

We take the naming: folders, files and exports are named after domain things (`todos`, `todo-list`, `todo-stats`).

We leave out the tactical patterns (aggregates, value objects, repositories as a domain concept) and bounded contexts.

Not enforced: no tool can tell a domain name from a bad one.

## Atomic Design

From [Brad Frost](https://atomicdesign.bradfrost.com/): UI components sorted into atoms, molecules, organisms, templates and pages.

Listed here because our Atomic axiom shares the word, and the two are unrelated. We leave it out: components are sorted by role (orchestrator or presenter) and by feature, not by size.
