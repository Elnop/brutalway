module.exports = {
  extends: require.resolve('./layers.cjs'),
  forbidden: [
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment:
        'Production code only imports packages from dependencies or peerDependencies: devDependencies hold the tooling, which is not installed with the package.',
      from: {
        path: '^src/',
        pathNot: '\\.test\\.tsx?$',
      },
      to: {
        dependencyTypes: ['npm-dev'],
        dependencyTypesNot: ['npm-peer'],
      },
    },
    {
      name: 'entries-not-imported',
      severity: 'error',
      comment:
        'A file at the root of src/ is an entry point of the package (a bin, an export): it composes the features and nothing imports it. Move the code you need into a feature, shared-features/ or shared/.',
      from: { pathNot: '\\.test\\.ts$' },
      to: { path: '^src/[^/]+\\.ts$' },
    },
    {
      name: 'no-app-folder',
      severity: 'error',
      comment:
        'A package has no src/app/: its entry points are files at the root of src/, one per bin or export.',
      from: { path: '^src/app/' },
      to: {},
    },
  ],
};
