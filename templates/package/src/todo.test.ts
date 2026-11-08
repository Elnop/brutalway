import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, it } from 'node:test';

const CLI = join(import.meta.dirname, 'todo.ts');
const USAGE = 'Usage: todo add <text> | todo list | todo done <id>, with --file <path> (default: todos.json)\n';

function folder(): string {
  return mkdtempSync(join(tmpdir(), 'todo-'));
}

function todo(cwd: string, ...args: string[]): { status: number | null; stdout: string; stderr: string } {
  const result = spawnSync(process.execPath, [CLI, ...args], { cwd, encoding: 'utf8' });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr };
}

describe('todo', () => {
  it('adds, completes and lists the todos of todos.json in the current folder', () => {
    const cwd = folder();
    assert.deepEqual(todo(cwd, 'list'), { status: 0, stdout: 'No todos.\n', stderr: '' });
    assert.deepEqual(todo(cwd, 'add', 'Buy', 'milk'), { status: 0, stdout: 'Added 1 [ ] Buy milk\n', stderr: '' });
    assert.deepEqual(todo(cwd, 'add', 'Write the README'), { status: 0, stdout: 'Added 2 [ ] Write the README\n', stderr: '' });
    assert.deepEqual(todo(cwd, 'done', '1'), { status: 0, stdout: 'Completed 1 [x] Buy milk\n', stderr: '' });
    assert.deepEqual(todo(cwd, 'list'), { status: 0, stdout: '1 [x] Buy milk\n2 [ ] Write the README\n', stderr: '' });
  });

  it('reads and writes the file given by --file', () => {
    const cwd = folder();
    writeFileSync(join(cwd, 'work.json'), JSON.stringify([{ id: 7, text: 'Ship it', done: false }]));
    assert.deepEqual(todo(cwd, 'add', 'Tag it', '--file', 'work.json'), { status: 0, stdout: 'Added 8 [ ] Tag it\n', stderr: '' });
    assert.deepEqual(todo(cwd, 'list', '--file', 'work.json'), { status: 0, stdout: '7 [ ] Ship it\n8 [ ] Tag it\n', stderr: '' });
    assert.deepEqual(todo(cwd, 'list'), { status: 0, stdout: 'No todos.\n', stderr: '' });
  });

  it('prints the usage for a missing or unknown command, and the reason for a refused one', () => {
    const cwd = folder();
    assert.deepEqual(todo(cwd), { status: 1, stdout: '', stderr: USAGE });
    assert.deepEqual(todo(cwd, 'remove', '1'), { status: 1, stdout: '', stderr: USAGE });
    assert.deepEqual(todo(cwd, 'add'), { status: 1, stdout: '', stderr: 'The text of a todo cannot be blank.\n' });
    assert.deepEqual(todo(cwd, 'done', 'one'), { status: 1, stdout: '', stderr: `one is not a todo id. ${USAGE}` });
    assert.deepEqual(todo(cwd, 'done', '4'), { status: 1, stdout: '', stderr: 'No todo has the id 4.\n' });
  });
});
