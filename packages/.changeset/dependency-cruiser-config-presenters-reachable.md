---
'@brutalway/dependency-cruiser-config': minor
---

`presenters-are-pure` follows the imports: a presenter is reported when it reaches a store, an `xClient.ts`, `zustand` or `@tanstack/react-query` through any chain of imports, at any depth. Before, it only looked at the direct imports and at the name of the hooks of `src/shared/`. A presenter could call `useTodoList`, which reads the store through `useTodos`, and could not call `useCopyToClipboard`, which only holds local state. Now it is the other way around.

New rule `presenters-render-presenters`: a presenter does not import an `XContainer`, `XLayout` or `XPage`. Without it, a presenter that renders an orchestrator would reach its store. A project where a presenter renders an orchestrator moves that orchestrator up into the orchestrator that renders the presenter.
