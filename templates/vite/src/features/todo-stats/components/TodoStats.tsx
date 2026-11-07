import { countLabel } from '@/shared/lib/countLabel.ts';
import '@/features/todo-stats/todo-stats.css';

type TodoStatsProps = {
  remaining: number;
  completed: number;
  onClearCompleted: () => void;
};

export function TodoStats({ remaining, completed, onClearCompleted }: TodoStatsProps) {
  return (
    <section className="todo-stats" aria-labelledby="todo-stats-title">
      <h2 id="todo-stats-title" className="visually-hidden">
        Progress
      </h2>
      <p className="todo-stats-chip todo-stats-left" aria-live="polite">
        {countLabel(remaining, 'task left', 'tasks left')}
      </p>
      <p className="todo-stats-chip todo-stats-done">{countLabel(completed, 'done', 'done')}</p>
      <button type="button" className="button button-pink" disabled={completed === 0} onClick={onClearCompleted}>
        Clear done
      </button>
    </section>
  );
}
