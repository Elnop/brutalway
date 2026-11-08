import type { Stack } from '#src/shared-features/stack/StackTypes.ts';

const BIN_SENTENCE = ' `src/todo.test.ts` runs `node src/todo.ts` in a temporary folder and compares the exact output and exit code.';
const EXPORT_SENTENCE = ' `src/todos.test.ts` checks the names the export offers and calls them together on one file.';
const BIN_ENTRY = '"todo": "./dist/todo.js"';
const BIN_LAYOUT_LINE = '  todo.ts           bin: the todo command';
const EXPORT_LAYOUT_LINE = '  todos.ts          the "." export';
const NAMED_ENTRIES = ', named after what it is (`src/todo.ts` for the `todo` command, `src/todos.ts` for the `"."` export),';
const README_COMMAND = `The \`todo\` command calls the same functions:

\`\`\`sh
todo add Buy milk           # Added 1 [ ] Buy milk
todo done 1                 # Completed 1 [x] Buy milk
todo list                   # 1 [x] Buy milk
todo list --file work.json  # No todos.
\`\`\`

It keeps the todos in \`todos.json\` in the current folder, or in the file given by \`--file\`, and parses its arguments with \`node:util\`. On an error, it prints the reason and exits with 1.

`;

export const packageStack: Stack = {
  id: 'package',
  label: 'npm package (library and CLI)',
  directory: 'templates/package',
  projectVersion: '0.1.0',
  options: [
    { id: 'example', message: 'Keep the todo list example?', default: true },
    { id: 'bin', message: 'Ship a command (bin) next to the export?', default: true },
    { id: 'release', message: 'Publish to npm with changesets and a GitHub workflow?', default: true },
    { id: 'claude-hook', message: 'Add the Claude Code hook that lints each edited file?', default: true, independent: true },
    { id: 'ci', message: 'Add the GitHub Actions workflow that runs the checks?', default: true, independent: true },
  ],
  changes: [
    {
      when: {},
      remove: ['CHANGELOG.md'],
      edits: [
        { file: 'README.md', replace: '# template-package\n', with: '# __PROJECT_NAME__\n' },
        { file: 'README.md', replace: "from 'template-package';", with: "from '__PROJECT_NAME__';" },
        { file: 'package.json', dropLines: '"private": true' },
      ],
    },
    {
      when: { bin: false },
      edits: [
        { file: 'package.json', replace: `  "bin": {\n    ${BIN_ENTRY}\n  },\n`, with: '' },
        { file: 'tsdown.config.ts', replace: "'src/todo.ts', ", with: '' },
        { file: 'README.md', dropLines: 'node src/todo.ts' },
        { file: 'README.md', dropLines: BIN_LAYOUT_LINE },
        { file: 'README.md', replace: 'listed in `bin` or `exports` of `package.json`', with: 'listed in `exports` of `package.json`' },
        { file: 'docs/architecture.md', replace: BIN_SENTENCE, with: '' },
        { file: 'docs/verifications.md', dropLines: '| Bin |' },
      ],
    },
    {
      when: { example: true, bin: false },
      remove: ['src/todo.ts', 'src/todo.test.ts'],
      edits: [
        { file: 'package.json', replace: ', as a library and as the todo command.', with: ', as a library.' },
        { file: 'README.md', replace: ', and installs a `todo` command that calls them.', with: '.' },
        { file: 'README.md', replace: README_COMMAND, with: '' },
        { file: 'docs/architecture.md', replace: NAMED_ENTRIES, with: ', named after what it is (`src/todos.ts` for the `"."` export),' },
      ],
    },
    {
      when: { example: false },
      remove: ['src/features', 'src/shared-features', 'src/shared', 'src/todo.ts', 'src/todo.test.ts', 'src/todos.ts', 'src/todos.test.ts'],
      edits: [
        { file: 'package.json', dropLines: '"description": "A todo list' },
        { file: 'package.json', replace: '"./dist/todos.d.ts"', with: '"./dist/greet.d.ts"' },
        { file: 'package.json', replace: '"./dist/todos.js"', with: '"./dist/greet.js"' },
        { file: 'tsdown.config.ts', replace: "'src/todos.ts'", with: "'src/greet.ts'" },
        { file: 'README.md', dropLines: 'The example is the todo list' },
        { file: 'README.md', dropSection: '## The example' },
        { file: 'README.md', replace: '`node:test`: each feature, then each entry point end to end', with: '`node:test`: each entry point end to end' },
        { file: 'README.md', replace: EXPORT_LAYOUT_LINE, with: '  greet.ts          the "." export' },
        {
          file: 'README.md',
          replace:
            ' `src/shared-features/todos/` holds the `Todo` type and `todosFile.ts`, the only file that reads and writes the todos. `src/features/add-todo/`, `src/features/list-todos/` and `src/features/complete-todo/` all use it without knowing each other, and `src/shared/jsonFile.ts` reads and writes any JSON file.',
          with: '',
        },
        { file: 'README.md', dropLines: '1. Delete `src/features/`' },
        { file: 'README.md', dropLines: '2. Rename the entry points' },
        { file: 'README.md', replace: '3. Add a feature per thing', with: '1. Add a feature per thing' },
        { file: 'README.md', replace: '4. Run `npm run check` often', with: '2. Run `npm run check` often' },
        { file: 'docs/architecture.md', replace: ' The example needs no runtime dependency.', with: '' },
        { file: 'docs/architecture.md', replace: EXPORT_SENTENCE, with: ' `src/greet.test.ts` checks the names the export offers and calls them.' },
        { file: 'docs/verifications.md', dropLines: '| Feature |' },
        { file: 'docs/verifications.md', dropLines: '| Shared feature |' },
        {
          file: 'docs/verifications.md',
          replace: 'the names the export offers, called together on one file | `src/todos.test.ts`',
          with: 'the names the export offers, called once | `src/greet.test.ts`',
        },
      ],
      overlay: 'skeleton',
      keep: ['src/features', 'src/shared-features', 'src/shared'],
    },
    {
      when: { example: false, bin: true },
      overlay: 'skeleton-bin',
      edits: [
        { file: 'package.json', replace: BIN_ENTRY, with: '"__PROJECT_NAME__": "./dist/cli.js"' },
        { file: 'tsdown.config.ts', replace: "'src/todo.ts'", with: "'src/cli.ts'" },
        { file: 'README.md', replace: 'node src/todo.ts add Buy milk\nnode src/todo.ts list\n', with: 'node src/cli.ts\n' },
        { file: 'README.md', replace: BIN_LAYOUT_LINE, with: '  cli.ts            bin: the __PROJECT_NAME__ command' },
        { file: 'docs/architecture.md', replace: NAMED_ENTRIES, with: ', named after what it is (`src/cli.ts` for the command, `src/greet.ts` for the `"."` export),' },
        { file: 'docs/architecture.md', replace: BIN_SENTENCE, with: ' `src/cli.test.ts` runs `node src/cli.ts` and compares the exact output and exit code.' },
        {
          file: 'docs/verifications.md',
          replace: '`node src/todo.ts` in a temporary folder: exact output, exit code | `src/todo.test.ts`',
          with: '`node src/cli.ts`: exact output, exit code | `src/cli.test.ts`',
        },
      ],
    },
    {
      when: { example: false, bin: false },
      edits: [{ file: 'docs/architecture.md', replace: NAMED_ENTRIES, with: ', named after what it is (`src/greet.ts` for the `"."` export),' }],
    },
    {
      when: { release: false },
      remove: ['.changeset', '.github/workflows/release.yml'],
      edits: [
        { file: 'README.md', dropLines: '| `npm run release` |' },
        { file: 'README.md', dropSection: '## Publishing' },
        { file: 'AGENTS.md', dropLines: 'comes with a changeset' },
        { file: 'docs/architecture.md', dropSection: '## Releases from changesets' },
      ],
      removeScripts: ['release'],
      removeDependencies: ['@changesets/cli'],
    },
    {
      when: { 'claude-hook': false },
      remove: ['.claude'],
      edits: [
        { file: 'knip.json', replace: '"@brutalway/agent-hook", ', with: '' },
        { file: 'README.md', dropSection: '## Working with an agent' },
      ],
      removeDependencies: ['@brutalway/agent-hook'],
    },
    {
      when: { ci: false },
      remove: ['.github/workflows/ci.yml'],
      edits: [{ file: 'docs/verifications.md', replace: 'runs locally, in the pre-commit hook and in CI.', with: 'runs locally and in the pre-commit hook.' }],
    },
    {
      when: { ci: false, release: false },
      remove: ['.github'],
    },
  ],
  nextSteps: () => ['npm test'],
};
