---
'@brutalway/check-tree': minor
'@brutalway/dependency-cruiser-config': patch
'@brutalway/oxlint-config-react': patch
'@brutalway/alint-config': patch
---

The messages say "shared feature" for a folder of a `shared/`, where they said "slice", "kind folder" where the docs also said "category folder", and "entry points" for the files at the root of `src/`. `split it into one slice per group` becomes `split it into one shared feature per group`, and `shared/ holds one folder per slice` becomes `shared/ holds one folder per shared feature`. The terms are defined in the new glossary of the docs, `docs/reference/glossary.md` in the brutalway repository.

A `.check-tree-known-violations.json` file holds the printed messages, so its entries no longer match: run `npx check-tree src --write-known-violations` once after the upgrade, and check that the diff only changes words.
