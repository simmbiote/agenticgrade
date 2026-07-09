import type { Metric } from '../types.js';
import { claudeHooksConfigured } from '../helpers.js';

export const claudeMetrics: Metric[] = [
  {
    id: 'claude.hooks-configured',
    category: 'automation-guardrails',
    description: 'Claude hooks configured',
    instruction: 'Configure Claude Code hooks',
    remediation:
      'Hooks let Claude Code enforce guardrails automatically (e.g. running lint after edits). Configure hooks in .claude/settings.json.',
    points: 10,
    provider: 'claude',
    check: (ctx) => claudeHooksConfigured(ctx),
  },
  {
    id: 'claude.subagents-skills-documented',
    category: 'maintainability',
    description: 'Claude subagents/skills documented',
    instruction: 'Add documented Claude subagents or skills',
    remediation:
      'Subagents and skills let Claude Code specialize behavior for recurring tasks. Add definitions under .claude/agents or .claude/skills.',
    points: 10,
    provider: 'claude',
    check: (ctx) => ctx.hasPath('.claude/agents') || ctx.hasPath('.claude/skills'),
  },
  {
    id: 'claude.custom-commands-documented',
    category: 'documentation',
    description: 'Claude custom commands documented',
    instruction: 'Add documented Claude custom commands',
    remediation:
      'Custom slash commands give Claude Code reusable, repo-specific workflows. Add command definitions under .claude/commands.',
    points: 10,
    provider: 'claude',
    check: (ctx) => ctx.hasPath('.claude/commands'),
  },
];
