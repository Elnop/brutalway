import { fastifyStack } from '#src/features/stacks/lib/fastifyStack.ts';
import { nextStack } from '#src/features/stacks/lib/nextStack.ts';
import { packageStack } from '#src/features/stacks/lib/packageStack.ts';
import { viteStack } from '#src/features/stacks/lib/viteStack.ts';

export const stacks = [viteStack, nextStack, fastifyStack, packageStack];
