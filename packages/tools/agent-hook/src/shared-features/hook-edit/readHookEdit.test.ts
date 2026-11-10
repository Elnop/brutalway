import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { readHookEdit } from '#src/shared-features/hook-edit/readHookEdit.ts';

describe('readHookEdit', () => {
  it('a Write call gives the file and marks it created', () => {
    assert.deepEqual(
      readHookEdit({ tool_name: 'Write', tool_input: { file_path: '/repo/src/a.ts' } }),
      { file: '/repo/src/a.ts', created: true, before: false },
    );
  });

  it('an Edit call gives the file, not created', () => {
    assert.deepEqual(
      readHookEdit({ tool_name: 'Edit', tool_input: { file_path: '/repo/src/a.ts' } }),
      { file: '/repo/src/a.ts', created: false, before: false },
    );
  });

  it('an unexpected payload gives no file', () => {
    assert.deepEqual(readHookEdit(null), { file: '', created: false, before: false });
    assert.deepEqual(readHookEdit({ tool_input: { file_path: 3 } }), {
      file: '',
      created: false,
      before: false,
    });
  });

  it('a PreToolUse call is marked as coming before the edit', () => {
    assert.deepEqual(
      readHookEdit({
        hook_event_name: 'PreToolUse',
        tool_name: 'Edit',
        tool_input: { file_path: '/repo/src/a.ts' },
      }),
      { file: '/repo/src/a.ts', created: false, before: true },
    );
  });
});
