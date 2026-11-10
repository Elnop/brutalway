# @brutalway/check-doc-sources

## 0.2.1

### Patch Changes

- 13485ca: A file declares 5 top-level functions at most (`function-size/max-functions`), as in the Norminette of 42: function declarations and functions assigned to a top-level `const`, exported or not. Nested functions, callbacks and object methods do not count. A project with a file of 6 functions starts failing. The packages move their helpers into files of their own, with no change in behavior. With `server-state`, the in-memory API of the vite example is split into `devApi.ts`, the Vite plugin, and `devApiRoutes.ts`, which answers each route from a table.

## 0.2.0

### Minor Changes

- 4c3f010: New package: `check-doc-sources` warns when a file cited by a Markdown doc changed and the doc did not. A citation is a path in inline code, resolved from the folder of the doc up to the root, or the target of a relative link. Changes are read from git, since `HEAD` or since `--base <ref>`, whitespace left out, and it always exits with 0. Settings go under `docSources` in `package.json`.

### Patch Changes

- 647adc0: A link whose `%` sequence is not valid, such as `[x](src/a%zz.ts)`, no longer crashes the run with `URIError`: the path is used as written, so a file literally named with `%` is still cited.
