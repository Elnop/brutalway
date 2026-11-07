import { deepStrictEqual } from 'node:assert';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

test('reactHookFormConfig keeps every form on its Zod schema', () => {
  deepStrictEqual(lintFixture(fileURLToPath(new URL('fixtures', import.meta.url))), [
    'Signup.tsx:7 form-conventions(zod-resolver)',
    'Signup.tsx:8 form-conventions(validation-in-schema)',
    'Signup.tsx:12 form-conventions(validation-in-schema)',
    'Signup.tsx:13 form-conventions(validation-in-schema)',
  ]);
});
