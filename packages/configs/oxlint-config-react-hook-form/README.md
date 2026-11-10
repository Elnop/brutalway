# @brutalway/oxlint-config-react-hook-form

Oxlint config for react-hook-form with Zod. A form validates in one place, its schema.

## Install

```sh
npm install --save-dev oxlint @brutalway/oxlint-config-react-hook-form
```

```ts
import { reactConfig } from '@brutalway/oxlint-config-react';
import { reactHookFormConfig } from '@brutalway/oxlint-config-react-hook-form';
import { defineConfig } from 'oxlint';

export default defineConfig({
  extends: [reactConfig, reactHookFormConfig],
});
```

## Usage

When `form-conventions/validation-in-schema` fires, move the rule into the Zod schema, where `.min(1, 'The title is blank')` also carries the message shown to the user.

## Rules

### `form-conventions/zod-resolver`

`useForm` takes `resolver: zodResolver(XSchema)`. A `useForm()` without options, or with another resolver, is reported:

```ts
useForm({ resolver: zodResolver(TodoDraftSchema), defaultValues: { title: '' } });
```

### `form-conventions/validation-in-schema`

No validation outside the schema: `register('title', { required: true })`, `useController({ rules })` and `<Controller rules={...} />` are reported.

## Why

With the schema as the only place that validates, the type of the values the form hands over is the type the schema checked.
