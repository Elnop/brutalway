# Commands

| Command | What it does |
|---|---|
| `npm start` | Expo dev server: a QR code for Expo Go, `i` for the iOS simulator, `a` for Android, `w` for the browser |
| `npm run ios`, `npm run android`, `npm run web` | the dev server, opened on one platform |
| `npm run check` | Prettier, both `tsc` projects, Oxlint, dependency-cruiser, check-tree, jscpd, check-doc-length, check-doc-sources, check-doc-links, i18next-cli, alint, knip |
| `npm test` | Jest with the `jest-expo` preset: unit tests and component tests, all in Node |
| `npm run build` | `expo export --platform web`: the web build in `dist/`, which also proves the code bundles |
| `npm run format` | Prettier in write mode |

CI (`.github/workflows/ci.yml`) runs `check`, `test` and `build`. It builds no native app: an iOS or Android build goes through [EAS Build](https://docs.expo.dev/build/introduction/).
