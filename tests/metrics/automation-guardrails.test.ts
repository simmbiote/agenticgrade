import { describe, it, expect, afterEach } from 'vitest';
import { automationGuardrailsMetrics } from '../../src/metrics/automation-guardrails.js';
import { scanFixture, type ScanFixture } from '../helpers/scan.js';

function metric(id: string) {
  const m = automationGuardrailsMetrics.find((m) => m.id === id);
  if (!m) throw new Error(`metric not found: ${id}`);
  return m;
}

describe('automation guard rails metrics', () => {
  let fx: ScanFixture | undefined;
  afterEach(() => {
    fx?.cleanup();
    fx = undefined;
  });

  it('CI workflow exists', () => {
    fx = scanFixture({ '.github/workflows/ci.yml': 'jobs: {}' });
    expect(metric('automation-guardrails.ci-workflow-exists').check(fx.ctx)).toBe(true);
  });

  it('lint command detected via eslint config', () => {
    fx = scanFixture({ 'eslint.config.js': 'export default []' });
    expect(metric('automation-guardrails.lint-command-detected').check(fx.ctx)).toBe(true);
  });

  it('format command detected via prettier config', () => {
    fx = scanFixture({ '.prettierrc.json': '{}' });
    expect(metric('automation-guardrails.format-command-detected').check(fx.ctx)).toBe(true);
  });

  it('typecheck/static analysis detected via strict tsconfig', () => {
    fx = scanFixture({ 'tsconfig.json': JSON.stringify({ compilerOptions: { strict: true } }) });
    expect(metric('automation-guardrails.typecheck-detected').check(fx.ctx)).toBe(true);
  });

  it('security/dependency scan detected via dependabot config', () => {
    fx = scanFixture({ '.github/dependabot.yml': 'version: 2' });
    expect(metric('automation-guardrails.security-scan-exists').check(fx.ctx)).toBe(true);
  });

  it('PR template exists', () => {
    fx = scanFixture({ '.github/PULL_REQUEST_TEMPLATE.md': '- [ ] done' });
    expect(metric('automation-guardrails.pr-template-exists').check(fx.ctx)).toBe(true);
  });

  it('conventional commit config exists', () => {
    fx = scanFixture({ 'commitlint.config.js': 'module.exports = {}' });
    expect(metric('automation-guardrails.conventional-commit-config-exists').check(fx.ctx)).toBe(
      true,
    );
  });

  it('required checks/branch protection hint detected', () => {
    fx = scanFixture({ 'CONTRIBUTING.md': 'Branch protection requires a required check.' });
    expect(metric('automation-guardrails.required-checks-hint').check(fx.ctx)).toBe(true);
  });
});
