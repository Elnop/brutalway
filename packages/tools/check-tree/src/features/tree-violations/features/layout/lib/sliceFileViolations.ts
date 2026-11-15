export function sliceFileViolations(name: string, files: readonly string[]): string[] {
  if (files.length === 0) return [];
  return [
    `${name} holds ${files.join(', ')}: shared/ holds one folder per slice, move each file into the slice of its concept`,
  ];
}
