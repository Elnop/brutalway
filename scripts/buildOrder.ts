type Manifest = {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

function internalDependencies(
  manifest: Manifest,
  names: ReadonlySet<string>,
  field: 'dependencies' | 'devDependencies' | 'peerDependencies',
): string[] {
  return Object.keys(manifest[field] ?? {}).filter(
    (name) => names.has(name) && name !== manifest.name,
  );
}

type Visit = {
  names: ReadonlySet<string>;
  byName: ReadonlyMap<string, Manifest>;
  order: string[];
  visiting: Set<string>;
};

function visit(state: Visit, name: string, path: string[]): void {
  if (state.order.includes(name)) return;
  if (state.visiting.has(name)) {
    throw new Error(`Dependency cycle between workspaces: ${[...path, name].join(' -> ')}`);
  }
  state.visiting.add(name);
  const manifest = state.byName.get(name);
  if (manifest !== undefined) {
    for (const dependency of [
      ...internalDependencies(manifest, state.names, 'dependencies'),
      ...internalDependencies(manifest, state.names, 'peerDependencies'),
    ]) {
      visit(state, dependency, [...path, name]);
    }
    for (const dependency of internalDependencies(manifest, state.names, 'devDependencies')) {
      if (!state.visiting.has(dependency)) visit(state, dependency, [...path, name]);
    }
  }
  state.visiting.delete(name);
  state.order.push(name);
}

export function buildOrder(manifests: Manifest[]): string[] {
  const state: Visit = {
    names: new Set(manifests.map((manifest) => manifest.name)),
    byName: new Map(manifests.map((manifest) => [manifest.name, manifest])),
    order: [],
    visiting: new Set<string>(),
  };
  for (const manifest of manifests.toSorted((left, right) => left.name.localeCompare(right.name))) {
    visit(state, manifest.name, []);
  }
  return state.order;
}
