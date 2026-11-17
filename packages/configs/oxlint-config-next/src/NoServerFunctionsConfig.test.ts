import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

const FIXTURE = fileURLToPath(new URL('../fixtures/no-server-functions', import.meta.url));

describe('noServerFunctionsConfig', () => {
  it("reports each 'use server' and 'use cache', in a file or in a function, once", () => {
    assert.deepEqual(lintFixture(FIXTURE), [
      'src/features/todo-list/addTodo.ts:1 server-actions(no-restricted-syntax)',
      'src/features/todo-list/renameTodo.ts:2 server-actions(no-restricted-syntax)',
      'src/features/todo-list/todoCount.ts:2 server-actions(no-restricted-syntax)',
      'src/features/todo-list/todoTitles.ts:1 server-actions(no-restricted-syntax)',
    ]);
  });
});
