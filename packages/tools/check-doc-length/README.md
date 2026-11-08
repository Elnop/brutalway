# @brutalway/check-doc-length

A Markdown file grows one section at a time until nobody reads it to the end. `check-doc-length` fails when a Markdown file of the project is longer than a limit, and `check-doc-length split` cuts it into a folder along its headings, rewriting the links that point into it.

```sh
npm install --save-dev @brutalway/check-doc-length
```

## Check

```sh
check-doc-length
```

Lists each Markdown file above the limit (300 lines by default) and exits with 1, so it fits in `npm run check`.

## Split

```sh
check-doc-length split docs/roadmap.md
check-doc-length split docs/roadmap.md --write
```

Without `--write`, it prints the files it would write. With it, `docs/roadmap.md` becomes a folder:

- `docs/roadmap/README.md` holds the text before the first `##` heading and a list of links to the sections. GitHub shows that file when the folder is opened.
- each `##` section becomes `docs/roadmap/<slug>.md`, its heading moved up to `#` and the headings below it moved up with it
- with `--file-depth 3`, each `##` section becomes a folder with its own `README.md`, and each `###` section a file in it

The content is copied as it was written, front matter and code blocks included: the file is read with `mdast-util-from-markdown`, the parser of remark, and cut at the positions of its headings, so a `#` in a code block is not a heading. Anchors are computed with `github-slugger`, the way GitHub does. A link between two sections, a relative link that now starts one folder deeper, and a link from another Markdown file of the project to the doc or to one of its anchors are rewritten to the new path.

## Settings

Under `docLength` in `package.json`, each one also a flag:

| Setting | Flag | Default |
|---|---|---|
| `maxLines` | `--max-lines` | `300` |
| `fileDepth` | `--file-depth` | `2`: `##` sections become files |
| `indexName` | `--index-name` | `README.md` |
| `orderPrefix` | `--order-prefix` | `false`, `true` names files `01-setup.md` |
| `include` | | `["**/*.md"]` |
| `ignore` | | `["**/node_modules/**", "**/dist/**", "**/CHANGELOG.md"]` |

```json
"docLength": { "maxLines": 200, "ignore": ["**/node_modules/**", "docs/archive/**"] }
```
