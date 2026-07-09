import type { Metric } from './types.js';
import { documentationMetrics } from './documentation.js';
import { architectureMetrics } from './architecture.js';
import { testingMetrics } from './testing.js';
import { automationGuardrailsMetrics } from './automation-guardrails.js';
import { aiContextMetrics } from './ai-context.js';
import { maintainabilityMetrics } from './maintainability.js';
import { openspecMetrics } from './providers/openspec.js';
import { claudeMetrics } from './providers/claude.js';
import { universalMetrics } from './providers/universal.js';

export const metricsCatalog: Metric[] = [
  ...documentationMetrics,
  ...architectureMetrics,
  ...testingMetrics,
  ...automationGuardrailsMetrics,
  ...aiContextMetrics,
  ...maintainabilityMetrics,
  ...openspecMetrics,
  ...claudeMetrics,
  ...universalMetrics,
];

export type { Metric, Category, MetricProvider } from './types.js';
export { CATEGORIES } from './types.js';
