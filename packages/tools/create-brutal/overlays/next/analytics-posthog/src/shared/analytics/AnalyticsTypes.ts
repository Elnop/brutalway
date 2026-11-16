declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_POSTHOG_KEY?: string;
      readonly NEXT_PUBLIC_POSTHOG_HOST?: string;
    }
  }
}

export type AnalyticsProperties = Record<string, string | number | boolean>;
