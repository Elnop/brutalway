import type { DatabaseSync, SQLOutputValue } from 'node:sqlite';
import type { Todo, TodosQueries } from '#src/shared-features/todos/TodosTypes.ts';

function toTodo(row: Record<string, SQLOutputValue>): Todo {
  return { id: Number(row['id']), title: String(row['title']), completed: row['completed'] === 1 };
}

export function createTodosQueries(database: DatabaseSync): TodosQueries {
  database.exec('CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY, title TEXT NOT NULL, completed INTEGER NOT NULL DEFAULT 0)');
  const listAll = database.prepare('SELECT id, title, completed FROM todos ORDER BY id');
  const listByCompleted = database.prepare('SELECT id, title, completed FROM todos WHERE completed = ? ORDER BY id');
  const findOne = database.prepare('SELECT id, title, completed FROM todos WHERE id = ?');
  const insertOne = database.prepare('INSERT INTO todos (title) VALUES (?) RETURNING id, title, completed');
  const updateOne = database.prepare('UPDATE todos SET title = coalesce(?, title), completed = coalesce(?, completed) WHERE id = ? RETURNING id, title, completed');
  const deleteOne = database.prepare('DELETE FROM todos WHERE id = ? RETURNING id, title, completed');
  const deleteCompleted = database.prepare('DELETE FROM todos WHERE completed = 1');
  const count = database.prepare('SELECT count(*) AS total, coalesce(sum(completed), 0) AS completed FROM todos');

  return {
    list: () => listAll.all().map(toTodo),
    listByCompleted: (completed) => listByCompleted.all(completed ? 1 : 0).map(toTodo),
    find: (id) => {
      const row = findOne.get(id);
      return row === undefined ? null : toTodo(row);
    },
    insert: ({ title }) => toTodo(insertOne.get(title) ?? {}),
    update: (id, { title, completed }) => {
      const row = updateOne.get(title ?? null, completed === undefined ? null : Number(completed), id);
      return row === undefined ? null : toTodo(row);
    },
    remove: (id) => {
      const row = deleteOne.get(id);
      return row === undefined ? null : toTodo(row);
    },
    removeCompleted: () => Number(deleteCompleted.run().changes),
    count: () => {
      const row = count.get() ?? {};
      return { total: Number(row['total']), completed: Number(row['completed']) };
    },
  };
}
