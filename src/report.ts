import type { ScoringResult } from './scoring.js';
import type { Category } from './metrics/types.js';

const CATEGORY_LABELS: Record<Category, string> = {
  documentation: 'Documentation',
  architecture: 'Architecture',
  testing: 'Testing',
  'automation-guardrails': 'Automation Guard Rails',
  'ai-context': 'AI Context',
  maintainability: 'Maintainability',
};

export function renderReport(result: ScoringResult): string {
  const lines: string[] = [];

  if (result.providers.length === 1 && result.providers[0] === 'none') {
    lines.push('Detected providers: none');
    lines.push(
      'No agentic provider detected (no openspec/, CLAUDE.md/.claude/, or AGENTS.md found) — AI Context scoring reflects base metrics only.',
    );
  } else {
    lines.push(`Detected providers: ${result.providers.join(', ')}`);
  }
  lines.push('');

  for (const category of result.categories) {
    lines.push(`${CATEGORY_LABELS[category.category]}: ${category.earned}/${category.max}`);
    for (const metric of category.metrics) {
      const mark = metric.passed ? 'x' : ' ';
      const providerTag = metric.provider ? ` [${metric.provider}]` : '';
      lines.push(
        `  [${mark}] ${metric.description} (${metric.earned}/${metric.points})${providerTag}`,
      );
    }
    lines.push('');
  }

  const { earned, max, percentage, grade } = result.overall;
  lines.push(`Overall: ${earned}/${max} (${percentage.toFixed(1)}%) — Grade: ${grade}`);

  return lines.join('\n');
}
