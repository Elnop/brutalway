import { ruleTester } from '@brutalway/lint-utils/ruleTester';
import { noDarkVariant } from './noDarkVariant.ts';

ruleTester.run('no-dark-variant', noDarkVariant, {
  valid: [{ filename: 'Card.tsx', code: '<div className="bg-paper hover:bg-yellow data-[theme=dark]:p-2" />' }],
  invalid: [
    { filename: 'Card.tsx', code: '<div className="bg-paper dark:bg-ink" />', errors: [{ message: 'The project is light only, so dark:bg-ink never applies: remove the dark: class.' }] },
    { filename: 'Card.tsx', code: '<div className={cn("p-2", "md:dark:hover:text-paper")} />', errors: [{ messageId: 'darkVariant' }] },
  ],
});
