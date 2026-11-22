# @brutalway/check-secrets

## 0.1.1

### Patch Changes

- 754da96: The README says that the change adding the first fingerprints to `.gitleaksignore` writes their number under `newRules` for check-exceptions.

## 0.1.0

### Minor Changes

- 0509717: New package: `check-secrets` fails when a file git would commit holds a secret. It runs gitleaks 8.30.1, downloaded from its GitHub release on the first run and checked against a pinned checksum, or the binary `GITLEAKS_BIN` points to.
