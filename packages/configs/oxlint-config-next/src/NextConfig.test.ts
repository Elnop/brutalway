import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';
import { lintFixture } from '@brutalway/lint-utils/lintFixture';

function fixture(name: string): string {
  return fileURLToPath(new URL(`../fixtures/${name}`, import.meta.url));
}

function diagnostics(name: string, folder: string): string[] {
  return lintFixture(fixture(name)).filter((line) => line.startsWith(folder));
}

describe('nextConfig', () => {
  it('checks the client boundary, server actions and nextjs rules', () => {
    assert.deepEqual(
      lintFixture(fixture('rules')).filter((line) => !line.startsWith('src/app/')),
      [
        'src/features/feed/Banner.tsx:2 next(no-img-element)',
        'src/features/feed/FeedContainer.tsx:4 client-boundary(no-restricted-syntax)',
        'src/features/todo-list/components/presenters/TodoItem.tsx:1 client-boundary(no-restricted-syntax)',
        'src/features/todo-list/components/TodoForm.tsx:2 server-actions(no-restricted-syntax)',
        'src/features/todo-list/todoActions.ts:7 server-actions(no-restricted-syntax)',
        'src/features/todo-list/todoActions.ts:7 server-actions(no-restricted-syntax)',
        'src/shared/ThemeContainer.tsx:1 client-boundary(no-restricted-syntax)',
      ],
    );
  });

  it('checks a file of src/app/ against every rule that is not about names, exports or props', () => {
    assert.deepEqual(diagnostics('rules', 'src/app/'), [
      'src/app/todos/page.tsx:2 client-boundary(no-restricted-syntax)',
      'src/app/todos/page.tsx:3 eslint(no-restricted-imports)',
      'src/app/todos/page.tsx:5 no-comments(disallowComments)',
      'src/app/todos/page.tsx:6 typescript(no-explicit-any)',
      'src/app/todos/page.tsx:7 eslint(no-nested-ternary)',
      'src/app/todos/page.tsx:8 eslint(no-console)',
      'src/app/todos/page.tsx:10 server-actions(no-restricted-syntax)',
      'src/app/todos/page.tsx:12 component-roles(no-restricted-syntax)',
      'src/app/todos/page.tsx:13 next(no-img-element)',
    ]);
  });

  it('accepts every file Next.js names, with the exports it asks for', () => {
    assert.deepEqual(lintFixture(fixture('conventions')), []);
  });
});
