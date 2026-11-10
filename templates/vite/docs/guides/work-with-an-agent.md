# Working with an agent

`.claude/settings.json` runs `@brutalway/agent-hook` after each edit made by Claude Code: Oxlint on the edited file, plus alint and check-tree when a file is created. Errors go back to the agent, which fixes them before moving on. Every message says what to change, so the agent does not need to know the convention beforehand.
