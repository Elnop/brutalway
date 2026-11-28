---
'@brutalway/oxlint-config-typescript': minor
---

A new export, `@brutalway/oxlint-config-typescript/line-width`, holds `lineWidthConfig`, a config of its own that `typescriptConfig` does not extend, so no project changes until it adds it to `extends`. It fails on any line of more than 100 columns, with no exception, and on a string cut into pieces: a backslash at the end of a line, two literals joined with `+` on one line or over several, and `+` between a string and a value. A text that does not fit is shortened, or moves into a `.json` or `.md` file.
