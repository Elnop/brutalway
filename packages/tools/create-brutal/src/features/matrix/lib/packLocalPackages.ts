import { globSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { runProcess } from '#src/features/matrix/lib/runProcess.ts';
import { isRecord } from '#src/shared/lib/isRecord.ts';

export async function packLocalPackages(root: string, destination: string): Promise<Map<string, string>> {
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  const names = globSync('packages/*/*/package.json', { cwd: root })
    .map((path): unknown => JSON.parse(readFileSync(join(root, path), 'utf8')))
    .flatMap((manifest) => (isRecord(manifest) && typeof manifest['name'] === 'string' && manifest['name'].startsWith('@brutalway/') ? [manifest['name']] : []));
  const result = await runProcess('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', destination, ...names.map((name) => `--workspace=${name}`)], root);
  if (!result.ok) throw new Error(`npm pack failed\n${result.output.slice(-4000)}`);
  const packed: unknown = JSON.parse(result.stdout);
  if (!Array.isArray(packed)) throw new Error('npm pack did not return a list');
  return new Map(
    packed.flatMap((entry) => (isRecord(entry) && typeof entry['name'] === 'string' && typeof entry['filename'] === 'string' ? [[entry['name'], join(destination, entry['filename'])]] : [])),
  );
}
