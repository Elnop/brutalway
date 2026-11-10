import { globSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { runProcess } from '#src/features/matrix/lib/runProcess.ts';
import { isRecord } from '#src/shared/lib/isRecord.ts';

function brutalwayPackageFolders(root: string): string[] {
  return globSync('packages/{configs,plugins,tools,utils}/*/package.json', { cwd: root }).flatMap(
    (path) => {
      const manifest: unknown = JSON.parse(readFileSync(join(root, path), 'utf8'));
      return isRecord(manifest) &&
        typeof manifest['name'] === 'string' &&
        manifest['name'].startsWith('@brutalway/')
        ? [join(root, dirname(path))]
        : [];
    },
  );
}

function tarballPaths(packOutput: string, destination: string): Map<string, string> {
  const packed: unknown = JSON.parse(packOutput);
  if (!Array.isArray(packed)) throw new Error('npm pack did not return a list');
  return new Map(
    packed.flatMap((entry) =>
      isRecord(entry) && typeof entry['name'] === 'string' && typeof entry['filename'] === 'string'
        ? [[entry['name'], join(destination, entry['filename'])]]
        : [],
    ),
  );
}

export async function packLocalPackages(
  root: string,
  destination: string,
): Promise<Map<string, string>> {
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  const packArgs = ['pack', '--ignore-scripts', '--json', '--pack-destination', destination];
  const result = await runProcess('npm', [...packArgs, ...brutalwayPackageFolders(root)], root);
  if (!result.ok) throw new Error(`npm pack failed\n${result.output.slice(-4000)}`);
  return tarballPaths(result.stdout, destination);
}
