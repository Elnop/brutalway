module.exports = {
  extends: require.resolve('./layers.cjs'),
  forbidden: [
    {
      name: 'third-party-not-to-src',
      severity: 'error',
      comment:
        'third-party/ holds code copied from a registry, which knows nothing about the app: it never imports src/. Wrap the primitive in src/ instead.',
      from: { path: '^third-party/' },
      to: { path: '^src/' },
    },
    {
      name: 'third-party-packages-only-from-third-party',
      severity: 'error',
      comment:
        'radix-ui and class-variance-authority sit behind the shadcn primitives: import the primitive from @third-party/shadcn/, or add it with npx shadcn add <name>, so swapping one happens in one place.',
      from: { pathNot: '^third-party/' },
      to: { path: 'node_modules/(radix-ui|@radix-ui/[^/]+|class-variance-authority)/' },
    },
  ],
};
