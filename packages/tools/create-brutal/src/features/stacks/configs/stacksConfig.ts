import { fastifyStack } from '#src/features/stacks/lib/fastifyStack.ts';
import { nextStack } from '#src/features/stacks/lib/nextStack.ts';
import { packageStack } from '#src/features/stacks/lib/packageStack.ts';
import { reactNativeStack } from '#src/features/stacks/lib/reactNativeStack.ts';
import { viteStack } from '#src/features/stacks/lib/viteStack.ts';

export const stacks = [viteStack, nextStack, reactNativeStack, fastifyStack, packageStack];
