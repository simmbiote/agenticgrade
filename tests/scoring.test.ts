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
      { id: 'a', category: 'documentation', description: 'a', points: 10, check: () => true },
      { id: 'b', category: 'documentation', description: 'b', points: 15, check: () => false },
      {
        id: 'c',
        category: 'documentation',
        description: 'c',
        points: 10,
        provider: 'claude',
        check: () => true,
      },
      {
        id: 'd',
        category: 'documentation',
        description: 'd',
        points: 10,
        provider: 'openspec',
        check: () => true,
      },
    ];

    const result = scoreRepo(ctx, metrics);
    const doc = result.categories.find((c) => c.category === 'documentation')!;

    expect(doc.earned).toBe(20);
    expect(doc.max).toBe(35);
    expect(doc.metrics.map((m) => m.id)).toEqual(['a', 'b', 'c']);
  });

  it('aggregates overall totals across all six categories and reports providers', () => {
    fixture = createFixture({});
    const ctx = createScanContext(fixture.root, new Set(['none']));
    const metrics: Metric[] = [
      { id: 'a', category: 'documentation', description: 'a', points: 10, check: () => true },
      { id: 'b', category: 'testing', description: 'b', points: 20, check: () => false },
    ];

    const result = scoreRepo(ctx, metrics);

    expect(result.providers).toEqual(['none']);
    expect(result.overall.earned).toBe(10);
    expect(result.overall.max).toBe(30);
    expect(result.overall.grade).toBe(gradeFromPercentage((10 / 30) * 100));
  });
});
