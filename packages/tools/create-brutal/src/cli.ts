#!/usr/bin/env node
import { existsSync, readdirSync, rmSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { intro, log, note, outro, spinner } from '@clack/prompts';
import type { CliArgs } from '#src/features/answers/CliTypes.ts';
import { readArgs } from '#src/features/answers/lib/readArgs.ts';
import { resolveAnswers } from '#src/features/answers/lib/resolveAnswers.ts';
import { askOption } from '#src/features/prompts/lib/askOption.ts';
import { askYesNo } from '#src/features/prompts/lib/askYesNo.ts';
import { pickDir } from '#src/features/prompts/lib/pickDir.ts';
import { pickStack } from '#src/features/prompts/lib/pickStack.ts';
import { usageText } from '#src/features/prompts/lib/usageText.ts';
import { scaffoldProject } from '#src/features/scaffolding/lib/scaffoldProject.ts';
import { templateSource } from '#src/features/scaffolding/lib/templateSource.ts';
import type { ScaffoldPlan } from '#src/features/scaffolding/ScaffoldTypes.ts';
import { stacks } from '#src/features/stacks/configs/stacksConfig.ts';
import { errorMessage } from '#src/shared/lib/errorMessage.ts';

async function createProject(dir: string, plan: () => ScaffoldPlan): Promise<void> {
  const existed = existsSync(dir);
  const progress = spinner();
  progress.start('Creating the project');
  try {
    await scaffoldProject(plan(), (message) => progress.message(message));
  } catch (error) {
    progress.error('Failed');
    if (existed) for (const entry of readdirSync(dir)) rmSync(resolve(dir, entry), { recursive: true, force: true });
    else rmSync(dir, { recursive: true, force: true });
    throw error;
  }
  progress.stop(`Created ${dir}`);
}

type ProjectChoices = Omit<ScaffoldPlan, 'source' | 'projectName'> & { local: boolean };

async function askChoices(argv: string[], first: CliArgs): Promise<ProjectChoices> {
  const dir = await pickDir(first.dir, first.yes);
  const stack = await pickStack(stacks, first.stack, first.yes);
  const args = readArgs(argv, stack);
  const answers = await resolveAnswers(stack.options, args.options, args.yes ? undefined : askOption);
  return { dir, stack, answers, local: args.local, git: await askYesNo(args.git, args.yes, 'Run git init?'), install: await askYesNo(args.install, args.yes, 'Run npm install?') };
}

async function main(): Promise<void> {
  const argv = process.argv.slice(2);
  const first = readArgs(argv, undefined);
  if (first.help) {
    process.stdout.write(`${usageText(stacks)}\n`);
    return;
  }
  intro('create-brutal');
  const choices = await askChoices(argv, first);
  await createProject(choices.dir, () => ({ ...choices, dir: resolve(choices.dir), projectName: basename(resolve(choices.dir)), source: templateSource(choices.stack, choices.local) }));
  note(
    [`cd ${choices.dir}`, ...(choices.install ? [] : ['npm install']), ...(choices.git ? [] : ['git init && git config core.hooksPath .githooks']), ...choices.stack.nextSteps(choices.answers)].join(
      '\n',
    ),
    'Next steps',
  );
  outro('Run npm run check before each commit.');
}

try {
  await main();
} catch (error) {
  log.error(errorMessage(error));
  process.exit(1);
}
