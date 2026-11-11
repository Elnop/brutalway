---
'template-react-native': minor
---

First version of template-react-native: the todo list of the other templates on Expo, with Expo Router, for iOS, Android and the web build. The routes sit in `src/app/screens/`, the neo-brutalist tokens are a TypeScript theme in `src/shared/ThemeConfig.ts`, and the todos are kept on the device through zustand and AsyncStorage. `npm run check` runs as on the web templates, without stylelint, and the tests run on Jest with React Native Testing Library.
