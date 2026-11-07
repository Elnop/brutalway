---
'create-brutal': minor
'@brutalway/dependency-cruiser-config': minor
---

New `analytics` option on vite: `none` by default, `module` or `posthog`. Both write `src/shared/analyticsClient.ts`, the only place events leave the app (`analyticsClient.track('todo_added')`, which the example calls when a task is added). With `module` it dispatches an `analytics` event on `window` for any tool to plug in. With `posthog` it sends to PostHog when `VITE_POSTHOG_KEY` is set, and nothing otherwise, with autocapture and remote scripts off and the PostHog hosts allowed in `connect-src`.

`@brutalway/dependency-cruiser-config` adds `analytics-in-client`: `posthog-js`, `@segment/analytics-next`, `mixpanel-browser`, `@amplitude/analytics-browser`, `react-ga4` and `@vercel/analytics` are only imported from an `analyticsClient.ts`.
