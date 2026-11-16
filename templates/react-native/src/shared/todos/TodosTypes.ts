export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type TodoFilter = 'all' | 'active' | 'completed';

export type TodosState = {
  todos: Todo[];
  filter: TodoFilter;
};

export type TodosActions = {
  add: (title: string) => void;
  toggle: (id: string) => void;
  rename: (id: string, title: string) => void;
  remove: (id: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: TodoFilter) => void;
};
