import type { DatabaseSync, SQLOutputValue } from 'node:sqlite';
import type { Todo, TodosQueries } from '#src/shared-features/todos/TodosTypes.ts';

function toTodo(row: Record<string, SQLOutputValue>): Todo {
  return { id: Number(row['id']), title: String(row['title']), completed: row['completed'] === 1 };
}

function toTodoOrNull(row: Record<string, SQLOutputValue> | undefined): Todo | null {
  return row === undefined ? null : toTodo(row);
}

function prepareStatements(database: DatabaseSync) {
  database.exec(
    'CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)',
  );
  return {
    listAll: database.prepare('SELECT id, title, completed FROM todos ORDER BY id'),
    listByCompleted: database.prepare(
      'SELECT id, title, completed FROM todos WHERE completed = ? ORDER BY id',
    ),
    findOne: database.prepare('SELECT id, title, completed FROM todos WHERE id = ?'),
    insertOne: database.prepare(
      'INSERT INTO todos (title) VALUES (?) RETURNING id, title, completed',
    ),
    updateOne: database.prepare(
      'UPDATE todos SET title = coalesce(?, title), completed = coalesce(?, completed) WHERE id = ? RETURNING id, title, completed',
    ),
    deleteOne: database.prepare('DELETE FROM todos WHERE id = ? RETURNING id, title, completed'),
    deleteCompleted: database.prepare('DELETE FROM todos WHERE completed = 1'),
    count: database.prepare(
      'SELECT count(*) AS total, coalesce(sum(completed), 0) AS completed FROM todos',
    ),
  };
}

export function createTodosQueries(database: DatabaseSync): TodosQueries {
  const statements = prepareStatements(database);

  return {
    list: () => statements.listAll.all().map(toTodo),
    listByCompleted: (completed) => statements.listByCompleted.all(completed ? 1 : 0).map(toTodo),
    find: (id) => toTodoOrNull(statements.findOne.get(id)),
    insert: ({ title }) => toTodo(statements.insertOne.get(title) ?? {}),
    update: (id, { title, completed }) =>
      toTodoOrNull(
        statements.updateOne.get(
          title ?? null,
          completed === undefined ? null : Number(completed),
          id,
        ),
      ),
    remove: (id) => toTodoOrNull(statements.deleteOne.get(id)),
    removeCompleted: () => Number(statements.deleteCompleted.run().changes),
    count: () => {
      const row = statements.count.get() ?? {};
      return { total: Number(row['total']), completed: Number(row['completed']) };
    },
  };
}
