import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mergeJson } from '#src/features/update/lib/mergeJson.ts';

describe('mergeJson', () => {
  it('takes the side that changed, key by key', () => {
    assert.deepEqual(
      mergeJson(
        { scripts: { check: 'a', test: 't' }, private: true },
        { scripts: { check: 'a', test: 't', dev: 'd' }, private: true },
        { scripts: { check: 'a && b', test: 't' }, private: true, type: 'module' },
      ),
      {
        value: { scripts: { check: 'a && b', test: 't', dev: 'd' }, private: true, type: 'module' },
        conflicts: [],
      },
    );
  });

  it('drops a key the template removed and the project left alone', () => {
    assert.deepEqual(mergeJson({ a: 1, b: 2 }, { a: 1, b: 2 }, { a: 1 }), {
      value: { a: 1 },
      conflicts: [],
    });
  });

  it('keeps the value of the project and names the key when both sides changed it', () => {
    assert.deepEqual(mergeJson({ deps: { x: '1' } }, { deps: { x: '2' } }, { deps: { x: '3' } }), {
      value: { deps: { x: '2' } },
      conflicts: ['deps.x'],
    });
  });

  it('treats arrays as one value', () => {
    assert.deepEqual(mergeJson({ files: ['a'] }, { files: ['a', 'b'] }, { files: ['c'] }), {
      value: { files: ['a', 'b'] },
      conflicts: ['files'],
    });
  });
});
