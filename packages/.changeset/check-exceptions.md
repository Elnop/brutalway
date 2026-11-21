---
'@brutalway/check-exceptions': minor
---

New package: `check-exceptions` fails when a list of exceptions grew since the commit the branch started from. It counts per rule the known violations of check-tree, the dependency-cruiser baseline, the ignore lists of knip and jscpd, the fingerprints of `.gitleaksignore` and the disable directives in the code, `gitleaks:allow` included, and `newRules` in `package.json` lets a new rule land with the violations it found.
