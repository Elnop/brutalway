# template-react-native

A React Native + Expo + TypeScript starter, for iOS, Android and the web, where the conventions are checked by tools instead of written down and hoped for. It is meant for codebases where several people or AI agents write code at the same time: when one of them puts a file in the wrong folder, imports across features or leaves a comment, `npm run check` fails and says what to do.

The example app is a todo list. It is there so every rule has real code to check: delete it and keep the structure. The look is neo-brutalist (thick black borders, flat pastel colors, hard shadows), shared by every template of the series and easy to swap: the tokens are in `src/shared-features/theme/ThemeConfig.ts`.

Part of [brutalway](https://github.com/Elnop/brutalway), which also publishes the `@brutalway/*` packages holding the rules and configs: this repository only holds what is specific to it.

## Create a project from it

```sh
npm create brutal my-app -- --stack react-native
```

The CLI asks which parts to keep or add. [Options](docs/reference/options.md) lists them, with what each one changes and the flags to answer without questions.

## Getting started

Node 26 is required (`.nvmrc`, and `.npmrc` refuses other versions).

```sh
nvm use
npm install
npm run android
```

`npm run android` builds the development build of the app and opens it on an Android emulator or a phone plugged in over USB. It needs the Android SDK; [Running on a device](docs/guides/run-on-a-device.md) covers iOS, WSL2 and the setup. To try the app without installing anything native, `npm run start:go` opens it in Expo Go and `npm run web` in the browser.

`npm install` also points git to `.githooks/`, so every commit runs `npm run check` first.

## Documentation

- [Starting your own app](docs/guides/start-your-own-app.md): replace the todo list with your own code
- [Running on a device](docs/guides/run-on-a-device.md): the development build on Android and iOS, a USB phone from WSL2, Expo Go
- [Translations](docs/guides/translations.md): how the texts go through i18next, and how to add a language
- [Working with an agent](docs/guides/work-with-an-agent.md): the Claude Code hook that sends the errors back to the agent
- [Commands](docs/reference/commands.md): the npm scripts and what CI runs
- [Layout](docs/reference/layout.md): the layers, the slices and where each file goes
- [Options](docs/reference/options.md): what each option of `npm create brutal` adds or removes
- [Verifications](docs/reference/verifications.md): every rule and the tool that enforces it
- [Architecture](docs/concepts/architecture.md): the patterns this template borrows from, with what it takes and what it leaves out

[AGENTS.md](AGENTS.md) sums up the commands and the conventions for a coding agent, and `CLAUDE.md` imports it for Claude Code.
