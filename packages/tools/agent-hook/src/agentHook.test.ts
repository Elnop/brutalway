import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { chmodSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'agentHook.ts');
const TOOLS = ['oxlint', 'alint', 'check-tree', 'stylelint'];

function project(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'agent-hook-'));
  const withTools: Record<string, string> = { 'package.json': '{ "name": "app" }', ...files };
  for (const tool of TOOLS) {
    withTools[`node_modules/.bin/${tool}`] = `#!/bin/sh\necho "${tool} $* in \${PWD#${root}}"\necho "${tool} says no" >&2\ncase " $FAILING " in *" ${tool} "*) exit 1;; esac\n`;
  }
  for (const [path, content] of Object.entries(withTools)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  for (const tool of TOOLS) chmodSync(join(root, `node_modules/.bin/${tool}`), 0o755);
  return root;
}

type Run = { cwd: string; input: unknown; args?: string[]; failing?: string[]; projectDir?: string };

function run({ cwd, input, args = [], failing = [], projectDir }: Run): { status: number | null; stdout: string; stderr: string } {
  const { CLAUDE_PROJECT_DIR: _ignored, ...inherited } = process.env;
  const env: NodeJS.ProcessEnv = { ...inherited, FAILING: failing.join(' ') };
  if (projectDir !== undefined) env['CLAUDE_PROJECT_DIR'] = projectDir;
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd, env, input: JSON.stringify(input), encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

function edit(file: string, toolName = 'Edit', event = 'PostToolUse'): unknown {
  return { hook_event_name: event, tool_name: toolName, tool_input: { file_path: file } };
}

describe('brutal-agent-hook', () => {
  it('says nothing and exits with 0 when the checks pass', () => {
    const root = project({ 'oxlint.config.ts': '', '.alint.yml': '', 'src/a.ts': '' });
    assert.deepEqual(run({ cwd: root, input: edit(join(root, 'src/a.ts'), 'Write') }), { status: 0, stdout: '', stderr: '' });
  });

  it('sends back the output of a failing oxlint, run from the nearest config, and exits with 2', () => {
    const root = project({ 'oxlint.config.ts': '', 'web/oxlint.config.ts': '', 'web/src/a.tsx': '' });
    assert.deepEqual(run({ cwd: root, input: edit('web/src/a.tsx'), failing: ['oxlint'] }), {
      status: 2,
      stdout: '',
      stderr: 'oxlint found problems in web/src/a.tsx:\noxlint --type-aware src/a.tsx in /web\noxlint says no\n\nFix them before going on.\n',
    });
  });

  it('runs alint and check-tree on each --tree that holds a created file', () => {
    const root = project({ 'oxlint.config.ts': '', '.alint.yml': '', 'web/src/a.ts': '' });
    assert.deepEqual(run({ cwd: root, input: edit(join(root, 'web/src/a.ts'), 'Write'), args: ['--tree', 'web/src', '--tree', 'web'], failing: ['alint', 'check-tree'] }), {
      status: 2,
      stdout: '',
      stderr: [
        'alint found problems in the repository layout or the docs:',
        'alint check in ',
        'alint says no',
        '',
        'check-tree found problems in web/src:',
        'check-tree web/src in ',
        'check-tree says no',
        '',
        'check-tree found problems in web:',
        'check-tree web in ',
        'check-tree says no',
        '',
        'Fix them before going on.',
        '',
      ].join('\n'),
    });
  });

  it('runs check-tree with --root-entries when the hook gets it', () => {
    const root = project({ 'src/features/a/a.ts': '' });
    assert.deepEqual(run({ cwd: root, input: edit(join(root, 'src/features/a/a.ts'), 'Write'), args: ['--root-entries'], failing: ['oxlint', 'check-tree'] }), {
      status: 2,
      stdout: '',
      stderr: [
        'oxlint found problems in src/features/a/a.ts:',
        'oxlint --type-aware src/features/a/a.ts in ',
        'oxlint says no',
        '',
        'check-tree found problems in src:',
        'check-tree src --root-entries in ',
        'check-tree says no',
        '',
        'Fix them before going on.',
        '',
      ].join('\n'),
    });
  });

  it('lints stylesheets only when the project configures stylelint', () => {
    const withConfig = project({ 'package.json': '{ "stylelint": { "extends": "x" } }', 'src/a.css': '' });
    assert.deepEqual(run({ cwd: withConfig, input: edit(join(withConfig, 'src/a.css')), failing: ['stylelint'] }), {
      status: 2,
      stdout: '',
      stderr: 'stylelint found problems in src/a.css:\nstylelint src/a.css in \nstylelint says no\n\nFix them before going on.\n',
    });
    const withoutConfig = project({ 'src/a.css': '' });
    assert.deepEqual(run({ cwd: withoutConfig, input: edit(join(withoutConfig, 'src/a.css')), failing: ['stylelint'] }), { status: 0, stdout: '', stderr: '' });
  });

  it('takes the project root from --root, then from CLAUDE_PROJECT_DIR', () => {
    const root = project({ 'oxlint.config.ts': '', 'src/a.ts': '' });
    const elsewhere = mkdtempSync(join(tmpdir(), 'agent-hook-'));
    const expected = { status: 2, stdout: '', stderr: 'oxlint found problems in src/a.ts:\noxlint --type-aware src/a.ts in \noxlint says no\n\nFix them before going on.\n' };
    assert.deepEqual(run({ cwd: elsewhere, input: edit('src/a.ts'), args: ['--root', root], failing: ['oxlint'], projectDir: elsewhere }), expected);
    assert.deepEqual(run({ cwd: elsewhere, input: edit('src/a.ts'), failing: ['oxlint'], projectDir: root }), expected);
  });

  it('says which command could not start, and from which root, when the project root does not exist', () => {
    const missing = join(mkdtempSync(join(tmpdir(), 'agent-hook-')), 'missing');
    assert.deepEqual(run({ cwd: tmpdir(), input: edit(join(missing, 'src/a.ts')), args: ['--root', missing] }), {
      status: 2,
      stdout: '',
      stderr: `Could not start npx --no-install oxlint --type-aware src/a.ts in ${missing}, the project root is ${missing}: spawnSync npx ENOENT\n`,
    });
  });

  it('ignores files outside the project, in node_modules, or without a path', () => {
    const root = project({ 'oxlint.config.ts': '', '.alint.yml': '' });
    const failing = ['oxlint', 'alint', 'check-tree'];
    assert.deepEqual(run({ cwd: root, input: edit('/elsewhere/src/a.ts', 'Write'), failing }), { status: 0, stdout: '', stderr: '' });
    assert.deepEqual(run({ cwd: root, input: edit(join(root, 'node_modules/x/a.ts'), 'Write'), failing }), { status: 0, stdout: '', stderr: '' });
    assert.deepEqual(run({ cwd: root, input: { tool_name: 'Write' }, failing }), { status: 0, stdout: '', stderr: '' });
  });

  it('refuses an edit under a vendored folder before it happens, and checks nothing there after', () => {
    const root = project({ 'oxlint.config.ts': '', '.alint.yml': '', 'third-party/shadcn/button.tsx': '', 'third-party/magic/orb.tsx': '' });
    const failing = ['oxlint', 'alint', 'check-tree'];
    const args = ['--vendored', 'third-party'];
    assert.deepEqual(run({ cwd: root, input: edit(join(root, 'third-party/shadcn/button.tsx'), 'Edit', 'PreToolUse'), args, failing }), {
      status: 2,
      stdout: '',
      stderr:
        'third-party/shadcn/button.tsx was copied from a registry into third-party/ and is never edited by hand, so the registry can replace it at any time. To update it, run npx shadcn add button --overwrite. To change how it looks, edit the tokens or add a rule on its data-slot in src/app/globals.css, or pass a class from the component that uses it. For a variant shadcn does not have, write a component in src/ that wraps it.\n',
    });
    assert.deepEqual(run({ cwd: root, input: edit(join(root, 'third-party/magic/orb.tsx'), 'Write', 'PreToolUse'), args: ['--vendored', 'third-party/'], failing }), {
      status: 2,
      stdout: '',
      stderr:
        "third-party/magic/orb.tsx was copied from a registry into third-party/ and is never edited by hand, so the registry can replace it at any time. Run the registry's CLI again to update it, and write your own code in src/.\n",
    });
    assert.deepEqual(run({ cwd: root, input: edit(join(root, 'third-party/shadcn/button.tsx'), 'Write'), args, failing }), { status: 0, stdout: '', stderr: '' });
    assert.deepEqual(run({ cwd: root, input: edit(join(root, 'src/a.ts'), 'Write', 'PreToolUse'), args, failing }), { status: 0, stdout: '', stderr: '' });
  });
});
