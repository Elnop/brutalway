import { basename, dirname } from 'node:path';
import type {
  ChildLayer,
  Layer,
} from '#src/features/tree-violations/features/layout/LayoutTypes.ts';

const SOURCE_LAYERS = new Map<string, Layer>([
  ['app', 'free'],
  ['features', 'features'],
  ['shared-features', 'features'],
  ['shared', 'shared'],
]);
const FEATURE_LAYERS = new Map<string, Layer>([
  ['features', 'features'],
  ['shared-features', 'features'],
  ['shared', 'shared'],
]);

function kindFolder(path: string, categories: ReadonlySet<string>, reason: string): ChildLayer {
  if (categories.has(basename(path))) return { layer: 'kind', violations: [] };
  return { layer: 'free', violations: [`${path} is not a kind folder: ${reason}`] };
}

function sourceChild(path: string): ChildLayer {
  const layer = SOURCE_LAYERS.get(basename(path));
  if (layer !== undefined) return { layer, violations: [] };
  return {
    layer: 'free',
    violations: [
      `${path} is not a layer: ${dirname(path)}/ holds app/, features/, shared-features/ and shared/ next to its entry files, move it into one of them`,
    ],
  };
}

function featureChild(path: string, categories: ReadonlySet<string>): ChildLayer {
  const layer = FEATURE_LAYERS.get(basename(path));
  if (layer !== undefined) return { layer, violations: [] };
  return kindFolder(
    path,
    categories,
    'a feature holds kind folders, features/ for its sub-features, shared-features/ for the business code they share and shared/, move it into features/ as a sub-feature or spread its files into kind folders',
  );
}

export function childLayer(
  layer: Layer,
  path: string,
  categories: ReadonlySet<string>,
): ChildLayer {
  if (layer === 'source') return sourceChild(path);
  if (layer === 'features') return { layer: 'feature', violations: [] };
  if (layer === 'feature') return featureChild(path, categories);
  if (layer === 'shared') {
    return kindFolder(
      path,
      categories,
      `${dirname(path)}/ holds no domain, move its files into lib/, types/, configs/... or into a shared feature`,
    );
  }
  if (layer === 'kind') {
    return kindFolder(path, categories, `${dirname(path)}/ holds its files and kind folders only`);
  }
  return { layer: 'free', violations: [] };
}
