import { basename, dirname } from 'node:path';
import { SUB_FEATURE_OR_SHARED_FEATURE } from '#src/features/shared-consumers/SharedConsumersConfig.ts';
import type {
  ImportedModule,
  SharedFeature,
} from '#src/features/shared-consumers/SharedConsumersTypes.ts';
import { platformBase } from '#src/shared/platform-variants/platformBase.ts';

function slotOf(owner: string, importer: string): string {
  if (!importer.startsWith(`${owner}/`)) return importer;
  const child = SUB_FEATURE_OR_SHARED_FEATURE.exec(importer.slice(owner.length + 1));
  return child === null ? owner : `${owner}/${child[0]}`;
}

function unitOf(path: string, platforms: readonly string[] | undefined): string {
  return `${dirname(path)}/${platformBase(basename(path), platforms)}`;
}

function importersByUnit(
  modules: readonly ImportedModule[],
  platforms: readonly string[] | undefined,
): Map<string, string[]> {
  const importers = new Map<string, string[]>();
  for (const { source, imports } of modules) {
    for (const target of imports) {
      const unit = unitOf(target, platforms);
      importers.set(unit, [...(importers.get(unit) ?? []), source]);
    }
  }
  return importers;
}

export function consumerSlots(modules: readonly ImportedModule[], platforms?: readonly string[]) {
  const importers = importersByUnit(modules, platforms);
  const slotsByModule = new Map<string, ReadonlySet<string>>();
  return function slots(path: string, sharedFeature: SharedFeature): ReadonlySet<string> {
    const key = `${sharedFeature.folder}:${path}`;
    const known = slotsByModule.get(key);
    if (known !== undefined) return known;
    const found = new Set<string>();
    slotsByModule.set(key, found);
    for (const importer of importers.get(unitOf(path, platforms)) ?? []) {
      if (importer.startsWith(`${sharedFeature.folder}/`)) {
        for (const slot of slots(importer, sharedFeature)) found.add(slot);
      } else found.add(slotOf(sharedFeature.owner, importer));
    }
    return found;
  };
}
