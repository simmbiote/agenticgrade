import type { Metric } from '../types.js';
import { hasHeadingMatching } from '../helpers.js';

export const universalMetrics: Metric[] = [
  {
    id: 'universal.agents-md-required-sections',
    category: 'ai-context',
    description: 'AGENTS.md has required sections',
    points: 10,
    provider: 'universal',
    check: (ctx) => {
      const content = ctx.read('AGENTS.md');
      if (!content) return false;
      return (
        hasHeadingMatching(content, ['setup']) &&
        hasHeadingMatching(content, ['convention']) &&
        hasHeadingMatching(content, ['test'])
      );
    },
  },
];
