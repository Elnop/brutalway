import type {
  FilesCheck,
  Layer,
} from '#src/features/tree-violations/features/layout/LayoutTypes.ts';

export function filesCheck(layer: Layer, holdsEntries: boolean): FilesCheck {
  if (layer === 'slices') return 'slices';
  return layer === 'router' || holdsEntries ? 'none' : 'groups';
}
