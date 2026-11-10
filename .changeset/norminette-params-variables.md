---
'@brutalway/oxlint-config-typescript': minor
'create-brutal': minor
'@brutalway/check-doc-length': patch
'@brutalway/check-tree': patch
'@brutalway/agent-hook': patch
'@brutalway/check-doc-links': patch
'@brutalway/stylelint-config': patch
'@brutalway/oxlint-config-tailwind': patch
---

A function takes 4 parameters at most (`max-params`) and declares 5 local variables at most (`function-size/max-variables`), as in the Norminette of 42. Each name bound by a destructuring counts, a nested function is counted on its own, and tests are exempt. A project with longer signatures or more locals starts failing. The packages are rewritten to fit, with no change in behavior.
