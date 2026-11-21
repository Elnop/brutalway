import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { sharedFeatureGroupViolations } from '#src/features/shared-consumers/lib/sharedFeatureGroupViolations.ts';
import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

function messagesOf(violations: readonly Violation[]): string[] {
  return violations.map(({ message }) => message);
}

function graph(edges: Record<string, string[]>) {
  const sources = new Set([...Object.keys(edges), ...Object.values(edges).flat()]);
  return [...sources].map((source) => ({ source, imports: edges[source] ?? [] }));
}

describe('sharedFeatureGroupViolations', () => {
  it('a shared feature whose files are linked by their imports, whatever their direction, passes', () => {
    const modules = graph({
      'src/shared/todos/todosStore.ts': ['src/shared/todos/TodosTypes.ts'],
      'src/shared/todos/todosSelectors.ts': ['src/shared/todos/TodosTypes.ts'],
      'src/shared/todos/hooks/useTodos.ts': ['src/shared/todos/todosStore.ts'],
      'src/shared/errors/errorMessage.ts': [],
    });
    assert.deepEqual(messagesOf(sharedFeatureGroupViolations('src', modules)), []);
  });

  it('a shared feature holding files that never import each other is reported, one group per set of linked files', () => {
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
    assert.deepEqual(messagesOf(sharedFeatureGroupViolations('src', modules)), [
      'src/shared/links holds 2 groups of files that never import each other (lib/linkKind.ts, LinksTypes.ts) (npmPackageName.ts): split it into one shared feature per group',
      'src/shared/utils holds 3 groups of files that never import each other (errorMessage.ts) (isRecord.ts) (packageRoot.ts): split it into one shared feature per group',
    ]);
  });

  it('a test that imports two groups does not link them', () => {
    const modules = graph({
      'src/shared/text/slug.ts': [],
      'src/shared/text/pad.ts': [],
      'src/shared/text/text.test.ts': ['src/shared/text/slug.ts', 'src/shared/text/pad.ts'],
    });
    assert.deepEqual(messagesOf(sharedFeatureGroupViolations('src', modules)), [
      'src/shared/text holds 2 groups of files that never import each other (pad.ts) (slug.ts): split it into one shared feature per group',
    ]);
  });

  it('a shared feature of the shared/ of a feature or of a shared feature is checked on its own, and its sub-features belong to it', () => {
    const modules = graph({
      'src/features/a/shared/title/TitleInput.tsx': [],
      'src/features/a/shared/title/TitleError.tsx': [],
      'src/shared/plan/plan.ts': ['src/shared/plan/features/steps/steps.ts'],
      'src/shared/plan/features/steps/steps.ts': ['src/shared/plan/shared/lock/lock.ts'],
      'src/shared/plan/shared/lock/lock.ts': [],
    });
    assert.deepEqual(messagesOf(sharedFeatureGroupViolations('src', modules)), [
      'src/features/a/shared/title holds 2 groups of files that never import each other (TitleError.tsx) (TitleInput.tsx): split it into one shared feature per group',
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
    assert.deepEqual(messagesOf(sharedFeatureGroupViolations('src', modules)), [
      'src/shared/alert holds 2 groups of files that never import each other (alert.ts) (alert.tv.ts): split it into one shared feature per group',
    ]);
    assert.deepEqual(
      messagesOf(sharedFeatureGroupViolations('src', modules, ['tv', 'web', 'native'])),
      [],
    );
  });
});
