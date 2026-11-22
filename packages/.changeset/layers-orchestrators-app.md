---
'@brutalway/dependency-cruiser-config': patch
---

Two rules in `layers`: `orchestrators-use-hooks`, an `XContainer`, `XLayout` or `XPage` imports no `xClient.ts` and reads server data through a hook, and `app-composes-orchestrators`, `src/app/` imports the orchestrators and providers of a feature, never one of its presenters.
