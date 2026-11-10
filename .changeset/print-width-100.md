---
'@brutalway/prettier-config': minor
'create-brutal': minor
---

Prettier wraps lines at 100 columns instead of 200, the closest to the 80 of the Norminette that the templates fit today. A project that extends the config gets reformatted on its next `prettier --write`, and some `if` bodies need braces once they move to their own line. The vite, fastify and package templates are formatted at 100 and pin `@brutalway/prettier-config` 0.3.0.
