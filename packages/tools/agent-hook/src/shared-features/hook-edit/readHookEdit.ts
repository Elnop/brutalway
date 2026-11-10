import type { HookEdit } from '#src/shared-features/hook-edit/HookEditTypes.ts';

function field(value: unknown, key: string): unknown {
  return typeof value === 'object' && value !== null ? Reflect.get(value, key) : undefined;
}

export function readHookEdit(input: unknown): HookEdit {
  const filePath = field(field(input, 'tool_input'), 'file_path');
  return {
    file: typeof filePath === 'string' ? filePath : '',
    created: field(input, 'tool_name') === 'Write',
    before: field(input, 'hook_event_name') === 'PreToolUse',
  };
}
