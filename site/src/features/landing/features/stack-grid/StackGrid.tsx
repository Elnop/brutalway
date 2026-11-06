import '@/features/landing/features/stack-grid/stack-grid.css';
import { SiteLink } from '@/shared/presenters/SiteLink.tsx';

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
        <h2 className="section-title reveal reveal-from-left">Same todo list, every stack</h2>
        <div className="stack-grid-cards">
          {stacks.map((stack) => (
            <article key={stack.name} className={`stack-grid-card reveal reveal-flip tone-${stack.tone}`}>
              <p className="stack-grid-status">{stack.status}</p>
              <h3>{stack.url === undefined ? stack.name : <SiteLink href={stack.url}>{stack.name}</SiteLink>}</h3>
              <p>{stack.tools}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
