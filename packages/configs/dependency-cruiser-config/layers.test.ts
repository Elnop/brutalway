import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';

const DEPCRUISE = join(import.meta.dirname, 'node_modules', '.bin', 'depcruise');

function project(files: Record<string, string>, config = 'layers.cjs'): string {
  const root = mkdtempSync(join(tmpdir(), 'layers-'));
  const all: Record<string, string> = {
    '.dependency-cruiser.cjs': `module.exports = { extends: ${JSON.stringify(join(import.meta.dirname, config))}, options: { parser: 'swc' } };\n`,
    'package.json': JSON.stringify({ name: 'fixture', devDependencies: { tooling: '1.0.0' } }),
    'node_modules/tooling/package.json': JSON.stringify({ name: 'tooling', main: 'index.js' }),
    'node_modules/tooling/index.js': 'module.exports = 1;\n',
    ...files,
  };
  for (const [path, content] of Object.entries(all)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

function violatedRules(root: string, folders = ['src']): string[] {
  const result = spawnSync(DEPCRUISE, [...folders, '--output-type', 'json'], {
    cwd: root,
    encoding: 'utf8',
  });
  const report: { summary: { violations: { rule: { name: string } }[] } } = JSON.parse(
    result.stdout,
  );
  return [...new Set(report.summary.violations.map((violation) => violation.rule.name))].toSorted();
}

function fakePackage(name: string): Record<string, string> {
  return {
    [`node_modules/${name}/package.json`]: JSON.stringify({ name, main: 'index.js' }),
    [`node_modules/${name}/index.js`]: 'module.exports = 1;\n',
  };
}

describe('dependency-cruiser-config', () => {
  it('a layered project has no violation', () => {
    const root = project({
      'src/app/App.ts':
        "import { feature } from '../features/editor/feature.ts';\nexport const app = feature;\n",
      'src/features/editor/feature.ts':
        "import { state } from '../../shared-features/plan/state.ts';\nimport { sub } from './features/form/sub.ts';\nexport const feature = state + sub;\n",
      'src/features/editor/features/form/sub.ts':
        "import { helper } from '../../shared/helper.ts';\nexport const sub = helper;\n",
      'src/features/editor/shared/helper.ts':
        "import { util } from '../../../shared/util.ts';\nexport const helper = util;\n",
      'src/shared-features/plan/state.ts':
        "import { util } from '../../shared/util.ts';\nexport const state = util;\n",
      'src/shared/util.ts': 'export const util = 1;\n',
    });
    assert.deepEqual(violatedRules(root), []);
  });

  it('each rule reports its violation', () => {
    const root = project({
      'src/app/App.ts': 'export const app = 1;\n',
      'src/shared/util.ts':
        "import { feature } from '../features/editor/feature.ts';\nexport const util = feature;\n",
      'src/shared-features/plan/state.ts':
        "import { other } from '../other/other.ts';\nimport { feature } from '../../features/editor/feature.ts';\nexport const state = other + feature;\n",
      'src/shared-features/other/other.ts': 'export const other = 1;\n',
      'src/features/editor/feature.ts':
        "import { app } from '../../app/App.ts';\nimport { summary } from '../summary/summary.ts';\nexport const feature = app + summary;\n",
      'src/features/summary/summary.ts': 'export const summary = 1;\n',
      'src/features/editor/features/form/form.ts':
        "import { list } from '../list/list.ts';\nexport const form = list;\n",
      'src/features/editor/features/list/list.ts': 'export const list = 1;\n',
      'src/features/editor/shared/helper.ts':
        "import { list } from '../features/list/list.ts';\nexport const helper = list;\n",
      'src/features/editor/components/Card.tsx':
        "import { useOther } from '../../../shared-features/other/useOther.ts';\nexport const Card = useOther;\n",
      'src/shared-features/other/useOther.ts': 'export const useOther = 1;\n',
      'src/features/summary/lib/cartStore.ts': 'export const cartStore = 1;\n',
      'src/features/summary/lib/useCart.ts':
        "import { cartStore } from './cartStore.ts';\nexport const useCart = cartStore;\n",
      'src/shared/a.ts': "import { b } from './b.ts';\nexport const a = 1 + b;\n",
      'src/shared/b.ts': "import { a } from './a.ts';\nexport const b = a;\n",
      'src/shared/missing.ts':
        "import { nothing } from './nothing.ts';\nexport const missing = nothing;\n",
      'src/shared/prod.ts':
        "import { fixture } from './prod.test.ts';\nimport tooling from 'tooling';\nexport const prod = fixture + tooling;\n",
      'src/shared/prod.test.ts': 'export const fixture = 1;\n',
    });
    assert.deepEqual(
      violatedRules(root),
      [
        'feature-shared-not-to-sub-features',
        'features-not-to-app',
        'no-circular',
        'no-cross-feature',
        'no-cross-shared-feature',
        'no-cross-sub-feature',
        'no-prod-to-tests',
        'no-unresolvable',
        'not-to-dev-dep',
        'presenters-are-pure',
        'shared-not-to-features',
        'shared-features-not-to-features',
        'stores-in-their-folder',
      ].toSorted(),
    );
  });

  it('server data stays out of presenters and stores', () => {
    const root = project({
      'package.json': JSON.stringify({
        name: 'fixture',
        dependencies: { '@tanstack/react-query': '1.0.0' },
      }),
      ...fakePackage('@tanstack/react-query'),
      'src/shared-features/todos/todosClient.ts': 'export const todosClient = 1;\n',
      'src/shared-features/todos/todosKeys.ts': 'export const todosKeys = 1;\n',
      'src/shared-features/todos/hooks/useTodosQuery.ts':
        "import { useQuery } from '@tanstack/react-query';\nimport { todosClient } from '../todosClient.ts';\nimport { todosKeys } from '../todosKeys.ts';\nexport const useTodosQuery = [useQuery, todosClient, todosKeys];\n",
      'src/features/list/components/ListLayout.tsx':
        "import { useTodosQuery } from '../../../shared-features/todos/hooks/useTodosQuery.ts';\nexport const ListLayout = useTodosQuery;\n",
    });
    assert.deepEqual(violatedRules(root), []);
    writeFileSync(
      join(root, 'src/features/list/components/Item.tsx'),
      "import { todosClient } from '../../../shared-features/todos/todosClient.ts';\nexport const Item = todosClient;\n",
    );
    writeFileSync(
      join(root, 'src/shared-features/todos/todosStore.ts'),
      "import { todosClient } from './todosClient.ts';\nexport const todosStore = todosClient;\n",
    );
    assert.deepEqual(violatedRules(root), ['presenters-are-pure', 'stores-hold-no-server-data']);
  });

  it('the server rules keep queries behind services and SQLite inside queries', () => {
    const root = project(
      {
        'src/app/buildApp.ts':
          "import { createTodosQueries } from '../shared-features/todos/todosQueries.ts';\nimport { createListService } from '../features/list/listService.ts';\nexport const app = createListService(createTodosQueries);\n",
        'src/shared/openDatabase.ts':
          "import { DatabaseSync } from 'node:sqlite';\nexport const openDatabase = DatabaseSync;\n",
        'src/shared-features/todos/todosQueries.ts':
          "import { DatabaseSync } from 'node:sqlite';\nexport const createTodosQueries = DatabaseSync;\n",
        'src/features/list/listService.ts':
          "import { createTodosQueries } from '../../shared-features/todos/todosQueries.ts';\nexport const createListService = createTodosQueries;\n",
        'src/features/list/listRoutes.ts':
          "import { createTodosQueries } from '../../shared-features/todos/todosQueries.ts';\nexport const listRoutes = createTodosQueries;\n",
        'src/features/list/listHelper.ts':
          "import { createTodosQueries } from '../../shared-features/todos/todosQueries.ts';\nimport { DatabaseSync } from 'node:sqlite';\nexport const listHelper = [createTodosQueries, DatabaseSync];\n",
      },
      'server.cjs',
    );
    assert.deepEqual(violatedRules(root), [
      'database-in-queries',
      'queries-behind-services',
      'routes-not-to-queries',
    ]);
  });

  it('the server rules let a worker run queries, start workers from src/app/ and keep HTTP calls in clients', () => {
    const root = project(
      {
        'package.json': JSON.stringify({
          name: 'fixture',
          dependencies: { pg: '1.0.0', undici: '1.0.0' },
        }),
        ...fakePackage('pg'),
        ...fakePackage('undici'),
        'src/app/buildApp.ts':
          "import { createSweepWorker } from '../shared-features/todos/sweepWorker.ts';\nexport const app = createSweepWorker;\n",
        'src/shared/openDatabase.ts': "import pg from 'pg';\nexport const openDatabase = pg;\n",
        'src/shared-features/todos/todosQueries.ts':
          "import pg from 'pg';\nexport const createTodosQueries = pg;\n",
        'src/shared-features/todos/sweepWorker.ts':
          "import { createTodosQueries } from './todosQueries.ts';\nexport const createSweepWorker = createTodosQueries;\n",
        'src/shared-features/todos/syncClient.ts':
          "import { request } from 'undici';\nimport https from 'node:https';\nexport const createSyncClient = [request, https];\n",
        'src/features/list/listService.ts':
          "import { createSweepWorker } from '../../shared-features/todos/sweepWorker.ts';\nexport const createListService = createSweepWorker;\n",
        'src/features/list/listHelper.ts':
          "import pg from 'pg';\nimport { request } from 'undici';\nexport const listHelper = [pg, request];\n",
      },
      'server.cjs',
    );
    assert.deepEqual(violatedRules(root), [
      'database-in-queries',
      'http-in-clients',
      'workers-started-from-app',
    ]);
  });

  it('the server config keeps the layer rules', () => {
    const root = project(
      {
        'src/shared/util.ts':
          "import { feature } from '../features/list/feature.ts';\nexport const util = feature;\n",
        'src/features/list/feature.ts': 'export const feature = 1;\n',
      },
      'server.cjs',
    );
    assert.deepEqual(violatedRules(root), ['shared-not-to-features']);
  });

  it('the shadcn rules keep third-party/ apart from the app and its packages inside it', () => {
    const root = project(
      {
        'package.json': JSON.stringify({
          name: 'fixture',
          dependencies: { 'radix-ui': '1.0.0', 'class-variance-authority': '1.0.0' },
        }),
        ...fakePackage('radix-ui'),
        ...fakePackage('class-variance-authority'),
        'third-party/shadcn/button.tsx':
          "import { Slot } from 'radix-ui';\nimport { cva } from 'class-variance-authority';\nexport const Button = [Slot, cva];\n",
        'src/shared/ui/Panel.tsx':
          "import { Button } from '../../../third-party/shadcn/button.tsx';\nexport const Panel = Button;\n",
      },
      'shadcn.cjs',
    );
    assert.deepEqual(violatedRules(root, ['src', 'third-party']), []);
    writeFileSync(
      join(root, 'src/shared/lib.ts'),
      "import { Slot } from 'radix-ui';\nexport const lib = Slot;\n",
    );
    writeFileSync(
      join(root, 'third-party/shadcn/card.tsx'),
      "import { Panel } from '../../src/shared/ui/Panel.tsx';\nexport const Card = Panel;\n",
    );
    assert.deepEqual(violatedRules(root, ['src', 'third-party']), [
      'third-party-not-to-src',
      'third-party-packages-only-from-third-party',
    ]);
  });

  it('the analytics SDK is only imported from analyticsClient.ts', () => {
    const root = project({
      'package.json': JSON.stringify({ name: 'fixture', dependencies: { 'posthog-js': '1.0.0' } }),
      ...fakePackage('posthog-js'),
      'src/shared/analyticsClient.ts':
        "import posthog from 'posthog-js';\nexport const analyticsClient = posthog;\n",
      'src/features/list/listLayout.ts':
        "import { analyticsClient } from '../../shared/analyticsClient.ts';\nexport const listLayout = analyticsClient;\n",
    });
    assert.deepEqual(violatedRules(root), []);
    writeFileSync(
      join(root, 'src/features/list/listHelper.ts'),
      "import posthog from 'posthog-js';\nexport const listHelper = posthog;\n",
    );
    assert.deepEqual(violatedRules(root), ['analytics-in-client']);
  });

  it('posthog-react-native is an analytics SDK too', () => {
    const root = project({
      'package.json': JSON.stringify({
        name: 'fixture',
        dependencies: { 'posthog-react-native': '1.0.0' },
      }),
      ...fakePackage('posthog-react-native'),
      'src/features/list/listHelper.ts':
        "import posthog from 'posthog-react-native';\nexport const listHelper = posthog;\n",
    });
    assert.deepEqual(violatedRules(root), ['analytics-in-client']);
  });

  it('the library rules keep the entry points at the root of src/, imported by nothing but tests', () => {
    const root = project(
      {
        'src/cli.ts':
          "import { feature } from './features/list/feature.ts';\nexport const cli = feature;\n",
        'src/cli.test.ts': "import { cli } from './cli.ts';\nexport const checked = cli;\n",
        'src/features/list/feature.ts':
          "import { util } from '../../shared/util.ts';\nexport const feature = util;\n",
        'src/shared/util.ts': 'export const util = 1;\n',
      },
      'library.cjs',
    );
    assert.deepEqual(violatedRules(root), []);
    writeFileSync(
      join(root, 'src/features/list/helper.ts'),
      "import { cli } from '../../cli.ts';\nexport const helper = cli;\n",
    );
    mkdirSync(join(root, 'src/app'));
    writeFileSync(
      join(root, 'src/app/App.ts'),
      "import { util } from '../shared/util.ts';\nexport const app = util;\n",
    );
    assert.deepEqual(violatedRules(root), ['entries-not-imported', 'no-app-folder']);
  });

  it('the library rules let the code import a peer dependency that is also a dev dependency, not a dev dependency alone', () => {
    const root = project(
      {
        'package.json': JSON.stringify({
          name: 'fixture',
          peerDependencies: { host: '1.0.0' },
          devDependencies: { host: '1.0.0', tooling: '1.0.0' },
        }),
        ...fakePackage('host'),
        'src/Config.ts': "import host from 'host';\nexport const config = host;\n",
      },
      'library.cjs',
    );
    assert.deepEqual(violatedRules(root), []);
    writeFileSync(
      join(root, 'src/Build.ts'),
      "import tooling from 'tooling';\nexport const build = tooling;\n",
    );
    assert.deepEqual(violatedRules(root), ['not-to-dev-dep']);
  });

  it('applies the sub-feature rules below the first level under a name that carries the level', () => {
    const root = project({
      'src/features/editor/features/form/features/fields/fields.ts':
        "import { help } from '../../shared/help.ts';\nexport const fields = help;\n",
      'src/features/editor/features/form/shared/help.ts': 'export const help = 1;\n',
    });
    assert.deepEqual(violatedRules(root), []);
    writeFileSync(
      join(root, 'src/features/editor/features/form/features/fields/name.ts'),
      "import { submit } from '../submit/submit.ts';\nexport const name = submit;\n",
    );
    mkdirSync(join(root, 'src/features/editor/features/form/features/submit'));
    writeFileSync(
      join(root, 'src/features/editor/features/form/features/submit/submit.ts'),
      'export const submit = 1;\n',
    );
    writeFileSync(
      join(root, 'src/features/editor/features/form/shared/check.ts'),
      "import { submit } from '../features/submit/submit.ts';\nexport const check = submit;\n",
    );
    assert.deepEqual(violatedRules(root), [
      'feature-shared-not-to-sub-features-level-2',
      'no-cross-sub-feature-level-2',
    ]);
  });

  it('applies the same rules inside a shared feature, and keeps sub shared features apart', () => {
    const root = project({
      'src/features/editor/features/form/form.ts':
        "import { draft } from '../../shared-features/draft/draft.ts';\nexport const form = draft;\n",
      'src/features/editor/shared-features/draft/draft.ts':
        "import { helper } from '../../shared/helper.ts';\nexport const draft = helper;\n",
      'src/features/editor/shared/helper.ts': 'export const helper = 1;\n',
      'src/shared-features/plan/features/steps/steps.ts':
        "import { lock } from '../../shared-features/lock/lock.ts';\nexport const steps = lock;\n",
      'src/shared-features/plan/shared-features/lock/lock.ts': 'export const lock = 1;\n',
      'src/shared-features/plan/plan.ts':
        "import { steps } from './features/steps/steps.ts';\nexport const plan = steps;\n",
    });
    assert.deepEqual(violatedRules(root), []);
    const imports: Record<string, string> = {
      'src/shared-features/plan/features/budget/budget.ts':
        "import { steps } from '../steps/steps.ts';\nexport const budget = steps;\n",
      'src/shared-features/plan/features/steps/total.ts':
        "import { plan } from '../../plan.ts';\nexport const total = plan;\n",
      'src/features/editor/shared-features/history/history.ts':
        "import { draft } from '../draft/draft.ts';\nimport { form } from '../../features/form/form.ts';\nexport const history = draft + form;\n",
      'src/shared-features/plan/shared/check.ts':
        "import { lock } from '../shared-features/lock/lock.ts';\nexport const check = lock;\n",
    };
    for (const [path, content] of Object.entries(imports)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), content);
    }
    assert.deepEqual(violatedRules(root), [
      'feature-shared-not-to-sub-features',
      'no-cross-sub-feature',
      'no-cross-sub-shared-feature',
    ]);
  });

  it('rejects a feature nested more than 10 levels deep, and any import of it', () => {
    const nested = `src/features/f1${Array.from({ length: 10 }, (_, index) => `/features/f${index + 2}`).join('')}`;
    const tenLevels = nested.slice(0, nested.lastIndexOf('/features/'));
    const root = project({
      'src/shared/util.ts': 'export const util = 1;\n',
      [`${tenLevels}/leaf.ts`]: `import { util } from '${'../'.repeat(20)}shared/util.ts';\nexport const leaf = util;\n`,
    });
    assert.deepEqual(violatedRules(root), []);
    mkdirSync(join(root, nested), { recursive: true });
    writeFileSync(
      join(root, nested, 'deep.ts'),
      `import { util } from '${'../'.repeat(22)}shared/util.ts';\nexport const deep = util;\n`,
    );
    writeFileSync(
      join(root, nested, 'deep.test.ts'),
      "import { deep } from './deep.ts';\nexport const checked = deep;\n",
    );
    assert.deepEqual(violatedRules(root), [
      'feature-nesting-too-deep',
      'feature-nesting-too-deep-imported',
    ]);
  });

  it('lets a Container, Layout, Page, Content or Config component read a store, and no other component', () => {
    const root = project({
      'src/features/list/listStore.ts': 'export const listStore = 1;\n',
      ...Object.fromEntries(
        ['Container', 'Layout', 'Page', 'Content', 'Config'].map((suffix) => [
          `src/features/list/components/List${suffix}.tsx`,
          `import { listStore } from '../listStore.ts';\nexport const List${suffix} = listStore;\n`,
        ]),
      ),
    });
    assert.deepEqual(violatedRules(root), []);
    writeFileSync(
      join(root, 'src/features/list/components/ListItem.tsx'),
      "import { listStore } from '../listStore.ts';\nexport const ListItem = listStore;\n",
    );
    assert.deepEqual(violatedRules(root), ['presenters-are-pure']);
  });
});
