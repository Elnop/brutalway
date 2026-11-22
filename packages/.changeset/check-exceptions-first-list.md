---
'@brutalway/check-exceptions': patch
---

A rule at 0 at the fork point counts as new, so `newRules` lets a first `.gitleaksignore`, a first `ignore` of `.jscpd.json` or a first ignore list of `knip.json` land. These keys always exist with 0 when the file is absent, and `newRules` was never read for them.
