import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { runProcess } from '#src/features/matrix/lib/runProcess.ts';
import {
  withLocalOverrides,
  withLocalPackages,
  withoutLocalPackages,
} from '#src/features/matrix/lib/withLocalPackages.ts';

export async function withLocalManifest(
  tarballs: Map<string, string> | undefined,
  dir: string,
  command: string,
  args: string[],
): Promise<{ ok: boolean; output: string }> {
  if (tarballs === undefined) return runProcess(command, args, dir);
  const manifestPath = join(dir, 'package.json');
  const workspacePath = join(dir, 'pnpm-workspace.yaml');
  const original = readFileSync(manifestPath, 'utf8');
  const workspace = existsSync(workspacePath) ? readFileSync(workspacePath, 'utf8') : undefined;
  writeFileSync(manifestPath, withLocalPackages(original, tarballs));
  if (workspace !== undefined) {
    writeFileSync(workspacePath, withLocalOverrides(workspace, tarballs));
  }
  const result = await runProcess(command, args, dir);
  writeFileSync(manifestPath, withoutLocalPackages(readFileSync(manifestPath, 'utf8'), original));
  if (workspace !== undefined) writeFileSync(workspacePath, workspace);
  return result;
}
