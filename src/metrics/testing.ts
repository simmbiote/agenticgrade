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
    points: 20,
    check: (ctx) => detectTestCommand(ctx) !== null,
  },
  {
    id: 'testing.test-command-documented',
    category: 'testing',
    description: 'test command documented',
    points: 15,
    check: (ctx) => testCommandDocumented(ctx, detectTestCommand(ctx)?.command),
  },
  {
    id: 'testing.ci-runs-tests',
    category: 'testing',
    description: 'CI runs tests',
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
    points: 15,
    check: (ctx) => hasTestFiles(ctx),
  },
  {
    id: 'testing.coverage-exists',
    category: 'testing',
    description: 'coverage config/report exists',
    points: 10,
    check: (ctx) => hasCoverageConfig(ctx),
  },
  {
    id: 'testing.unit-integration-structure',
    category: 'testing',
    description: 'unit/integration structure detectable',
    points: 10,
    check: (ctx) => hasUnitIntegrationStructure(ctx),
  },
  {
    id: 'testing.tests-required-check',
    category: 'testing',
    description: 'tests are required checks',
    points: 10,
    check: (ctx) => testsAreRequiredCheck(ctx),
  },
];
