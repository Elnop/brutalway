import { ruleTester } from '@brutalway/lint-utils/ruleTester';
import { noDarkVariant } from '#src/features/no-dark-variant/noDarkVariant.ts';

ruleTester.run('no-dark-variant', noDarkVariant, {
  valid: [{ filename: 'Card.tsx', code: '<div className="bg-paper hover:bg-yellow data-[theme=dark]:p-2" />' }],
  invalid: [
    {
      filename: 'Card.tsx',
      code: '<div className="bg-paper dark:bg-ink" />',
      errors: [{ message: 'A theme changes the values of the tokens, never a class: remove dark:bg-ink, and give the token its dark value in the stylesheet that declares it.' }],
    },
    { filename: 'Card.tsx', code: '<div className={cn("p-2", "md:dark:hover:text-paper")} />', errors: [{ messageId: 'darkVariant' }] },
  ],
});
