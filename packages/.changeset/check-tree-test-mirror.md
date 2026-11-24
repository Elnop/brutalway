---
'@brutalway/check-tree': minor
---

check-tree adds five rules on the tests, which now live in `test/unit/` at the path of their source instead of next to it. A `.test.ts` or `.test.tsx` under `src/` is reported with the path it moves to (`test-in-source`), and so is a test of `test/unit/` whose source is not at the mirrored path (`orphan-test`, with the `git mv` to run when a single folder holds a source of that name). The other three rules report a folder of `test/unit/` that `src/` does not have (`orphan-test-folder`), a file of `test/unit/` that is not a test (`not-a-test`) and a folder of `test/` other than `unit/`, `e2e/` and `support/` (`not-a-test-folder`). To adopt them, run `npx check-tree src --fix`, which makes the moves, then point the test runner at `test/`. A project that moves later can write the new violations with `--write-known-violations`.

The tests no longer have an exception in the other rules. Under `src/` they count in the kind folders, and the shared-feature rules no longer look for them, since `test/unit/` is outside the checked folder.
