# E1. Tailwind CSS

Source: bedrock (`styles/globals.css`, `.agents/rules/theme.md`, rules `no-raw-tailwind-colors`, `no-raw-color-literals`, `no-heading-without-display-font`, `no-code-without-mono-font`).

bedrock defines every color, font and radius as a token in one CSS file with Tailwind v4's `@theme`, then forbids any color that is not a token: no `bg-white`, no `text-zinc-500`, no `bg-[#0f0f0f]`, no hex in a `style` prop. This is the part worth taking. The neo-brutalist look of the series becomes a set of tokens (`--color-ink`, `--color-paper`, `--shadow-hard`...), so a project made with Tailwind looks the same as one made with plain CSS.

**E1-S1. Tailwind as a styling value.** As someone creating a project, I want `--styling tailwind`, so that I write styles as classes in the components.
- Tailwind v4 with `@tailwindcss/vite`, no `tailwind.config.js`, tokens in `src/app/globals.css` under `@theme`.
- The example's `.css` files are gone, the todo list renders the same, and the e2e screenshots (if any) match.
- check-tree's rule that puts stylesheets in `styles/` still passes with a single `globals.css`.

**E1-S2. Only tokens.** As someone working on the project, I want a lint error when I write a color that is not a token, so that the palette stays in one file.
- New package `@brutalway/oxlint-config-tailwind`: no built-in palette class, no arbitrary color value, no color literal in `style`, `fill` or `stroke`.
- The message names the token file and the closest tokens.

**E1-S3. Font roles.** As someone working on the project, I want headings and code to use the right font class, so that typography stays consistent without a review.
- `h1` to `h3` need `font-display`, `code` and `pre` need `font-mono`, the body inherits `font-sans`.

**E1-S4. Sorted classes.** As someone reviewing a diff, I want the classes always in the same order, so that a diff only shows real changes.
- `prettier-plugin-tailwindcss` added to `@brutalway/prettier-config` or to a variant of it, `prettier --check` fails on unsorted classes.

**E1-S5. Dark mode, or not.** As someone creating a project, I want to know whether `dark:` is allowed, so that I do not ship half a theme.
- Default: light only, `dark:` reported by the lint (bedrock does the same). A later `--theme dark` option adds the dark tokens and lifts the rule.
