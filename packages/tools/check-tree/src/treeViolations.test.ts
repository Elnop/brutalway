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
      'shared/ui/lib/a.ts',
      'shared/ui/lib/b.ts',
      'shared/ui/lib/a.test.ts',
      'features/feature/styles/a.css',
      'features/feature/styles/b.css',
      'features/feature/Feature.tsx',
    ]);
    assert.deepEqual(treeViolations(root), []);
  });

  it('an empty folder is reported', () => {
    assert.deepEqual(treeViolations(tree(['a.ts'], ['features/empty'])), [
      'src/features/empty is empty: delete it',
    ]);
  });

  it('a category folder with a single child is reported, its tests aside', () => {
    assert.deepEqual(treeViolations(tree(['shared/ui/lib/a.ts', 'shared/ui/lib/a.test.ts'])), [
      'src/shared/ui/lib holds a single child: move it up one level and delete the folder',
    ]);
  });

  it('two loose stylesheets, or one beside a styles/ folder, are reported', () => {
    assert.deepEqual(treeViolations(tree(['a.css', 'b.css'])), [
      'src holds 2 styles files (a.css, b.css): move them into styles/',
    ]);
    assert.deepEqual(
      treeViolations(
        tree(['a.css', 'shared/ui/a.css', 'shared/ui/styles/b.css', 'shared/ui/styles/c.css']),
      ),
      ['src/shared/ui has a styles/ folder: move a.css into it'],
    );
  });

  it('a CSS Module stays next to its component, outside of styles/', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'app/globals.css',
          'app/App.tsx',
          'app/App.module.css',
          'features/list/components/ListLayout.tsx',
          'features/list/components/ListLayout.module.css',
          'features/list/components/presenters/Item.tsx',
          'features/list/components/presenters/Item.module.css',
          'features/list/components/presenters/Input.tsx',
          'features/list/components/presenters/Input.module.css',
        ]),
      ),
      [],
    );
  });

  it('hooks, types, configs, stores and lib files follow the same rule as stylesheets', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'features/feature/useA.ts',
          'features/feature/useB.tsx',
          'features/feature/useA.test.ts',
        ]),
      ),
      ['src/features/feature holds 2 hooks files (useA.ts, useB.tsx): move them into hooks/'],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'features/feature/useA.ts',
          'features/feature/hooks/useB.ts',
          'features/feature/hooks/useC.ts',
        ]),
      ),
      ['src/features/feature has a hooks/ folder: move useA.ts into it'],
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
        tree([
          'features/feature/total.ts',
          'features/feature/Cart.ts',
          'features/feature/lib/a.ts',
          'features/feature/lib/b.ts',
        ]),
      ),
      ['src/features/feature has a lib/ folder: move Cart.ts, total.ts into it'],
    );
  });

  it('a single file of a kind stays at the root, and named files are not lib', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'features/feature/useA.ts',
          'features/feature/total.ts',
          'features/feature/cartTypes.ts',
          'features/feature/CartContent.ts',
          'features/feature/env.d.ts',
          'features/feature/Cart.tsx',
          'features/feature/HelpContent.tsx',
        ]),
      ),
      [],
    );
  });

  it('components go in components/, then orchestrators/ and presenters/ inside it', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'features/feature/Cart.tsx',
          'features/feature/CartContainer.tsx',
          'features/feature/main.tsx',
        ]),
      ),
      [
        'src/features/feature holds 2 components files (Cart.tsx, CartContainer.tsx): move them into components/',
      ],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'features/feature/Cart.tsx',
          'features/feature/components/Panel.tsx',
          'features/feature/components/RowContainer.tsx',
        ]),
      ),
      ['src/features/feature has a components/ folder: move Cart.tsx into it'],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'shared/ui/components/CartLayout.tsx',
          'shared/ui/components/CartPage.tsx',
          'shared/ui/components/Panel.tsx',
          'shared/ui/components/Row.tsx',
        ]),
      ),
      [
        'src/shared/ui/components holds 2 orchestrators files (CartLayout.tsx, CartPage.tsx): move them into orchestrators/',
        'src/shared/ui/components holds 2 presenters files (Panel.tsx, Row.tsx): move them into presenters/',
      ],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'shared/ui/components/CartPage.tsx',
          'shared/ui/components/Panel.tsx',
          'shared/ui/components/presenters/Row.tsx',
          'shared/ui/components/presenters/Cell.tsx',
        ]),
      ),
      ['src/shared/ui/components has a presenters/ folder: move Panel.tsx into it'],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'shared/ui/components/presenters/Panel.tsx',
          'shared/ui/components/presenters/Row.tsx',
          'shared/ui/components/orchestrators/PanelContainer.tsx',
          'shared/ui/components/orchestrators/RowContainer.tsx',
        ]),
      ),
      [],
    );
  });

  it('the category folders can be replaced', () => {
    assert.deepEqual(
      treeViolations(tree(['shared/ui/server/b.ts', 'shared/ui/c.ts']), ['server']),
      ['src/shared/ui/server holds a single child: move it up one level and delete the folder'],
    );
    assert.deepEqual(
      treeViolations(tree(['shared/ui/lib/a.ts', 'shared/ui/lib/b.ts']), ['server']),
      [
        'src/shared/ui/lib is not a kind folder: a feature or a slice holds kind folders, features/ for its sub-features and shared/ for the slices they share, move it into features/ as a sub-feature, into shared/ as a slice, or spread its files into kind folders',
      ],
    );
  });

  it('src/ holds app/, features/ and shared/, and app/ is free', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'main.tsx',
          'app/screens/home/index.tsx',
          'app/locales/en/common.json',
          'features/list/List.tsx',
          'shared/todos/todosStore.ts',
          'shared/text/normalize.ts',
        ]),
      ),
      [],
    );
    assert.deepEqual(treeViolations(tree(['utils/a.ts', 'shared-features/todos/todos.ts'])), [
      'src/shared-features is not a layer: src/ holds app/, features/ and shared/ next to its entry files, move it into one of them',
      'src/utils is not a layer: src/ holds app/, features/ and shared/ next to its entry files, move it into one of them',
    ]);
  });

  it('the files of app/ stay where the router reads them, whatever their kind and however many they are', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'app/layout.tsx',
          'app/page.tsx',
          'app/sitemap.ts',
          'app/robots.ts',
          'app/manifest.ts',
          'app/globals.css',
          'app/print.css',
          'app/blog/[slug]/page.tsx',
          'app/blog/[slug]/opengraph-image.tsx',
          'app/blog/[slug]/sitemap.ts',
          'app/+middleware.ts',
          'app/hello+api.ts',
          'app/todos+api.ts',
        ]),
      ),
      [],
    );
    assert.deepEqual(treeViolations(tree(['app/page.tsx'], ['app/empty'])), [
      'src/app/empty is empty: delete it',
    ]);
  });

  it('a shared/ holds one folder per slice and no file, at any depth, and a slice is laid out like a feature', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'shared/authentication/AuthenticationTypes.ts',
          'shared/authentication/signRequest.ts',
          'shared/errors/errorMessage.ts',
          'shared/todos/hooks/useTodos.ts',
          'shared/todos/hooks/useTodoStats.ts',
        ]),
      ),
      [],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'shared/readEnv.ts',
          'shared/EnvTypes.ts',
          'shared/readEnv.test.ts',
          'shared/todos/todos.ts',
          'features/list/shared/format.ts',
          'features/list/shared/title/Title.tsx',
        ]),
      ),
      [
        'src/features/list/shared holds format.ts: shared/ holds one folder per slice, move each file into the slice of its concept',
        'src/shared holds EnvTypes.ts, readEnv.ts: shared/ holds one folder per slice, move each file into the slice of its concept',
      ],
    );
    assert.deepEqual(
      treeViolations(tree(['shared/ui/components/A.tsx', 'shared/ui/components/http/client.ts'])),
      [
        'src/shared/ui/components/http is not a kind folder: src/shared/ui/components/ holds its files and kind folders only',
      ],
    );
  });

  it('a feature or a slice holds kind folders, features/ and shared/, at any depth', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'features/list/listRoutes.ts',
          'features/list/features/editor/editor.ts',
          'features/list/shared/drafts/drafts.ts',
          'shared/todos/todosQueries.ts',
          'shared/todos/features/locking/lock.ts',
          'shared/todos/features/locking/features/renew/renew.ts',
          'shared/todos/shared/types/aTypes.ts',
          'shared/todos/shared/types/bTypes.ts',
        ]),
      ),
      [],
    );
    const reason =
      'a feature or a slice holds kind folders, features/ for its sub-features and shared/ for the slices they share, move it into features/ as a sub-feature, into shared/ as a slice, or spread its files into kind folders';
    assert.deepEqual(
      treeViolations(
        tree(['features/list/billing/invoice.ts', 'features/list/billing/BillingTypes.ts']),
      ),
      [`src/features/list/billing is not a kind folder: ${reason}`],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'shared/todos/features/locking/parts/part.ts',
          'shared/todos/features/locking/lock.ts',
          'shared/todos/shared-features/drafts/drafts.ts',
        ]),
      ),
      [
        `src/shared/todos/features/locking/parts is not a kind folder: ${reason}`,
        `src/shared/todos/shared-features is not a kind folder: ${reason}`,
      ],
    );
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
        tree([
          'shared/todos/todosQueries.ts',
          'shared/todos/queries/aQueries.ts',
          'shared/todos/queries/bQueries.ts',
        ]),
      ),
      ['src/shared/todos has a queries/ folder: move todosQueries.ts into it'],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'features/a/aService.ts',
          'features/a/bService.ts',
          'features/a/AppSchemas.ts',
          'features/a/UserSchemas.ts',
        ]),
      ),
      [
        'src/features/a holds 2 services files (aService.ts, bService.ts): move them into services/',
        'src/features/a holds 2 schemas files (AppSchemas.ts, UserSchemas.ts): move them into schemas/',
      ],
    );
  });

  it('query key factories follow the same rule and are not lib', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'shared/todos/todosKeys.ts',
          'shared/todos/todosClient.ts',
          'shared/todos/todosSelectors.ts',
        ]),
      ),
      [],
    );
    assert.deepEqual(treeViolations(tree(['features/a/todosKeys.ts', 'features/a/notesKeys.ts'])), [
      'src/features/a holds 2 keys files (notesKeys.ts, todosKeys.ts): move them into keys/',
    ]);
  });

  it('clients and workers follow the same rule, and env files are not lib', () => {
    assert.deepEqual(
      treeViolations(
        tree([
          'features/sync/syncService.ts',
          'features/sync/todoSyncClient.ts',
          'features/sync/todoReminderWorker.ts',
          'shared/env/appEnv.ts',
          'shared/env/openDatabase.ts',
        ]),
      ),
      [],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'features/a/githubClient.ts',
          'features/a/stripeClient.ts',
          'features/a/sweepWorker.ts',
          'features/a/queueWorker.ts',
        ]),
      ),
      [
        'src/features/a holds 2 clients files (githubClient.ts, stripeClient.ts): move them into clients/',
        'src/features/a holds 2 workers files (queueWorker.ts, sweepWorker.ts): move them into workers/',
      ],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'features/a/githubClient.ts',
          'features/a/clients/aClient.ts',
          'features/a/clients/bClient.ts',
        ]),
      ),
      ['src/features/a has a clients/ folder: move githubClient.ts into it'],
    );
  });

  it('a category folder whose files all belong to one group keeps them, since the group folder would be its single child', () => {
    assert.deepEqual(
      treeViolations(
        tree(['features/a/components/PageShell.tsx', 'features/a/components/ThemedStack.tsx']),
      ),
      [],
    );
    assert.deepEqual(
      treeViolations(
        tree([
          'features/a/components/PageShell.tsx',
          'features/a/components/ThemedStack.tsx',
          'features/a/components/ShellLayout.tsx',
        ]),
      ),
      [
        'src/features/a/components holds 2 presenters files (PageShell.tsx, ThemedStack.tsx): move them into presenters/',
      ],
    );
  });
});
