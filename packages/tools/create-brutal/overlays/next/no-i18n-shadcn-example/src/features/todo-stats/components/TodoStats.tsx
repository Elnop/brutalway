import { Button } from '@third-party/shadcn/button';

type TodoStatsProps = {
  remaining: number;
  completed: number;
  onClearCompleted: () => void;
};

type TodoStatsCountsProps = {
  remaining: number;
  completed: number;
};

function TodoStatsCounts({ remaining, completed }: TodoStatsCountsProps) {
  return (
    <>
      <p
        className="border-3 border-ink bg-blue px-[0.9rem] py-[0.4rem] font-bold text-on-accent shadow-hard-sm"
        aria-live="polite"
      >
        {remaining === 1 ? '1 task left' : `${remaining} tasks left`}
      </p>
      <p className="border-3 border-ink bg-paper px-[0.9rem] py-[0.4rem] font-bold text-ink shadow-hard-sm">
        {completed} done
      </p>
    </>
  );
}

export function TodoStats({ remaining, completed, onClearCompleted }: TodoStatsProps) {
  return (
    <section className="flex flex-wrap items-center gap-3" aria-labelledby="todo-stats-title">
      <h2 id="todo-stats-title" className="sr-only font-display">
        Progress
      </h2>
      <TodoStatsCounts remaining={remaining} completed={completed} />
      <Button
        type="button"
        variant="destructive"
        className="ml-auto h-auto py-[0.55rem]"
        disabled={completed === 0}
        onClick={onClearCompleted}
      >
        Clear done
      </Button>
    </section>
  );
}
