type Manifest = {
  name: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
};

function internalDependencies(manifest: Manifest, names: ReadonlySet<string>, field: 'dependencies' | 'devDependencies' | 'peerDependencies'): string[] {
  return Object.keys(manifest[field] ?? {}).filter((name) => names.has(name) && name !== manifest.name);
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
    if (manifest !== undefined) {
      for (const dependency of [...internalDependencies(manifest, names, 'dependencies'), ...internalDependencies(manifest, names, 'peerDependencies')]) visit(dependency, [...path, name]);
      for (const dependency of internalDependencies(manifest, names, 'devDependencies')) if (!visiting.has(dependency)) visit(dependency, [...path, name]);
    }
    visiting.delete(name);
    order.push(name);
  }
  for (const manifest of manifests.toSorted((left, right) => left.name.localeCompare(right.name))) visit(manifest.name, []);
  return order;
}
