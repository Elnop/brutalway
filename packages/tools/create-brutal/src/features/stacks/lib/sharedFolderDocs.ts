import type { ChangeCondition, StackChange } from '#src/shared/stack/StackTypes.ts';

export function sharedFolderDocs(
  files: string[],
  when: ChangeCondition = { example: false },
): StackChange {
  return {
    when,
    edits: files.map((file) => ({ file, replace: '`src/shared/`', with: '`shared/`', all: true })),
  };
}
