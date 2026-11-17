import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';
import styles from '@/app/page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Todos</h1>
        <p>template-next · brutalway</p>
      </header>
      <main className={styles.body}>
        <TodoListLayout />
        <TodoStatsContainer />
      </main>
    </div>
  );
}
