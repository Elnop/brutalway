# template-package

## 0.1.0

### Minor Changes

- f3d0392: New template for a standalone npm package. The example is the todo list kept in a JSON file: the `"."` export offers `addTodo`, `listTodos` and `completeTodo`, and the `todo` bin calls them (`todo add|list|done`, `--file`). Each entry point is a file at the root of `src/`, checked by `@brutalway/dependency-cruiser-config/library` and `check-tree --root-entries`, tsdown builds `dist/` with its types, and `@brutalway/alint-config/library.yml` pins the devDependencies only. Versions come from changesets, and `.github/workflows/release.yml` publishes them to npm with trusted publishing and provenance.
