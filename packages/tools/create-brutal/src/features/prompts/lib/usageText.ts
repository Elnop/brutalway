import { isChoice } from '#src/shared-features/stack/lib/optionValues.ts';
import type { Stack, StackOption } from '#src/shared-features/stack/StackTypes.ts';

function defaultLabel(option: StackOption): string {
  if (isChoice(option)) return option.default;
  return option.default ? 'yes' : 'no';
}

function optionUsage(option: StackOption): string {
  const form = isChoice(option) ? `--${option.id} ${option.values.map((value) => value.id).join('|')}` : `--[no-]${option.id}`;
  return `  ${form.padEnd(30)} default: ${defaultLabel(option)}`;
}

export function usageText(stacks: Stack[]): string {
  return `Usage: npm create brutal [dir] -- [flags]

  --stack <id>       ${stacks.map((stack) => stack.id).join(', ')}
  --preset <file>    JSON file with stack, options, git and install
  --yes, -y          take the default of every question left
  --no-git           skip git init (the pre-commit hook is dropped)
  --no-install       skip npm install
  --local            copy the templates from this brutal checkout

Each stack option has a flag. A yes/no option takes --<option> or --no-<option>,
an option with several values takes --<option> <value>.
${stacks.map((stack) => `\n${stack.id}\n${stack.options.map(optionUsage).join('\n')}`).join('\n')}`;
}
