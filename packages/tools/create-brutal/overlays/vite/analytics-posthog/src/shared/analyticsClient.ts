import { posthog } from 'posthog-js';

const key: unknown = import.meta.env['VITE_POSTHOG_KEY'];
const host: unknown = import.meta.env['VITE_POSTHOG_HOST'];
const enabled = typeof key === 'string' && key !== '';

if (enabled) {
  posthog.init(key, { api_host: typeof host === 'string' && host !== '' ? host : 'https://eu.i.posthog.com', autocapture: false, disable_external_dependency_loading: true });
}

export const analyticsClient = {
  track(name: string, properties: Record<string, string | number | boolean> = {}): void {
    if (enabled) posthog.capture(name, properties);
  },
};
