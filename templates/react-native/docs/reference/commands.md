# Commands

| Command | What it does |
|---|---|
| `npm run android`, `npm run ios` | builds the development build, installs it on an emulator, a simulator or a USB device, and starts Metro |
| `npm start` | Metro alone, for a development build already installed |
| `npm run phone` | the development build on a USB Android phone, through the adb of `ADB` (`scripts/phone.ts`) |
| `npm run start:go` | Metro for Expo Go |
| `npm run web` | the app in the browser |
| `npm run check` | Prettier, both `tsc` projects, Oxlint, dependency-cruiser, check-tree, jscpd, check-doc-length, check-doc-sources, check-doc-links, i18next-cli, alint, knip |
| `npm test` | Jest with the `jest-expo` preset: unit tests and component tests, all in Node |
| `npm run build` | `expo export --platform web`: the web build in `dist/`, which also proves the code bundles |
| `npm run format` | Prettier in write mode |

CI (`.github/workflows/ci.yml`) runs `check`, `test` and `build`. It builds no native app: `npm run android` and `npm run ios` build locally, and `eas.json` holds the profiles of [EAS Build](https://docs.expo.dev/build/introduction/).
