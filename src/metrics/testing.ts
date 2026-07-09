import type { Metric } from './types.js';
import {
  ciMentionsAny,
  detectTestCommand,
  hasCiWorkflow,
  hasCoverageConfig,
  hasTestFiles,
  hasUnitIntegrationStructure,
  testCommandDocumented,
  testsAreRequiredCheck,
} from './helpers.js';

export const testingMetrics: Metric[] = [
  {
    id: 'testing.test-command-detected',
    category: 'testing',
    description: 'test command detected',
    instruction: 'Add a test command (e.g. npm test)',
    remediation:
      'Without a discoverable test command, agents can\'t verify their own changes. Add a test script (e.g. "test": "vitest run") to package.json.',
    points: 20,
    check: (ctx) => detectTestCommand(ctx) !== null,
  },
  {
    id: 'testing.test-command-documented',
    category: 'testing',
    description: 'test command documented',
    instruction: 'Document the test command in the README',
    remediation:
      "Even a working test command is easy to miss if it isn't written down. Document how to run tests in your README's Testing section.",
    points: 15,
    check: (ctx) => testCommandDocumented(ctx, detectTestCommand(ctx)?.command),
  },
  {
    id: 'testing.ci-runs-tests',
    category: 'testing',
    description: 'CI runs tests',
    instruction: 'Configure CI to run your test command',
    remediation:
      "Tests that don't run in CI don't protect against regressions. Configure your CI workflow to invoke your test command on every push and PR.",
    points: 20,
    check: (ctx) => {
      const detected = detectTestCommand(ctx);
      if (!hasCiWorkflow(ctx)) return false;
      if (!detected) return ciMentionsAny(ctx, ['test']);
      return ciMentionsAny(ctx, [detected.command]);
    },
  },
  {
    id: 'testing.test-files-exist',
    category: 'testing',
    description: 'test files exist',
    instruction: 'Add test files',
    remediation:
      "A test command with nothing to run doesn't verify anything. Add test files exercising your code's behavior.",
    points: 15,
    check: (ctx) => hasTestFiles(ctx),
  },
  {
    id: 'testing.coverage-exists',
    category: 'testing',
    description: 'coverage config/report exists',
    instruction: 'Add test coverage configuration or reporting',
    remediation:
      'Without coverage reporting, gaps in test coverage go unnoticed. Add coverage configuration (e.g. vitest --coverage) or a coverage report step.',
    points: 10,
    check: (ctx) => hasCoverageConfig(ctx),
  },
  {
    id: 'testing.unit-integration-structure',
    category: 'testing',
    description: 'unit/integration structure detectable',
    instruction: 'Organize tests into unit/integration directories',
    remediation:
      "Separating unit and integration tests clarifies what's being verified and at what level. Organize tests into unit/ and integration/ (or equivalent) directories.",
    points: 10,
    check: (ctx) => hasUnitIntegrationStructure(ctx),
  },
  {
    id: 'testing.tests-required-check',
    category: 'testing',
    description: 'tests are required checks',
    instruction: 'Make tests a required check before merging',
    remediation:
      "Tests that aren't required checks can be bypassed, defeating their purpose. Configure branch protection to require tests to pass before merging.",
    points: 10,
    check: (ctx) => testsAreRequiredCheck(ctx),
  },
];
