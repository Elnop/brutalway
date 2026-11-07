import { Button } from '@third-party/shadcn/button';
import { countLabel } from '@/shared/lib/countLabel.ts';

type TodoStatsProps = {
  remaining: number;
  completed: number;
  onClearCompleted: () => void;
};

export function TodoStats({ remaining, completed, onClearCompleted }: TodoStatsProps) {
  return (
    <section className="flex flex-wrap items-center gap-3" aria-labelledby="todo-stats-title">
      <h2 id="todo-stats-title" className="sr-only font-display">
        Progress
      </h2>
      <p className="border-3 border-ink bg-blue px-[0.9rem] py-[0.4rem] font-bold text-paper shadow-hard-sm" aria-live="polite">
        {countLabel(remaining, 'task left', 'tasks left')}
      </p>
      <p className="border-3 border-ink bg-paper px-[0.9rem] py-[0.4rem] font-bold shadow-hard-sm">{countLabel(completed, 'done', 'done')}</p>
      <Button type="button" variant="destructive" className="ml-auto h-auto py-[0.55rem]" disabled={completed === 0} onClick={onClearCompleted}>
        Clear done
      </Button>
    </section>
  );
}
