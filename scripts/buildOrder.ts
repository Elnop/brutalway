type Manifest = {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

function internalDependencies(manifest: Manifest, names: ReadonlySet<string>): string[] {
  const all = { ...manifest.dependencies, ...manifest.devDependencies, ...manifest.peerDependencies };
  return Object.keys(all).filter((name) => names.has(name) && name !== manifest.name);
}

export function buildOrder(manifests: Manifest[]): string[] {
  const names = new Set(manifests.map((manifest) => manifest.name));
  const byName = new Map(manifests.map((manifest) => [manifest.name, manifest]));
  const order: string[] = [];
  const visiting = new Set<string>();
  function visit(name: string, path: string[]): void {
    if (order.includes(name)) return;
    if (visiting.has(name)) throw new Error(`Dependency cycle between workspaces: ${[...path, name].join(' -> ')}`);
    visiting.add(name);
    const manifest = byName.get(name);
    for (const dependency of manifest === undefined ? [] : internalDependencies(manifest, names)) visit(dependency, [...path, name]);
    visiting.delete(name);
    order.push(name);
  }
  for (const manifest of manifests.toSorted((left, right) => left.name.localeCompare(right.name))) visit(manifest.name, []);
  return order;
}
