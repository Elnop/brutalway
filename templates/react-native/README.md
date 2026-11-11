# template-react-native

A React Native + Expo + TypeScript starter where the conventions are checked by tools instead of written down and hoped for. It is meant for codebases where several people or AI agents write code at the same time: when one of them puts a file in the wrong folder, imports across features or leaves a comment, `npm run check` fails and says what to do.

The example app is a todo list that runs on iOS, Android and the web build of Expo. It is there so every rule has real code to check: delete it and keep the structure. The look is neo-brutalist (thick black borders, flat pastel colors, hard shadows), shared by every template of the series and easy to swap: the tokens are in `src/shared/ThemeConfig.ts`.

Part of [brutalway](https://github.com/Elnop/brutalway), which also publishes the `@brutalway/*` packages holding the rules and configs: this repository only holds what is specific to it.

## Getting started

Node 26 is required (`.nvmrc`, and `.npmrc` refuses other versions).

```sh
nvm use
npm install
npm start
```

`npm start` prints a QR code: scan it with Expo Go on a phone, or press `w` to open the app in the browser. No Xcode or Android Studio is needed to run the example.

`npm install` also points git to `.githooks/`, so every commit runs `npm run check` first.

## Documentation

- [Starting your own app](docs/guides/start-your-own-app.md): replace the todo list with your own code
- [Translations](docs/guides/translations.md): how the texts go through i18next, and how to add a language
- [Working with an agent](docs/guides/work-with-an-agent.md): the Claude Code hook that sends the errors back to the agent
- [Commands](docs/reference/commands.md): the npm scripts and what CI runs
- [Layout](docs/reference/layout.md): the layers, the slices and where each file goes
- [Verifications](docs/reference/verifications.md): every rule and the tool that enforces it
- [Architecture](docs/concepts/architecture.md): the patterns this template borrows from, with what it takes and what it leaves out

[AGENTS.md](AGENTS.md) sums up the commands and the conventions for a coding agent, and `CLAUDE.md` imports it for Claude Code.
