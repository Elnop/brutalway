---
'template-react-native': minor
---

First version of template-react-native: the todo list of the other templates on Expo, with Expo Router, for iOS, Android and the web build. It runs in a development build (`npm run android`, `npm run ios`, and `npm run phone` for a USB phone that the adb of the SDK does not see, as on WSL2), with Expo Go kept as an option. The routes sit in `src/app/screens/`, the neo-brutalist tokens are a TypeScript theme in `src/shared/ThemeConfig.ts`, and the todos are kept on the device through zustand and AsyncStorage. `npm run check` runs as on the web templates, without stylelint, and the tests run on Jest with React Native Testing Library.
