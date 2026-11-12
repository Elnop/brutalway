export type Layer = 'source' | 'free' | 'features' | 'feature' | 'shared' | 'kind';

export type ChildLayer = { layer: Layer; violations: string[] };
