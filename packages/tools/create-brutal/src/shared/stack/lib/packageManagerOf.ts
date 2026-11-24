import { PNPM } from '#src/shared/stack/configs/PackageManagerConfig.ts';
import type { Answers, PackageManager } from '#src/shared/stack/StackTypes.ts';

export function packageManagerOf(answers: Answers): PackageManager {
  return answers['package-manager'] === PNPM ? PNPM : 'npm';
}
