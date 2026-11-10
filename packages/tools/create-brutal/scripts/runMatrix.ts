import { spawn } from 'node:child_process';
import { appendFileSync, globSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { errorMessage } from '#src/shared/lib/errorMessage.ts';
import { isRecord } from '#src/shared/lib/isRecord.ts';
import { matrixCombinations } from '#src/features/matrix/lib/matrixCombinations.ts';
import { scaffoldProject } from '#src/features/scaffolding/lib/scaffoldProject.ts';
import { LOCAL_ROOT } from '#src/features/scaffolding/ScaffoldConfig.ts';
import { SHADCN_ADDED_AFTER_SCAFFOLD } from '#src/features/stacks/configs/shadcnConfig.ts';
import type { Answers, Stack } from '#src/shared-features/stack/StackTypes.ts';
import { stacks } from '#src/features/stacks/configs/stacksConfig.ts';
import { withLocalPackages, withoutLocalPackages } from '#src/features/matrix/lib/withLocalPackages.ts';

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

function run(command: string, args: string[], cwd: string): Promise<{ ok: boolean; output: string; stdout: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, CI: '1' } });
    let output = '';
    let stdout = '';
    child.stdout.on('data', (chunk: Buffer) => {
      stdout += chunk.toString();
      output += chunk.toString();
    });
    child.stderr.on('data', (chunk: Buffer) => (output += chunk.toString()));
    child.on('close', (code) => resolve({ ok: code === 0, output, stdout }));
  });
}

async function packLocalPackages(): Promise<Map<string, string>> {
  const destination = join(WORK_DIR, 'packages');
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination, { recursive: true });
  const names = globSync('packages/*/*/package.json', { cwd: LOCAL_ROOT })
    .map((path): unknown => JSON.parse(readFileSync(join(LOCAL_ROOT, path), 'utf8')))
    .flatMap((manifest) => (isRecord(manifest) && typeof manifest['name'] === 'string' && manifest['name'].startsWith('@brutalway/') ? [manifest['name']] : []));
  const result = await run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', destination, ...names.map((name) => `--workspace=${name}`)], LOCAL_ROOT);
  if (!result.ok) throw new Error(`npm pack failed\n${result.output.slice(-4000)}`);
  const packed: unknown = JSON.parse(result.stdout);
  if (!Array.isArray(packed)) throw new Error('npm pack did not return a list');
  return new Map(
    packed.flatMap((entry) => (isRecord(entry) && typeof entry['name'] === 'string' && typeof entry['filename'] === 'string' ? [[entry['name'], join(destination, entry['filename'])]] : [])),
  );
}

const tarballs = values['local-packages'] === true ? await packLocalPackages() : undefined;

async function withLocalManifest(dir: string, command: string, args: string[]): Promise<{ ok: boolean; output: string }> {
  if (tarballs === undefined) return run(command, args, dir);
  const manifestPath = join(dir, 'package.json');
  const original = readFileSync(manifestPath, 'utf8');
  writeFileSync(manifestPath, withLocalPackages(original, tarballs));
  const result = await run(command, args, dir);
  writeFileSync(manifestPath, withoutLocalPackages(readFileSync(manifestPath, 'utf8'), original));
  return result;
}

function label(answers: Answers): string {
  return Object.entries(answers)
    .map(([id, value]) => {
      if (typeof value === 'string') return `${id}=${value}`;
      return value ? id : `no-${id}`;
    })
    .join(' ');
}

async function prepare({ stack, answers, name }: Run, dir: string): Promise<string | undefined> {
  try {
    await scaffoldProject({ dir, projectName: name, stack, answers, source: { kind: 'local', root: LOCAL_ROOT }, git: true, install: false }, () => undefined);
  } catch (error) {
    return `scaffolding failed: ${errorMessage(error)}`;
  }
  const installed = await withLocalManifest(dir, 'npm', ['install', '--prefer-offline', '--no-audit', '--no-fund']);
  if (!installed.ok) return `npm install failed\n${installed.output.slice(-4000)}`;
  if (answers['ui'] !== 'shadcn') return undefined;
  const added = await withLocalManifest(dir, 'npx', ['shadcn', 'add', ...SHADCN_ADDED_AFTER_SCAFFOLD, '--yes']);
  return added.ok ? undefined : `shadcn add failed\n${added.output.slice(-4000)}`;
}

async function runCommands(answers: Answers, dir: string): Promise<string | undefined> {
  const commands = [['npm', 'run', 'check'], ['npm', 'test'], ...(values.e2e === true && answers['e2e'] ? [['npm', 'run', 'e2e']] : [])];
  for (const [command = '', ...args] of commands) {
    const result = await run(command, args, dir);
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

function onlyAnswers(only: string | undefined): Answers {
  if (only === undefined) return {};
  return Object.fromEntries(
    only.split(',').map((pair) => {
      const [id = '', value = ''] = pair.split('=');
      if (value === 'true' || value === 'false') return [id, value === 'true'];
      return [id, value];
    }),
  );
}

const runs: Run[] = stacks
  .filter((stack) => values.stack === undefined || stack.id === values.stack)
  .flatMap((stack) => matrixCombinations(stack.options, values.all === true, onlyAnswers(values.only)).map((answers, index) => ({ stack, answers, name: `${stack.id}-${index}` })));
const failures: string[] = [];
let next = 0;

async function worker(): Promise<void> {
  for (let current = runs[next++]; current !== undefined; current = runs[next++]) {
    const failure = await check(current);
    process.stdout.write(`${failure === undefined ? 'ok  ' : 'FAIL'} ${current.name} ${label(current.answers)}\n`);
    if (failure !== undefined) failures.push(`${current.name} ${label(current.answers)}\n${failure}`);
  }
}

function duration(milliseconds: number): string {
  const seconds = Math.round(milliseconds / 1000);
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
}

await Promise.all(Array.from({ length: JOBS }, worker));
for (const failure of failures) process.stderr.write(`\n${failure}\n`);
const summary = `${runs.length} projects built in ${duration(performance.now() - STARTED_AT)}, ${failures.length} failed`;
process.stdout.write(`\n${summary}\n`);
const stepSummary = process.env['GITHUB_STEP_SUMMARY'];
if (stepSummary !== undefined) appendFileSync(stepSummary, `### Matrix\n\n${summary}\n`);
if (values.keep === true) process.stdout.write(`\nProjects kept in ${WORK_DIR}\n`);
process.exitCode = failures.length > 0 ? 1 : 0;
