export type ImportedModule = { source: string; imports: readonly string[] };

export type Slice = { owner: string; folder: string };

export type CheckedPaths = { root: string; shown: (path: string) => string };
