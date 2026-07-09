import type { Metric } from './types.js';
import {
  agentIgnoreExists,
  aiContextContent,
  claudeShimOrImportExists,
  mentionsAny,
} from './helpers.js';

export const aiContextMetrics: Metric[] = [
  {
    id: 'ai-context.agents-md-exists',
    category: 'ai-context',
    description: 'AGENTS.md exists',
    points: 20,
    check: (ctx) => ctx.hasFile('AGENTS.md'),
  },
  {
    id: 'ai-context.claude-shim-import-exists',
    category: 'ai-context',
    description: 'CLAUDE.md shim/import exists',
    points: 15,
    check: (ctx) => claudeShimOrImportExists(ctx),
  },
  {
    id: 'ai-context.covers-testing',
    category: 'ai-context',
    description: 'agent file covers testing',
    points: 10,
    check: (ctx) => mentionsAny(aiContextContent(ctx), ['test', 'testing']),
  },
  {
    id: 'ai-context.covers-code-style',
    category: 'ai-context',
    description: 'agent file covers code style',
    points: 10,
    check: (ctx) =>
      mentionsAny(aiContextContent(ctx), ['code style', 'conventions', 'style guide']),
  },
  {
    id: 'ai-context.covers-architecture-rules',
    category: 'ai-context',
    description: 'agent file covers architecture rules',
    points: 10,
    check: (ctx) =>
      mentionsAny(aiContextContent(ctx), ['architecture', 'module boundary', 'module boundaries']),
  },
  {
    id: 'ai-context.covers-adr-spec-rules',
    category: 'ai-context',
    description: 'agent file covers ADR/spec rules',
    points: 10,
    check: (ctx) => mentionsAny(aiContextContent(ctx), ['adr', 'docs/adr', 'docs/specs', 'spec']),
  },
  {
    id: 'ai-context.docs-specs-exists',
    category: 'ai-context',
    description: 'docs/specs exists',
    points: 10,
    check: (ctx) => ctx.hasPath('docs/specs'),
  },
  {
    id: 'ai-context.docs-plans-exists',
    category: 'ai-context',
    description: 'docs/plans exists',
    points: 5,
    check: (ctx) => ctx.hasPath('docs/plans'),
  },
  {
    id: 'ai-context.docs-research-exists',
    category: 'ai-context',
    description: 'docs/research exists',
    points: 5,
    check: (ctx) => ctx.hasPath('docs/research'),
  },
  {
    id: 'ai-context.agentignore-exists',
    category: 'ai-context',
    description: '.agentignore or equivalent exists',
    points: 5,
    check: (ctx) => agentIgnoreExists(ctx),
  },
];
