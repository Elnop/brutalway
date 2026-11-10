# @brutalway/stylelint-config

Stylelint config for projects that keep their colors in one stylesheet and may use CSS Modules. Colors are custom properties declared in `src/app/globals.css`, and a `X.module.css` belongs to the `X.tsx` next to it.

## Install

```sh
npm install --save-dev stylelint @brutalway/stylelint-config
```

`package.json`:

```json
{
  "stylelint": { "extends": "@brutalway/stylelint-config" }
}
```

## Usage

### Use another stylesheet for the colors

The stylesheet path is an option of `brutalway/color-tokens`, relative to the folder stylelint runs from:

```json
{
  "extends": "@brutalway/stylelint-config",
  "rules": { "brutalway/color-tokens": [true, { "stylesheet": "app/styles.css" }] }
}
```

## Rules

### `brutalway/color-tokens`

Outside of `src/app/globals.css`, a color is a `var()` of a custom property declared there. The rule reports hex colors, color functions (`rgb()`, `hsl()`, `oklch()`...) and named colors (`white`, `tomato`). Named colors are only looked for in properties that take a color, so `grid-area: tan` passes. Strings and `url()` are skipped, so a `%23ffd23f` inside an inline SVG is left alone.

The message names the three closest tokens, compared in OKLab:

```
#fffdf4 is not a color token. Use a var() of a color declared in src/app/globals.css, closest: var(--paper), var(--yellow), var(--blue).
```

### `brutalway/module-next-to-component`

`TodoItem.module.css` needs a `TodoItem.tsx` in the same folder. A stylesheet left behind after a component is renamed or deleted is reported.

### `brutalway/no-unused-class`

Every class of `TodoItem.module.css` is used by `TodoItem.tsx`, as `styles.name` or `styles['name']`, where `styles` is whatever name the component imports the stylesheet under. A component that does not import its stylesheet is reported too.

### CSS Module class names

In a `.module.css` file, `selector-class-pattern` asks for camelCase classes (`.todoItem`). Plain `.css` files keep whatever naming they use.

## Why

camelCase class names let the component read `styles.todoItem`, so the name is the same in both files.
