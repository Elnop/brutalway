declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_POSTHOG_KEY?: string;
      EXPO_PUBLIC_POSTHOG_HOST?: string;
    }
  }
}

export type AnalyticsProperties = Record<string, string | number | boolean>;
