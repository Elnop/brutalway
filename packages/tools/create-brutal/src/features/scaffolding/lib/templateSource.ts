import { readStackRefs } from '#src/features/scaffolding/lib/readStackRefs.ts';
import { LOCAL_ROOT } from '#src/features/scaffolding/ScaffoldConfig.ts';
import type { TemplateSource } from '#src/features/scaffolding/ScaffoldTypes.ts';
import type { Stack } from '#src/shared-features/stack/StackTypes.ts';

export function templateSource(stack: Stack, local: boolean): TemplateSource {
  if (local) return { kind: 'local', root: LOCAL_ROOT };
  const ref = readStackRefs().get(stack.id);
  if (ref === undefined) {
    throw new Error(
      `No template commit recorded for ${stack.id}: run from a published build or pass --local`,
    );
  }
  return { kind: 'github', ref };
}
