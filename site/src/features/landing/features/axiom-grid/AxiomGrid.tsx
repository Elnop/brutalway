import { AXIOMS } from '@/features/landing/shared/AxiomsConfig.ts';
import '@/features/landing/features/axiom-grid/axiom-grid.css';

export function AxiomGrid() {
  return (
    <section id="axioms" className="axioms container">
      <h2 className="section-title reveal">Six axioms, one word</h2>
      <div className="axioms-grid">
        {AXIOMS.map((axiom) => (
          <article key={axiom.letter} className="axioms-card reveal">
            <div className="axioms-card-heading">
              <span className={`axioms-card-letter tone-${axiom.tone}`} aria-hidden="true">
                {axiom.letter}
              </span>
              <h3>{axiom.name}</h3>
            </div>
            <p className="axioms-card-motto">{axiom.motto}</p>
            <p>{axiom.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
