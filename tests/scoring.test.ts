import { describe, it, expect, afterEach } from 'vitest';
import { createScanContext } from '../src/context.js';
import { gradeFromPercentage, isMetricApplicable, scoreRepo } from '../src/scoring.js';
import type { Metric } from '../src/metrics/types.js';
import { createFixture, type Fixture } from './helpers/fixture.js';

describe('gradeFromPercentage', () => {
  it.each([
    [100, 'A+'],
    [97, 'A+'],
    [96, 'A'],
    [93, 'A'],
    [90, 'A-'],
    [83, 'B'],
    [70, 'C-'],
    [60, 'D'],
    [59.9, 'F'],
    [0, 'F'],
  ])('%d%% maps to %s', (pct, grade) => {
    expect(gradeFromPercentage(pct)).toBe(grade);
  });
});

describe('isMetricApplicable', () => {
  const base: Metric = {
    id: 'x',
    category: 'documentation',
    description: 'x',
    instruction: 'x',
    remediation: 'x',
    points: 10,
    check: () => true,
  };

  it('is true for an untagged metric regardless of providers', () => {
    expect(isMetricApplicable(base, new Set())).toBe(true);
    expect(isMetricApplicable(base, new Set(['claude']))).toBe(true);
  });

  it('is true for a tagged metric only when its provider is detected', () => {
    const tagged = { ...base, provider: 'claude' as const };
    expect(isMetricApplicable(tagged, new Set(['claude']))).toBe(true);
    expect(isMetricApplicable(tagged, new Set(['openspec']))).toBe(false);
  });
});

function metric(overrides: Partial<Metric> & Pick<Metric, 'id' | 'category' | 'points' | 'check'>): Metric {
  return {
    description: overrides.id,
    instruction: overrides.id,
    remediation: overrides.id,
    ...overrides,
  };
}

describe('scoreRepo', () => {
  let fixture: Fixture | undefined;

  afterEach(() => {
    fixture?.cleanup();
    fixture = undefined;
  });

  it('sums earned/max per category and excludes non-applicable provider metrics', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['claude']));

    const metrics: Metric[] = [
      metric({ id: 'a', category: 'documentation', points: 10, check: () => true }),
      metric({ id: 'b', category: 'documentation', points: 15, check: () => false }),
      metric({
        id: 'c',
        category: 'documentation',
        points: 10,
        provider: 'claude',
        check: () => true,
      }),
      metric({
        id: 'd',
        category: 'documentation',
        points: 10,
        provider: 'openspec',
        check: () => true,
      }),
    ];

    const result = scoreRepo(ctx, metrics);
    const doc = result.categories.find((c) => c.category === 'documentation')!;

    expect(doc.earned).toBe(20);
    expect(doc.max).toBe(35);
    expect(doc.percentage).toBeCloseTo((20 / 35) * 100);
    expect(doc.metrics.map((m) => m.id)).toEqual(['a', 'b', 'c']);
  });

  it('reports a category percentage of 0 when the category has no applicable metrics', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['none']));
    const metrics: Metric[] = [metric({ id: 'a', category: 'testing', points: 10, check: () => true })];

    const result = scoreRepo(ctx, metrics);
    const doc = result.categories.find((c) => c.category === 'documentation')!;

    expect(doc.max).toBe(0);
    expect(doc.percentage).toBe(0);
  });

  it('aggregates overall totals across all six categories and reports providers', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['none']));
    const metrics: Metric[] = [
      metric({ id: 'a', category: 'documentation', points: 10, check: () => true }),
      metric({ id: 'b', category: 'testing', points: 20, check: () => false }),
    ];

    const result = scoreRepo(ctx, metrics);

    expect(result.providers).toEqual(['none']);
    expect(result.overall.earned).toBe(10);
    expect(result.overall.max).toBe(30);
    expect(result.overall.grade).toBe(gradeFromPercentage((10 / 30) * 100));
  });

  it('ranks the top 5 failing metrics by points, descending', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['none']));
    const metrics: Metric[] = [
      metric({ id: 'a', category: 'documentation', points: 5, check: () => false }),
      metric({ id: 'b', category: 'documentation', points: 20, check: () => false }),
      metric({ id: 'c', category: 'testing', points: 15, check: () => false }),
      metric({ id: 'd', category: 'testing', points: 10, check: () => false }),
      metric({ id: 'e', category: 'architecture', points: 25, check: () => false }),
      metric({ id: 'f', category: 'architecture', points: 1, check: () => false }),
      metric({ id: 'g', category: 'maintainability', points: 30, check: () => true }),
    ];

    const result = scoreRepo(ctx, metrics);

    expect(result.topImprovements.map((m) => m.id)).toEqual(['e', 'b', 'c', 'd', 'a']);
    expect(result.topImprovements.every((m) => 'instruction' in m)).toBe(true);
    expect(result.topImprovements.every((m) => !('description' in m))).toBe(true);
  });

  it('includes all failing metrics when fewer than 5 fail', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['none']));
    const metrics: Metric[] = [
      metric({ id: 'a', category: 'documentation', points: 10, check: () => false }),
      metric({ id: 'b', category: 'testing', points: 20, check: () => false }),
      metric({ id: 'c', category: 'architecture', points: 5, check: () => true }),
    ];

    const result = scoreRepo(ctx, metrics);

    expect(result.topImprovements.map((m) => m.id)).toEqual(['b', 'a']);
  });

  it('reports an empty topImprovements list when every metric passes', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['none']));
    const metrics: Metric[] = [metric({ id: 'a', category: 'documentation', points: 10, check: () => true })];

    const result = scoreRepo(ctx, metrics);

    expect(result.topImprovements).toEqual([]);
  });

  it('breaks ties by category order', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['none']));
    const metrics: Metric[] = [
      metric({ id: 'a', category: 'testing', points: 10, check: () => false }),
      metric({ id: 'b', category: 'documentation', points: 10, check: () => false }),
    ];

    const result = scoreRepo(ctx, metrics);

    expect(result.topImprovements.map((m) => m.id)).toEqual(['b', 'a']);
  });

  it('carries remediation on each metric result', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['none']));
    const metrics: Metric[] = [
      { ...metric({ id: 'a', category: 'documentation', points: 10, check: () => false }), remediation: 'Fix it by doing X.' },
    ];

    const result = scoreRepo(ctx, metrics);
    const doc = result.categories.find((c) => c.category === 'documentation')!;

    expect(doc.metrics[0].remediation).toBe('Fix it by doing X.');
  });
});
