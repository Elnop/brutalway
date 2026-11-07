import { applyStackChanges, updatePackageJson } from './applyStackChanges.ts';
import { fetchTemplate } from './fetchTemplate.ts';
import { runCommand } from './runCommand.ts';
import { OVERLAYS_ROOT } from './ScaffoldConfig.ts';
import type { ScaffoldPlan } from './StackTypes.ts';

export async function scaffoldProject(plan: ScaffoldPlan, step: (message: string) => void): Promise<void> {
  step(`Downloading ${plan.stack.directory}`);
  await fetchTemplate(plan.stack, plan.dir, plan.source);
  step('Applying the options');
  applyStackChanges(plan.dir, plan.stack, plan.answers, OVERLAYS_ROOT, plan.projectName);
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
