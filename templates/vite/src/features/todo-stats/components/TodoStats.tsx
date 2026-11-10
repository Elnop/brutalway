import { useTranslation } from 'react-i18next';
import '@/features/todo-stats/todo-stats.css';

type TodoStatsProps = {
  remaining: number;
  completed: number;
  onClearCompleted: () => void;
};

export function TodoStats({ remaining, completed, onClearCompleted }: TodoStatsProps) {
  const { t } = useTranslation('todoStats');
  return (
    <section className="todo-stats" aria-labelledby="todo-stats-title">
      <h2 id="todo-stats-title" className="visually-hidden">
        {t('title')}
      </h2>
      <p className="todo-stats-chip todo-stats-left" aria-live="polite">
        {t('left', { count: remaining })}
      </p>
      <p className="todo-stats-chip todo-stats-done">{t('done', { count: completed })}</p>
      <button
        type="button"
        className="button button-pink"
        disabled={completed === 0}
        onClick={onClearCompleted}
      >
        {t('clear')}
      </button>
    </section>
  );
}
