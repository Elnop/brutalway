---
'@brutalway/dependency-cruiser-config': minor
---

`xClient.ts` means a client of an external API, with no exception. The analytics rule becomes `analytics-in-tracker`: the SDK is only imported from `analyticsTracker.ts`, so rename `analyticsClient.ts` to `analyticsTracker.ts`. `orchestrators-use-hooks` no longer lets an orchestrator import `analyticsClient.ts`.
