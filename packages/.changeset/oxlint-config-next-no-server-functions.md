---
'@brutalway/oxlint-config-next': minor
---

`@brutalway/oxlint-config-next/no-server-functions` exports `noServerFunctionsConfig`, for an app that reads and writes its data through an API with TanStack Query. Extended after `nextConfig`, it reports every `'use server'` and every `'use cache'`, at the top of a file or in a function, in place of the rules on where a server action goes.
