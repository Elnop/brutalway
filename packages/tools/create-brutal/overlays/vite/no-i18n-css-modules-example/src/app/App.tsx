import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';
import styles from '@/app/App.module.css';

export function App() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Todos</h1>
        <p>template-vite · brutalway</p>
      </header>
      <main className={styles.body}>
        <TodoListLayout />
        <TodoStatsContainer />
      </main>
    </div>
  );
}
