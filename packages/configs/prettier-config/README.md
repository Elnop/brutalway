# @brutalway/prettier-config

Prettier config: single quotes, trailing commas everywhere, 200 columns. Everything else is Prettier's default.

## Install

```sh
npm install --save-dev @brutalway/prettier-config
```

In `package.json`:

```json
{
  "prettier": "@brutalway/prettier-config"
}
```

### Tailwind CSS

`@brutalway/prettier-config/tailwind` adds [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss), so `prettier --check` fails on classes that are not in Tailwind's order.

```sh
npm install --save-dev @brutalway/prettier-config prettier-plugin-tailwindcss
```

```json
{
  "prettier": "@brutalway/prettier-config/tailwind"
}
```

## Options

| Option               | Value                                         |
| -------------------- | --------------------------------------------- |
| `singleQuote`        | `true`                                        |
| `trailingComma`      | `all`                                         |
| `printWidth`         | `200`                                         |
| `plugins`            | `prettier-plugin-tailwindcss`, `tailwind` only |
| `tailwindStylesheet` | `./src/app/globals.css`, `tailwind` only       |

The Tailwind variant reads the theme from `src/app/globals.css`, relative to the `package.json`, so custom tokens like `bg-ink` are sorted with the built-in classes.
