import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

export function kindFolderViolation(
  name: string,
  folder: string,
  loose: readonly string[],
  folderExists: boolean,
): Violation {
  const message = folderExists
    ? `${name} has a ${folder}/ folder: move ${loose.join(', ')} into it`
    : `${name} holds ${loose.length} ${folder} files (${loose.join(', ')}): move them into ${folder}/`;
  return { rule: 'kind-folder', path: `${name}/${folder}`, count: loose.length, message };
}
