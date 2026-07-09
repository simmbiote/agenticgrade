import { describe, it, expect, afterEach } from 'vitest';
import { architectureMetrics } from '../../src/metrics/architecture.js';
import { LARGE_FILE_LINE_THRESHOLD } from '../../src/metrics/helpers.js';
import { scanFixture, type ScanFixture } from '../helpers/scan.js';

function metric(id: string) {
  const m = architectureMetrics.find((m) => m.id === id);
  if (!m) throw new Error(`metric not found: ${id}`);
  return m;
}

function linesOf(count: number): string {
  return Array.from({ length: count }, (_, i) => `line ${i}`).join('\n');
}

describe('architecture metrics', () => {
  let fx: ScanFixture | undefined;
  afterEach(() => {
    fx?.cleanup();
    fx = undefined;
  });

  it('docs/adr exists, ADR files exist, ADR index exists', () => {
    fx = scanFixture({
      'docs/adr/README.md': 'index',
      'docs/adr/0001-record.md': 'record',
    });
    expect(metric('architecture.docs-adr-exists').check(fx.ctx)).toBe(true);
    expect(metric('architecture.adr-files-exist').check(fx.ctx)).toBe(true);
    expect(metric('architecture.adr-index-exists').check(fx.ctx)).toBe(true);
  });

  it('architecture overview doc exists via ARCHITECTURE.md', () => {
    fx = scanFixture({ 'ARCHITECTURE.md': '# architecture' });
    expect(metric('architecture.overview-doc-exists').check(fx.ctx)).toBe(true);
  });

  it('CODEOWNERS exists', () => {
    fx = scanFixture({ CODEOWNERS: '* @team' });
    expect(metric('architecture.codeowners-exists').check(fx.ctx)).toBe(true);
  });

  it('clear source root detected for known candidates', () => {
    fx = scanFixture({ 'src/index.ts': 'export {}' });
    expect(metric('architecture.clear-source-root').check(fx.ctx)).toBe(true);
    fx.cleanup();

    fx = scanFixture({ 'random/index.ts': 'export {}' });
    expect(metric('architecture.clear-source-root').check(fx.ctx)).toBe(false);
  });

  it('module/package boundaries detectable with 2+ sibling module dirs', () => {
    fx = scanFixture({
      'src/moduleA/index.ts': 'export {}',
      'src/moduleB/index.ts': 'export {}',
    });
    expect(metric('architecture.module-boundaries-detectable').check(fx.ctx)).toBe(true);
    fx.cleanup();

    fx = scanFixture({ 'src/index.ts': 'export {}' });
    expect(metric('architecture.module-boundaries-detectable').check(fx.ctx)).toBe(false);
  });

  it('no very large source files: passes at 799 lines, fails at 801 lines', () => {
    fx = scanFixture({ 'src/small.ts': linesOf(LARGE_FILE_LINE_THRESHOLD - 1) });
    expect(metric('architecture.no-very-large-source-files').check(fx.ctx)).toBe(true);
    fx.cleanup();

    fx = scanFixture({ 'src/big.ts': linesOf(LARGE_FILE_LINE_THRESHOLD + 1) });
    expect(metric('architecture.no-very-large-source-files').check(fx.ctx)).toBe(false);
  });
});
