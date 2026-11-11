import PostHog from 'posthog-react-native';
import type { AnalyticsProperties } from '@/shared/AnalyticsTypes.ts';

const key = process.env.EXPO_PUBLIC_POSTHOG_KEY ?? '';
const posthog =
  key === ''
    ? undefined
    : new PostHog(key, {
        host: process.env.EXPO_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com',
        captureAppLifecycleEvents: false,
      });

export const analyticsClient = {
  track(name: string, properties: AnalyticsProperties = {}): void {
    posthog?.capture(name, properties);
  },
};
