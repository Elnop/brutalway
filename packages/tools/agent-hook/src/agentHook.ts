#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { hookChecks } from '#src/features/edit-checks/hookChecks.ts';
import { readHookEdit } from '#src/shared-features/hook-edit/readHookEdit.ts';
import { vendoredEditMessage } from '#src/features/vendored-refusal/vendoredEditMessage.ts';

const { values } = parseArgs({
  options: {
    tree: { type: 'string', multiple: true, default: ['src'] },
    vendored: { type: 'string', multiple: true, default: [] },
    root: { type: 'string' },
    'root-entries': { type: 'boolean', default: false },
  },
});
const root = resolve(values.root ?? process.env['CLAUDE_PROJECT_DIR'] ?? process.cwd());
const edit = readHookEdit(JSON.parse(readFileSync(0, 'utf8')));
const problems: string[] = [];

const file = edit.file === '' ? '' : resolve(root, edit.file);

const refusal = edit.before && file !== '' ? vendoredEditMessage(root, file, values.vendored) : undefined;
if (refusal !== undefined) problems.push(refusal);

for (const check of edit.before ? [] : hookChecks(root, { ...edit, file }, values.tree, values.vendored, values['root-entries'])) {
  const result = spawnSync('npx', ['--no-install', check.command, ...check.args], { cwd: check.cwd, encoding: 'utf8' });
  if (result.status !== 0) problems.push(`${check.label}:\n${result.stdout}${result.stderr}`);
}

if (problems.length > 0) {
  process.stderr.write(refusal === undefined ? `${problems.join('\n')}\nFix them before going on.\n` : `${refusal}\n`);
  process.exitCode = 2;
}
