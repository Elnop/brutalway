import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'cli.ts');
const SHOW_CURSOR = '\u001B[?25h';
const HIDE_CURSOR = '\u001B[?25l';

const USAGE = `Usage: npm create brutal [dir] -- [flags]

  --stack <id>       vite, fastify
  --preset <file>    JSON file with stack, options, git and install
  --yes, -y          take the default of every question left
  --no-git           skip git init (the pre-commit hook is dropped)
  --no-install       skip npm install
  --local            copy the templates from this brutal checkout

Each stack option has a flag. A yes/no option takes --<option> or --no-<option>,
an option with several values takes --<option> <value>.

vite
  --[no-]example                 default: yes
  --[no-]zustand                 default: yes
  --styling css|css-modules|tailwind default: css
  --ui none|shadcn               default: none
  --[no-]server-state            default: no
  --[no-]forms                   default: no
  --[no-]i18n                    default: no
  --[no-]react-compiler          default: no
  --analytics none|module|posthog default: none
  --[no-]component-tests         default: yes
  --[no-]coverage                default: no
  --[no-]e2e                     default: yes
  --[no-]claude-hook             default: yes
  --[no-]ci                      default: yes

fastify
  --[no-]example                 default: yes
  --[no-]swagger                 default: yes
  --[no-]database                default: yes
  --[no-]claude-hook             default: yes
  --[no-]ci                      default: yes
`;

const CREATED_WITHOUT_GIT = `┌  create-brutal
${HIDE_CURSOR}│
◇  Created app
${SHOW_CURSOR}│
◇  Next steps ──────────────────────────────────────╮
│                                                   │
│  cd app                                           │
│  npm install                                      │
│  git init && git config core.hooksPath .githooks  │
│  npm run dev                                      │
│                                                   │
├───────────────────────────────────────────────────╯
│
└  Run npm run check before each commit.

`;

const CREATED_WITH_GIT = `┌  create-brutal
${HIDE_CURSOR}│
◇  Created app
${SHOW_CURSOR}│
◇  Next steps ──╮
│               │
│  cd app       │
│  npm install  │
│  npm run dev  │
│               │
├───────────────╯
│
└  Run npm run check before each commit.

`;

const OFFLINE = ['--local', '--no-git', '--no-install'];

type Run = { status: number | null; stdout: string; stderr: string; cwd: string };

function run(args: string[], prepare: (cwd: string) => void = () => undefined): Run {
  const cwd = mkdtempSync(join(tmpdir(), 'create-brutal-'));
  prepare(cwd);
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, cwd };
}

function failure(message: string): { status: number; stdout: string; stderr: string } {
  return { status: 1, stdout: `┌  create-brutal\n│\n■  ${message}\n`, stderr: '' };
}

function outcome({ status, stdout, stderr }: Run): { status: number | null; stdout: string; stderr: string } {
  return { status, stdout, stderr };
}

function manifest(project: string): { name?: string; scripts?: Record<string, string> } {
  return JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'));
}

