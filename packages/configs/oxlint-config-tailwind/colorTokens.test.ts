import { fileURLToPath } from 'node:url';
import { ruleTester } from '@brutalway/lint-utils/ruleTester';
import { colorTokens } from './colorTokens.ts';

const STYLESHEET = fileURLToPath(new URL('fixtures/src/app/globals.css', import.meta.url));
const options = [{ stylesheet: STYLESHEET }];

function notToken(text: string, closest: string) {
  return { message: `${text} is not a color token. Use a color declared under @theme in ${STYLESHEET}, closest: ${closest}.` };
}

ruleTester.run('color-tokens', colorTokens, {
  valid: [
    { filename: 'Card.tsx', options, code: '<div className="border-3 border-ink bg-paper text-ink hover:bg-yellow/50 shadow-hard bg-transparent text-current" />' },
    { filename: 'Card.tsx', options, code: '<p className="text-[clamp(1rem,2vw,2rem)] stroke-[2.5] bg-yellow bg-(--color-ink) shadow-[4px_4px_0_var(--color-ink)]" />' },
    { filename: 'Card.tsx', options, code: '<svg fill="currentColor" stroke="none" style={{ color: "var(--color-ink)", width: 3 }} />' },
    { filename: 'Card.tsx', options, code: '<div className={styles.card} title="#fff" />' },
  ],
  invalid: [
    { filename: 'Card.tsx', options, code: '<div className="bg-white" />', errors: [notToken('bg-white', 'bg-paper, bg-yellow, bg-blue')] },
    { filename: 'Card.tsx', options, code: '<div className="p-2 md:hover:text-zinc-900/80" />', errors: [notToken('md:hover:text-zinc-900/80', 'text-ink, text-blue, text-yellow')] },
    {
      filename: 'Card.tsx',
      options,
      code: '<div className={cn("p-2", active && "border-t-yellow-300")} />',
      errors: [notToken('border-t-yellow-300', 'border-t-yellow, border-t-paper, border-t-blue')],
    },
    { filename: 'Card.tsx', options, code: '<div className={`p-2 ${x} bg-[#0f0f0f]`} />', errors: [notToken('bg-[#0f0f0f]', 'bg-ink, bg-blue, bg-yellow')] },
    {
      filename: 'Card.tsx',
      options,
      code: '<div className="shadow-[4px_4px_0_#000] [color:rgb(0_0_255)]" />',
      errors: [{ messageId: 'notToken' }, notToken('[color:rgb(0_0_255)]', 'var(--color-blue), var(--color-ink), var(--color-paper)')],
    },
    { filename: 'Card.tsx', options, code: '<svg fill="#fffdf4" />', errors: [notToken('#fffdf4', 'var(--color-paper), var(--color-yellow), var(--color-blue)')] },
    {
      filename: 'Card.tsx',
      options,
      code: '<p style={{ background: "oklch(0.6 0.2 260)", color: `#222` }} />',
      errors: [{ messageId: 'notToken' }, notToken('#222', 'var(--color-ink), var(--color-blue), var(--color-yellow)')],
    },
    {
      filename: 'Card.tsx',
      options: [{ stylesheet: 'missing.css' }],
      code: '<div className="bg-red-500" />',
      errors: [{ message: 'bg-red-500 is not a color token. Declare the colors as --color-* under @theme in missing.css and use those.' }],
    },
  ],
});
