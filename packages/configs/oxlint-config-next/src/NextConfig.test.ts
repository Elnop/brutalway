import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

describe('nextConfig', () => {
  it('checks the client boundary, server actions and nextjs rules, and accepts route files', () => {
    assert.deepEqual(lintFixture(fileURLToPath(new URL('../fixtures', import.meta.url))), [
      'src/app/Banner.tsx:2 next(no-img-element)',
      'src/features/feed/FeedContainer.tsx:4 client-boundary(no-restricted-syntax)',
      'src/features/todo-list/components/presenters/TodoItem.tsx:1 client-boundary(no-restricted-syntax)',
      'src/features/todo-list/components/TodoForm.tsx:2 server-actions(no-restricted-syntax)',
      'src/features/todo-list/todoActions.ts:7 server-actions(no-restricted-syntax)',
      'src/features/todo-list/todoActions.ts:7 server-actions(no-restricted-syntax)',
      'src/shared/ThemeContainer.tsx:1 client-boundary(no-restricted-syntax)',
    ]);
  });
});
