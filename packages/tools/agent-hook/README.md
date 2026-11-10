# @brutalway/agent-hook

A Claude Code `PostToolUse` hook that runs the project's linters and checks on each file the agent edits or creates, and sends their output back to the agent. It can also run as a `PreToolUse` hook that refuses edits to vendored code.

## Install

```sh
npm install --save-dev @brutalway/agent-hook
```

In `.claude/settings.json`:

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

The tools are run with `npx --no-install`, so they must be dependencies of the project.

Without touching `.claude/settings.json`, the `brutal-checks` plugin from this repository runs the same hook in any project that has the package installed. See the [repository README](../../../README.md#claude-code-plugin).

## Usage

### Check several source folders

Pass `--tree` once per source folder:

```sh
npx --no-install brutal-agent-hook --tree web/src --tree server/src
```

### Keep the entry points of a published package

A published package keeps one entry point per bin or export at the root of `src/`. Add `--root-entries`: the hook passes the same flag to `check-tree`, which then leaves those files where they are.

### Vendored code

`--vendored <folder>` names a folder of code copied from a registry, like the shadcn/ui primitives in `third-party/`. The `PostToolUse` hook runs no check on a file there. As a `PreToolUse` hook, it refuses the edit before it happens and tells the agent what to do instead: run `npx shadcn add <name> --overwrite`, restyle through the tokens or a `data-slot` rule in `src/app/globals.css`, or wrap the primitive in `src/`.

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx --no-install brutal-agent-hook --vendored third-party", "timeout": 10 }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "npx --no-install brutal-agent-hook --tree src --vendored third-party", "timeout": 60 }]
      }
    ]
  }
}
```

## Reference

### What runs after each edit

After each `Edit` or `Write` by the agent:

- an edited `.ts` or `.tsx` file goes through `oxlint --type-aware`, run from the folder of the nearest `oxlint.config.ts` or `.oxlintrc.json`, so a monorepo with a config per workspace works as is
- an edited `.css` file goes through `stylelint` if the project has a stylelint config (a `stylelint` key in `package.json`, a `.stylelintrc*` or a `stylelint.config.*`)
- a created file, or an edited Markdown file, runs `alint check` if the project has an `.alint.yml`
- a created file inside one of the `--tree` folders runs `check-tree` on that folder

### Exit code

If one of them fails, the hook prints their output and exits with code 2: Claude Code sends it back to the agent, which fixes the problem before going on. When a tool cannot start, for example because the project root does not exist, the hook says which command failed, in which folder, and the error from Node, and also exits with code 2.

### Flags

| Flag                  | Default               | Effect                                                         |
| --------------------- | --------------------- | -------------------------------------------------------------- |
| `--tree <folder>`     | `src`                 | folder checked by `check-tree`, once per folder                |
| `--root <folder>`     | `$CLAUDE_PROJECT_DIR` | root of the project                                            |
| `--root-entries`      | off                   | passed to `check-tree`, which leaves the files at the root     |
| `--vendored <folder>` | none                  | folder of vendored code: no check after an edit, refused before |
