import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { sliceGroupViolations } from '#src/features/shared-consumers/lib/sliceGroupViolations.ts';

function graph(edges: Record<string, string[]>) {
  const sources = new Set([...Object.keys(edges), ...Object.values(edges).flat()]);
  return [...sources].map((source) => ({ source, imports: edges[source] ?? [] }));
}

describe('sliceGroupViolations', () => {
  it('a slice whose files are linked by their imports, whatever their direction, passes', () => {
    const modules = graph({
      'src/shared/todos/todosStore.ts': ['src/shared/todos/TodosTypes.ts'],
      'src/shared/todos/todosSelectors.ts': ['src/shared/todos/TodosTypes.ts'],
      'src/shared/todos/hooks/useTodos.ts': ['src/shared/todos/todosStore.ts'],
      'src/shared/errors/errorMessage.ts': [],
    });
    assert.deepEqual(sliceGroupViolations('src', modules), []);
  });

  it('a slice holding files that never import each other is reported, one group per set of linked files', () => {
    const modules = graph({
      'src/features/a/A.ts': [
        'src/shared/utils/errorMessage.ts',
        'src/shared/utils/isRecord.ts',
        'src/shared/utils/packageRoot.ts',
      ],
      'src/shared/links/npmPackageName.ts': [],
      'src/shared/links/LinksTypes.ts': [],
      'src/shared/links/lib/linkKind.ts': ['src/shared/links/LinksTypes.ts'],
    });
    assert.deepEqual(sliceGroupViolations('src', modules), [
      'src/shared/links holds 2 groups of files that never import each other (lib/linkKind.ts, LinksTypes.ts) (npmPackageName.ts): split it into one slice per group',
      'src/shared/utils holds 3 groups of files that never import each other (errorMessage.ts) (isRecord.ts) (packageRoot.ts): split it into one slice per group',
    ]);
  });

  it('a test that imports two groups does not link them', () => {
    const modules = graph({
      'src/shared/text/slug.ts': [],
      'src/shared/text/pad.ts': [],
      'src/shared/text/text.test.ts': ['src/shared/text/slug.ts', 'src/shared/text/pad.ts'],
    });
    assert.deepEqual(sliceGroupViolations('src', modules), [
      'src/shared/text holds 2 groups of files that never import each other (pad.ts) (slug.ts): split it into one slice per group',
    ]);
  });

  it('a slice of the shared/ of a feature or of a slice is checked on its own, and its sub-features belong to it', () => {
    const modules = graph({
      'src/features/a/shared/title/TitleInput.tsx': [],
      'src/features/a/shared/title/TitleError.tsx': [],
      'src/shared/plan/plan.ts': ['src/shared/plan/features/steps/steps.ts'],
      'src/shared/plan/features/steps/steps.ts': ['src/shared/plan/shared/lock/lock.ts'],
      'src/shared/plan/shared/lock/lock.ts': [],
    });
    assert.deepEqual(sliceGroupViolations('src', modules), [
      'src/features/a/shared/title holds 2 groups of files that never import each other (TitleError.tsx) (TitleInput.tsx): split it into one slice per group',
    ]);
  });
  it('a platform variant is in the group of its base, and the variants of a base that does not exist are in one group', () => {
    const modules = graph({
      'src/shared/screen-title/useScreenTitle.ts': [],
      'src/shared/screen-title/useScreenTitle.web.ts': [],
      'src/shared/device/deviceIdentity.native.ts': [],
      'src/shared/device/deviceIdentity.web.ts': [],
      'src/shared/alert/alert.ts': [],
      'src/shared/alert/alert.tv.ts': [],
    });
    assert.deepEqual(sliceGroupViolations('src', modules), [
      'src/shared/alert holds 2 groups of files that never import each other (alert.ts) (alert.tv.ts): split it into one slice per group',
    ]);
    assert.deepEqual(sliceGroupViolations('src', modules, ['tv', 'web', 'native']), []);
  });
});
