import type {
  FilesCheck,
  Layer,
} from '#src/features/tree-violations/features/layout/LayoutTypes.ts';

export function filesCheck(layer: Layer, holdsEntries: boolean): FilesCheck {
  if (layer === 'sharedFeatures') return 'sharedFeatures';
  if (layer === 'locales') return 'locales';
  if (layer === 'language') return 'language';
  return layer === 'router' || holdsEntries ? 'none' : 'groups';
}
