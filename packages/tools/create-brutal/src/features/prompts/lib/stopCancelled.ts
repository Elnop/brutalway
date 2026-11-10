import { cancel } from '@clack/prompts';

export function stopCancelled(): never {
  cancel('Cancelled.');
  process.exit(1);
}
