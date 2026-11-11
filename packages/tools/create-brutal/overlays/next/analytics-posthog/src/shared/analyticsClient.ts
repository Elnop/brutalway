import { posthog } from 'posthog-js';
import type { AnalyticsProperties } from '@/shared/AnalyticsTypes.ts';

const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const enabled = typeof window !== 'undefined' && key !== undefined && key !== '';

if (enabled) {
  posthog.init(key, {
    api_host: host !== undefined && host !== '' ? host : 'https://eu.i.posthog.com',
    autocapture: false,
    disable_external_dependency_loading: true,
  });
}

export const analyticsClient = {
  track(name: string, properties: AnalyticsProperties = {}): void {
    if (enabled) posthog.capture(name, properties);
  },
};
