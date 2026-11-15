---
'template-next': patch
---

The agent hook runs check-tree with `--root-entries`, like `npm run tree`. It used to ask the agent to move `src/instrumentation.ts` and `src/proxy.ts` into `lib/`, where Next.js no longer finds them.
