import { execFileSync, spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { buildSteps, checkSteps } from './checkSteps.ts';
import { releasePlan } from './releasePlan.ts';
import { runSteps } from './runSteps.ts';

function run(command: string, args: string[]): void {
  const { status } = spawnSync(command, args, { stdio: 'inherit' });
  if (status !== 0) throw new Error(`${command} ${args.join(' ')} failed`);
}

function output(command: string, args: string[]): string {
  return execFileSync(command, args, { encoding: 'utf8' }).trim();
}

function versionPendingChangesets(): void {
  const pending = ['packages', 'templates'].some((folder) =>
    readdirSync(join(folder, '.changeset')).some(
      (file) => file.endsWith('.md') && file !== 'README.md',
    ),
  );
  if (!pending) return;
  run('npm', ['run', 'version']);
  run('git', ['add', '--all', 'packages', 'templates']);
  run('git', ['commit', '--message', 'chore: release']);
}

async function release(): Promise<number> {
  if (output('git', ['status', '--porcelain']) !== '') {
    process.stderr.write('The working tree has changes: commit or stash them before releasing.\n');
    return 1;
  }
  versionPendingChangesets();
  const plan = releasePlan(new Set(output('git', ['tag', '--list']).split('\n')));
  if (plan.names.length === 0) {
    process.stdout.write('Nothing to release: every version already has its tag.\n');
    return 0;
  }
  process.stdout.write(`Releasing ${plan.names.join(', ')}\n\n`);
  const status = await runSteps([...buildSteps(plan.build), ...checkSteps(plan.check)]);
  if (status !== 0) return status;
  if (plan.publishesPackages) run('npm', ['run', 'release', '--prefix', 'packages']);
  if (plan.tagsTemplates) run('npm', ['run', 'tag', '--prefix', 'templates']);
  run('git', ['push', '--follow-tags']);
  run('node', ['scripts/createReleases.ts']);
  return 0;
}

process.exitCode = await release();
