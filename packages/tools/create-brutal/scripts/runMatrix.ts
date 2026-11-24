import { appendFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { errorMessage } from '#src/shared/error-message/errorMessage.ts';
import { formatDuration } from '#src/features/matrix/lib/formatDuration.ts';
import { matrixLabel } from '#src/features/matrix/lib/matrixLabel.ts';
import { onlyAnswers } from '#src/features/matrix/lib/onlyAnswers.ts';
import { packLocalPackages } from '#src/features/matrix/lib/packLocalPackages.ts';
import { runProcess } from '#src/features/matrix/lib/runProcess.ts';
import { matrixCombinations } from '#src/features/matrix/lib/matrixCombinations.ts';
import { scaffoldProject } from '#src/features/scaffolding/lib/scaffoldProject.ts';
import { LOCAL_ROOT } from '#src/features/scaffolding/ScaffoldConfig.ts';
import { SHADCN_ADDED_AFTER_SCAFFOLD } from '#src/features/stacks/configs/shadcnConfig.ts';
import type { Answers, Stack } from '#src/shared/stack/StackTypes.ts';
import { stacks } from '#src/features/stacks/configs/stacksConfig.ts';
import { withLocalManifest } from '#src/features/matrix/lib/withLocalManifest.ts';
import { packageManagerOf } from '#src/shared/stack/lib/packageManagerOf.ts';

const { values } = parseArgs({
  options: {
    stack: { type: 'string' },
    all: { type: 'boolean' },
    only: { type: 'string' },
    e2e: { type: 'boolean' },
    jobs: { type: 'string' },
    keep: { type: 'boolean' },
    'local-packages': { type: 'boolean' },
  },
});
const WORK_DIR = join(tmpdir(), 'brutal-matrix');
const JOBS = Number(values.jobs ?? '3');
const STARTED_AT = performance.now();

type Run = { stack: Stack; answers: Answers; name: string };

const tarballs =
  values['local-packages'] === true
    ? await packLocalPackages(LOCAL_ROOT, join(WORK_DIR, 'packages'))
    : undefined;

const INSTALL_ARGS = {
  npm: ['install', '--prefer-offline', '--no-audit', '--no-fund'],
  pnpm: ['install', '--prefer-offline', '--no-frozen-lockfile'],
};
const SHADCN_ARGS = ['shadcn', 'add', ...SHADCN_ADDED_AFTER_SCAFFOLD, '--yes'];
const SHADCN_COMMAND = { npm: ['npx', ...SHADCN_ARGS], pnpm: ['pnpm', 'exec', ...SHADCN_ARGS] };

const SCAFFOLD_DEFAULTS = {
  source: { kind: 'local', root: LOCAL_ROOT },
  git: true,
  install: false,
} as const;

async function addShadcn(dir: string, manager: 'npm' | 'pnpm'): Promise<string | undefined> {
  const [command = 'npx', ...args] = SHADCN_COMMAND[manager];
  const added = await withLocalManifest(tarballs, dir, command, args);
  return added.ok ? undefined : `shadcn add failed\n${added.output.slice(-4000)}`;
}

async function prepare(matrixRun: Run, dir: string): Promise<string | undefined> {
  const plan = { ...matrixRun, ...SCAFFOLD_DEFAULTS, dir, projectName: matrixRun.name };
  try {
    await scaffoldProject(plan, () => undefined);
  } catch (error) {
    return `scaffolding failed: ${errorMessage(error)}`;
  }
  const manager = packageManagerOf(matrixRun.answers);
  const installed = await withLocalManifest(tarballs, dir, manager, INSTALL_ARGS[manager]);
  if (!installed.ok) return `${manager} install failed\n${installed.output.slice(-4000)}`;
  return matrixRun.answers['ui'] === 'shadcn' ? addShadcn(dir, manager) : undefined;
}

async function runCommands(answers: Answers, dir: string): Promise<string | undefined> {
  const manager = packageManagerOf(answers);
  const commands = [
    [manager, 'run', 'check'],
    ...(answers['unit-tests'] === false ? [] : [[manager, 'test']]),
    ...(values.e2e === true && answers['e2e'] ? [[manager, 'run', 'e2e']] : []),
  ];
  for (const [command = '', ...args] of commands) {
    const result = await runProcess(command, args, dir);
    if (!result.ok) return `${args.join(' ')} failed\n${result.output.slice(-4000)}`;
  }
  return undefined;
}

async function check(matrixRun: Run): Promise<string | undefined> {
  const dir = join(WORK_DIR, matrixRun.name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const failure = (await prepare(matrixRun, dir)) ?? (await runCommands(matrixRun.answers, dir));
  if (failure !== undefined) return failure;
  if (values.keep !== true) rmSync(dir, { recursive: true, force: true });
  return undefined;
}

const runs: Run[] = stacks
  .filter((stack) => values.stack === undefined || stack.id === values.stack)
  .flatMap((stack) =>
    matrixCombinations(stack.options, values.all === true, onlyAnswers(values.only)).map(
      (answers, index) => ({ stack, answers, name: `${stack.id}-${index}` }),
    ),
  );
const failures: string[] = [];
let next = 0;

async function worker(): Promise<void> {
  for (let current = runs[next++]; current !== undefined; current = runs[next++]) {
    const failure = await check(current);
    process.stdout.write(
      `${failure === undefined ? 'ok  ' : 'FAIL'} ${current.name} ${matrixLabel(current.answers)}\n`,
    );
    if (failure !== undefined) {
      failures.push(`${current.name} ${matrixLabel(current.answers)}\n${failure}`);
    }
  }
}

await Promise.all(Array.from({ length: JOBS }, worker));
for (const failure of failures) process.stderr.write(`\n${failure}\n`);
const summary = `${runs.length} projects built in ${formatDuration(performance.now() - STARTED_AT)}, ${failures.length} failed`;
process.stdout.write(`\n${summary}\n`);
const stepSummary = process.env['GITHUB_STEP_SUMMARY'];
if (stepSummary !== undefined) appendFileSync(stepSummary, `### Matrix\n\n${summary}\n`);
if (values.keep === true) process.stdout.write(`\nProjects kept in ${WORK_DIR}\n`);
process.exitCode = failures.length > 0 ? 1 : 0;
