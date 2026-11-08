# @brutalway/check-doc-links

A link in a doc can die without any commit: a package gets renamed on npm, a repository moves, an article goes offline. `check-doc-links` requests every `http` and `https` link of the Markdown files of the project and fails when one of them is gone. It is fast enough for a pre-commit hook, and does nothing when the machine is offline.

```sh
npm install --save-dev @brutalway/check-doc-links
```

## What fails and what does not

```sh
check-doc-links
```

Each link is requested with `HEAD`, then with `GET` when the server refuses `HEAD`, redirects followed, 10 seconds at most, 8 at a time.

- A `404`, a `410` or a domain that does not exist fails the check, with the doc, the line and the link.
- A `401`, `403`, `429`, a `5xx`, a timeout or a lost connection prints a warning and does not fail: many sites answer robots that way (Medium sends `403`), and a site that is down for an hour is not a broken link.
- A link that answered is not requested again for 24 hours. The cache is `node_modules/.cache/check-doc-links.json`.
- Before requesting anything, it tries `https://registry.npmjs.org/`. Without an answer within 3 seconds, it prints how many links it did not check and exits with 0.

Relative links are left to the tools that check paths in the repository, such as alint's `markdown_links_resolve`.

## Links checked without the network

- `https://www.npmjs.com/package/<name>` is requested from `registry.npmjs.org`, since npmjs.com answers `403` to robots. A package of the project itself, the root `package.json` or one of its workspaces, is not requested at all: its page does not exist until it is published.
- A link to a file of this repository on GitHub (`https://github.com/<owner>/<repo>/blob/main/<path>`, or `tree`, on `main`, `master` or `HEAD`) is checked on disk, the repository being the `origin` remote. A file added in the same commit passes, and one that was moved fails before the push.

## Settings

Under `docLinks` in `package.json`:

| Setting   | Default                                                                                     |
| --------- | ------------------------------------------------------------------------------------------- |
| `include` | `["**/*.md"]`                                                                               |
| `ignore`  | `["**/node_modules/**", "**/dist/**", "**/CHANGELOG.md"]`                                   |
| `skip`    | links to `localhost`, `127.0.0.1` and `example.com`, `.org`, `.net`, as regular expressions |

```json
"docLinks": { "skip": ["^https://internal\\.company\\.dev/"] }
```

The `skip` patterns of `package.json` are added to the default ones, so `localhost` and `example.com` stay skipped. A list given for `include` or `ignore` replaces its default.
