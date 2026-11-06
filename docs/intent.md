# Intent

A codebase written by several authors drifts. Each one, human or AI agent, brings their own habits, and a convention written in a README is forgotten by the next person who did not read it. Agents make this worse: they write fast, they write a lot, and they start every session without remembering the last one.

These templates take one position: a convention exists only if a program checks it. Everything else follows from six axioms.

## Deterministic

A convention that no program checks does not exist.

Every rule is enforced by a tool (Oxlint, dependency-cruiser, check-tree, alint, knip, tsc), never by a review or a prompt. The same code always gets the same verdict, locally, in the pre-commit hook and in CI. The same goes for the setup: every dependency is pinned, and the CLI records the commit of each template it ships.

## Unified

One way to write each thing.

Each construct has a single allowed form: function declarations, `type` over `interface`, `for...of` over `forEach`, imports through an alias, no barrel file. The same holds across stacks: the front end and the API share the four layers, the naming rules and the todo list example. Whoever knows one template can read the others, and an agent never has to pick between two styles.

## Atomic

One unit, one thing.

A file holds one export and is named after it. A lint rule checks one thing and reports one message. In the CLI, every option is an independent overlay that can be added or left out, and every combination of options passes `npm run check`. Small units are easier to name, to find and to replace, by a human or an agent.

## Isolated

Code depends only on what is below it, and siblings never know each other.

A layer imports only the layers below it: `app`, then `features`, then `shared-features`, then `shared`. Two features never import each other, nor do two shared features or two sub-features: what they have in common moves one level down. Inside a feature the same goes for roles: a presenter imports no store, a route imports no queries. A change in a feature can only break that feature and what sits above it, so an agent working on one feature cannot break another, and deleting a feature folder breaks nothing outside it.

## Predictable

The name gives the path, the path gives the content.

`todosStore.ts` exports `todosStore` and `todosActions`, Zod schemas live in an `XSchemas.ts`, a `hooks/` folder only holds hooks. You can tell where to write a file without reading the codebase, and what a file holds without opening it. For an agent that arrives with no context, this matters more than anything else.

## Actionable

The error says what to change.

A failing check names the file, the rule and the fix. The message is the documentation: nobody has to learn the conventions beforehand, they are taught at the moment they are broken. The Claude Code hook runs the checks on each file the agent edits and sends the errors back, so the agent fixes them before moving on.

## Further reading

[inspirations.md](inspirations.md) lists the existing architecture principles these templates borrow from, what they take from each and what they leave out. Each template has its own `docs/architecture.md` for what is specific to its stack.
