#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { hookChecks } from './hookChecks.ts';
import { readHookEdit } from './readHookEdit.ts';

const { values } = parseArgs({ options: { tree: { type: 'string', multiple: true, default: ['src'] }, root: { type: 'string' } } });
const root = resolve(values.root ?? process.env['CLAUDE_PROJECT_DIR'] ?? process.cwd());
const edit = readHookEdit(JSON.parse(readFileSync(0, 'utf8')));
const problems: string[] = [];

const file = edit.file === '' ? '' : resolve(root, edit.file);

for (const check of hookChecks(root, { ...edit, file }, values.tree)) {
  const result = spawnSync('npx', ['--no-install', check.command, ...check.args], { cwd: check.cwd, encoding: 'utf8' });
  if (result.status !== 0) problems.push(`${check.label}:\n${result.stdout}${result.stderr}`);
}

if (problems.length > 0) {
  process.stderr.write(`${problems.join('\n')}\nFix them before going on.\n`);
  process.exitCode = 2;
}
