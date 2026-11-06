# @brutalway/agent-hook

A Claude Code `PostToolUse` hook. After each `Edit` or `Write` by the agent:

- an edited `.ts` or `.tsx` file goes through `oxlint --type-aware`, run from the folder of the nearest `oxlint.config.ts` or `.oxlintrc.json`, so a monorepo with a config per workspace works as is
- a created file, or an edited Markdown file, runs `alint check` if the project has an `.alint.yml`
- a created file inside one of the `--tree` folders runs `check-tree` on that folder (default: `src`)

If one of them fails, the hook prints their output and exits with code 2: Claude Code sends it back to the agent, which fixes the problem before going on. The tools are run with `npx --no-install`, so they must be dependencies of the project.

```sh
npm install --save-dev @brutalway/agent-hook
```

`.claude/settings.json`:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx --no-install brutal-agent-hook --tree src", "timeout": 60 }]
      }
    ]
  }
}
```

Pass `--tree` once per source folder (`--tree web/src --tree server/src`). The project root is `$CLAUDE_PROJECT_DIR`, or `--root`.

Without touching `.claude/settings.json`, the `brutal-checks` plugin from this repository runs the same hook in any project that has the package installed. See the [repository README](../../../README.md#claude-code-plugin).
