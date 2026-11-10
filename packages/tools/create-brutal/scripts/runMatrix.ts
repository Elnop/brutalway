import { appendFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { errorMessage } from '#src/shared/lib/errorMessage.ts';
import { formatDuration } from '#src/features/matrix/lib/formatDuration.ts';
import { matrixLabel } from '#src/features/matrix/lib/matrixLabel.ts';
import { onlyAnswers } from '#src/features/matrix/lib/onlyAnswers.ts';
import { packLocalPackages } from '#src/features/matrix/lib/packLocalPackages.ts';
import { runProcess } from '#src/features/matrix/lib/runProcess.ts';
import { matrixCombinations } from '#src/features/matrix/lib/matrixCombinations.ts';
import { scaffoldProject } from '#src/features/scaffolding/lib/scaffoldProject.ts';
import { LOCAL_ROOT } from '#src/features/scaffolding/ScaffoldConfig.ts';
import { SHADCN_ADDED_AFTER_SCAFFOLD } from '#src/features/stacks/configs/shadcnConfig.ts';
import type { Answers, Stack } from '#src/shared-features/stack/StackTypes.ts';
import { stacks } from '#src/features/stacks/configs/stacksConfig.ts';
import {
  withLocalPackages,
  withoutLocalPackages,
} from '#src/features/matrix/lib/withLocalPackages.ts';

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

async function withLocalManifest(
  dir: string,
  command: string,
  args: string[],
): Promise<{ ok: boolean; output: string }> {
  if (tarballs === undefined) return runProcess(command, args, dir);
  const manifestPath = join(dir, 'package.json');
  const original = readFileSync(manifestPath, 'utf8');
  writeFileSync(manifestPath, withLocalPackages(original, tarballs));
  const result = await runProcess(command, args, dir);
  writeFileSync(manifestPath, withoutLocalPackages(readFileSync(manifestPath, 'utf8'), original));
  return result;
}

const INSTALL_ARGS = ['install', '--prefer-offline', '--no-audit', '--no-fund'];
const SHADCN_ARGS = ['shadcn', 'add', ...SHADCN_ADDED_AFTER_SCAFFOLD, '--yes'];

const SCAFFOLD_DEFAULTS = {
  source: { kind: 'local', root: LOCAL_ROOT },
  git: true,
  install: false,
} as const;

async function prepare(matrixRun: Run, dir: string): Promise<string | undefined> {
  const plan = { ...matrixRun, ...SCAFFOLD_DEFAULTS, dir, projectName: matrixRun.name };
  try {
    await scaffoldProject(plan, () => undefined);
  } catch (error) {
    return `scaffolding failed: ${errorMessage(error)}`;
  }
  const installed = await withLocalManifest(dir, 'npm', INSTALL_ARGS);
  if (!installed.ok) return `npm install failed\n${installed.output.slice(-4000)}`;
  if (matrixRun.answers['ui'] !== 'shadcn') return undefined;
  const added = await withLocalManifest(dir, 'npx', SHADCN_ARGS);
  return added.ok ? undefined : `shadcn add failed\n${added.output.slice(-4000)}`;
}

async function runCommands(answers: Answers, dir: string): Promise<string | undefined> {
  const commands = [
    ['npm', 'run', 'check'],
    ['npm', 'test'],
    ...(values.e2e === true && answers['e2e'] ? [['npm', 'run', 'e2e']] : []),
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
