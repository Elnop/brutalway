---
'template-fastify': patch
'template-next': patch
'template-package': patch
'template-react-native': patch
'template-vite': patch
---

The templates use @brutalway/check 0.3.0, which runs the checks at the same time, @brutalway/check-exceptions 0.2.1, where `newRules` lets a first `.gitleaksignore` land, and @brutalway/check-secrets 0.1.1.
