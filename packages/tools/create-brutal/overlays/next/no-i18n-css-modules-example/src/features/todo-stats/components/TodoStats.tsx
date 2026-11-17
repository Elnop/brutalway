import styles from '@/features/todo-stats/components/TodoStats.module.css';

type TodoStatsProps = {
  remaining: number;
  completed: number;
  onClearCompleted: () => void;
};

export function TodoStats({ remaining, completed, onClearCompleted }: TodoStatsProps) {
  return (
    <section className={styles.stats} aria-labelledby="todo-stats-title">
      <h2 id="todo-stats-title" className="visually-hidden">
        Progress
      </h2>
      <p className={`${styles.chip} ${styles.left}`} aria-live="polite">
        {remaining === 1 ? '1 task left' : `${remaining} tasks left`}
      </p>
      <p className={`${styles.chip} ${styles.done}`}>{completed} done</p>
      <button
        type="button"
        className="button button-pink"
        disabled={completed === 0}
        onClick={onClearCompleted}
      >
        Clear done
      </button>
    </section>
  );
}
