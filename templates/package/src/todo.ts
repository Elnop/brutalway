#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { addTodo } from '#src/features/add-todo/addTodo.ts';
import { completeTodo } from '#src/features/complete-todo/completeTodo.ts';
import { listTodos } from '#src/features/list-todos/listTodos.ts';
import type { Todo } from '#src/shared-features/todos/TodosTypes.ts';

const USAGE = 'Usage: todo add <text> | todo list | todo done <id>, with --file <path> (default: todos.json)';

function line(todo: Todo): string {
  return `${todo.id} [${todo.done ? 'x' : ' '}] ${todo.text}`;
}

function todoId(text: string | undefined): number {
  const id = Number(text);
  if (!Number.isInteger(id) || id < 1) throw new Error(`${text ?? 'Nothing'} is not a todo id. ${USAGE}`);
  return id;
}

function output(command: string | undefined, args: string[], file: string): string {
  if (command === 'add') return `Added ${line(addTodo(file, args.join(' ')))}\n`;
  if (command === 'done') return `Completed ${line(completeTodo(file, todoId(args[0])))}\n`;
  if (command !== 'list') throw new Error(USAGE);
  const todos = listTodos(file);
  if (todos.length === 0) return 'No todos.\n';
  return todos.map((todo) => `${line(todo)}\n`).join('');
}

try {
  const { values, positionals } = parseArgs({ allowPositionals: true, options: { file: { type: 'string', default: 'todos.json' } } });
  const [command, ...args] = positionals;
  process.stdout.write(output(command, args, values.file));
} catch (error) {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
}
