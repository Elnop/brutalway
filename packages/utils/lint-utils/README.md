# @brutalway/lint-utils

Helpers shared by the `@brutalway` lint plugins and configs. Each package installs it as a dev dependency, and tsdown bundles the parts it imports into its `dist`.

## Install

```sh
npm install --save-dev @brutalway/lint-utils
```

You probably want one of the packages that use it:

- [@brutalway/eslint-plugin-file-named-after-export](https://www.npmjs.com/package/@brutalway/eslint-plugin-file-named-after-export)
- [@brutalway/eslint-plugin-store-layout](https://www.npmjs.com/package/@brutalway/eslint-plugin-store-layout)
- [@brutalway/oxlint-config-typescript](https://www.npmjs.com/package/@brutalway/oxlint-config-typescript)
- [@brutalway/oxlint-config-tailwind](https://www.npmjs.com/package/@brutalway/oxlint-config-tailwind)
- [@brutalway/stylelint-config](https://www.npmjs.com/package/@brutalway/stylelint-config)

## Reference

### Lint rules

- `baseName(filename)`: the file name without folder and extension
- `exportsOf(program)`: the named exports of a module, with their declaration node
- `ruleTester`: an oxlint `RuleTester` wired to `node:test`
- `lintFixture(directory)`: runs oxlint in a folder with its own `oxlint.config.ts` and returns one `file:line rule` entry per diagnostic

### Colors

- `oklab(value)`: a hex, `rgb()`, `rgba()` or `oklch()` color in Oklab, or `undefined` for any other value
- `oklabDistance(left, right)`: the Euclidean distance between two Oklab colors
- `createColorTokenReader(parse)`: a function that reads a stylesheet, parses its tokens with `parse` and keeps them until the file's mtime changes. A missing file gives no tokens.
- the `Oklab` and `ColorToken` types
