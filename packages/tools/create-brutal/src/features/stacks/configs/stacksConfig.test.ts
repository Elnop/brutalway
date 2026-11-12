import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, it } from 'node:test';
import { flag } from '#src/shared-features/stack/lib/flag.ts';
import { stacks } from '#src/features/stacks/configs/stacksConfig.ts';
import { packageRoot } from '#src/shared/lib/packageRoot.ts';
import { satisfiesRules } from '#src/shared-features/stack/lib/optionRules.ts';
import { candidateValues, isChoice } from '#src/shared-features/stack/lib/optionValues.ts';
import type { AnswerValue, StackOption } from '#src/shared-features/stack/StackTypes.ts';

const OPTIONS_DOC = 'docs/reference/options.md';
const REPOSITORY_ROOT = join(packageRoot(import.meta.dirname), '..', '..', '..');

function shownValue(value: AnswerValue): string {
  if (typeof value === 'string') return `\`${value}\``;
  return value ? 'yes' : 'no';
}

function incompatibleFlags(option: StackOption, options: StackOption[]): string {
  return candidateValues(option)
    .flatMap((value) =>
      options
        .filter((other) => other.id !== option.id)
        .flatMap((other) =>
          candidateValues(other)
            .filter(
              (otherValue) =>
                !satisfiesRules(options, { [option.id]: value, [other.id]: otherValue }),
            )
            .map(
              (otherValue) =>
                `\`${flag(option.id, value)}\` with \`${flag(other.id, otherValue)}\``,
            ),
        ),
    )
    .join(', ');
}

function expectedRow(option: StackOption, options: StackOption[]): string[] {
  return [
    isChoice(option) ? `\`--${option.id}\`` : `\`--[no-]${option.id}\``,
    candidateValues(option).map(shownValue).join(', '),
    shownValue(option.default),
    incompatibleFlags(option, options),
  ];
}

function documentedRows(text: string): string[][] {
  return text
    .split('\n')
    .filter((line) => line.startsWith('| `--'))
    .map((line) =>
      line
        .slice(1, -1)
        .split('|')
        .map((cell) => cell.trim()),
    );
}

describe('the options page of each template', () => {
  for (const stack of stacks) {
    it(`lists the flag, values, default and incompatible flags of every ${stack.id} option`, () => {
      const text = readFileSync(join(REPOSITORY_ROOT, stack.directory, OPTIONS_DOC), 'utf8');
      assert.deepStrictEqual(
        documentedRows(text),
        stack.options.map((option) => expectedRow(option, stack.options)),
      );
    });
  }
});
