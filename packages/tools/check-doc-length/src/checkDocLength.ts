#!/usr/bin/env node
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { parseArgs } from 'node:util';
import { longDocs } from '#src/features/length-check/longDocs.ts';
import { splitDoc } from '#src/features/split/lib/splitDoc.ts';
import type { SplitPlan } from '#src/features/split/SplitTypes.ts';
import type { DocLengthSettings } from '#src/shared-features/docs/DocLengthTypes.ts';
import { markdownFiles } from '#src/shared-features/docs/lib/markdownFiles.ts';
import { readSettings } from '#src/shared-features/docs/lib/readSettings.ts';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    'max-lines': { type: 'string' },
    'file-depth': { type: 'string' },
    'index-name': { type: 'string' },
    'order-prefix': { type: 'boolean' },
    write: { type: 'boolean' },
  },
});

function overrides(): Partial<DocLengthSettings> {
  return {
    ...(values['max-lines'] === undefined ? {} : { maxLines: Number(values['max-lines']) }),
    ...(values['file-depth'] === undefined ? {} : { fileDepth: Number(values['file-depth']) }),
    ...(values['index-name'] === undefined ? {} : { indexName: values['index-name'] }),
    ...(values['order-prefix'] === undefined ? {} : { orderPrefix: values['order-prefix'] }),
  };
}

const cwd = process.cwd();
const settings = readSettings(cwd, overrides());
const files = markdownFiles(cwd, settings);

function tooLong(path: string, lines: number): string {
  return `${path} has ${lines} lines, more than ${settings.maxLines}: run check-doc-length split ${path} to see how it would be split along its headings, then add --write.`;
}

function check(): void {
  const long = longDocs(files, settings);
  for (const doc of long) console.error(tooLong(doc.path, doc.lines));
  process.exitCode = long.length === 0 ? 0 : 1;
}

function writePlan(plan: SplitPlan): void {
  rmSync(join(cwd, plan.removed));
  for (const file of plan.written) {
    mkdirSync(dirname(join(cwd, file.path)), { recursive: true });
    writeFileSync(join(cwd, file.path), file.content);
  }
}

function split(path: string): void {
  const doc = files.find((file) => file.path === path);
  if (doc === undefined) {
    throw new Error(`${path} is not one of the Markdown files of this project`);
  }
  const plan = splitDoc(
    path,
    doc.content,
    files.filter((file) => file !== doc),
    settings,
  );
  for (const file of plan.written) {
    process.stdout.write(`${file.path} (${file.content.split('\n').length - 1} lines)\n`);
  }
  if (values.write !== true) {
    process.stdout.write(
      `\nNothing written. Run it again with --write to replace ${path} with these files.\n`,
    );
    return;
  }
  writePlan(plan);
}

if (positionals[0] === 'split') split(positionals[1] ?? '');
else check();
