---
'create-brutal': patch
---

The projects get the new rules of oxlint-config-typescript 0.8.3, oxlint-config-zustand 0.3.1, oxlint-config-react 0.5.3, oxlint-config-react-native 0.3.2 and dependency-cruiser-config 0.12.4. A react-native project has its page frame in `src/features/page-layout/PageLayout.tsx`.

The language switch of a vite project with `--i18n en-fr` is `src/features/language-switch/LanguageSwitchContainer.tsx`, since it reads and changes the language, and `src/app/` imports only orchestrators.
