import { ruleTester } from '@brutalway/lint-utils/ruleTester';
import { fontRoles } from './fontRoles.ts';

ruleTester.run('font-roles', fontRoles, {
  valid: [
    { filename: 'Page.tsx', code: '<h1 className="font-display text-5xl">Title</h1>' },
    { filename: 'Page.tsx', code: '<h2 className={cn("sr-only", "md:font-display")}>Title</h2>' },
    { filename: 'Page.tsx', code: '<pre className="font-mono"><code className="font-mono">x</code></pre>' },
    { filename: 'Page.tsx', code: '<h3 className={styles.title}>Title</h3>' },
    { filename: 'Page.tsx', code: '<h3 {...props}>Title</h3>' },
    { filename: 'Page.tsx', code: '<h4>Title</h4>' },
  ],
  invalid: [
    { filename: 'Page.tsx', code: '<h1>Title</h1>', errors: [{ message: '<h1> takes the font-display class: add it to its className.' }] },
    { filename: 'Page.tsx', code: '<h2 className="font-sans">Title</h2>', errors: [{ message: '<h2> takes the font-display class: add it to its className.' }] },
    { filename: 'Page.tsx', code: '<code className={open ? "text-ink" : "text-blue"}>x</code>', errors: [{ message: '<code> takes the font-mono class: add it to its className.' }] },
  ],
});
