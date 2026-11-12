# Getting started

In this tutorial you create a front end with template-vite, add a small feature to it, and break four rules on the way to see what the checks answer. It takes about fifteen minutes. You need Node 26.

## Create the project

```sh
npm create brutal my-app -- --stack vite --yes
cd my-app
npx playwright install --only-shell chromium
npm run dev
```

`--yes` keeps every default: the todo list example, plain CSS, the tests, the Claude Code hook and CI. The last command serves the todo list at `http://localhost:5173`. Add a few tasks and check some of them.

Stop the dev server and run the checks:

```sh
npm run check
```

Everything passes. That is true for any combination of options the CLI offers, listed in the [options of template-vite](../templates/vite/docs/reference/options.md).

## The goal

The stats bar under the list shows how many tasks are left and how many are done. You are going to add a third chip with the share of done tasks, like `67% done`.

The bar is the `todo-stats` feature:

```
src/features/todo-stats/
  components/
    TodoStats.tsx            the presenter: it only gets props
    TodoStatsContainer.tsx   the orchestrator: it reads the store
    TodoStats.test.tsx
  todo-stats.css
```

## A hook in its own folder

The percentage needs a hook. Hooks go in `hooks/`, so create `src/features/todo-stats/hooks/useTodoProgress.ts`:

```ts
import { selectCompletedCount } from '@/shared-features/todos/todosSelectors.ts';
import { useTodos } from '@/shared-features/todos/useTodos.ts';

export function useTodoProgress() {
  const total = useTodos((state) => state.todos.length);
  const completed = useTodos(selectCompletedCount);
  return total === 0 ? 0 : Math.round((completed / total) * 100);
}
```

Run the tree check:

```sh
npm run tree
```

```
src/features/todo-stats/hooks holds a single child: move it up one level and delete the folder
```

A category folder only exists once it holds two files. With one hook, the file stays at the root of the feature:

```sh
mv src/features/todo-stats/hooks/useTodoProgress.ts src/features/todo-stats/
rmdir src/features/todo-stats/hooks
```

## Borrowing from another feature

The `todo-list` feature already has a `useTodoList` hook that returns the tasks. It is tempting to count them from there. Import it at the top of `useTodoProgress.ts`:

```ts
import { useTodoList } from '@/features/todo-list/useTodoList.ts';
```

and use it on the first line of the hook:

```ts
const total = useTodoList().todos.length;
```

```sh
npm run deps
```

```
error no-cross-feature: src/features/todo-stats/useTodoProgress.ts → src/features/todo-list/useTodoList.ts
  A feature never imports another feature: move what they share down to
  shared-features/ (business code) or src/shared/ (no domain).
```

Two features never import each other, so that deleting one never breaks the other. What they share lives one layer down, in `src/shared-features/todos/`, which is where the first version read the tasks. Put it back.

## Text in the component

Pass the value from the orchestrator to the presenter. In `TodoStatsContainer.tsx`:

```tsx
import { useTodoProgress } from '@/features/todo-stats/useTodoProgress.ts';
```

```tsx
const progress = useTodoProgress();
return <TodoStats remaining={remaining} completed={completed} progress={progress} onClearCompleted={todosActions.clearCompleted} />;
```

In `TodoStats.tsx`, add `progress: number` to `TodoStatsProps`, take it in the parameters, and show it before the button:

```tsx
<p className="todo-stats-chip">{progress}% done</p>
```

```sh
npm run lint
```

```
error i18next(no-literal-string): disallow literal string: <p className="todo-stats-chip">{progress}% done</p>
```

Every text a user reads goes through i18next, even in a project with one language. Add the message to `src/app/locales/en/todoStats.json`:

```json
"progress": "{{percent}}% done"
```

and use it:

```tsx
<p className="todo-stats-chip">{t('progress', { percent: progress })}</p>
```

If you write `t('progres')` or forget `percent`, `tsc` fails: the keys and their variables are typed.

## The test that no longer compiles

```sh
npm run check
```

```
src/features/todo-stats/components/TodoStats.test.tsx(8,34): error TS2741: Property 'progress' is missing in type '{ remaining: number; completed: number; onClearCompleted: Mock<() => void>; }' but required in type 'TodoStatsProps'.
```

The presenter test renders `TodoStats` with its old props. Give it `progress={67}` in the first test and `progress={0}` in the second, and check the new chip in the first one:

```tsx
await expect.element(screen.getByText('67% done')).toBeVisible();
```

```sh
npm run check
npm test
```

Both pass. Run `npm run dev` again to see the chip.

## With Claude Code

Ask Claude Code for the same feature in a fresh project. The hook installed by the template runs Oxlint on each file the agent edits, and check-tree and alint on each file it creates, then sends the errors back to it. The agent gets the messages you just read and fixes them before going further, without you pasting anything.

## Next

- [Guides](guides/README.md): the checks in an existing project, the Claude Code hook
- [Common rules](reference/rules.md): every rule, its tool and its message
- [Concepts](concepts/README.md): why the conventions are checked by tools
- [template-vite](../templates/vite/README.md): the commands, the layout and the checks specific to the front end
