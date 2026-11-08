import { fastifyStack } from '#src/features/stacks/lib/fastifyStack.ts';
import { viteStack } from '#src/features/stacks/lib/viteStack.ts';

export const stacks = [viteStack, fastifyStack];
