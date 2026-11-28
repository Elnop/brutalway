import { createI18n } from '@/app/createI18n.ts';
import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';

export default function Home() {
  const t = createI18n().getFixedT(null, 'app');
  return (
    <div className="page">
      <header className="page-header">
        <h1>{t('title')}</h1>
        <p>{t('tagline')}</p>
      </header>
      <main className="page-body">
        <TodoListLayout />
        <TodoStatsContainer />
      </main>
    </div>
  );
}
