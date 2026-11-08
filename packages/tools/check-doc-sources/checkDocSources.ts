#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { changedFiles } from './changedFiles.ts';
import { citations } from './citations.ts';
import { markdownFiles } from './markdownFiles.ts';
import { readSettings } from './readSettings.ts';
import { staleCitations } from './staleCitations.ts';

const { values } = parseArgs({ options: { base: { type: 'string' } } });

const cwd = process.cwd();

function changedOrUndefined(): Set<string> | undefined {
  try {
    return changedFiles(cwd, values.base);
  } catch {
    return undefined;
  }
}

const changed = changedOrUndefined();
if (changed === undefined) {
  process.stderr.write(`check-doc-sources: no git history to compare with${values.base === undefined ? '' : ` ${values.base}`}, nothing checked.\n`);
} else {
  const settings = readSettings(cwd);
  const cited = markdownFiles(cwd, settings).flatMap((doc) => citations(cwd, doc));
  for (const citation of staleCitations(cited, changed, settings.ignoreSources)) {
    process.stderr.write(`${citation.file} changed, and ${citation.doc}:${citation.line} cites it but did not change: check that what it says about it still holds.\n`);
  }
}
