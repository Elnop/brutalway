---
'@brutalway/check-tree': minor
---

A `locales/` folder is accepted in a feature or a shared feature, and checked: it holds one folder per language, named like `en` or `fr-CA`, and nothing else, and a language folder holds `.json` files only. It is the one folder that may hold a single child, since a project can have a single language. A project with no `locales/` folder has nothing to do. Three rules join the ones a known-violations file can list: `locales-file`, `not-a-language-folder` and `not-a-locale-file`.
