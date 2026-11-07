import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readHookEdit } from './readHookEdit.ts';

test('a Write call gives the file and marks it created', () => {
  assert.deepEqual(readHookEdit({ tool_name: 'Write', tool_input: { file_path: '/repo/src/a.ts' } }), { file: '/repo/src/a.ts', created: true, before: false });
});

test('an Edit call gives the file, not created', () => {
  assert.deepEqual(readHookEdit({ tool_name: 'Edit', tool_input: { file_path: '/repo/src/a.ts' } }), { file: '/repo/src/a.ts', created: false, before: false });
});

test('an unexpected payload gives no file', () => {
  assert.deepEqual(readHookEdit(null), { file: '', created: false, before: false });
  assert.deepEqual(readHookEdit({ tool_input: { file_path: 3 } }), { file: '', created: false, before: false });
});

test('a PreToolUse call is marked as coming before the edit', () => {
  assert.deepEqual(readHookEdit({ hook_event_name: 'PreToolUse', tool_name: 'Edit', tool_input: { file_path: '/repo/src/a.ts' } }), { file: '/repo/src/a.ts', created: false, before: true });
});
