# @brutal/tsconfig

Strict TypeScript configs. `base.json` turns on `strict` and the flags it leaves out: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature` and `exactOptionalPropertyTypes`. It also sets `noEmit`, `allowImportingTsExtensions`, `erasableSyntaxOnly` and `verbatimModuleSyntax`, for projects where a bundler or Node runs the TypeScript directly.

| File              | Adds                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| `base.json`       | the flags above, `target` ES2022                                                                    |
| `node.json`       | `target` and `lib` ES2024 (what Node 26 runs), `module` and `moduleResolution` nodenext, Node types |
| `react-vite.json` | DOM libs, `moduleResolution` bundler, `jsx` react-jsx, `vite/client` types                          |

```sh
npm install --save-dev @brutal/tsconfig
```

```json
{
  "extends": "@brutal/tsconfig/react-vite.json",
  "compilerOptions": {
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["src"]
}
```

`paths`, `include` and `exclude` stay in your own file: TypeScript resolves them from the file that declares them.
