import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { sharedConsumerViolations } from '#src/features/shared-consumers/lib/sharedConsumerViolations.ts';

function graph(edges: Record<string, string[]>) {
  const sources = new Set([...Object.keys(edges), ...Object.values(edges).flat()]);
  return [...sources].map((source) => ({ source, imports: edges[source] ?? [] }));
}

describe('sharedConsumerViolations', () => {
  it('a file of a shared feature in src/shared/ used by two features passes', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/dates/formatDate.ts'],
      'src/features/b/B.tsx': ['src/shared/dates/formatDate.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), []);
  });

  it('a file of a shared feature used by a single feature or a single other shared feature is reported, however many of its files import it', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/dates/formatDate.ts'],
      'src/features/a/lib/b.ts': ['src/shared/dates/formatDate.ts'],
      'src/shared/todos/todosStore.ts': ['src/shared/ids/id.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/dates/formatDate.ts is only used by src/features/a: move it into src/features/a',
      'src/shared/ids/id.ts is only used by src/shared/todos: move it into src/shared/todos',
    ]);
  });

  it('a whole shared feature used by a single feature is reported, which the folders of shared-features/ used to escape', () => {
    const modules = graph({
      'src/features/list/List.tsx': ['src/shared/todos/todosStore.ts'],
      'src/shared/todos/todosStore.ts': ['src/shared/todos/TodosTypes.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/todos/todosStore.ts is only used by src/features/list: move it into src/features/list',
      'src/shared/todos/TodosTypes.ts is only used by src/features/list: move it into src/features/list',
    ]);
  });

  it('a file used by another file of the same shared feature counts the consumers of that file, a file of another shared feature does not pass them on', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/dates/formatDate.ts', 'src/shared/slugs/slugify.ts'],
      'src/features/b/B.tsx': ['src/shared/dates/formatDate.ts', 'src/shared/slugs/slugify.ts'],
      'src/shared/dates/formatDate.ts': ['src/shared/dates/pad.ts'],
      'src/shared/slugs/slugify.ts': ['src/shared/text/lower.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/text/lower.ts is only used by src/shared/slugs: move it into src/shared/slugs',
    ]);
  });

  it('a sub-feature counts as the feature it sits in for src/shared/', () => {
    const modules = graph({
      'src/features/a/features/x/X.tsx': ['src/shared/dates/formatDate.ts'],
      'src/features/a/features/y/Y.tsx': ['src/shared/dates/formatDate.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/dates/formatDate.ts is only used by src/features/a: move it into src/features/a',
    ]);
  });

  it('a shared feature of the shared/ of a feature used by a single sub-feature is reported', () => {
    const modules = graph({
      'src/features/a/features/x/X.tsx': ['src/features/a/shared/form/useForm.ts'],
      'src/features/a/features/x/features/deep/Deep.tsx': ['src/features/a/shared/title/Title.tsx'],
      'src/features/a/features/y/Y.tsx': ['src/features/a/shared/title/Title.tsx'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/features/a/shared/form/useForm.ts is only used by src/features/a/features/x: move it into src/features/a/features/x',
    ]);
  });

  it('a shared feature of the shared/ of a feature used only by the files of the feature outside its sub-features is reported', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/features/a/shared/dates/format.ts'],
      'src/features/a/lib/b.ts': ['src/features/a/shared/dates/format.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/features/a/shared/dates/format.ts is only used by src/features/a outside its sub-features: move it out of shared/ into the kind folders of src/features/a',
    ]);
  });

  it('a shared feature nested in a shared feature counts the sub-features of its parent shared feature', () => {
    const modules = graph({
      'src/shared/plan/features/steps/steps.ts': ['src/shared/plan/shared/lock/lock.ts'],
      'src/shared/plan/features/budget/budget.ts': ['src/shared/plan/shared/lock/lock.ts'],
      'src/shared/plan/features/budget/total.ts': ['src/shared/plan/shared/money/money.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/plan/shared/money/money.ts is only used by src/shared/plan/features/budget: move it into src/shared/plan/features/budget',
    ]);
  });

  it('a file of src/shared/ used only by app/ or by the entry points of src/ passes', () => {
    const modules = graph({
      'src/main.tsx': ['src/shared/env/readEnv.ts'],
      'src/app/App.tsx': ['src/shared/theme/theme.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), []);
  });

  it('a test is never a consumer, wherever it sits, and a file only tests import is left to knip --production', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/text/format.ts', 'src/shared/text/slug.ts'],
      'src/features/b/B.test.tsx': ['src/shared/text/format.ts'],
      'src/shared/text/slug.test.ts': ['src/shared/text/slug.ts', 'src/shared/text/unused.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/text/format.ts is only used by src/features/a: move it into src/features/a',
      'src/shared/text/slug.ts is only used by src/features/a: move it into src/features/a',
    ]);
  });

  it('a file at the root of a shared/ is left to the folder checks', () => {
    const modules = graph({ 'src/features/a/A.tsx': ['src/shared/format.ts'] });
    assert.deepEqual(sharedConsumerViolations('src', modules), []);
  });

  it('a nested checked folder gives paths from its parent, like the folder checks', () => {
    const modules = graph({
      'packages/ws/src/features/a/A.tsx': ['packages/ws/src/shared/text/format.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('./packages/ws/src/', modules), [
      'src/shared/text/format.ts is only used by src/features/a: move it into src/features/a',
    ]);
  });

  it('a platform variant gets the consumers of its base, which dependency-cruiser resolves the imports to', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/theme/lib/alert.ts'],
      'src/features/b/B.tsx': ['src/shared/theme/lib/alert.ts'],
      'src/shared/theme/lib/alert.web.ts': ['src/shared/theme/alertStore.ts'],
      'src/features/shell/Shell.tsx': ['src/shared/theme/AlertHost.tsx'],
      'src/shared/theme/AlertHost.tsx': ['src/shared/theme/alertStore.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/theme/AlertHost.tsx is only used by src/features/shell: move it into src/features/shell',
    ]);
  });

  it('a variant of a platform outside the list keeps its own consumers', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/theme/lib/alert.ts'],
      'src/features/b/B.tsx': ['src/shared/theme/lib/alert.ts'],
      'src/shared/theme/lib/alert.tv.ts': ['src/shared/theme/alertStore.ts'],
      'src/features/shell/Shell.tsx': ['src/shared/theme/alertStore.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules, ['web']), [
      'src/shared/theme/alertStore.ts is only used by src/features/shell: move it into src/features/shell',
    ]);
  });
});
