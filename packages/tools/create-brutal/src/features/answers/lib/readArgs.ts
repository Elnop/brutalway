import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import type { ParseArgsOptionsConfig } from 'node:util';
import type { CliArgs, Preset } from '#src/features/answers/CliTypes.ts';
import { isRecord } from '#src/shared/lib/isRecord.ts';
import { isChoice } from '#src/shared-features/stack/optionRules.ts';
import type { AnswerValue, Answers, Stack } from '#src/shared-features/stack/StackTypes.ts';

const BASE_OPTIONS: ParseArgsOptionsConfig = {
  stack: { type: 'string' },
  preset: { type: 'string' },
  yes: { type: 'boolean', short: 'y' },
  local: { type: 'boolean' },
  help: { type: 'boolean', short: 'h' },
  git: { type: 'boolean' },
  install: { type: 'boolean' },
};

function answerEntries(value: unknown): Answers {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, AnswerValue] => typeof entry[1] === 'boolean' || typeof entry[1] === 'string'));
}

function readPreset(path: unknown): Preset {
  if (typeof path !== 'string') return { options: {} };
  const parsed: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (!isRecord(parsed)) throw new Error(`${path} is not a JSON object`);
  const { stack, git, install } = parsed;
  return {
    ...(typeof stack === 'string' ? { stack } : {}),
    ...(typeof git === 'boolean' ? { git } : {}),
    ...(typeof install === 'boolean' ? { install } : {}),
    options: answerEntries(parsed['options']),
  };
}

function optionalBoolean(value: unknown, fallback: boolean | undefined): boolean | undefined {
  return typeof value === 'boolean' ? value : fallback;
}

export function readArgs(argv: string[], stack: Stack | undefined): CliArgs {
  const stackOptions: ParseArgsOptionsConfig = Object.fromEntries((stack?.options ?? []).map((option) => [option.id, { type: isChoice(option) ? 'string' : 'boolean' }]));
  const { values, positionals } = parseArgs({ args: argv, options: { ...BASE_OPTIONS, ...stackOptions }, allowPositionals: true, allowNegative: true, strict: stack !== undefined });
  const preset = readPreset(values['preset']);
  const options: Answers = { ...preset.options };
  for (const option of stack?.options ?? []) {
    const value = values[option.id];
    if (typeof value === 'boolean' || typeof value === 'string') options[option.id] = value;
  }
  const stackId = values['stack'];
  return {
    dir: positionals[0],
    stack: typeof stackId === 'string' ? stackId : preset.stack,
    yes: values['yes'] === true,
    local: values['local'] === true,
    help: values['help'] === true,
    git: optionalBoolean(values['git'], preset.git),
    install: optionalBoolean(values['install'], preset.install),
    options,
  };
}