describe('create-brutal', () => {
  it('prints the usage with every stack option for --help and -h, and exits with 0', () => {
    assert.deepEqual(outcome(run(['--help'])), { status: 0, stdout: USAGE, stderr: '' });
    assert.deepEqual(outcome(run(['-h'])), { status: 0, stdout: USAGE, stderr: '' });
  });

  it('refuses a missing, badly named or non-empty folder', () => {
    assert.deepEqual(outcome(run(['-y'])), failure('Give a folder name.'));
    assert.deepEqual(outcome(run(['Bad_Name', '--stack', 'fastify', '-y'])), failure('Use lowercase letters, digits, dots, dashes and underscores.'));
    const notEmpty = run(['app', '--stack', 'fastify', '-y'], (cwd) => {
      mkdirSync(join(cwd, 'app'));
      writeFileSync(join(cwd, 'app', 'file'), '');
    });
    assert.deepEqual(outcome(notEmpty), failure('app is not empty.'));
  });

  it('refuses an unknown stack, an unknown flag, a choice without value and options that conflict', () => {
    assert.deepEqual(outcome(run(['app', '--stack', 'nope', '-y'])), failure('Unknown stack nope. Choose one of: vite, fastify'));
    assert.deepEqual(
      outcome(run(['app', '--stack', 'fastify', '--bogus', '-y'])),
      failure(`Unknown option '--bogus'. To specify a positional argument starting with a '-', place it at the end of the command after '--', as in '-- "--bogus"`),
    );
    assert.deepEqual(
      outcome(run(['app', '--stack', 'vite', '--styling', '-y', '--local'])),
      failure(
        "Option '--styling' argument is ambiguous.\n│  Did you forget to specify the option argument for '--styling'?\n│  To specify an option argument starting with a dash use '--styling=-XYZ'.",
      ),
    );
    assert.deepEqual(outcome(run(['app', '--stack', 'vite', '-y', ...OFFLINE, '--styling', 'css', '--ui', 'shadcn'])), failure('--styling css cannot be used with --ui shadcn'));
  });

  it('refuses a preset that is not a JSON object', () => {
    const result = run(['app', '--preset', 'preset.json', '-y', '--local'], (cwd) => writeFileSync(join(cwd, 'preset.json'), '[1]'));
    assert.deepEqual(outcome(result), { status: 1, stdout: '│\n■  preset.json is not a JSON object\n', stderr: '' });
  });

  it('asks for --local when no template commit is recorded, and leaves no folder behind', () => {
    const result = run(['app', '--stack', 'fastify', '-y', '--no-git', '--no-install']);
    assert.deepEqual(outcome(result), {
      status: 1,
      stdout: `┌  create-brutal\n${HIDE_CURSOR}│\n▲  Failed\n${SHOW_CURSOR}│\n■  No template commit recorded for fastify: run from a published build or pass --local\n`,
      stderr: '',
    });
    assert.equal(existsSync(join(result.cwd, 'app')), false);
  });

  it('creates the fastify project from the local checkout, named after its folder, without the git hook script', () => {
    const result = run(['app', '--stack', 'fastify', '-y', ...OFFLINE]);
    assert.deepEqual(outcome(result), { status: 0, stdout: CREATED_WITHOUT_GIT, stderr: '' });
    const project = join(result.cwd, 'app');
    assert.equal(manifest(project).name, 'app');
    assert.equal(manifest(project).scripts?.['prepare'], undefined);
    assert.equal(existsSync(join(project, '.git')), false);
    for (const file of ['src/server.ts', 'src/shared/lib/openDatabase.ts', 'src/shared/swaggerTheme.css', '.github/workflows/ci.yml', 'src/features/todo-list/todoListRoutes.ts']) {
      assert.equal(existsSync(join(project, file)), true, file);
    }
  });

  it('runs git init when asked', () => {
    const result = run(['app', '--stack', 'fastify', '-y', '--local', '--no-install']);
    assert.deepEqual(outcome(result), { status: 0, stdout: CREATED_WITH_GIT, stderr: '' });
    assert.equal(existsSync(join(result.cwd, 'app', '.git')), true);
    assert.notEqual(manifest(join(result.cwd, 'app')).scripts?.['prepare'], undefined);
  });

  it('drops what the fastify options turn off', () => {
    const result = run(['app', '--stack', 'fastify', '-y', ...OFFLINE, '--no-example', '--no-swagger', '--no-database', '--no-ci']);
    assert.deepEqual(outcome(result), { status: 0, stdout: CREATED_WITHOUT_GIT, stderr: '' });
    const project = join(result.cwd, 'app');
    for (const file of ['src/shared/lib/openDatabase.ts', 'src/shared/swaggerTheme.css', '.github/workflows/ci.yml', 'src/features/todo-list/todoListRoutes.ts']) {
      assert.equal(existsSync(join(project, file)), false, file);
    }
    assert.equal(existsSync(join(project, 'src/features/.gitkeep')), true);
  });

  it('reads the stack, the options, git and install from a preset', () => {
    const preset = JSON.stringify({ stack: 'fastify', git: false, install: false, options: { swagger: false, ci: false } });
    const result = run(['app', '--preset', 'preset.json', '-y', '--local'], (cwd) => writeFileSync(join(cwd, 'preset.json'), preset));
    assert.deepEqual(outcome(result), { status: 0, stdout: CREATED_WITHOUT_GIT, stderr: '' });
    const project = join(result.cwd, 'app');
    assert.equal(existsSync(join(project, 'src/shared/swaggerTheme.css')), false);
    assert.equal(existsSync(join(project, '.github/workflows/ci.yml')), false);
    assert.equal(existsSync(join(project, '.git')), false);
  });

  it('copies the vite overlays of the chosen options', () => {
    const options = ['--styling', 'tailwind', '--ui', 'shadcn', '--server-state', '--forms', '--i18n', '--react-compiler', '--analytics', 'posthog', '--no-e2e', '--no-component-tests'];
    const result = run(['app', '--stack', 'vite', '-y', ...OFFLINE, ...options]);
    assert.deepEqual(outcome(result), { status: 0, stdout: CREATED_WITHOUT_GIT, stderr: '' });
    const project = join(result.cwd, 'app');
    for (const file of ['third-party/shadcn/button.tsx', 'components.json', 'devApi.ts', 'src/app/locales/fr/app.json', 'src/shared/analyticsClient.ts', 'tsconfig.third-party.json']) {
      assert.equal(existsSync(join(project, file)), true, file);
    }
    for (const file of ['playwright.config.ts', 'e2e/app.spec.ts', 'src/features/todo-list/todo-list.css']) {
      assert.equal(existsSync(join(project, file)), false, file);
    }
  });
});
