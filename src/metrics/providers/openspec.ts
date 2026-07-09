import type { Metric } from '../types.js';
import { ciMentionsAny } from '../helpers.js';

export const openspecMetrics: Metric[] = [
  {
    id: 'openspec.design-docs-present',
    category: 'architecture',
    description: 'OpenSpec design docs present',
    points: 15,
    provider: 'openspec',
    check: (ctx) => ctx.findFiles(/^openspec\/changes\/[^/]+\/design\.md$/).length > 0,
  },
  {
    id: 'openspec.validate-in-ci',
    category: 'automation-guardrails',
    description: 'OpenSpec validate enforced in CI',
    points: 10,
    provider: 'openspec',
    check: (ctx) => ciMentionsAny(ctx, ['openspec validate']),
  },
  {
    id: 'openspec.change-archive-used',
    category: 'maintainability',
    description: 'OpenSpec change archive used',
    points: 10,
    provider: 'openspec',
    check: (ctx) => ctx.hasPath('openspec/changes/archive'),
  },
];
