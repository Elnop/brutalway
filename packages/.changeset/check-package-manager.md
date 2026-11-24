---
'@brutalway/check': minor
---

`brutal-check` runs the scripts with the package manager that started it, npm or pnpm: it reads `npm_config_user_agent`, then the `packageManager` field of `package.json`, and falls back on npm. `pnpm run check` no longer calls npm for each step.
