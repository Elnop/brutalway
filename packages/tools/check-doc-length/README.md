# @brutalway/check-doc-length

`check-doc-length` fails when a Markdown file of the project is longer than a limit, and `check-doc-length split` cuts it into a folder along its headings, rewriting the links that point into it.

## Install

```sh
npm install --save-dev @brutalway/check-doc-length
```

Then add `check-doc-length` to `npm run check`.

## Usage

### Find the docs that are too long

```sh
check-doc-length
```

### Split a long doc

Preview the files it would write, then write them:

```sh
check-doc-length split docs/roadmap.md
check-doc-length split docs/roadmap.md --write
```

### Split down to `###` sections

```sh
check-doc-length split docs/roadmap.md --file-depth 3 --write
```

Each `##` section becomes a folder with its own `README.md`, and each `###` section a file in it.

### Change the limit or skip some files

```json
"docLength": { "maxLines": 200, "ignore": ["**/node_modules/**", "docs/archive/**"] }
```

## Reference

### Check

`check-doc-length` lists each Markdown file above the limit (300 lines by default) and exits with 1.

### Split

Without `--write`, `split` prints the files it would write. With it, `docs/roadmap.md` becomes a folder:

- `docs/roadmap/README.md` holds the text before the first `##` heading and a list of links to the sections. GitHub shows that file when the folder is opened.
- each `##` section becomes `docs/roadmap/<slug>.md`, its heading moved up to `#` and the headings below it moved up with it
- with `--file-depth 3`, each `##` section becomes a folder with its own `README.md`, and each `###` section a file in it

A link between two sections, a relative link that now starts one folder deeper, and a link from another Markdown file of the project to the doc or to one of its anchors are rewritten to the new path.

### Settings

Under `docLength` in `package.json`, each one also a flag:

| Setting       | Flag             | Default                                                   |
| ------------- | ---------------- | --------------------------------------------------------- |
| `maxLines`    | `--max-lines`    | `300`                                                     |
| `fileDepth`   | `--file-depth`   | `2`: `##` sections become files                           |
| `indexName`   | `--index-name`   | `README.md`                                               |
| `orderPrefix` | `--order-prefix` | `false`, `true` names files `01-setup.md`                 |
| `include`     |                  | `["**/*.md"]`                                             |
| `ignore`      |                  | `["**/node_modules/**", "**/dist/**", "**/CHANGELOG.md"]` |

## Why

A Markdown file grows one section at a time until nobody reads it to the end.

The split copies the content as it was written, front matter and code blocks included: the file is read with `mdast-util-from-markdown`, the parser of remark, and cut at the positions of its headings, so a `#` in a code block is not a heading. Anchors are computed with `github-slugger`, the way GitHub does.
