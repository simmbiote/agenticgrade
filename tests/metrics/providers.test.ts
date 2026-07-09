import { describe, it, expect, afterEach } from 'vitest';
import { openspecMetrics } from '../../src/metrics/providers/openspec.js';
import { claudeMetrics } from '../../src/metrics/providers/claude.js';
import { universalMetrics } from '../../src/metrics/providers/universal.js';
import { isMetricApplicable } from '../../src/scoring.js';
import { scanFixture, type ScanFixture } from '../helpers/scan.js';

function find(metrics: typeof openspecMetrics, id: string) {
  const m = metrics.find((m) => m.id === id);
  if (!m) throw new Error(`metric not found: ${id}`);
  return m;
}

describe('openspec provider metrics', () => {
  let fx: ScanFixture | undefined;
  afterEach(() => {
    fx?.cleanup();
    fx = undefined;
  });

  it('design docs present when a change has a design.md', () => {
    fx = scanFixture(
      { 'openspec/changes/add-thing/design.md': '## Context' },
      ['openspec'],
    );
    expect(find(openspecMetrics, 'openspec.design-docs-present').check(fx.ctx)).toBe(true);
  });

  it('validate enforced in CI when a workflow runs openspec validate', () => {
    fx = scanFixture(
      {
        'openspec/config.yaml': 'x',
        '.github/workflows/ci.yml': 'steps:\n  - run: openspec validate --strict',
      },
      ['openspec'],
    );
    expect(find(openspecMetrics, 'openspec.validate-in-ci').check(fx.ctx)).toBe(true);
  });

  it('change archive used when openspec/changes/archive has entries', () => {
    fx = scanFixture(
      { 'openspec/changes/archive/old-change/proposal.md': 'done' },
      ['openspec'],
    );
    expect(find(openspecMetrics, 'openspec.change-archive-used').check(fx.ctx)).toBe(true);
  });

  it('is only applicable when openspec is in the detected provider set', () => {
    const metric = find(openspecMetrics, 'openspec.design-docs-present');
    expect(isMetricApplicable(metric, new Set(['openspec']))).toBe(true);
    expect(isMetricApplicable(metric, new Set(['claude']))).toBe(false);
  });
});

describe('claude provider metrics', () => {
  let fx: ScanFixture | undefined;
  afterEach(() => {
    fx?.cleanup();
    fx = undefined;
  });

  it('hooks configured when settings.json defines a hook', () => {
    fx = scanFixture(
      {
        '.claude/settings.json': JSON.stringify({ hooks: { PreToolUse: [{ matcher: '*' }] } }),
      },
      ['claude'],
    );
    expect(find(claudeMetrics, 'claude.hooks-configured').check(fx.ctx)).toBe(true);
  });

  it('subagents/skills documented via .claude/agents', () => {
    fx = scanFixture({ '.claude/agents/reviewer.md': '# reviewer' }, ['claude']);
    expect(find(claudeMetrics, 'claude.subagents-skills-documented').check(fx.ctx)).toBe(true);
  });

  it('custom commands documented via .claude/commands', () => {
    fx = scanFixture({ '.claude/commands/deploy.md': '# deploy' }, ['claude']);
    expect(find(claudeMetrics, 'claude.custom-commands-documented').check(fx.ctx)).toBe(true);
  });
});

describe('universal provider metrics', () => {
  let fx: ScanFixture | undefined;
  afterEach(() => {
    fx?.cleanup();
    fx = undefined;
  });

  it('AGENTS.md has required sections when Setup/Conventions/Testing headings are present', () => {
    fx = scanFixture(
      { 'AGENTS.md': '## Setup\nx\n## Conventions\nx\n## Testing\nx' },
      ['universal'],
    );
    expect(find(universalMetrics, 'universal.agents-md-required-sections').check(fx.ctx)).toBe(
      true,
    );
  });

  it('fails when a required section heading is missing', () => {
    fx = scanFixture({ 'AGENTS.md': '## Setup\nx' }, ['universal']);
    expect(find(universalMetrics, 'universal.agents-md-required-sections').check(fx.ctx)).toBe(
      false,
    );
  });
});
