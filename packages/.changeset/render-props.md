---
'@brutalway/oxlint-config-react': patch
---

A function prop that returns `ReactNode`, `ReactElement` or `JSX.Element` is a render prop, named `children` or `renderX`, so a container that calls `children(plan)` passes. Any other function prop is still a callback named `onX`, and `renderSave: () => void` is reported as one.
