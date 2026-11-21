import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { CACHE_FOLDER, RELEASE_URL } from '#src/features/binary/BinaryConfig.ts';
import type { ReleaseAsset } from '#src/features/binary/BinaryTypes.ts';
import { releaseAsset } from '#src/features/binary/lib/releaseAsset.ts';
import { releaseClient } from '#src/features/binary/releaseClient.ts';

async function install({ name, sha256 }: ReleaseAsset, target: string): Promise<void> {
  const bytes = await releaseClient.verifiedDownload(`${RELEASE_URL}/${name}`, sha256);
  mkdirSync(join(target, '..'), { recursive: true });
  const work = mkdtempSync(`${target}-`);
  writeFileSync(join(work, name), bytes);
  const { status } = spawnSync('tar', ['-xf', name], { cwd: work, stdio: 'ignore' });
  if (status !== 0) throw new Error(`check-secrets: tar could not extract ${name}`);
  renameSync(work, target);
}

export async function gitleaksBinary(cwd: string): Promise<string> {
  const given = process.env['GITLEAKS_BIN'];
  if (given !== undefined && given !== '') return given;
  const target = join(cwd, CACHE_FOLDER);
  const binary = join(target, process.platform === 'win32' ? 'gitleaks.exe' : 'gitleaks');
  if (!existsSync(binary)) {
    rmSync(target, { recursive: true, force: true });
    await install(releaseAsset(process.platform, process.arch), target);
  }
  return binary;
}
