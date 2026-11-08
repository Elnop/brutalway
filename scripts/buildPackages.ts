import { execFileSync } from 'node:child_process';
import { chmodSync, existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buildOrder } from './buildOrder.ts';

type Manifest = { name: string; scripts?: Record<string, string>; bin?: string | Record<string, string> };

const root = JSON.parse(readFileSync('package.json', 'utf8'));
const paths: string[] = root.workspaces.flatMap((pattern: string) => globSync(`${pattern}/package.json`));
const manifests = new Map<string, Manifest>(paths.map((path) => [dirname(path), JSON.parse(readFileSync(path, 'utf8'))]));
const buildable = new Set([...manifests.values()].filter((manifest) => manifest.scripts?.['build'] !== undefined).map((manifest) => manifest.name));
for (const name of buildOrder([...manifests.values()])) {
  if (buildable.has(name)) execFileSync('npm', ['run', 'build', '--workspace', name], { stdio: 'inherit' });
}
for (const [folder, manifest] of manifests) {
  const bins = typeof manifest.bin === 'string' ? [manifest.bin] : Object.values(manifest.bin ?? {});
  for (const bin of bins) if (existsSync(join(folder, bin))) chmodSync(join(folder, bin), 0o755);
}
execFileSync('npm', ['rebuild', '--ignore-scripts'], { stdio: 'inherit' });
