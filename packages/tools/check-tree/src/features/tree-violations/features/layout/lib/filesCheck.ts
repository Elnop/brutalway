import type {
  FilesCheck,
  Layer,
} from '#src/features/tree-violations/features/layout/LayoutTypes.ts';

export function filesCheck(layer: Layer, holdsEntries: boolean): FilesCheck {
  if (layer === 'sharedFeatures') return 'sharedFeatures';
  return layer === 'router' || holdsEntries ? 'none' : 'groups';
}
