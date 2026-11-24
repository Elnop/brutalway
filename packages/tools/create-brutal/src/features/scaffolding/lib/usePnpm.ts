import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  NODE_LINKER_BY_STACK,
  NPM_ONLY_FILES,
  PNPM_DENIED_BUILDS,
  PNPM_VERSION,
} from '#src/features/scaffolding/ScaffoldConfig.ts';
import { npmOverrides } from '#src/features/scaffolding/lib/npmOverrides.ts';
import { pnpmWorkspace } from '#src/features/scaffolding/lib/pnpmWorkspace.ts';
import { rewriteCommands } from '#src/features/scaffolding/lib/rewriteCommands.ts';
import { updatePackageJson } from '#src/features/scaffolding/lib/updatePackageJson.ts';
import { isRecord } from '#src/shared/is-record/isRecord.ts';

function allowedBuilds(allowScripts: unknown): Record<string, boolean> {
  if (!isRecord(allowScripts)) return {};
  return Object.fromEntries(
    Object.entries(allowScripts).filter(
      (entry): entry is [string, boolean] => typeof entry[1] === 'boolean',
    ),
  );
}

function ignoreLockfile(dir: string): void {
  const path = join(dir, '.prettierignore');
  if (!existsSync(path)) return;
  writeFileSync(
    path,
    readFileSync(path, 'utf8').replace(/^package-lock\.json$/mu, 'pnpm-lock.yaml'),
  );
}

export function usePnpm(dir: string, stackId: string): void {
  updatePackageJson(dir, (pkg) => {
    const settings = {
      allowBuilds: { ...PNPM_DENIED_BUILDS, ...allowedBuilds(pkg['allowScripts']) },
      overrides: Object.fromEntries(npmOverrides(pkg['overrides'])),
      nodeLinker: NODE_LINKER_BY_STACK[stackId],
    };
    writeFileSync(join(dir, 'pnpm-workspace.yaml'), pnpmWorkspace(settings));
    delete pkg['allowScripts'];
    delete pkg['overrides'];
    pkg['packageManager'] = `pnpm@${PNPM_VERSION}`;
  });
  for (const file of NPM_ONLY_FILES) rmSync(join(dir, file), { force: true });
  ignoreLockfile(dir);
  rewriteCommands(dir);
}
