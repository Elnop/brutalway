# @brutalway/oxlint-config-shadcn

Oxlint config for an app whose controls come from [shadcn/ui](https://ui.shadcn.com), vendored in `third-party/shadcn/` and imported through `@third-party/shadcn/`. A raw `<button>` next to a `Button` drifts away from it (focus ring, disabled state, size), so the app only writes the primitives.

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-shadcn
```

```ts
import { reactConfig } from '@brutalway/oxlint-config-react';
import { shadcnConfig } from '@brutalway/oxlint-config-shadcn';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, shadcnConfig],
  ignorePatterns: ['third-party'],
});
```

## `ui-conventions/primitives-first`

These raw elements are reported, with the primitive to import instead:

| Element                    | Primitive                                      |
| -------------------------- | ---------------------------------------------- |
| `<button>`                 | `Button` from `@third-party/shadcn/button`     |
| `<input>`                  | `Input` from `@third-party/shadcn/input`       |
| `<input type="checkbox">`  | `Checkbox` from `@third-party/shadcn/checkbox` |
| `<input type="radio">`     | `RadioGroup` from `@third-party/shadcn/radio-group` |
| `<select>`                 | `Select` from `@third-party/shadcn/select`     |
| `<textarea>`               | `Textarea` from `@third-party/shadcn/textarea` |

`<input type="hidden">` is left alone. When the primitive is not vendored yet, the message gives the command that adds it, like `npx shadcn add textarea`. The vendored files themselves are not linted: keep `third-party` in `ignorePatterns`.

## `ui-conventions/one-icon-library`

Icons come from `lucide-react`, the `iconLibrary` of `components.json` and the set the primitives already use. Imports of `react-icons`, `@heroicons/*`, `@radix-ui/react-icons`, `@tabler/icons-react`, `@phosphor-icons/*`, `phosphor-react`, `@fortawesome/*`, `react-feather`, `@mui/icons-material`, `iconoir-react`, `@remixicon/react` and `@hugeicons/*` are reported.
