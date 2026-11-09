import { useTranslation } from 'react-i18next';

type TodoStatsProps = {
  remaining: number;
  completed: number;
  onClearCompleted: () => void;
};

export function TodoStats({ remaining, completed, onClearCompleted }: TodoStatsProps) {
  const { t } = useTranslation('todoStats');
  return (
    <section className="flex flex-wrap items-center gap-3" aria-labelledby="todo-stats-title">
      <h2 id="todo-stats-title" className="sr-only font-display">
        {t('title')}
      </h2>
      <p className="border-3 border-ink bg-blue px-[0.9rem] py-[0.4rem] font-bold text-on-accent shadow-hard-sm" aria-live="polite">
        {t('left', { count: remaining })}
      </p>
      <p className="border-3 border-ink bg-paper px-[0.9rem] py-[0.4rem] font-bold text-ink shadow-hard-sm">{t('done', { count: completed })}</p>
      <button type="button" className="ml-auto button bg-pink px-[1.1rem] py-[0.55rem] text-on-accent" disabled={completed === 0} onClick={onClearCompleted}>
        {t('clear')}
      </button>
    </section>
  );
}
