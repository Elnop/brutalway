import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'checkDocLinks.ts');
const OFFLINE = { NODE_USE_ENV_PROXY: '1', HTTPS_PROXY: 'http://127.0.0.1:1', HTTP_PROXY: 'http://127.0.0.1:1' };

function project(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), 'check-doc-links-'));
  spawnSync('git', ['init', '-q'], { cwd: root });
  spawnSync('git', ['remote', 'add', 'origin', 'git@github.com:Elnop/brutalway.git'], { cwd: root });
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

function run(cwd: string, env: Record<string, string> = {}): { status: number | null; lines: string[] } {
  const result = spawnSync(process.execPath, [CLI], { cwd, encoding: 'utf8', env: { ...process.env, ...env } });
  return { status: result.status, lines: result.stderr.split('\n').filter((line) => line !== '') };
}

describe('check-doc-links', () => {
  it('passes when every link resolves inside the project, without a request', () => {
    const root = project({
      'package.json': JSON.stringify({ name: 'root', workspaces: ['packages/*'] }),
      'packages/a/package.json': JSON.stringify({ name: '@me/a' }),
      'docs/guide.md': '[guide](https://github.com/Elnop/brutalway/blob/main/docs/guide.md) [a](https://www.npmjs.com/package/@me/a)\n',
      'README.md': '[local](http://localhost:3000/) [example](https://example.com/page) `https://gone.invalid/`\n',
    });
    assert.deepEqual(run(root, OFFLINE), { status: 0, lines: [] });
  });

  it('fails on a file of the repository that is gone, with the doc and the line', () => {
    const root = project({ 'README.md': '# Title\n\n[gone](https://github.com/Elnop/brutalway/tree/main/docs/gone)\n' });
    assert.deepEqual(run(root, OFFLINE), {
      status: 1,
      lines: ['README.md:3 links to https://github.com/Elnop/brutalway/tree/main/docs/gone, which is gone (no docs/gone in this repository): fix the link or remove it.'],
    });
  });

  it('leaves external links unchecked when offline, and still fails on local ones', () => {
    const root = project({
      'README.md': '[a](https://gone.invalid/a) [b](https://gone.invalid/b) [a again](https://gone.invalid/a)\n',
      'CHANGELOG.md': '[old](https://github.com/Elnop/brutalway/tree/main/old)\n',
      'node_modules/x/README.md': '[old](https://github.com/Elnop/brutalway/tree/main/old)\n',
      'docs/b.md': '[gone](https://github.com/Elnop/brutalway/blob/main/gone.md)\n',
    });
    assert.deepEqual(run(root, OFFLINE), {
      status: 1,
      lines: [
        'check-doc-links: offline, 2 external links not checked.',
        'docs/b.md:1 links to https://github.com/Elnop/brutalway/blob/main/gone.md, which is gone (no gone.md in this repository): fix the link or remove it.',
      ],
    });
  });

  it('skips the links matching the docLinks.skip patterns of package.json', () => {
    const root = project({
      'package.json': JSON.stringify({ docLinks: { skip: ['^https://github\\.com/Elnop/brutalway/tree/main/private/'] } }),
      'README.md': '[private](https://github.com/Elnop/brutalway/tree/main/private/notes)\n',
    });
    assert.deepEqual(run(root, OFFLINE), { status: 0, lines: [] });
  });
});
