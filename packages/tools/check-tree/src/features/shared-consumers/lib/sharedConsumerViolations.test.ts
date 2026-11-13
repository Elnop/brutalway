import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { sharedConsumerViolations } from '#src/features/shared-consumers/lib/sharedConsumerViolations.ts';

function graph(edges: Record<string, string[]>) {
  const sources = new Set([...Object.keys(edges), ...Object.values(edges).flat()]);
  return [...sources].map((source) => ({ source, imports: edges[source] ?? [] }));
}

describe('sharedConsumerViolations', () => {
  it('a file of src/shared/ used by two features passes', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/lib/format.ts'],
      'src/features/b/B.tsx': ['src/shared/lib/format.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), []);
  });

  it('a file of src/shared/ used by a single feature or shared feature is reported, however many of its files import it', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/lib/format.ts'],
      'src/features/a/lib/b.ts': ['src/shared/lib/format.ts'],
      'src/shared-features/todos/todosStore.ts': ['src/shared/lib/id.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/lib/format.ts is only used by src/features/a: move it into src/features/a',
      'src/shared/lib/id.ts is only used by src/shared-features/todos: move it into src/shared-features/todos',
    ]);
  });

  it('a file used by another file of the same shared/ counts the consumers of that file', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/lib/formatDate.ts'],
      'src/features/b/B.tsx': ['src/shared/lib/formatDate.ts'],
      'src/shared/lib/formatDate.ts': ['src/shared/lib/pad.ts'],
      'src/features/c/C.tsx': ['src/shared/lib/slugify.ts'],
      'src/shared/lib/slugify.ts': ['src/shared/lib/lower.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/lib/slugify.ts is only used by src/features/c: move it into src/features/c',
      'src/shared/lib/lower.ts is only used by src/features/c: move it into src/features/c',
    ]);
  });

  it('a sub-feature counts as the feature it sits in for src/shared/', () => {
    const modules = graph({
      'src/features/a/features/x/X.tsx': ['src/shared/lib/format.ts'],
      'src/features/a/features/y/Y.tsx': ['src/shared/lib/format.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/lib/format.ts is only used by src/features/a: move it into src/features/a',
    ]);
  });

  it('the shared/ of a feature used by a single sub-feature is reported', () => {
    const modules = graph({
      'src/features/a/features/x/X.tsx': ['src/features/a/shared/useForm.ts'],
      'src/features/a/features/x/features/deep/Deep.tsx': ['src/features/a/shared/Title.tsx'],
      'src/features/a/features/y/Y.tsx': ['src/features/a/shared/Title.tsx'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/features/a/shared/useForm.ts is only used by src/features/a/features/x: move it into src/features/a/features/x',
    ]);
  });

  it('the shared/ of a feature used only by the files of the feature outside its sub-features is reported', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/features/a/shared/format.ts'],
      'src/features/a/lib/b.ts': ['src/features/a/shared/format.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/features/a/shared/format.ts is only used by src/features/a outside its sub-features: move it out of shared/ into the kind folders of src/features/a',
    ]);
  });

  it('a file of src/shared/ used only by app/ or by the entry files of src/ passes', () => {
    const modules = graph({
      'src/main.tsx': ['src/shared/lib/readEnv.ts'],
      'src/app/App.tsx': ['src/shared/lib/theme.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), []);
  });

  it('tests and unused files are not counted', () => {
    const modules = graph({
      'src/features/a/A.tsx': ['src/shared/lib/format.ts'],
      'src/features/b/B.test.tsx': ['src/shared/lib/format.ts', 'src/shared/lib/unused.ts'],
      'src/shared/lib/format.test.ts': ['src/shared/lib/format.ts'],
    });
    assert.deepEqual(sharedConsumerViolations('src', modules), [
      'src/shared/lib/format.ts is only used by src/features/a: move it into src/features/a',
    ]);
  });
});
