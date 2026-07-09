import { describe, it, expect, afterEach } from 'vitest';
import { maintainabilityMetrics } from '../../src/metrics/maintainability.js';
import {
  conventionalCommitRatio,
  CONVENTIONAL_COMMIT_RATIO_THRESHOLD,
  LARGE_FILE_LINE_THRESHOLD,
} from '../../src/metrics/helpers.js';
import { createFileIndex, createScanContext } from '../../src/context.js';
import { detectProviders } from '../../src/providers.js';
import { createFixture, type Fixture } from '../helpers/fixture.js';
import { scanFixture, type ScanFixture } from '../helpers/scan.js';
import { commitAll, initGitRepo } from '../helpers/gitFixture.js';

function metric(id: string) {
  const m = maintainabilityMetrics.find((m) => m.id === id);
  if (!m) throw new Error(`metric not found: ${id}`);
  return m;
}

function linesOf(count: number): string {
  return Array.from({ length: count }, (_, i) => `line ${i}`).join('\n');
}

function buildCtx(root: string) {
  const index = createFileIndex(root);
  return createScanContext(root, detectProviders(index), index);
}

describe('maintainability metrics', () => {
  let fx: ScanFixture | undefined;
  let rawFixture: Fixture | undefined;

  afterEach(() => {
    fx?.cleanup();
    fx = undefined;
    rawFixture?.cleanup();
    rawFixture = undefined;
  });

  it('PR template checklist detected via checkbox syntax', () => {
    fx = scanFixture({ '.github/PULL_REQUEST_TEMPLATE.md': '- [ ] tests pass\n- [ ] docs updated' });
    expect(metric('maintainability.pr-template-checklist').check(fx.ctx)).toBe(true);
  });

  it('PR size guidance present', () => {
    fx = scanFixture({ 'CONTRIBUTING.md': 'Please keep pull requests small.' });
    expect(metric('maintainability.pr-size-guidance').check(fx.ctx)).toBe(true);
  });

  it('conventional commit ratio: 70% of 20 passes, 65% fails (threshold boundary)', () => {
    const passSubjects = [...Array(14).fill('feat: add thing'), ...Array(6).fill('random message')];
    expect(conventionalCommitRatio(passSubjects)).toBeCloseTo(CONVENTIONAL_COMMIT_RATIO_THRESHOLD);

    const failSubjects = [...Array(13).fill('feat: add thing'), ...Array(7).fill('random message')];
    expect(conventionalCommitRatio(failSubjects)).toBeLessThan(CONVENTIONAL_COMMIT_RATIO_THRESHOLD);
  });

  it('conventional commits used recently passes when 70%+ of recent commits are conventional', () => {
    rawFixture = createFixture({ 'README.md': '# hi' });
    initGitRepo(rawFixture.root);
    for (let i = 0; i < 14; i++) commitAll(rawFixture.root, `feat: change ${i}`);
    for (let i = 0; i < 6; i++) commitAll(rawFixture.root, `unstructured change ${i}`);

    const ctx = buildCtx(rawFixture.root);
    expect(metric('maintainability.conventional-commits-recent').check(ctx)).toBe(true);
  });

  it('conventional commits used recently fails when below 70% are conventional', () => {
    rawFixture = createFixture({ 'README.md': '# hi' });
    initGitRepo(rawFixture.root);
    for (let i = 0; i < 13; i++) commitAll(rawFixture.root, `feat: change ${i}`);
    for (let i = 0; i < 7; i++) commitAll(rawFixture.root, `unstructured change ${i}`);

    const ctx = buildCtx(rawFixture.root);
    expect(metric('maintainability.conventional-commits-recent').check(ctx)).toBe(false);
  });

  it('large files below threshold: passes at 799 lines, fails at 801 lines', () => {
    fx = scanFixture({ 'src/small.ts': linesOf(LARGE_FILE_LINE_THRESHOLD - 1) });
    expect(metric('maintainability.large-files-below-threshold').check(fx.ctx)).toBe(true);
    fx.cleanup();

    fx = scanFixture({ 'src/big.ts': linesOf(LARGE_FILE_LINE_THRESHOLD + 1) });
    expect(metric('maintainability.large-files-below-threshold').check(fx.ctx)).toBe(false);
  });

  it('TODO/FIXME density: reasonable below threshold, unreasonable above', () => {
    const sparse = `${linesOf(999)}\n// TODO fix this`;
    fx = scanFixture({ 'src/sparse.ts': sparse });
    expect(metric('maintainability.todo-fixme-reasonable').check(fx.ctx)).toBe(true);
    fx.cleanup();

    const dense = Array.from({ length: 100 }, (_, i) => (i < 10 ? '// TODO fix' : `line ${i}`)).join(
      '\n',
    );
    fx = scanFixture({ 'src/dense.ts': dense });
    expect(metric('maintainability.todo-fixme-reasonable').check(fx.ctx)).toBe(false);
  });

  it('dependency lockfile exists', () => {
    fx = scanFixture({ 'package-lock.json': '{}' });
    expect(metric('maintainability.dependency-lockfile-exists').check(fx.ctx)).toBe(true);
  });

  it('CODEOWNERS exists', () => {
    fx = scanFixture({ CODEOWNERS: '* @team' });
    expect(metric('maintainability.codeowners-exists').check(fx.ctx)).toBe(true);
  });

  it('docs updated recently within the 90-day window', () => {
    rawFixture = createFixture({ 'docs/notes.md': 'notes' });
    initGitRepo(rawFixture.root);
    commitAll(rawFixture.root, 'docs: add notes');

    const ctx = buildCtx(rawFixture.root);
    expect(metric('maintainability.docs-updated-recently').check(ctx)).toBe(true);
  });

  it('docs updated recently fails when the last commit is over 90 days old', () => {
    rawFixture = createFixture({ 'docs/notes.md': 'notes' });
    initGitRepo(rawFixture.root);
    commitAll(rawFixture.root, 'docs: add notes', '2000-01-01T00:00:00Z');

    const ctx = buildCtx(rawFixture.root);
    expect(metric('maintainability.docs-updated-recently').check(ctx)).toBe(false);
  });

  it('no generated files mixed with source', () => {
    fx = scanFixture({ 'src/index.ts': 'export {}' });
    expect(metric('maintainability.no-generated-files-mixed').check(fx.ctx)).toBe(true);
    fx.cleanup();

    fx = scanFixture({ 'src/dist/bundle.js': 'noop', 'src/index.ts': 'export {}' });
    expect(metric('maintainability.no-generated-files-mixed').check(fx.ctx)).toBe(false);
  });
});
