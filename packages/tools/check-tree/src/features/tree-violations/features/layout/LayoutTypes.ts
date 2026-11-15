export type Layer = 'source' | 'free' | 'router' | 'features' | 'feature' | 'slices' | 'kind';

export type ChildLayer = { layer: Layer; violations: string[] };

export type FilesCheck = 'groups' | 'slices' | 'none';
