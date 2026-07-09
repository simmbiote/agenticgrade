import { describe, it, expect, afterEach } from 'vitest';
import { testingMetrics } from '../../src/metrics/testing.js';
import { scanFixture, type ScanFixture } from '../helpers/scan.js';

function metric(id: string) {
  const m = testingMetrics.find((m) => m.id === id);
  if (!m) throw new Error(`metric not found: ${id}`);
  return m;
}

describe('testing metrics', () => {
  let fx: ScanFixture | undefined;
  afterEach(() => {
    fx?.cleanup();
    fx = undefined;
  });

  it('test command detected from package.json scripts.test', () => {
    fx = scanFixture({ 'package.json': JSON.stringify({ scripts: { test: 'vitest run' } }) });
    expect(metric('testing.test-command-detected').check(fx.ctx)).toBe(true);
  });

  it('test command detected from go.mod', () => {
    fx = scanFixture({ 'go.mod': 'module example.com/foo' });
    expect(metric('testing.test-command-detected').check(fx.ctx)).toBe(true);
  });

  it('test command documented when README shows the literal command', () => {
    fx = scanFixture({
      'package.json': JSON.stringify({ scripts: { test: 'vitest run' } }),
      'README.md': '## Test\n```\nvitest run\n```',
    });
    expect(metric('testing.test-command-documented').check(fx.ctx)).toBe(true);
    fx.cleanup();

    fx = scanFixture({
      'package.json': JSON.stringify({ scripts: { test: 'vitest run' } }),
      'README.md': '## Test\nrun the tests',
    });
    expect(metric('testing.test-command-documented').check(fx.ctx)).toBe(false);
  });

  it('CI runs tests when a workflow step runs the detected command', () => {
    fx = scanFixture({
      'package.json': JSON.stringify({ scripts: { test: 'vitest run' } }),
      '.github/workflows/ci.yml': 'jobs:\n  test:\n    steps:\n      - run: vitest run',
    });
    expect(metric('testing.ci-runs-tests').check(fx.ctx)).toBe(true);
  });

  it('test files exist via tests/ directory', () => {
    fx = scanFixture({ 'tests/foo.test.ts': 'test()' });
    expect(metric('testing.test-files-exist').check(fx.ctx)).toBe(true);
  });

  it('coverage config/report exists', () => {
    fx = scanFixture({ '.nycrc': '{}' });
    expect(metric('testing.coverage-exists').check(fx.ctx)).toBe(true);
  });

  it('unit/integration structure detectable via separate directories', () => {
    fx = scanFixture({ 'tests/unit/a.test.ts': 'x', 'tests/integration/b.test.ts': 'x' });
    expect(metric('testing.unit-integration-structure').check(fx.ctx)).toBe(true);
  });

  it('tests are required checks when documented in CONTRIBUTING.md', () => {
    fx = scanFixture({
      'CONTRIBUTING.md': 'PRs require the test job to pass as a required status check.',
    });
    expect(metric('testing.tests-required-check').check(fx.ctx)).toBe(true);
  });
});
