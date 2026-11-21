import type { Violation } from '#src/shared/violations/ViolationTypes.ts';

export type Layer =
  'source' | 'free' | 'router' | 'features' | 'feature' | 'sharedFeatures' | 'kind';

export type ChildLayer = { layer: Layer; violations: Violation[] };

export type FilesCheck = 'groups' | 'sharedFeatures' | 'none';
