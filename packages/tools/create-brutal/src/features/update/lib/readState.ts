import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isRecord } from '#src/shared/is-record/isRecord.ts';
import { STATE_FILE, STATE_SCHEMA_VERSION } from '#src/shared/stack/configs/StateConfig.ts';
import type { BrutalwayState, AnswerValue, Answers } from '#src/shared/stack/StackTypes.ts';

function answers(value: unknown): Answers | undefined {
  if (!isRecord(value)) return undefined;
  const entries = Object.entries(value).filter(
    (entry): entry is [string, AnswerValue] =>
      typeof entry[1] === 'boolean' || typeof entry[1] === 'string',
  );
  return entries.length === Object.keys(value).length ? Object.fromEntries(entries) : undefined;
}

function stateOf(parsed: unknown): BrutalwayState | undefined {
  if (!isRecord(parsed) || parsed['schemaVersion'] !== STATE_SCHEMA_VERSION) return undefined;
  const { createBrutal, stack, projectName } = parsed;
  const options = answers(parsed['options']);
  if (typeof createBrutal !== 'string' || typeof stack !== 'string') return undefined;
  if (typeof projectName !== 'string' || options === undefined) return undefined;
  return { schemaVersion: STATE_SCHEMA_VERSION, createBrutal, stack, projectName, options };
}

export function readState(dir: string): BrutalwayState | undefined {
  const path = join(dir, STATE_FILE);
  if (!existsSync(path)) return undefined;
  const state = stateOf(JSON.parse(readFileSync(path, 'utf8')));
  if (state === undefined) {
    throw new Error(
      `${STATE_FILE} holds schemaVersion ${String(STATE_SCHEMA_VERSION)}, createBrutal, stack, projectName and options: create-brutal writes it, do not edit it by hand`,
    );
  }
  return state;
}
