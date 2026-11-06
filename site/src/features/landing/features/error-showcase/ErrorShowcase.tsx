import '@/features/landing/features/error-showcase/error-showcase.css';

export function ErrorShowcase() {
  return (
    <section className="error-showcase container">
      <div className="error-showcase-text">
        <h2 className="section-title">The error is the documentation</h2>
        <p>Nobody learns the conventions first. A message teaches each one at the moment it is broken, with the file, the rule and the fix.</p>
      </div>
      <pre className="terminal error-showcase-terminal">
        {'$ npm run check\n\n'}
        <span className="terminal-error">error</span>
        {
          ' no-cross-feature\n  src/features/todo-stats/TodoStats.tsx\n  → src/features/todo-list/components/presenters/TodoItem.tsx\n\n  A feature never imports another feature: move what they share\n  down to shared-features/ (business code) or src/shared/ (no domain).'
        }
      </pre>
    </section>
  );
}
