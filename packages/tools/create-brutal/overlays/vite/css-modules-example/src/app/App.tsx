import { useTranslation } from 'react-i18next';
import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';
import styles from '@/app/App.module.css';

export function App() {
  const { t } = useTranslation('app');
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>{t('title')}</h1>
        <p>{t('tagline')}</p>
      </header>
      <main className={styles.body}>
        <TodoListLayout />
        <TodoStatsContainer />
      </main>
    </div>
  );
}
