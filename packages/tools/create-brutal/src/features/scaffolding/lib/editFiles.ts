import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { applyFileEdit } from '#src/features/scaffolding/lib/applyFileEdit.ts';
import { PROJECT_NAME_TOKEN } from '#src/features/scaffolding/ScaffoldConfig.ts';
import { errorMessage } from '#src/shared/lib/errorMessage.ts';
import type { FileEdit } from '#src/shared-features/stack/StackTypes.ts';

function withProjectName(edit: FileEdit, projectName: string): FileEdit {
  if ('with' in edit) {
    return { ...edit, with: edit.with.replaceAll(PROJECT_NAME_TOKEN, projectName) };
  }
  if ('insert' in edit) {
    return { ...edit, insert: edit.insert.replaceAll(PROJECT_NAME_TOKEN, projectName) };
  }
  return edit;
}

export function editFiles(dir: string, edits: FileEdit[], projectName: string): void {
  for (const edit of edits) {
    const path = join(dir, edit.file);
    if (!existsSync(path)) throw new Error(`${edit.file} does not exist`);
    const named = withProjectName(edit, projectName);
    try {
      writeFileSync(path, applyFileEdit(readFileSync(path, 'utf8'), named));
    } catch (error) {
      throw new Error(`${edit.file}: ${errorMessage(error)}`, { cause: error });
    }
  }
}
