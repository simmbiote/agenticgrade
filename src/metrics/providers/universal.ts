import type { Metric } from '../types.js';
import { hasHeadingMatching } from '../helpers.js';

export const universalMetrics: Metric[] = [
  {
    id: 'universal.agents-md-required-sections',
    category: 'ai-context',
    description: 'AGENTS.md has required sections',
    instruction: 'Add Setup, Conventions, and Testing sections to AGENTS.md',
    remediation:
      'A generic AGENTS.md without required sections leaves agents guessing at conventions. Add Setup, Conventions, and Testing headings to your AGENTS.md.',
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
