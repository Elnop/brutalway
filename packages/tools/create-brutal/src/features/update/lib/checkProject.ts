import { log } from '@clack/prompts';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rendersDiffer } from '#src/features/update/lib/compareFiles.ts';
import { renderTree } from '#src/features/update/lib/renderTree.ts';
import type { Renderer } from '#src/features/update/UpdateTypes.ts';
import type { BrutalwayState } from '#src/shared/stack/StackTypes.ts';

async function rendersChange(
  from: BrutalwayState,
  to: BrutalwayState,
  render: Renderer,
): Promise<boolean> {
  const root = mkdtempSync(join(tmpdir(), 'create-brutal-check-'));
  try {
    const oldDir = await renderTree(render, from, join(root, 'old'));
    const newDir = await renderTree(render, to, join(root, 'new'));
    return rendersDiffer(oldDir, newDir);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}

export async function checkProject(
  from: BrutalwayState,
  to: BrutalwayState,
  render: Renderer,
): Promise<number> {
  const behind = from.createBrutal !== to.createBrutal && (await rendersChange(from, to, render));
  log.info(
    behind
      ? `create-brutal ${to.createBrutal} changes this project: run npx create-brutal@latest update`
      : `the project is up to date with create-brutal ${to.createBrutal}`,
  );
  return behind ? 1 : 0;
}
