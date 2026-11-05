import { spawn } from 'node:child_process';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { errorMessage } from '../src/errorMessage.ts';
import { matrixCombinations } from '../src/matrixCombinations.ts';
import { scaffoldProject } from '../src/scaffoldProject.ts';
import { LOCAL_ROOT } from '../src/ScaffoldConfig.ts';
import type { Answers, Stack } from '../src/StackTypes.ts';
import { stacks } from '../src/stacks/stacksConfig.ts';

const { values } = parseArgs({ options: { stack: { type: 'string' }, e2e: { type: 'boolean' }, jobs: { type: 'string' }, keep: { type: 'boolean' } } });
const WORK_DIR = join(LOCAL_ROOT, '.matrix');
const JOBS = Number(values.jobs ?? '3');

type Run = { stack: Stack; answers: Answers; name: string };

function run(command: string, args: string[], cwd: string): Promise<{ ok: boolean; output: string }> {
  return new Promise((resolve) => {
    const child = spawn(command, args, { cwd, env: { ...process.env, CI: '1' } });
    let output = '';
    child.stdout.on('data', (chunk: Buffer) => (output += chunk.toString()));
    child.stderr.on('data', (chunk: Buffer) => (output += chunk.toString()));
    child.on('close', (code) => resolve({ ok: code === 0, output }));
  });
}

function label(answers: Answers): string {
  return Object.entries(answers)
    .map(([id, value]) => (value ? id : `no-${id}`))
    .join(' ');
}

async function check({ stack, answers, name }: Run): Promise<string | undefined> {
  const dir = join(WORK_DIR, name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  try {
    await scaffoldProject({ dir, projectName: name, stack, answers, source: { kind: 'local', root: LOCAL_ROOT }, git: true, install: false }, () => undefined);
  } catch (error) {
    return `scaffolding failed: ${errorMessage(error)}`;
  }
  const commands = [
    ['npm', 'install', '--prefer-offline', '--no-audit', '--no-fund'],
    ['npm', 'run', 'check'],
    ['npm', 'test'],
    ...(values.e2e === true && answers['e2e'] ? [['npm', 'run', 'e2e']] : []),
  ];
  for (const [command = '', ...args] of commands) {
    const result = await run(command, args, dir);
    if (!result.ok) return `${args.join(' ')} failed\n${result.output.slice(-4000)}`;
  }
  if (values.keep !== true) rmSync(dir, { recursive: true, force: true });
  return undefined;
}

const runs: Run[] = stacks
  .filter((stack) => values.stack === undefined || stack.id === values.stack)
  .flatMap((stack) => matrixCombinations(stack.options).map((answers, index) => ({ stack, answers, name: `${stack.id}-${index}` })));
const failures: string[] = [];
let next = 0;

async function worker(): Promise<void> {
  for (let current = runs[next++]; current !== undefined; current = runs[next++]) {
    const failure = await check(current);
    process.stdout.write(`${failure === undefined ? 'ok  ' : 'FAIL'} ${current.name} ${label(current.answers)}\n`);
    if (failure !== undefined) failures.push(`${current.name} ${label(current.answers)}\n${failure}`);
  }
}

await Promise.all(Array.from({ length: JOBS }, worker));
for (const failure of failures) process.stderr.write(`\n${failure}\n`);
process.exitCode = failures.length > 0 ? 1 : 0;
