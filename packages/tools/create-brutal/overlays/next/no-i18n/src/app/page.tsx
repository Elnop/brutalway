import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';

export default function Home() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Todos</h1>
        <p>template-next · brutalway</p>
      </header>
      <main className="page-body">
        <TodoListLayout />
        <TodoStatsContainer />
      </main>
    </div>
  );
}
