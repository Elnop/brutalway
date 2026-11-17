---
'@brutalway/dependency-cruiser-config': minor
---

`presenters-are-pure` no longer counts an `XProvider.tsx` as a presenter, as `@brutalway/oxlint-config-next` already does: a provider wires a context, so it may import `@tanstack/react-query` or a store, like the `QueryProvider` of template-next with its `server-state` option.
