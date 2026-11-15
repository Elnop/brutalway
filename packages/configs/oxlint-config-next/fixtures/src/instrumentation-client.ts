import { analyticsClient } from '@/shared/analyticsClient.ts';

analyticsClient.track('app_opened');

export function onRouterTransitionStart(url: string): void {
  analyticsClient.track(url);
}
