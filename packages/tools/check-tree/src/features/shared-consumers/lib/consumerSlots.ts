import { SLICE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

function slotOf(owner: string, importer: string): string {
  if (!importer.startsWith(`${owner}/`)) return importer;
  const slice = SLICE.exec(importer.slice(owner.length + 1));
  return slice === null ? owner : `${owner}/${slice[0]}`;
}

function importersByModule(modules: readonly ImportedModule[]): Map<string, string[]> {
  const importers = new Map<string, string[]>();
  for (const { source, imports } of modules) {
    for (const target of imports) importers.set(target, [...(importers.get(target) ?? []), source]);
  }
  return importers;
}

export function consumerSlots(modules: readonly ImportedModule[]) {
  const importers = importersByModule(modules);
  const slotsByModule = new Map<string, ReadonlySet<string>>();
  return function slots(path: string, owner: string): ReadonlySet<string> {
    const known = slotsByModule.get(path);
    if (known !== undefined) return known;
    const found = new Set<string>();
    slotsByModule.set(path, found);
    for (const importer of importers.get(path) ?? []) {
      if (importer.startsWith(`${owner}/shared/`)) {
        for (const slot of slots(importer, owner)) found.add(slot);
      } else found.add(slotOf(owner, importer));
    }
    return found;
  };
}
