# @brutalway/color-utils

Color code shared by two `@brutalway` configs, which bundle it at build time. You probably want one of those instead:

- [@brutalway/oxlint-config-tailwind](https://www.npmjs.com/package/@brutalway/oxlint-config-tailwind)
- [@brutalway/stylelint-config](https://www.npmjs.com/package/@brutalway/stylelint-config)

It exports:

- `oklab(value)`: a hex, `rgb()`, `rgba()` or `oklch()` color in Oklab, or `undefined` for any other value
- `oklabDistance(left, right)`: the Euclidean distance between two Oklab colors
- `createColorTokenReader(parse)`: a function that reads a stylesheet, parses its tokens with `parse` and keeps them until the file's mtime changes. A missing file gives no tokens.
- the `Oklab` and `ColorToken` types
