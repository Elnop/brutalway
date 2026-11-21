import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { applyCommit } from '#src/features/update/lib/applyCommit.ts';
import { assertClean } from '#src/features/update/lib/assertClean.ts';
import { commitRenders } from '#src/features/update/lib/commitRenders.ts';
import { compareFiles } from '#src/features/update/lib/compareFiles.ts';
import { git } from '#src/features/update/lib/git.ts';
import { mergePackageJson } from '#src/features/update/lib/mergePackageJson.ts';
import { renderTree } from '#src/features/update/lib/renderTree.ts';
import type { FileComparison, UpdatePlan, UpdateResult } from '#src/features/update/UpdateTypes.ts';
import { writeState } from '#src/shared/stack/lib/writeState.ts';

function checkRelated(oldDir: string, projectDir: string): FileComparison {
  const comparison = compareFiles(oldDir, projectDir);
  if (comparison.present * 2 >= comparison.total) return comparison;
  throw new Error(
    `only ${String(comparison.present)} of the ${String(comparison.total)} files that this version generates exist in the project: check --from, --stack and the options`,
  );
}

function mergeRenders(plan: UpdatePlan, oldDir: string, newDir: string, root: string): string[] {
  const prefix = git(plan.projectDir, ['rev-parse', '--show-prefix']).trim();
  const message = `chore: update the project to create-brutal ${plan.to.createBrutal}`;
  const repo = join(root, 'repo');
  if (!commitRenders(repo, { oldDir, newDir }, prefix, message)) return [];
  return applyCommit(plan.projectDir, repo);
}

async function mergeInto(plan: UpdatePlan, root: string): Promise<UpdateResult> {
  const oldDir = await renderTree(plan.render, plan.from, join(root, 'old'));
  const attached = plan.attach ? checkRelated(oldDir, plan.projectDir) : undefined;
  const newDir = await renderTree(plan.render, plan.to, join(root, 'new'));
  const conflicts = mergeRenders(plan, oldDir, newDir, root);
  return {
    conflicts,
    packageConflicts: mergePackageJson(plan.projectDir, oldDir, newDir),
    attached,
  };
}

export async function updateProject(plan: UpdatePlan): Promise<UpdateResult> {
  assertClean(plan.projectDir);
  const root = mkdtempSync(join(tmpdir(), 'create-brutal-update-'));
  try {
    const result = await mergeInto(plan, root);
    writeState(plan.projectDir, plan.to);
    return result;
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
