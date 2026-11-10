# Work with Claude Code

[`@brutalway/agent-hook`](../../packages/tools/agent-hook) runs the checks on each file Claude Code edits and sends the errors back to the agent, which fixes them before going on. It runs Oxlint on an edited `.ts` or `.tsx` file, stylelint on an edited `.css` file, alint on a created file and check-tree on a created file under `src/`.

## In a project created from a template

Nothing to do. The `claude-hook` option is on by default: `.claude/settings.json` runs the hook, and `CLAUDE.md` imports `AGENTS.md`, which sums up the commands and the conventions for the agent. Keep `npm run check` as the last step of a task: the hook only sees one file at a time, and dependency-cruiser, knip and the tests run on the whole project.

## In another project

Install the hook and the tools it runs. It calls them with `npx --no-install`, so they have to be dependencies of the project: see [Use the checks in an existing project](existing-project.md).

```sh
npm install --save-dev @brutalway/agent-hook
```

Then either install the plugin of this repository, which runs the hook in every project that has the package, without touching the project's settings:

```
/plugin install brutal-checks --marketplace Elnop/brutalway
```

or declare the hook in `.claude/settings.json`, to share it with everyone who clones the project:

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

Pass `--tree` once per source folder: `--tree web/src --tree server/src`.

## Vendored code

With shadcn/ui, `--vendored third-party` makes the hook refuse an edit under `third-party/` before it happens, and tell the agent to run `npx shadcn add <name> --overwrite` or to restyle through the tokens instead. A project created with `--ui shadcn` already has it. The [agent-hook README](../../packages/tools/agent-hook/README.md#vendored-code) has the settings to add it by hand.
