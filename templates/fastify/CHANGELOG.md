# template-fastify

## 0.2.1

### Patch Changes

- 7a815dc: The Swagger UI theme uses the pastel colors of the series: yellow `#ffe98f`, pink `#ffb8e6` and blue `#b3c5ff`, with dark text on the blue method badge.

## 0.2.0

### Minor Changes

- a0fbb5d: `AGENTS.md` sums up for a coding agent what `npm run check` runs and the conventions worth knowing before writing code, with pointers to `README.md` and `docs/`. `CLAUDE.md` imports it with `@AGENTS.md`, and alint checks its paths like those of the README.
- 1e8e26f: `npm run check` runs `check-doc-length` (`@brutalway/check-doc-length`): a Markdown file of the project longer than 300 lines fails it, and `npx check-doc-length split <file>` shows how to cut it into a folder along its `##` headings.
- 1654ce3: `npm run check` runs `check-doc-links` (`@brutalway/check-doc-links`): a link of a Markdown file to a page that is gone fails it, other errors only warn, and nothing is requested when the machine is offline.
- 9c29d82: `npm run check` runs `check-doc-sources` (`@brutalway/check-doc-sources`): when a file you changed is cited by a Markdown file that did not change, it prints a warning naming the doc and the line, without failing.
- f1b60f3: `npm run check` runs jscpd (`.jscpd.json`): a block of 8 lines or 120 tokens that appears twice in `src/`, tests left out, fails it.

### Patch Changes

- Use the @brutalway packages of this release. `check-doc-links` keeps its default skipped links when `docLinks.skip` is set, `check-doc-sources` no longer crashes on a link with a malformed `%`, the agent hook says which check could not start, and `file-named-after-export` also reports a named default export.

## 0.1.0

### Minor Changes

- First versioned release. Fastify and TypeScript run by Node without a build step, with the todo list API as the example (Zod schemas, `node:sqlite`, a themed Swagger UI on `/docs`), `node:test` tests, and the `@brutalway/*` checks run by `npm run check`, the pre-commit hook and CI.
