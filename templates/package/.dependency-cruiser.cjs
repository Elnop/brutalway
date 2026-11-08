module.exports = {
  extends: '@brutalway/dependency-cruiser-config/library',
  options: {
    doNotFollow: { path: 'node_modules' },
    tsConfig: { fileName: 'tsconfig.json' },
    parser: 'swc',
    tsPreCompilationDeps: false,
    enhancedResolveOptions: { extensions: ['.ts', '.js'], exportsFields: ['exports'], conditionNames: ['import', 'require', 'node', 'default'] },
  },
};
