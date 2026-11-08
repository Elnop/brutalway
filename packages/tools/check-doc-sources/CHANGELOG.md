# @brutalway/check-doc-sources

## 0.2.0

### Minor Changes

- 4c3f010: New package: `check-doc-sources` warns when a file cited by a Markdown doc changed and the doc did not. A citation is a path in inline code, resolved from the folder of the doc up to the root, or the target of a relative link. Changes are read from git, since `HEAD` or since `--base <ref>`, whitespace left out, and it always exits with 0. Settings go under `docSources` in `package.json`.

### Patch Changes

- 647adc0: A link whose `%` sequence is not valid, such as `[x](src/a%zz.ts)`, no longer crashes the run with `URIError`: the path is used as written, so a file literally named with `%` is still cited.
