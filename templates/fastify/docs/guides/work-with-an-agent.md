# Working with an agent

`.claude/settings.json` runs `@brutalway/agent-hook` after each edit made by Claude Code: Oxlint on the edited file, plus alint and check-tree when a file is created. Errors go back to the agent, which fixes them before moving on.

When a check looks wrong to the agent, `AGENTS.md` and the hook messages tell it to stop and offer you an issue or a pull request on [brutalway](https://github.com/Elnop/brutalway), with a draft, instead of turning the rule off. Nothing is sent before you agree.
