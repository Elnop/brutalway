#!/usr/bin/env node
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { cancel, confirm, intro, isCancel, log, note, outro, select, spinner, text } from '@clack/prompts';
import { errorMessage } from './errorMessage.ts';
import { readArgs } from './readArgs.ts';
import { readStackRefs } from './readStackRefs.ts';
import { resolveAnswers } from './resolveAnswers.ts';
import { scaffoldProject } from './scaffoldProject.ts';
import { LOCAL_ROOT } from './ScaffoldConfig.ts';
import type { Stack, StackOption, TemplateSource } from './StackTypes.ts';
import { stacks } from './stacks/stacksConfig.ts';

const PROJECT_NAME = /^[a-z0-9][a-z0-9._-]*$/u;

const USAGE = `Usage: npm create brutal [dir] -- [flags]

  --stack <id>       ${stacks.map((stack) => stack.id).join(', ')}
  --preset <file>    JSON file with stack, options, git and install
  --yes, -y          take the default of every question left
  --no-git           skip git init (the pre-commit hook is dropped)
  --no-install       skip npm install
  --local            copy the templates from this brutal checkout

Each stack option has a flag: --<option> or --no-<option>.
${stacks.map((stack) => `  ${stack.id}: ${stack.options.map((option) => option.id).join(', ')}`).join('\n')}`;

function stopCancelled(): never {
  cancel('Cancelled.');
  process.exit(1);
}

function validateDir(value: string | undefined): string | undefined {
  if (value === undefined || value === '') return 'Give a folder name.';
  if (!PROJECT_NAME.test(basename(resolve(value)))) return 'Use lowercase letters, digits, dots, dashes and underscores.';
  if (existsSync(value) && readdirSync(value).length > 0) return `${value} is not empty.`;
  return undefined;
}

async function pickDir(given: string | undefined, yes: boolean): Promise<string> {
  if (given !== undefined || yes) {
    const error = validateDir(given);
    if (error !== undefined) throw new Error(error);
    return given ?? '';
  }
  const value = await text({ message: 'Project folder', placeholder: 'my-app', validate: validateDir });
  return isCancel(value) ? stopCancelled() : value;
}

async function pickStack(id: string | undefined, yes: boolean): Promise<Stack> {
  if (id !== undefined) {
    const found = stacks.find((stack) => stack.id === id);
    if (found === undefined) throw new Error(`Unknown stack ${id}. Choose one of: ${stacks.map((stack) => stack.id).join(', ')}`);
    return found;
  }
  if (yes) throw new Error('--yes needs --stack');
  const value = await select({ message: 'Stack', options: stacks.map((stack) => ({ value: stack, label: stack.label })) });
  return isCancel(value) ? stopCancelled() : value;
}

async function askOption(option: StackOption): Promise<boolean> {
  const value = await confirm({ message: option.message, initialValue: option.default });
  return isCancel(value) ? stopCancelled() : value;
}

async function askYesNo(given: boolean | undefined, yes: boolean, message: string): Promise<boolean> {
  if (given !== undefined) return given;
  if (yes) return true;
  const value = await confirm({ message, initialValue: true });
  return isCancel(value) ? stopCancelled() : value;
}

function templateSource(stack: Stack, local: boolean): TemplateSource {
  if (local) return { kind: 'local', root: LOCAL_ROOT };
  const ref = readStackRefs().get(stack.id);
  if (ref === undefined) throw new Error(`No template commit recorded for ${stack.id}: run from a published build or pass --local`);
  return { kind: 'github', ref };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const first = readArgs(argv, undefined);
  if (first.help) {
    process.stdout.write(`${USAGE}\n`);
    return;
  }
  intro('create-brutal');
  const dir = await pickDir(first.dir, first.yes);
  const stack = await pickStack(first.stack, first.yes);
  const args = readArgs(argv, stack);
  const answers = await resolveAnswers(stack.options, args.options, args.yes ? undefined : askOption);
  const git = await askYesNo(args.git, args.yes, 'Run git init?');
  const install = await askYesNo(args.install, args.yes, 'Run npm install?');
  const existed = existsSync(dir);
  const progress = spinner();
  progress.start('Creating the project');
  try {
    await scaffoldProject({ dir: resolve(dir), projectName: basename(resolve(dir)), stack, answers, source: templateSource(stack, args.local), git, install }, (message) => progress.message(message));
  } catch (error) {
    progress.error('Failed');
    if (existed) for (const entry of readdirSync(dir)) rmSync(resolve(dir, entry), { recursive: true, force: true });
    else rmSync(dir, { recursive: true, force: true });
    throw error;
  }
  progress.stop(`Created ${dir}`);
  note([`cd ${dir}`, ...(install ? [] : ['npm install']), ...(git ? [] : ['git init && git config core.hooksPath .githooks']), ...stack.nextSteps(answers)].join('\n'), 'Next steps');
  outro('Run npm run check before each commit.');
}

try {
  await main();
} catch (error) {
  log.error(errorMessage(error));
  process.exit(1);
}
