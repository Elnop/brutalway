module.exports = {
  extends: '@brutalway/dependency-cruiser-config/library',
  forbidden: [
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment:
        'Production code only imports packages from dependencies or peerDependencies, except @brutalway/lint-utils, which tsdown bundles into dist.',
      from: { path: '^src/', pathNot: '\\.test\\.tsx?$' },
      to: {
        dependencyTypes: ['npm-dev'],
        dependencyTypesNot: ['npm-peer'],
        pathNot: '^node_modules/@brutalway/lint-utils/',
      },
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    parser: 'swc',
    tsPreCompilationDeps: false,
    enhancedResolveOptions: {
      extensions: ['.ts', '.js'],
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default'],
    },
  },
};
