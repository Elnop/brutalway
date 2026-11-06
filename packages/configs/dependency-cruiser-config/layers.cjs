const MAX_FEATURE_DEPTH = 10;

function featureAtDepth(depth) {
  return 'src/features/[^/]+' + '/features/[^/]+'.repeat(depth - 1);
}

function ruleName(base, level) {
  return level === 1 ? base : `${base}-level-${level}`;
}

function subFeatureRules() {
  return Array.from({ length: MAX_FEATURE_DEPTH - 1 }, (_, index) => ({
    name: ruleName('no-cross-sub-feature', index + 1),
    severity: 'error',
    comment: 'A sub-feature (features/<x>/features/<y>/, at any depth) imports neither its siblings nor its parent feature root: move what several of them use into the parent shared/.',
    from: {
      path: `^(${featureAtDepth(index + 1)})/features/([^/]+)/`,
    },
    to: {
      path: '^$1/',
      pathNot: '^$1/(features/$2|shared)/',
    },
  }));
}

function atEveryDepth(build) {
  return Array.from({ length: MAX_FEATURE_DEPTH }, (_, index) => build(featureAtDepth(index + 1), index + 1));
}

function featureSharedRules() {
  return atEveryDepth((feature, level) => ({
    name: ruleName('feature-shared-not-to-sub-features', level),
    severity: 'error',
    comment: 'A feature shared/ serves its sub-features: it imports none of them.',
    from: {
      path: `^(${feature})/shared/`,
    },
    to: {
      path: '^$1/',
      pathNot: '^$1/shared/',
    },
  }));
}

function tooDeepRules() {
  const tooDeep = `^${featureAtDepth(MAX_FEATURE_DEPTH + 1)}/`;
  const comment = `Features nest at most ${MAX_FEATURE_DEPTH} levels deep: move the deepest sub-features up into their own feature.`;
  return [
    { name: 'feature-nesting-too-deep', severity: 'error', comment, from: { path: tooDeep }, to: {} },
    { name: 'feature-nesting-too-deep-imported', severity: 'error', comment, from: {}, to: { path: tooDeep } },
  ];
}

module.exports = {
  forbidden: [
    {
      name: 'no-prod-to-tests',
      severity: 'error',
      comment: 'Production code never imports a test file.',
      from: {
        pathNot: '\\.test\\.tsx?$',
      },
      to: {
        path: '\\.test\\.tsx?$',
      },
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment: 'Production code only imports packages from dependencies: devDependencies hold the tooling, which never ships in the bundle.',
      from: {
        path: '^src/',
        pathNot: '\\.test\\.tsx?$',
      },
      to: {
        dependencyTypes: ['npm-dev'],
      },
    },
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'An import cycle welds modules together: extract the shared part into its own module.',
      from: {},
      to: {
        circular: true,
      },
    },
    {
      name: 'no-unresolvable',
      severity: 'error',
      comment: 'This import resolves to no file: fix the path or the alias.',
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
    {
      name: 'shared-not-to-features',
      severity: 'error',
      comment: 'src/shared/ serves the whole app: it imports neither shared-features/ nor features/.',
      from: {
        path: '^src/shared/',
      },
      to: {
        path: '^src/(app|features|shared-features)/',
      },
    },
    {
      name: 'shared-features-not-to-features',
      severity: 'error',
      comment: 'shared-features/ sits below the features: a shared feature imports no feature and not app/.',
      from: {
        path: '^src/shared-features/',
      },
      to: {
        path: '^src/(app|features)/',
      },
    },
    {
      name: 'no-cross-shared-feature',
      severity: 'error',
      comment: 'A shared feature never imports another shared feature: the feature that uses both links them.',
      from: {
        path: '^src/shared-features/([^/]+)/',
      },
      to: {
        path: '^src/shared-features/',
        pathNot: '^src/shared-features/$1/',
      },
    },
    {
      name: 'features-not-to-app',
      severity: 'error',
      comment: 'A feature never imports app/: app/ composes the features.',
      from: {
        path: '^src/features/',
      },
      to: {
        path: '^src/app/',
      },
    },
    {
      name: 'no-cross-feature',
      severity: 'error',
      comment: 'A feature never imports another feature: move what they share down to shared-features/ (business code) or src/shared/ (no domain).',
      from: {
        path: '^src/features/([^/]+)/',
      },
      to: {
        path: '^src/features/',
        pathNot: '^src/features/$1/',
      },
    },
    ...subFeatureRules(),
    ...featureSharedRules(),
    ...tooDeepRules(),
    {
      name: 'presenters-are-pure',
      severity: 'error',
      comment: 'A presenter reads no store: its orchestrator passes everything through props. Any component whose name does not end with Container, Layout or Page is a presenter.',
      from: {
        path: '^src/(features|shared)/.+\\.tsx$',
        pathNot: ['(Container|Layout|Page|Content|Config)\\.tsx$', '\\.test\\.tsx$'],
      },
      to: {
        path: '(Store\\.ts$|node_modules/zustand/|^src/shared-features/[^/]+/(hooks/)?use[^/]+\\.ts$)',
      },
    },
    {
      name: 'stores-in-their-folder',
      severity: 'error',
      comment: 'A store lives at the root or in the stores/ folder of a shared feature, a feature, a sub-feature or a shared/.',
      from: {},
      to: {
        path: 'Store\\.ts$',
        pathNot: [...atEveryDepth((feature) => `^${feature}/(shared/)?(stores/)?[^/]+Store\\.ts$`), '^src/shared/(stores/)?[^/]+Store\\.ts$', '^src/shared-features/[^/]+/(stores/)?[^/]+Store\\.ts$'],
      },
    },
  ],
};
