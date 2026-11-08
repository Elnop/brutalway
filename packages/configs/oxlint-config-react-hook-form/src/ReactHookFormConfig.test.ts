import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('reactHookFormConfig', () => {
  it('keeps every form on its Zod schema', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'Signup.tsx:7 form-conventions(zod-resolver)',
      'Signup.tsx:8 form-conventions(validation-in-schema)',
      'Signup.tsx:12 form-conventions(validation-in-schema)',
      'Signup.tsx:13 form-conventions(validation-in-schema)',
    ]);
  });
});
