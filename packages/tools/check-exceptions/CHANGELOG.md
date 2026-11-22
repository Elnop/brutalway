# @brutalway/check-exceptions

## 0.2.1

### Patch Changes

- 754da96: A rule at 0 at the fork point counts as new, so `newRules` lets a first `.gitleaksignore`, a first `ignore` of `.jscpd.json` or a first ignore list of `knip.json` land. These keys always exist with 0 when the file is absent, and `newRules` was never read for them.

## 0.2.0

### Minor Changes

- db3ea44: check-exceptions counts `.alint-baseline.json`, which `alint baseline` writes: per rule, the sum of the counts of its entries, under the key `alint <rule>`.
- c1caf4d: check-exceptions counts `oxlint-suppressions.json`, which `oxlint --suppress-all` writes: per rule, the sum of the counts of each file, under the key `oxlint-suppressions <rule>`.

## 0.1.0

### Minor Changes

- c23bc1b: New package: `check-exceptions` fails when a list of exceptions grew since the commit the branch started from. It counts per rule the known violations of check-tree, the dependency-cruiser baseline, the ignore lists of knip and jscpd, the fingerprints of `.gitleaksignore` and the disable directives in the code, `gitleaks:allow` included, and `newRules` in `package.json` lets a new rule land with the violations it found.
