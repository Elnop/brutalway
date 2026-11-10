import { existsSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { isCancel, text } from '@clack/prompts';
import { stopCancelled } from '#src/features/prompts/lib/stopCancelled.ts';

const PROJECT_NAME = /^[a-z0-9][a-z0-9._-]*$/u;

function validateDir(value: string | undefined): string | undefined {
  if (value === undefined || value === '') return 'Give a folder name.';
  if (!PROJECT_NAME.test(basename(resolve(value)))) {
    return 'Use lowercase letters, digits, dots, dashes and underscores.';
  }
  if (existsSync(value) && readdirSync(value).length > 0) return `${value} is not empty.`;
  return undefined;
}

export async function pickDir(given: string | undefined, yes: boolean): Promise<string> {
  if (given !== undefined || yes) {
    const error = validateDir(given);
    if (error !== undefined) throw new Error(error);
    return given ?? '';
  }
  const value = await text({
    message: 'Project folder',
    placeholder: 'my-app',
    validate: validateDir,
  });
  return isCancel(value) ? stopCancelled() : value;
}
