import { AXIOMS } from '@/features/landing/shared/AxiomsConfig.ts';
import { CommandLine } from '@/shared/presenters/CommandLine.tsx';
import '@/features/landing/features/hero/hero.css';

export function Hero() {
  return (
    <section id="top" className="hero container">
      <p className="hero-eyebrow">Project templates for humans and AI agents</p>
      <ol className="hero-letters" aria-label="The six axioms">
        {AXIOMS.map((axiom) => (
          <li key={axiom.letter} className={`hero-letter tone-${axiom.tone}`}>
            <span className="hero-letter-glyph" aria-hidden="true">
              {axiom.letter}
            </span>
            <span className="hero-letter-name">{axiom.name}</span>
          </li>
        ))}
      </ol>
      <div className="hero-pitch">
        <div className="hero-pitch-text">
          <h1>Every convention is a check.</h1>
          <p>
            When a person or an AI agent breaks one, <code>npm run check</code> fails and says what to change. Nothing is left to memory or to code review.
          </p>
        </div>
        <div className="hero-actions">
          <CommandLine shadow="yellow" />
        </div>
      </div>
    </section>
  );
}
