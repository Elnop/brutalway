export type Layer =
  'source' | 'free' | 'router' | 'features' | 'feature' | 'sharedFeatures' | 'kind';

export type ChildLayer = { layer: Layer; violations: string[] };

export type FilesCheck = 'groups' | 'sharedFeatures' | 'none';
