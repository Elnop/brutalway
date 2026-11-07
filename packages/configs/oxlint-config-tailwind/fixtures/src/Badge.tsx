export function Badge({ done }: { done: boolean }) {
  return (
    <section className="border-3 border-ink bg-paper">
      <h2 className={done ? 'font-display text-ink' : 'font-display text-zinc-500'}>Badge</h2>
      <h3>Details</h3>
      <p className="bg-[#0f0f0f] dark:bg-ink" style={{ color: 'rgb(255 0 0)' }}>
        <code className="font-mono">npm run check</code>
      </p>
      <svg fill="#ffd23f" viewBox="0 0 1 1" />
    </section>
  );
}
