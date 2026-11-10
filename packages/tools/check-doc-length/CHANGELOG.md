# @brutalway/check-doc-length

## 0.2.1

### Patch Changes

- 13485ca: A file declares 5 top-level functions at most (`function-size/max-functions`), as in the Norminette of 42: function declarations and functions assigned to a top-level `const`, exported or not. Nested functions, callbacks and object methods do not count. A project with a file of 6 functions starts failing. The packages move their helpers into files of their own, with no change in behavior. With `server-state`, the in-memory API of the vite example is split into `devApi.ts`, the Vite plugin, and `devApiRoutes.ts`, which answers each route from a table.
- 11f6d20: A function takes 4 parameters at most (`max-params`) and declares 5 local variables at most (`function-size/max-variables`), as in the Norminette of 42. Each name bound by a destructuring counts, a nested function is counted on its own, and tests are exempt. A project with longer signatures or more locals starts failing. The packages are rewritten to fit, with no change in behavior.

## 0.2.0

### Minor Changes

- c196c84: New package: `check-doc-length` fails when a Markdown file is longer than 300 lines, and `check-doc-length split <file>` cuts it into a folder along its `##` headings, with a `README.md` index, headings moved up and the links that point into it rewritten. It reads Markdown with `mdast-util-from-markdown` and copies the content as written, front matter and code blocks included. Settings go under `docLength` in `package.json`.
