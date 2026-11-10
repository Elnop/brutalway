# @brutalway/lint-utils

Helpers shared by the `@brutalway` lint plugins and configs.

## Install

The package is private and not published to npm. You probably want one of the packages that use it:

- [@brutalway/eslint-plugin-file-named-after-export](https://www.npmjs.com/package/@brutalway/eslint-plugin-file-named-after-export)
- [@brutalway/eslint-plugin-store-layout](https://www.npmjs.com/package/@brutalway/eslint-plugin-store-layout)
- [@brutalway/oxlint-config-typescript](https://www.npmjs.com/package/@brutalway/oxlint-config-typescript)

## Reference

- `baseName(filename)`: the file name without folder and extension
- `exportsOf(program)`: the named exports of a module, with their declaration node
- `ruleTester`: an oxlint `RuleTester` wired to `node:test`
- `lintFixture(directory)`: runs oxlint in a folder with its own `oxlint.config.ts` and returns one `file:line rule` entry per diagnostic
