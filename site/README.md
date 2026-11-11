# site

The landing page of the project, published on GitHub Pages at [brutalway.elnop.dev](https://brutalway.elnop.dev/) by the Pages workflow at the root of the repository.

It was created with `npm create brutal` from template-vite, without the example, zustand, component tests, e2e, CI or the Claude Code hook. The conventions of the template apply: `npm run check` has to pass before a push, and the Pages workflow runs it again before deploying.

The landing page is one feature, `src/features/landing/`, and each of its sections is a sub-feature in `src/features/landing/features/`. The six axioms are used by two of them, the hero and the axiom grid, so they live in the feature's `src/features/landing/shared/`. The header and the footer are sub-features of `src/features/site/`, whose `SiteFrame` wraps both the landing page and the docs pages.

The docs pages under `#/docs` are not part of the build. When someone opens them, the site lists the `docs/` folder of each repository with the GitHub API, fetches the Markdown from `raw.githubusercontent.com` and renders it. A push to `main` that adds or changes a doc shows up within a few minutes, without a redeploy. The repositories and the files outside `docs/` are listed in `src/features/docs/DocsConfig.ts`, with the npm name of each package, which the end of its page links to next to the GitHub file and a link to open an issue. The roadmap page has no file: it is built from the issues of the repository, read with the GitHub API in the same way.

```sh
nvm use
npm install
npm run dev
```

The Vite `base` is `./`, so the build works under any path, including after the repository is renamed.
