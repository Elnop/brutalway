# @brutalway/check-doc-sources

`check-doc-sources` lists the files you changed that a Markdown doc of the project cites, when that doc did not change too, so you read it again before it says something false.

## Install

```sh
npm install --save-dev @brutalway/check-doc-sources
```

A doc declares what it depends on by citing it, nothing else to write.

## Usage

### Check your local changes

```sh
check-doc-sources
```

Compares with `HEAD`: the files changed, staged or not, and the new files git does not ignore.

### Check a pull request in CI

```sh
check-doc-sources --base origin/main
```

Compares with the commit the branch started from.

### Stop warning about some files

List them under `docSources.ignoreSources` in `package.json`, or leave some docs out with `ignore`:

```json
"docSources": { "ignore": ["**/node_modules/**", "docs/archive/**"] }
```

## Reference

### What counts as a citation

- a path in inline code, like `src/app/App.tsx`, resolved from the folder of the doc up to the root of the project, the nearest existing file wins: `package.json` in `packages/tool/README.md` is `packages/tool/package.json`
- the target of a relative link, like `[the store](../src/todosStore.ts#L4)`, resolved from the doc

Only existing files count. A folder, another Markdown file, a URL, a code block or a path that does not exist is not a citation: checking that a cited path exists is the job of a link checker such as alint's `markdown_paths_resolve`.

### What counts as a change

Without `--base`, the files changed since `HEAD`, staged or not, and the new files git does not ignore. With it, the files changed since the commit the branch started from, which is what a CI job on a pull request wants. A change of whitespace only is left out. Paths are relative to the folder it runs in, so it works in a package of a monorepo.

### Output

For each changed file cited by a doc that did not change, it prints the file, the doc and the line of the citation. It always exits with 0. Before the first commit every file is new, so it reports nothing. Outside a git repository, it says it has nothing to compare with.

### Settings

Under `docSources` in `package.json`:

| Setting         | Default                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------- |
| `include`       | `["**/*.md"]`                                                                                 |
| `ignore`        | `["**/node_modules/**", "**/dist/**", "**/CHANGELOG.md"]`                                     |
| `ignoreSources` | `["**/package.json", "**/package-lock.json"]`, cited files that change too often to warn about |

## Why

A doc that names a file keeps describing it after the file changes.

It never fails: a file can change without making its doc false, and a check that fails would push for an edit made only to silence it.
