---
'@brutalway/agent-hook': patch
---

When a check cannot start, for example because the project root does not exist, the hook prints the command, the folder it ran in, the project root and the error from Node, and exits with code 2. It used to print `oxlint found problems` followed by `undefinedundefined`.
