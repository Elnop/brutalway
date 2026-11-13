import { existsSync } from 'node:fs';
import { cruise } from 'dependency-cruiser';
import extractDepcruiseOptions from 'dependency-cruiser/config-utl/extract-depcruise-options';
import extractTSConfig from 'dependency-cruiser/config-utl/extract-ts-config';
import type { ImportedModule } from '#src/features/shared-consumers/SharedConsumersTypes.ts';

const CONFIG_FILES = [
  '.dependency-cruiser.js',
  '.dependency-cruiser.cjs',
  '.dependency-cruiser.mjs',
  '.dependency-cruiser.json',
];

export async function cruiseImports(root: string): Promise<ImportedModule[]> {
  const configFile = CONFIG_FILES.find((file) => existsSync(file));
  if (configFile === undefined) {
    throw new Error(
      `check-tree reads the dependency-cruiser config to resolve imports, and the current folder has none of ${CONFIG_FILES.join(', ')}`,
    );
  }
  const options = await extractDepcruiseOptions(`./${configFile}`);
  const tsConfigFile = options.tsConfig?.fileName;
  const result = await cruise(
    [root],
    { ...options, validate: false, tsPreCompilationDeps: true },
    {},
    { tsConfig: tsConfigFile === undefined ? undefined : extractTSConfig(tsConfigFile) },
  );
  if (typeof result.output === 'string') throw new Error(result.output);
  return result.output.modules.map(({ source, dependencies }) => ({
    source,
    imports: dependencies.map(({ resolved }) => resolved),
  }));
}
