import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { testMirrorViolations } from '#src/features/test-mirror/lib/testMirrorViolations.ts';

function project(files: string[], folders: string[] = []): string {
  const root = mkdtempSync(join(tmpdir(), 'mirror-'));
  for (const folder of folders) mkdirSync(join(root, folder), { recursive: true });
  for (const file of files) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), '');
  }
  return join(root, 'src');
}

function messagesOf(sourceRoot: string, platforms?: readonly string[]): string[] {
  return testMirrorViolations(sourceRoot, platforms).map(({ message }) => message);
}

describe('testMirrorViolations', () => {
  it('a test at the mirrored path of its source passes, and a source needs no test', () => {
    const root = project([
      'src/shared/todos/lib/normalizeTitle.ts',
      'src/shared/todos/lib/todosSelectors.ts',
      'src/features/list/TodoList.tsx',
      'test/unit/shared/todos/lib/normalizeTitle.test.ts',
      'test/unit/features/list/TodoList.test.tsx',
      'test/unit/features/list/__snapshots__/TodoList.test.tsx.snap',
      'test/e2e/todos.spec.ts',
      'test/support/createTestServer.ts',
    ]);
    assert.deepEqual(messagesOf(root), []);
  });

  it('a test under src/ is reported with the path it moves to', () => {
    const root = project(['src/shared/a/lib/a.ts', 'src/shared/a/lib/a.test.ts']);
    assert.deepEqual(testMirrorViolations(root), [
      {
        rule: 'test-in-source',
        path: 'src/shared/a/lib/a.test.ts',
        message:
          'src/shared/a/lib/a.test.ts is a test: move it to test/unit/shared/a/lib/a.test.ts, where test/unit mirrors src',
        move: { from: 'src/shared/a/lib/a.test.ts', to: 'test/unit/shared/a/lib/a.test.ts' },
      },
    ]);
  });

  it('a test whose source moved is reported with the git mv to run, when a single folder holds a source of that name', () => {
    const root = project([
      'src/features/b/lib/format.ts',
      'src/features/a/A.tsx',
      'test/unit/features/a/format.test.ts',
    ]);
    assert.deepEqual(testMirrorViolations(root), [
      {
        rule: 'orphan-test',
        path: 'test/unit/features/a/format.test.ts',
        message:
          'test/unit/features/a/format.test.ts has no source named format in src/features/a: src/features/b/lib holds one, run git mv test/unit/features/a/format.test.ts test/unit/features/b/lib/format.test.ts',
        move: {
          from: 'test/unit/features/a/format.test.ts',
          to: 'test/unit/features/b/lib/format.test.ts',
        },
      },
    ]);
  });

  it('a test with no source, or with sources of that name in several folders, is reported without a move', () => {
    const root = project([
      'src/features/a/A.tsx',
      'src/features/b/lib/format.ts',
      'src/features/c/lib/format.ts',
      'test/unit/features/a/format.test.ts',
      'test/unit/features/a/gone.test.ts',
    ]);
    assert.deepEqual(messagesOf(root), [
      'test/unit/features/a/format.test.ts has no source named format in src/features/a: src/features/b/lib, src/features/c/lib each hold one, move the test to the mirror of the one it tests',
      'test/unit/features/a/gone.test.ts has no source named gone in src/features/a: a unit test sits at the path of its source, under test/unit, move it there or delete it',
    ]);
    assert.equal(
      testMirrorViolations(root).some(({ move }) => move !== undefined),
      false,
    );
  });

  it('a component test may test a .ts source and a test may test a platform variant', () => {
    const root = project([
      'src/shared/a/hooks/useA.ts',
      'src/shared/a/hooks/useB.ts',
      'src/shared/a/Button.native.tsx',
      'src/shared/a/alert.tv.ts',
      'test/unit/shared/a/hooks/useA.test.tsx',
      'test/unit/shared/a/Button.test.tsx',
      'test/unit/shared/a/alert.test.ts',
    ]);
    assert.deepEqual(messagesOf(root), [
      'test/unit/shared/a/alert.test.ts has no source named alert in src/shared/a: a unit test sits at the path of its source, under test/unit, move it there or delete it',
    ]);
    assert.deepEqual(messagesOf(root, ['tv']), [
      'test/unit/shared/a/Button.test.tsx has no source named Button in src/shared/a: a unit test sits at the path of its source, under test/unit, move it there or delete it',
    ]);
  });

  it('a folder of test/unit that src/ does not have is reported once, at its top, and its tests with it', () => {
    const root = project(['src/features/a/A.tsx', 'test/unit/features/gone/deep/x.test.ts']);
    assert.deepEqual(messagesOf(root), [
      'test/unit/features/gone has no counterpart src/features/gone: move its tests to the mirror of their sources, or delete it',
      'test/unit/features/gone/deep/x.test.ts has no source named x in src/features/gone/deep: a unit test sits at the path of its source, under test/unit, move it there or delete it',
    ]);
  });

  it('a file of test/unit that is not a test, an empty folder of test/unit and a folder of test/ other than unit, e2e and support are reported', () => {
    const root = project(
      [
        'src/features/a/A.tsx',
        'test/unit/features/a/helper.ts',
        'test/fixtures/a.json',
        'test/setup.ts',
      ],
      ['test/unit/features'],
    );
    assert.deepEqual(messagesOf(root), [
      'test/fixtures is not a folder of test/, which holds unit/, e2e/, support/ only: unit/ mirrors src/ with its unit tests, e2e/ holds the end-to-end tests and support/ the helpers they share',
      'test/setup.ts is not a folder of test/, which holds unit/, e2e/, support/ only: unit/ mirrors src/ with its unit tests, e2e/ holds the end-to-end tests and support/ the helpers they share',
      'test/unit/features/a/helper.ts is not a test: test/unit only holds the unit tests of src, move it into test/support',
    ]);
  });

  it('an empty folder of test/unit is reported', () => {
    const root = project(['src/features/a/A.tsx'], ['test/unit/features/a']);
    assert.deepEqual(messagesOf(root), ['test/unit/features/a is empty: delete it']);
  });

  it('a project without test/ has nothing to report', () => {
    assert.deepEqual(messagesOf(project(['src/features/a/A.tsx'])), []);
  });
});
