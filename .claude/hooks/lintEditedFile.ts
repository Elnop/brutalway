import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = join(import.meta.dirname, '..', '..');
function field(value: unknown, key: string): unknown {
  return typeof value === 'object' && value !== null ? Reflect.get(value, key) : undefined;
}

const input: unknown = JSON.parse(readFileSync(0, 'utf8'));
const filePath = field(field(input, 'tool_input'), 'file_path');
const file = typeof filePath === 'string' ? filePath : '';
const fromRoot = relative(root, file);
const inRepo = !fromRoot.startsWith('..') && !fromRoot.split('/').includes('node_modules');
const created = field(input, 'tool_name') === 'Write';
const problems: string[] = [];

function check(label: string, command: string, args: string[]) {
  const result = spawnSync('npx', [command, ...args], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) problems.push(`${label}:\n${result.stdout}${result.stderr}`);
}

if (inRepo && /\.tsx?$/u.test(file)) check(`oxlint found problems in ${fromRoot}`, 'oxlint', ['--type-aware', fromRoot]);
if (inRepo && (created || file.endsWith('.md'))) check('alint found problems in the repo layout or the docs', 'alint', ['check']);
if (inRepo && created && fromRoot.startsWith('src/')) check('check-tree found problems in src', 'check-tree', ['src']);

if (problems.length > 0) {
  process.stderr.write(`${problems.join('\n')}\nFix them before going on.\n`);
  process.exit(2);
}
