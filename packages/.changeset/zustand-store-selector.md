---
'@brutalway/oxlint-config-zustand': patch
---

A store hook takes a selector: `useStore(xStore)` with a single argument and `useXStore()` without one are reported, since the component would re-render on every change of the store.
