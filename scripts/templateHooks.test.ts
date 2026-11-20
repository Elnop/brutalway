import assert from 'node:assert/strict';
import { existsSync, globSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';

type Settings = { hooks: { PostToolUse: { hooks: { command: string }[] }[] } };

function treeArgsOfHook(template: string): string[] {
  const settings: Settings = JSON.parse(
    readFileSync(join(template, '.claude/settings.json'), 'utf8'),
  );
  const command = settings.hooks.PostToolUse.flatMap(({ hooks }) => hooks)
    .map((hook) => hook.command)
    .find((line) => line.includes('brutal-agent-hook'));
  const words = command?.split(' ') ?? [];
  return [words[words.indexOf('--tree') + 1] ?? ''];
}

function treeArgsOfScript(template: string): string[] {
  const manifest: { scripts: Record<string, string> } = JSON.parse(
    readFileSync(join(template, 'package.json'), 'utf8'),
  );
  return manifest.scripts['tree']?.split(' ').slice(1) ?? [];
}

const templates = globSync('templates/*/package.json')
  .map(dirname)
  .filter((template) => existsSync(join(template, '.claude/settings.json')));

for (const template of templates) {
  test(`the agent hook of ${template} checks the folder of its tree script, which takes its options from package.json`, () => {
    assert.deepEqual(treeArgsOfHook(template), treeArgsOfScript(template));
  });
}
