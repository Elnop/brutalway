# @brutalway/alint-config

[alint](https://github.com/asamarts/alint) rules for a repository: links in the docs resolve, a few folders hold only one kind of file, and dependency versions are exact.

## Install

```sh
npm install --save-dev @brutalway/alint-config @asamarts/alint
```

alint downloads its binary in a `postinstall` script, which npm 11 runs only once you approve it (`allowScripts` in `package.json`).

`.alint.yml`:

```yaml
version: 1
extends:
  - ./node_modules/@brutalway/alint-config/base.yml
rules:
  - id: doc-paths-resolve
    kind: markdown_paths_resolve
    paths: ['README.md', 'docs/**/*.md']
    prefixes: ['src/', 'docs/']
    level: error
```

### Library

For a published package, extend `library.yml` instead. It runs the same rules as `base.yml`, except that `exact-dependency-versions` only checks `devDependencies`:

```yaml
version: 1
extends:
  - ./node_modules/@brutalway/alint-config/library.yml
```

## Rules

| Rule                        | Checks                                                                                       |
| --------------------------- | -------------------------------------------------------------------------------------------- |
| `doc-links-resolve`         | every file link in `README.md` and `docs/**/*.md` points to a file that exists               |
| `doc-fragments-resolve`     | every anchor in those links matches a heading                                                |
| `styles-only-css`           | a `styles/` folder only holds `.css` files                                                   |
| `types-only-types-files`    | a `types/` folder only holds `XTypes.ts` files                                               |
| `configs-only-config-files` | a `configs/` folder only holds `XConfig.ts` files and their tests                            |
| `exact-dependency-versions` | every `dependencies` and `devDependencies` entry of every `package.json` is an exact version |

## Why

alint only follows a local `extends` that stays inside the linted tree, so the path goes through `node_modules`. `markdown_paths_resolve` stays in your file because its `prefixes` depend on your folders.

A published package states its runtime `dependencies` and `peerDependencies` as ranges, so the projects that install it can share one copy. That is why `library.yml` leaves them out of `exact-dependency-versions`.
