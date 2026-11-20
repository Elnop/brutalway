export function sharedRootFileViolations(name: string, files: readonly string[]): string[] {
  if (files.length === 0) return [];
  return [
    `${name} holds ${files.join(', ')}: shared/ holds one folder per shared feature, move each file into the shared feature of its concept`,
  ];
}
