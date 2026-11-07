# create-brutal

## 0.5.1

### Patch Changes

- c4b03ab: Generated projects leave out the release setup of the templates: `.changeset/`, `CHANGELOG.md`, `.github/workflows/release.yml`, `@changesets/cli` and the `version` field.
- eefe611: The templates are downloaded from `templates/` in the brutalway repository. The template-vite and template-fastify repositories are no longer updated.

## 0.5.0

### Minor Changes

- Generated projects use the `@brutalway/*` packages instead of `@elnop/*`, and their docs point to BRUTAL way.
