# @brutalway/oxlint-config-vitest

Oxlint config for Vitest tests. It does not extend any other config.

## Install

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-vitest
```

```ts
import { typescriptConfig } from '@brutalway/oxlint-config-typescript';
import { vitestConfig } from '@brutalway/oxlint-config-vitest';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [typescriptConfig, vitestConfig],
});
```

## Usage

Since it extends nothing, it fits next to any of the `@brutalway/oxlint-config-*` presets. `@brutalway/oxlint-config-react-vite` already includes it.

## Rules

- `it()` inside a `describe`, `test()` outside
- `vi.fn()` takes the type of the function it replaces: `vi.fn<() => void>()`
- `toThrow()` names the expected message
- one matcher for each check: `toStrictEqual` instead of `toEqual`, `toBe(true)` instead of `toBeTruthy()`, `toBeNull()` instead of `toBe(null)`, `toHaveBeenCalledTimes(1)` instead of `toHaveBeenCalledOnce()`
- `expect(value, message)` is accepted, Vitest takes a message as second argument
