# site

The landing page of the project, published on GitHub Pages by the Pages workflow at the root of the repository.

It was created with `npm create elnop-stack` from template-vite, without the example, zustand, component tests, e2e, CI or the Claude Code hook. The conventions of the template apply: `npm run check` has to pass before a push, and the Pages workflow runs it again before deploying.

Each section of the page is a feature in `src/features/`. The six axioms are shared by the hero and the axiom grid, so they live in `src/shared-features/axioms/`.

```sh
nvm use
npm install
npm run dev
```

The Vite `base` is `./`, so the build works under any path, including after the repository is renamed.
