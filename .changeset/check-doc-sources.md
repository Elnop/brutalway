---
'@brutalway/check-doc-sources': minor
---

New package: `check-doc-sources` warns when a file cited by a Markdown doc changed and the doc did not. A citation is a path in inline code, resolved from the folder of the doc up to the root, or the target of a relative link. Changes are read from git, since `HEAD` or since `--base <ref>`, whitespace left out, and it always exits with 0. Settings go under `docSources` in `package.json`.
