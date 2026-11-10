# @brutalway/tsconfig

Strict TypeScript configs, for projects where a bundler or Node runs the TypeScript directly.

## Install

```sh
npm install --save-dev @brutalway/tsconfig
```

`tsconfig.json` for a React app built with Vite:

```json
{
  "extends": "@brutalway/tsconfig/react-vite.json",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

`paths`, `include` and `exclude` stay in your own file. For a Node project, extend `@brutalway/tsconfig/node.json` the same way.

## Usage

### Check vendored code with its own flags

The third-party variant goes in a project of its own, referenced by the app's:

```json
{
  "extends": "@brutalway/tsconfig/react-vite-third-party.json",
  "compilerOptions": {
    "composite": true,
    "noEmit": false,
    "emitDeclarationOnly": true,
    "outDir": "node_modules/.cache/tsc-third-party"
  },
  "include": ["third-party"]
}
```

The app lists it under `references` and is checked with `tsc -b`.

## Options

`base.json` turns on `strict` and the flags it leaves out: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`. It also sets `noEmit`, `allowImportingTsExtensions`, `erasableSyntaxOnly` and `verbatimModuleSyntax`.

| File                          | Adds                                                                                                                                                              |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `base.json`                   | the flags above, `target` ES2022                                                                                                                                  |
| `node.json`                   | `target` and `lib` ES2024 (what Node 26 runs), `module` and `moduleResolution` nodenext, Node types                                                               |
| `react-vite.json`             | `lib` ES2024 with the DOM libs, `moduleResolution` bundler, `jsx` react-jsx, `vite/client` types                                                                  |
| `react-vite-third-party.json` | `react-vite.json` without `exactOptionalPropertyTypes` and `noPropertyAccessFromIndexSignature`, for code copied from a registry (shadcn/ui) that you do not edit |

## Why

`paths`, `include` and `exclude` are not in the shared files because TypeScript resolves them from the file that declares them.

The third-party project keeps vendored files checked with the flags they were written for, and the app keeps every flag. With `tsc -b`, the app reads the vendored files through their declarations instead of compiling them with its own flags.
