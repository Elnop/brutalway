import '@/features/authors/authors.css';

const AUTHOR_COUNT = 72;
const FULLY_VISIBLE = 36;

const authors = Array.from({ length: AUTHOR_COUNT }, (_unused, index) => ({
  id: index,
  isAgent: index % 3 !== 0,
  opacity: index < FULLY_VISIBLE ? 1 : Math.max(0.12, 1 - (index - FULLY_VISIBLE) / 38),
}));

const steps = [
  { number: '01', title: 'An author writes a file', detail: 'A person in their editor, or an agent with an Edit or a Write.', tone: 'paper' },
  { number: '02', title: 'The checks run', detail: 'After each edit for an agent, through the Claude Code hook. Before each commit and in CI for everyone.', tone: 'yellow' },
  { number: '03', title: 'The error comes back', detail: 'It names the file, the rule and what to change.', tone: 'pink' },
  { number: '04', title: 'The author fixes it', detail: 'Right away, while the change is still in mind or in context.', tone: 'paper' },
];

export function AuthorsSection() {
  return (
    <section id="authors" className="authors">
      <div className="authors-inner container">
        <div className="authors-intro">
          <h2>One author or ten thousand</h2>
          <p>
            A developer, a team, or a fleet of agents running in parallel: every change goes through the same checks. The rules do not loosen as the team grows, and no one needs onboarding. Agents
            start each session with no memory of the last one, and it does not matter: the error teaches the convention again.
          </p>
        </div>
        <div className="authors-funnel" aria-hidden="true">
          <div className="authors-crowd">
            {authors.map((author) => (
              <div key={author.id} className={author.isAgent ? 'authors-tile tone-yellow' : 'authors-tile tone-paper'} style={{ opacity: author.opacity }}>
                <img src={`${import.meta.env.BASE_URL}${author.isAgent ? 'agent' : 'human'}.svg`} alt="" width="24" height="24" />
              </div>
            ))}
          </div>
          <svg width="40" height="56" viewBox="0 0 40 56">
            <path d="M20 0 V48 M6 34 L20 50 L34 34" fill="none" stroke="#111111" strokeWidth="5" strokeLinecap="square" />
          </svg>
          <code className="authors-check">npm run check</code>
        </div>
        <ol className="authors-steps">
          {steps.map((step) => (
            <li key={step.number} className={`authors-step tone-${step.tone}`}>
              <span className="authors-step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
