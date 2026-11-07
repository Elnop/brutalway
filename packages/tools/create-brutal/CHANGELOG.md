# create-brutal

## 0.6.0

### Minor Changes

- 6b54a39: Options can have several values (`--styling tailwind`, `"styling": "tailwind"` in a preset), default to off and add files, dependencies and doc lines, and declare `conflicts` next to `requires`. A combination that cannot work stops the CLI before anything is written. `--help` lists the values and the default of each option.
- e455859: New `styling` option on vite: `--styling tailwind` writes the example with Tailwind CSS v4 classes and keeps the colors, fonts and shadows as tokens under `@theme` in `src/app/globals.css`. `@brutalway/oxlint-config-tailwind` reports any color that is not a token and names the closest ones, a heading without `font-display`, code without `font-mono` and any `dark:` class. `@brutalway/prettier-config/tailwind` sorts the classes.

## 0.5.1

### Patch Changes

- c4b03ab: Generated projects leave out the release setup of the templates: `.changeset/`, `CHANGELOG.md`, `.github/workflows/release.yml`, `@changesets/cli` and the `version` field.
- eefe611: The templates are downloaded from `templates/` in the brutalway repository. The template-vite and template-fastify repositories are no longer updated.

## 0.5.0

### Minor Changes

- Generated projects use the `@brutalway/*` packages instead of `@elnop/*`, and their docs point to BRUTAL way.
