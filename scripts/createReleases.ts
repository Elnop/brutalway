import { execFileSync, spawnSync } from 'node:child_process';
import { globSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { releaseNotes } from './releaseNotes.ts';

function run(command: string, args: string[]): string {
  return execFileSync(command, args, { encoding: 'utf8' }).trim();
}

function lines(output: string): string[] {
  return output.split('\n').filter((line) => line !== '');
}

const NPM_POLL_INTERVAL_MS = 10_000;
const NPM_WAIT_LIMIT_MS = 300_000;

type Tag = { tag: string; name: string; version: string };

function isPublished(name: string, version: string): boolean {
  return spawnSync('npm', ['view', `${name}@${version}`, 'version'], { stdio: 'ignore' }).status === 0;
}

async function servedByNpm(candidates: Tag[]): Promise<Tag[]> {
  const deadline = Date.now() + NPM_WAIT_LIMIT_MS;
  const served = new Set<string>();
  let pending = candidates;
  while (pending.length > 0) {
    for (const { tag, name, version } of pending) if (isPublished(name, version)) served.add(tag);
    pending = pending.filter(({ tag }) => !served.has(tag));
    if (pending.length === 0 || Date.now() >= deadline) break;
    process.stdout.write(`waiting for npm to serve ${pending.map(({ tag }) => tag).join(', ')}\n`);
    await setTimeout(NPM_POLL_INTERVAL_MS);
  }
  for (const { tag } of pending) process.stderr.write(`skipped ${tag}: no such package version on npm after ${String(NPM_WAIT_LIMIT_MS / 60_000)} minutes\n`);
  return candidates.filter(({ tag }) => served.has(tag));
}

const directories = new Map(
  globSync('packages/*/*/package.json').map((manifestPath) => {
    const manifest: { name: string } = JSON.parse(readFileSync(manifestPath, 'utf8'));
    return [manifest.name, dirname(manifestPath)];
  }),
);
const released = new Set(lines(run('gh', ['release', 'list', '--limit', '1000', '--json', 'tagName', '--jq', '.[].tagName'])));
const tags = lines(run('git', ['tag', '--list', '@brutal/*', 'create-brutal@*', '--sort=creatordate']))
  .filter((tag) => !released.has(tag))
  .map((tag): Tag => ({ tag, name: tag.slice(0, tag.lastIndexOf('@')), version: tag.slice(tag.lastIndexOf('@') + 1) }));

for (const { tag, name } of tags) if (!directories.has(name)) process.stderr.write(`skipped ${tag}: no package of that name in packages/\n`);
const releasable = await servedByNpm(tags.filter(({ name }) => directories.has(name)));

for (const [index, { tag, name, version }] of releasable.entries()) {
  const changelog = readFileSync(join(directories.get(name) ?? '', 'CHANGELOG.md'), 'utf8');
  const notes = releaseNotes(changelog, version) ?? 'First release.';
  const isLatest = index === releasable.length - 1;
  run('gh', ['release', 'create', tag, '--verify-tag', '--title', tag, '--notes', `${notes}\n\nnpm: https://www.npmjs.com/package/${name}/v/${version}`, `--latest=${String(isLatest)}`]);
  process.stdout.write(`released ${tag}\n`);
}
