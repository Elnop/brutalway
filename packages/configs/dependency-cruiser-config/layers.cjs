const MAX_FEATURE_DEPTH = 10;
const TEST_CODE = ['\\.test\\.tsx?$', '^(test-utils|e2e)/'];
const SLICE = '(?:features|shared)/[^/]+';

function presenter() {
  return {
    path: '^src/(features|shared)/.+\\.tsx$',
    pathNot: ['(Container|Layout|Page|Content|Config|Provider)\\.tsx$', '\\.test\\.tsx$'],
  };
}

function featureAtDepth(depth) {
  return `src/${SLICE}` + `/${SLICE}`.repeat(depth - 1);
}

function ruleName(base, level) {
  return level === 1 ? base : `${base}-level-${level}`;
}

function atEveryDepth(build) {
  return Array.from({ length: MAX_FEATURE_DEPTH }, (_, index) =>
    build(featureAtDepth(index + 1), index + 1),
  );
}

function belowTheDeepest(build) {
  return atEveryDepth(build).slice(0, -1);
}

function subFeatureRules() {
  return belowTheDeepest((feature, level) => ({
    name: ruleName('no-cross-sub-feature', level),
    severity: 'error',
    comment:
      'A sub-feature (features/<y>/ inside a feature or a slice of shared/, at any depth) imports neither its siblings nor the root of its parent: move what several of them use into a slice of the parent shared/, named after its concept.',
    from: {
      path: `^(${feature})/features/([^/]+)/`,
    },
    to: {
      path: '^$1/',
      pathNot: '^$1/(features/$2|shared)/',
    },
  }));
}

function subSharedRules() {
  return belowTheDeepest((feature, level) => ({
    name: ruleName('no-cross-sub-shared', level),
    severity: 'error',
    comment:
      'A slice of the shared/ of a feature or of a slice (shared/<y>/, at any depth) imports neither another slice, nor a sub-feature, nor the root of its parent: merge the two slices, or copy the code it needs.',
    from: {
      path: `^(${feature})/shared/([^/]+)/`,
    },
    to: {
      path: '^$1/',
      pathNot: '^$1/shared/$2/',
    },
  }));
}

function tooDeepRules() {
  const tooDeep = `^${featureAtDepth(MAX_FEATURE_DEPTH + 1)}/`;
  const comment = `Features and slices of shared/ nest at most ${MAX_FEATURE_DEPTH} levels deep: move the deepest sub-features up into their own feature.`;
  return [
    {
      name: 'feature-nesting-too-deep',
      severity: 'error',
      comment,
      from: { path: tooDeep },
      to: {},
    },
    {
      name: 'feature-nesting-too-deep-imported',
      severity: 'error',
      comment,
      from: {},
      to: { path: tooDeep },
    },
  ];
}

module.exports = {
  forbidden: [
    {
      name: 'no-prod-to-tests',
      severity: 'error',
      comment:
        'Production code never imports a test file, a test utility from test-utils/ or an end-to-end file from e2e/.',
      from: {
        pathNot: TEST_CODE,
      },
      to: {
        path: TEST_CODE,
      },
    },
    {
      name: 'not-to-dev-dep',
      severity: 'error',
      comment:
        'Production code only imports packages from dependencies: devDependencies hold the tooling, which never ships in the bundle.',
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
      comment:
        'An import cycle welds modules together: extract the shared part into its own module.',
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
      comment:
        'src/shared/ sits below the features: a slice of shared/ imports no feature and not app/.',
      from: {
        path: '^src/shared/',
      },
      to: {
        path: '^src/(app|features)/',
      },
    },
    {
      name: 'no-cross-shared',
      severity: 'error',
      comment:
        'A slice of shared/ never imports another slice: merge the two slices, or copy the code it needs.',
      from: {
        path: '^src/shared/([^/]+)/',
      },
      to: {
        path: '^src/shared/',
        pathNot: '^src/shared/$1/',
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
      name: 'app-only-to-features',
      severity: 'error',
      comment:
        'app/ composes the features: it imports no slice of shared/. Wrap what it needs in a feature, like a page shell or the server setup.',
      from: {
        path: '^src/app/',
      },
      to: {
        path: '^src/shared/',
      },
    },
    {
      name: 'no-cross-feature',
      severity: 'error',
      comment:
        'A feature never imports another feature: move what they share down to a slice of src/shared/, named after its concept.',
      from: {
        path: '^src/features/([^/]+)/',
      },
      to: {
        path: '^src/features/',
        pathNot: '^src/features/$1/',
      },
    },
    ...subFeatureRules(),
    ...subSharedRules(),
    ...tooDeepRules(),
    {
      name: 'presenters-are-pure',
      severity: 'error',
      comment:
        'A presenter reads no store and no server data, through no chain of imports: its orchestrator passes everything through props. A hook of local state stays fine. Any component whose name does not end with Container, Layout, Page, Content, Config or Provider is a presenter.',
      from: presenter(),
      to: {
        path: '(Store\\.ts$|Client\\.ts$|node_modules/zustand/|node_modules/@tanstack/react-query/)',
        reachable: true,
      },
    },
    {
      name: 'presenters-render-presenters',
      severity: 'error',
      comment:
        'A presenter renders presenters only: the orchestrator that reads state sits above it, so render the orchestrator from its parent orchestrator, or rename the presenter into an orchestrator.',
      from: presenter(),
      to: { path: '(Container|Layout|Page)\\.tsx$' },
    },
    {
      name: 'stores-hold-no-server-data',
      severity: 'error',
      comment:
        'A store holds UI state only: data from an API goes through a query hook that calls the xClient.ts, never into a store.',
      from: { path: 'Store\\.ts$' },
      to: {
        path: '(Client\\.ts$|Keys\\.ts$|node_modules/@tanstack/react-query/|/use[^/]+\\.tsx?$)',
      },
    },
    {
      name: 'analytics-in-client',
      severity: 'error',
      comment:
        'Events leave the app through analyticsClient.ts only: call analyticsClient.track() instead of the SDK, so swapping the tool happens in one file.',
      from: { pathNot: '(^|/)analyticsClient\\.ts$' },
      to: {
        path: 'node_modules/(posthog-js|posthog-react-native|@segment/analytics-next|mixpanel-browser|@amplitude/analytics-browser|react-ga4|@vercel/analytics)/',
      },
    },
    {
      name: 'stores-in-their-folder',
      severity: 'error',
      comment:
        'A store lives at the root or in the stores/ folder of a feature or a slice of shared/, at any depth.',
      from: {},
      to: {
        path: 'Store\\.ts$',
        pathNot: atEveryDepth((feature) => `^${feature}/(stores/)?[^/]+Store\\.ts$`),
      },
    },
  ],
};
