import type { Dimensions } from '@/shared/PlanTypes.ts';

export function computeArea({ width, length }: Dimensions): number {
  return width * length;
}
