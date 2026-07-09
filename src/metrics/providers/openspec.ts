import type { Metric } from '../types.js';
import { ciMentionsAny } from '../helpers.js';

export const openspecMetrics: Metric[] = [
  {
    id: 'openspec.design-docs-present',
    category: 'architecture',
    description: 'OpenSpec design docs present',
    instruction: 'Add design.md to your OpenSpec changes',
    remediation:
      'Design docs capture the technical decisions behind a change, not just what it does. Add a design.md to at least one openspec/changes/ entry.',
    points: 15,
    provider: 'openspec',
    check: (ctx) => ctx.findFiles(/^openspec\/changes\/[^/]+\/design\.md$/).length > 0,
  },
  {
    id: 'openspec.validate-in-ci',
    category: 'automation-guardrails',
    description: 'OpenSpec validate enforced in CI',
    instruction: 'Run openspec validate in CI',
    remediation:
      'Without CI enforcement, invalid specs can merge unnoticed. Add an "openspec validate" step to your CI workflow.',
    points: 10,
    provider: 'openspec',
    check: (ctx) => ciMentionsAny(ctx, ['openspec validate']),
  },
  {
    id: 'openspec.change-archive-used',
    category: 'maintainability',
    description: 'OpenSpec change archive used',
    instruction: 'Archive completed OpenSpec changes',
    remediation:
      'Unarchived completed changes clutter the active change list and let specs drift from what shipped. Archive completed changes into openspec/changes/archive.',
    points: 10,
    provider: 'openspec',
    check: (ctx) => ctx.hasPath('openspec/changes/archive'),
  },
];
