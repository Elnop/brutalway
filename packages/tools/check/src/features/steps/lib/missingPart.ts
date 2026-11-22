import type { Manifest, Step } from '#src/features/steps/StepsTypes.ts';

export function missingPart(step: Step, manifest: Manifest): string | undefined {
  if ('script' in step) {
    return manifest.scripts[step.script] === undefined ? `no "${step.script}" script` : undefined;
  }
  return manifest.dependencies.has(step.dependency) ? undefined : `no ${step.dependency}`;
}
