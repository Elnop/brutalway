import { applyStackChanges, updatePackageJson } from '#src/features/scaffolding/lib/applyStackChanges.ts';
import { fetchTemplate } from '#src/features/scaffolding/lib/fetchTemplate.ts';
import { runCommand } from '#src/shared/lib/runCommand.ts';
import { OVERLAYS_ROOT } from '#src/features/scaffolding/ScaffoldConfig.ts';
import type { ScaffoldPlan } from '#src/features/scaffolding/ScaffoldTypes.ts';

export async function scaffoldProject(plan: ScaffoldPlan, step: (message: string) => void): Promise<void> {
  step(`Downloading ${plan.stack.directory}`);
  await fetchTemplate(plan.stack, plan.dir, plan.source);
  step('Applying the options');
  applyStackChanges(plan, OVERLAYS_ROOT);
  if (plan.git) {
    step('Initializing git');
    runCommand('git', ['init', '--quiet'], plan.dir);
  } else {
    updatePackageJson(plan.dir, (pkg) => {
      delete pkg.scripts?.['prepare'];
    });
  }
  if (plan.install) {
    step('Installing dependencies');
    runCommand('npm', ['install'], plan.dir);
  }
}
