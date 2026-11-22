---
'@brutalway/oxlint-config-react': patch
---

An `XContainer`, `XLayout` or `XPage` no longer has to call a hook. A layout or a page that only composes presenters is an orchestrator too: what sets a presenter apart is what it may not do, which dependency-cruiser checks.
