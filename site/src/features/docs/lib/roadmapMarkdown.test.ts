import { describe, expect, it } from 'vitest';
import type { RoadmapIssue } from '@/features/docs/DocsTypes.ts';
import { roadmapMarkdown } from '@/features/docs/lib/roadmapMarkdown.ts';

function issue(number: number, fields: Partial<RoadmapIssue> = {}): RoadmapIssue {
  return { number, title: `Issue ${String(number)}`, url: `https://github.com/o/r/issues/${String(number)}`, closed: false, completed: false, labels: [], parent: undefined, ...fields };
}

function section(markdown: string, heading: string): string | undefined {
  return markdown
    .split(/^## /mu)
    .find((part) => part.startsWith(`${heading}\n`))
    ?.slice(heading.length)
    .trim();
}

describe('roadmapMarkdown', () => {
  it('puts each issue under the section of its status label, and the closed ones under Done', () => {
    const markdown = roadmapMarkdown('o/r', [issue(1, { labels: ['todo'] }), issue(2, { labels: ['in progress'] }), issue(3, { labels: ['triage'] }), issue(4, { closed: true, completed: true })]);
    expect(markdown.startsWith('# Roadmap\n\n')).toBe(true);
    expect(markdown.indexOf('## In progress')).toBeLessThan(markdown.indexOf('## To do'));
    expect(section(markdown, 'In progress')).toBe('- [#2](https://github.com/o/r/issues/2) Issue 2');
    expect(section(markdown, 'To do')).toBe('- [#1](https://github.com/o/r/issues/1) Issue 1');
    expect(section(markdown, 'Waiting for triage')).toContain('- [#3](https://github.com/o/r/issues/3) Issue 3');
    expect(section(markdown, 'Done')).toBe('- [#4](https://github.com/o/r/issues/4) Issue 4');
  });

  it('leaves out an open issue without a status label, an issue closed as not planned and a rejected one', () => {
    const markdown = roadmapMarkdown('o/r', [issue(1), issue(2, { closed: true }), issue(3, { labels: ['todo', 'wontfix'] }), issue(4, { closed: true, completed: true, labels: ['duplicate'] })]);
    expect(markdown).not.toContain('](https://github.com/o/r/issues/');
    expect(markdown).not.toContain('## ');
  });

  it('keeps an issue in triage while it still carries the label, whatever else it has', () => {
    const markdown = roadmapMarkdown('o/r', [issue(1, { labels: ['todo', 'triage'] })]);
    expect(section(markdown, 'To do')).toBeUndefined();
    expect(section(markdown, 'Waiting for triage')).toContain('#1');
  });

  it('nests sub-issues under their parent, with their own status when it differs', () => {
    const markdown = roadmapMarkdown('o/r', [
      issue(5, { labels: ['todo'], parent: 4 }),
      issue(4, { labels: ['in progress', 'enhancement'] }),
      issue(6, { closed: true, completed: true, parent: 4 }),
      issue(7, { parent: 4 }),
    ]);
    expect(section(markdown, 'In progress')).toBe(
      ['- [#4](https://github.com/o/r/issues/4) Issue 4 · `enhancement`', '  - [#5](https://github.com/o/r/issues/5) Issue 5 · todo', '  - [#6](https://github.com/o/r/issues/6) Issue 6 · done'].join(
        '\n',
      ),
    );
    expect(section(markdown, 'To do')).toBeUndefined();
  });

  it('lists a sub-issue at the top of its section when its parent is not shown', () => {
    const markdown = roadmapMarkdown('o/r', [issue(4), issue(5, { labels: ['todo'], parent: 4 })]);
    expect(section(markdown, 'To do')).toBe('- [#5](https://github.com/o/r/issues/5) Issue 5');
  });

  it('shows the newest done issues first and escapes the Markdown of titles', () => {
    const markdown = roadmapMarkdown('o/r', [issue(1, { closed: true, completed: true, title: 'A [link] *star* `code`' }), issue(2, { closed: true, completed: true })]);
    expect(section(markdown, 'Done')).toBe(['- [#2](https://github.com/o/r/issues/2) Issue 2', '- [#1](https://github.com/o/r/issues/1) A \\[link\\] \\*star\\* `code`'].join('\n'));
  });
});
