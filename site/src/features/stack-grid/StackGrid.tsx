import '@/features/stack-grid/stack-grid.css';

const stacks = [
  { name: 'template-vite', status: 'Ready', tools: 'Vite, React, zustand, Vitest, Playwright', tone: 'yellow', url: 'https://github.com/Elnop/template-vite' },
  { name: 'template-fastify', status: 'Ready', tools: 'Fastify, Zod, node:sqlite, node:test, Swagger UI', tone: 'pink', url: 'https://github.com/Elnop/template-fastify' },
  { name: 'template-next', status: 'Planned', tools: 'Next.js', tone: 'paper', url: undefined },
  { name: 'template-react-native', status: 'Planned', tools: 'React Native', tone: 'paper', url: undefined },
];

export function StackGrid() {
  return (
    <section id="stacks" className="stack-grid">
      <div className="stack-grid-inner container">
        <h2 className="section-title">Same todo list, every stack</h2>
        <div className="stack-grid-cards">
          {stacks.map((stack) => (
            <article key={stack.name} className={`stack-grid-card tone-${stack.tone}`}>
              <p className="stack-grid-status">{stack.status}</p>
              <h3>{stack.url === undefined ? stack.name : <a href={stack.url}>{stack.name}</a>}</h3>
              <p>{stack.tools}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
