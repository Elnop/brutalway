import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { treeViolations } from '#src/treeViolations.ts';

function tree(files: string[], folders: string[] = []): string {
  const root = join(mkdtempSync(join(tmpdir(), 'tree-')), 'src');
  for (const folder of folders) mkdirSync(join(root, folder), { recursive: true });
  for (const file of files) {
    mkdirSync(dirname(join(root, file)), { recursive: true });
    writeFileSync(join(root, file), '');
  }
  return root;
}

describe('treeViolations', () => {
  it('a conforming tree has no violation', () => {
    const root = tree([
      'app/App.tsx',
      'app/globals.css',
      'lib/a.ts',
      'lib/b.ts',
      'lib/a.test.ts',
      'feature/styles/a.css',
      'feature/styles/b.css',
      'feature/Feature.tsx',
    ]);
    assert.deepEqual(treeViolations(root), []);
  });

  it('an empty folder is reported', () => {
    assert.deepEqual(treeViolations(tree(['a.ts'], ['empty'])), ['src/empty is empty: delete it']);
  });

  it('a category folder with a single child is reported, its tests aside', () => {
    assert.deepEqual(treeViolations(tree(['lib/a.ts', 'lib/a.test.ts'])), [
      'src/lib holds a single child: move it up one level and delete the folder',
    ]);
  });

  it('two loose stylesheets, or one beside a styles/ folder, are reported', () => {
    assert.deepEqual(treeViolations(tree(['a.css', 'b.css'])), [
      'src holds 2 styles files (a.css, b.css): move them into styles/',
    ]);
    assert.deepEqual(treeViolations(tree(['a.css', 'styles/b.css', 'styles/c.css'])), [
      'src has a styles/ folder: move a.css into it',
    ]);
  });

  it('a CSS Module stays next to its component, outside of styles/', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'app/globals.css',
          'app/App.tsx',
          'app/App.module.css',
          'list/components/ListLayout.tsx',
          'list/components/ListLayout.module.css',
          'list/components/presenters/Item.tsx',
          'list/components/presenters/Item.module.css',
          'list/components/presenters/Input.tsx',
          'list/components/presenters/Input.module.css',
        ]),
      ),
      [],
    );
  });

  it('hooks, types, configs, stores and lib files follow the same rule as stylesheets', () => {
    assert.deepEqual(
      treeViolations(tree(['feature/useA.ts', 'feature/useB.tsx', 'feature/useA.test.ts'])),
      ['src/feature holds 2 hooks files (useA.ts, useB.tsx): move them into hooks/'],
    );
    assert.deepEqual(
      treeViolations(tree(['feature/useA.ts', 'feature/hooks/useB.ts', 'feature/hooks/useC.ts'])),
      ['src/feature has a hooks/ folder: move useA.ts into it'],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'cartTypes.ts',
          'userTypes.ts',
          'CartConfig.ts',
          'UserConfig.ts',
          'cartStore.ts',
          'userStore.ts',
        ]),
      ),
      [
        'src holds 2 types files (cartTypes.ts, userTypes.ts): move them into types/',
        'src holds 2 configs files (CartConfig.ts, UserConfig.ts): move them into configs/',
        'src holds 2 stores files (cartStore.ts, userStore.ts): move them into stores/',
      ],
    );
    assert.deepEqual(
      treeViolations(
        tree(['feature/total.ts', 'feature/Cart.ts', 'feature/lib/a.ts', 'feature/lib/b.ts']),
      ),
      ['src/feature has a lib/ folder: move Cart.ts, total.ts into it'],
    );
  });

  it('a single file of a kind stays at the root, and named files are not lib', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'feature/useA.ts',
          'feature/total.ts',
          'feature/cartTypes.ts',
          'feature/CartContent.ts',
          'feature/env.d.ts',
          'feature/Cart.tsx',
          'feature/HelpContent.tsx',
        ]),
      ),
      [],
    );
  });

  it('components go in components/, then orchestrators/ and presenters/ inside it', () => {
    assert.deepEqual(
      treeViolations(tree(['feature/Cart.tsx', 'feature/CartContainer.tsx', 'feature/main.tsx'])),
      [
        'src/feature holds 2 components files (Cart.tsx, CartContainer.tsx): move them into components/',
      ],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'feature/Cart.tsx',
          'feature/components/Panel.tsx',
          'feature/components/RowContainer.tsx',
        ]),
      ),
      ['src/feature has a components/ folder: move Cart.tsx into it'],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'components/CartLayout.tsx',
          'components/CartPage.tsx',
          'components/Panel.tsx',
          'components/Row.tsx',
        ]),
      ),
      [
        'src/components holds 2 orchestrators files (CartLayout.tsx, CartPage.tsx): move them into orchestrators/',
        'src/components holds 2 presenters files (Panel.tsx, Row.tsx): move them into presenters/',
      ],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'components/CartPage.tsx',
          'components/Panel.tsx',
          'components/presenters/Row.tsx',
          'components/presenters/Cell.tsx',
        ]),
      ),
      ['src/components has a presenters/ folder: move Panel.tsx into it'],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'components/presenters/Panel.tsx',
          'components/presenters/Row.tsx',
          'components/orchestrators/PanelContainer.tsx',
          'components/orchestrators/RowContainer.tsx',
        ]),
      ),
      [],
    );
  });

  it('the category folders can be replaced', () => {
    assert.deepEqual(treeViolations(tree(['lib/a.ts', 'server/b.ts']), ['server']), [
      'src/server holds a single child: move it up one level and delete the folder',
    ]);
  });

  it('server files: routes, services, queries and schemas follow the same rule', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'features/list/listRoutes.ts',
          'features/list/listService.ts',
          'features/list/ListSchemas.ts',
          'features/list/listQueries.ts',
        ]),
      ),
      [],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'features/list/listRoutes.ts',
          'features/list/adminRoutes.ts',
          'features/list/listService.ts',
        ]),
      ),
      [
        'src/features/list holds 2 routes files (adminRoutes.ts, listRoutes.ts): move them into routes/',
      ],
    );
    assert.deepEqual(
      treeViolations(
        tree(['todos/todosQueries.ts', 'todos/queries/aQueries.ts', 'todos/queries/bQueries.ts']),
      ),
      ['src/todos has a queries/ folder: move todosQueries.ts into it'],
    );
    assert.deepEqual(
      treeViolations(
        tree(['a/aService.ts', 'a/bService.ts', 'a/AppSchemas.ts', 'a/UserSchemas.ts']),
      ),
      [
        'src/a holds 2 services files (aService.ts, bService.ts): move them into services/',
        'src/a holds 2 schemas files (AppSchemas.ts, UserSchemas.ts): move them into schemas/',
      ],
    );
  });

  it('query key factories follow the same rule and are not lib', () => {
    assert.deepEqual(
      treeViolations(
        tree(['todos/todosKeys.ts', 'todos/todosClient.ts', 'todos/todosSelectors.ts']),
      ),
      [],
    );
    assert.deepEqual(treeViolations(tree(['a/todosKeys.ts', 'a/notesKeys.ts'])), [
      'src/a holds 2 keys files (notesKeys.ts, todosKeys.ts): move them into keys/',
    ]);
  });

  it('clients and workers follow the same rule, and env files are not lib', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'features/sync/syncService.ts',
          'features/sync/todoSyncClient.ts',
          'features/sync/todoReminderWorker.ts',
          'shared/appEnv.ts',
          'shared/openDatabase.ts',
        ]),
      ),
      [],
    );
    assert.deepEqual(
      treeViolations(
        tree(['a/githubClient.ts', 'a/stripeClient.ts', 'a/sweepWorker.ts', 'a/queueWorker.ts']),
      ),
      [
        'src/a holds 2 clients files (githubClient.ts, stripeClient.ts): move them into clients/',
        'src/a holds 2 workers files (queueWorker.ts, sweepWorker.ts): move them into workers/',
      ],
    );
    assert.deepEqual(
      treeViolations(tree(['a/githubClient.ts', 'a/clients/aClient.ts', 'a/clients/bClient.ts'])),
      ['src/a has a clients/ folder: move githubClient.ts into it'],
    );
  });
});
