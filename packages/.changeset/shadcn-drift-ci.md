---
'create-brutal': minor
---

With shadcn/ui and the GitHub Actions workflow, CI runs `npx shadcn add <name> --overwrite` on each file of `third-party/shadcn/` and fails when the result differs from the commit, so a hand edit of a vendored primitive is caught even when it did not go through the agent hook.
