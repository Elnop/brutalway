---
'@brutalway/check-doc-length': minor
---

New package: `check-doc-length` fails when a Markdown file is longer than 300 lines, and `check-doc-length split <file>` cuts it into a folder along its `##` headings, with a `README.md` index, headings moved up and the links that point into it rewritten. It reads Markdown with `mdast-util-from-markdown` and copies the content as written, front matter and code blocks included. Settings go under `docLength` in `package.json`.
