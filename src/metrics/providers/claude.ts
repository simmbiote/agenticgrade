import type { Metric } from '../types.js';
import { claudeHooksConfigured } from '../helpers.js';

export const claudeMetrics: Metric[] = [
  {
    id: 'claude.hooks-configured',
    category: 'automation-guardrails',
    description: 'Claude hooks configured',
    points: 10,
    provider: 'claude',
    check: (ctx) => claudeHooksConfigured(ctx),
  },
  {
    id: 'claude.subagents-skills-documented',
    category: 'maintainability',
    description: 'Claude subagents/skills documented',
    points: 10,
    provider: 'claude',
    check: (ctx) => ctx.hasPath('.claude/agents') || ctx.hasPath('.claude/skills'),
  },
  {
    id: 'claude.custom-commands-documented',
    category: 'documentation',
    description: 'Claude custom commands documented',
    points: 10,
    provider: 'claude',
    check: (ctx) => ctx.hasPath('.claude/commands'),
  },
];
