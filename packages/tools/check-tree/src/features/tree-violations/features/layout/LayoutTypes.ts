export type Layer = 'source' | 'free' | 'router' | 'features' | 'feature' | 'shared' | 'kind';

export type ChildLayer = { layer: Layer; violations: string[] };
