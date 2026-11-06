# @brutal/oxlint-config-vitest

Oxlint config for Vitest tests:

- `it()` inside a `describe`, `test()` outside
- `vi.fn()` takes the type of the function it replaces: `vi.fn<() => void>()`
- `toThrow()` names the expected message
- one matcher for each check: `toStrictEqual` instead of `toEqual`, `toBe(true)` instead of `toBeTruthy()`, `toBeNull()` instead of `toBe(null)`, `toHaveBeenCalledTimes(1)` instead of `toHaveBeenCalledOnce()`
- `expect(value, message)` is accepted, Vitest takes a message as second argument

It does not extend any other config, so it fits next to any of the `@brutal/oxlint-config-*` presets. `@brutal/oxlint-config-react-vite` already includes it.

```sh
npm install --save-dev oxlint @brutal/oxlint-config-vitest
```

```ts
import { typescriptConfig } from '@brutal/oxlint-config-typescript';
import { vitestConfig } from '@brutal/oxlint-config-vitest';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [typescriptConfig, vitestConfig],
});
```
