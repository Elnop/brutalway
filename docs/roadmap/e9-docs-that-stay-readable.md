# E9. Docs that stay readable

A Markdown file grows one section at a time until nobody reads it to the end. `mdsplit` splits a file along its headings but checks nothing and leaves internal links broken. markdownlint and remark-lint only limit line length, not file length.

The tool is `@brutalway/check-doc-length`, with the command `check-doc-length`, named like `check-tree` after what it checks: `tldr` is already the name of a well-known CLI (tldr-pages). It reads Markdown with `mdast-util-from-markdown`, the parser of remark, which gives the headings, the links and their positions, then cuts the source text at those positions, so the content is copied byte for byte, front matter and code blocks included. Anchors are computed with `github-slugger`, the way GitHub does.

`docs/roadmap.md` was 368 lines, above the 300 lines allowed by default, so the tool's first real use was to split it into this folder: one file per epic, and `README.md` with the introduction and the list.

**E9-S0. Spike, docs that describe code that changed.** Tracked in [#52](https://github.com/Elnop/brutalway/issues/52).
- A doc already says what it depends on: the docs of the templates cite their files in backticks, 52 paths across `README.md`, `AGENTS.md` and `docs/`. alint 0.21.0 (`markdown_paths_resolve`) fails when a cited path under `src/`, `e2e/`, `docs/`, `.github/` or `.claude/` does not exist, so a renamed or moved file is caught today. No front matter list or marker is needed: the citation is the declaration.
- What is left is a file that still exists but changed. Only files count: `src/shared/` or `src/features/` are cited everywhere, and counting folders would warn on every commit.
- Replayed on the history of `templates/vite`: 12 commits touched a file cited by a doc, the doc changed in the same commit for 7 of them. A failing check would push for an edit made only to silence it, so the check warns and exits with 0.
- Not taken: embedding snippets from the source (`markdown-magic`, `embedme`) only covers docs that quote code, and these docs describe it. Swimm does the same idea as a hosted product.

**E9-S1. Check and split long docs.** As someone maintaining the docs of a project, I want a check that fails when a Markdown file gets too long, and a command that splits it into folders along its headings, so that a long doc gets split before it becomes a wall of text. Tracked in [#49](https://github.com/Elnop/brutalway/issues/49).
- `check-doc-length` lists the Markdown files above the threshold and exits non-zero. `check-doc-length split <file>` prints the tree it would write, and writes it with `--write`.
- Settings under `docLength` in `package.json`, overridable on the command line: `maxLines` (300), the heading depth that becomes a file (2) and the one that becomes a folder, included and ignored globs, and the file naming (slug of the heading, with an optional `01-` order prefix).
- Each folder gets an index with the text before the first heading and links to its children. It is named `README.md` by default, since GitHub shows that file when a folder is opened, and the name is configurable.
- A split file starts with its own heading moved up to `#`. Links between sections, and links from the other Markdown files of the project to an anchor that moved, are rewritten to the new path.
- In `npm run check` of the repository and of both templates.

**E9-S2. The site follows split docs.** As someone reading the docs on brutalway.elnop.dev, I want the files of a split doc to show up, so that splitting a doc does not hide it.
- The site lists `docs/` through the GitHub contents API, which does not go into subfolders: it walks them too.
- `docs/roadmap.md` is split with the tool, and the links of `README.md` and of the issues' bodies that point to it are updated.

**E9-S3. Warn when a cited file changes without its doc.** As someone changing code, I want to be told which docs cite the files I changed, so that I check what they say before it turns false.
- Reads the Markdown files of the project with the parser of `check-doc-length`, and takes each path in inline code or in a link that resolves to a file. Folders are left out.
- Compares with the files changed since `HEAD` (staged or not), or since `--base <ref>` in CI. For each changed file cited by a doc that did not change, it prints the file, the doc and the line, and exits with 0. A change of whitespace only is skipped.
- In `npm run check` of the repository and of both templates, so the pre-commit hook shows it.
