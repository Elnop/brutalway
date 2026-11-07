import { TodoFilters } from '@/features/todo-list/components/presenters/TodoFilters.tsx';
import { TodoInput } from '@/features/todo-list/components/presenters/TodoInput.tsx';
import { TodoItem } from '@/features/todo-list/components/presenters/TodoItem.tsx';
import { useTodoList } from '@/features/todo-list/useTodoList.ts';

export function TodoListLayout() {
  const { todos, filter, add, setFilter, toggle, rename, remove } = useTodoList();
  return (
    <section className="border-3 border-ink bg-yellow p-6 shadow-hard" aria-labelledby="todo-list-title">
      <h2 id="todo-list-title" className="mb-5 font-display text-2xl leading-none font-bold uppercase">
        Tasks
      </h2>
      <TodoInput onAdd={add} />
      <TodoFilters filter={filter} onChange={setFilter} />
      {todos.length === 0 ? (
        <p className="font-bold">Nothing here.</p>
      ) : (
        <ul className="grid gap-3">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} onToggle={toggle} onRename={rename} onRemove={remove} />
          ))}
        </ul>
      )}
    </section>
  );
}
