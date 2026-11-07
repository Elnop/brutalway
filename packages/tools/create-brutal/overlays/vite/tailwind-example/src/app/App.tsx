import { useTranslation } from 'react-i18next';
import { TodoListLayout } from '@/features/todo-list/components/TodoListLayout.tsx';
import { TodoStatsContainer } from '@/features/todo-stats/components/TodoStatsContainer.tsx';

export function App() {
  const { t } = useTranslation('app');
  return (
    <div className="mx-auto max-w-2xl px-4 pt-10 pb-16">
      <header className="mb-8">
        <h1 className="font-display text-[clamp(2.8rem,12vw,5rem)] leading-none font-bold tracking-[-0.03em] uppercase">{t('title')}</h1>
        <p className="mt-3 inline-block -rotate-2 border-3 border-ink bg-pink px-[0.6rem] py-[0.2rem] font-bold">{t('tagline')}</p>
      </header>
      <main className="grid grid-cols-[minmax(0,1fr)] gap-8">
        <TodoListLayout />
        <TodoStatsContainer />
      </main>
    </div>
  );
}
