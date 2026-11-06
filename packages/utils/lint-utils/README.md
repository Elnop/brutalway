# @brutal/lint-utils

Helpers shared by the `@brutal` lint plugins and configs. You probably want one of those instead:

- [@brutal/eslint-plugin-file-named-after-export](https://www.npmjs.com/package/@brutal/eslint-plugin-file-named-after-export)
- [@brutal/eslint-plugin-store-layout](https://www.npmjs.com/package/@brutal/eslint-plugin-store-layout)
- [@brutal/oxlint-config-typescript](https://www.npmjs.com/package/@brutal/oxlint-config-typescript)

It exports:

- `baseName(filename)`: the file name without folder and extension
- `exportsOf(program)`: the named exports of a module, with their declaration node
- `ruleTester`: an oxlint `RuleTester` wired to `node:test`
- `lintFixture(directory)`: runs oxlint in a folder with its own `oxlint.config.ts` and returns one `file:line rule` entry per diagnostic
