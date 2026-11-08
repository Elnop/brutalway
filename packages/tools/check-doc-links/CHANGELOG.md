# @brutalway/check-doc-links

## 0.2.0

### Minor Changes

- f82caae: New package: `check-doc-links` requests the `http` and `https` links of the Markdown files of the project and fails on a `404`, a `410` or a domain that does not exist. Other errors only warn, a link that answered is cached for 24 hours, and nothing is requested when the machine is offline. npm pages go through the registry, and the project's own packages and the files of its GitHub repository are checked without the network. Settings go under `docLinks` in `package.json`.

### Patch Changes

- 243d9d6: A `skip` list under `docLinks` in `package.json` is added to the default patterns: links to `localhost`, `127.0.0.1` and `example.com`, `.org`, `.net` stay skipped.
