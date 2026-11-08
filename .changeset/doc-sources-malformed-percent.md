---
'@brutalway/check-doc-sources': patch
---

A link whose `%` sequence is not valid, such as `[x](src/a%zz.ts)`, no longer crashes the run with `URIError`: the path is used as written, so a file literally named with `%` is still cited.
