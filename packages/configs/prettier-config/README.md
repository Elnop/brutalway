# @brutalway/prettier-config

Prettier config: single quotes, trailing commas everywhere, 200 columns. Everything else is Prettier's default.

```sh
npm install --save-dev @brutalway/prettier-config
```

In `package.json`:

```json
{
  "prettier": "@brutalway/prettier-config"
}
```

## Tailwind CSS

`@brutalway/prettier-config/tailwind` adds [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss), so `prettier --check` fails on classes that are not in Tailwind's order. It reads the theme from `src/app/globals.css`, relative to the `package.json`, so custom tokens like `bg-ink` are sorted with the built-in classes.

```sh
npm install --save-dev @brutalway/prettier-config prettier-plugin-tailwindcss
```

```json
{
  "prettier": "@brutalway/prettier-config/tailwind"
}
```
