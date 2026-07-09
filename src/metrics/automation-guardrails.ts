import type { Metric } from './types.js';
import {
  hasCiWorkflow,
  hasConventionalCommitConfig,
  hasFormatCommand,
  hasLintCommand,
  hasPrTemplate,
  hasSecurityScan,
  hasTypecheckOrStaticAnalysis,
  requiredChecksHintDetected,
} from './helpers.js';

export const automationGuardrailsMetrics: Metric[] = [
  {
    id: 'automation-guardrails.ci-workflow-exists',
    category: 'automation-guardrails',
    description: 'CI workflow exists',
    points: 20,
    check: (ctx) => hasCiWorkflow(ctx),
  },
  {
    id: 'automation-guardrails.lint-command-detected',
    category: 'automation-guardrails',
    description: 'lint command detected',
    points: 15,
    check: (ctx) => hasLintCommand(ctx),
  },
  {
    id: 'automation-guardrails.format-command-detected',
    category: 'automation-guardrails',
    description: 'format command detected',
    points: 10,
    check: (ctx) => hasFormatCommand(ctx),
  },
  {
    id: 'automation-guardrails.typecheck-detected',
    category: 'automation-guardrails',
    description: 'typecheck/static analysis detected',
    points: 15,
    check: (ctx) => hasTypecheckOrStaticAnalysis(ctx),
  },
  {
    id: 'automation-guardrails.security-scan-exists',
    category: 'automation-guardrails',
    description: 'security/dependency scan exists',
    points: 10,
    check: (ctx) => hasSecurityScan(ctx),
  },
  {
    id: 'automation-guardrails.pr-template-exists',
    category: 'automation-guardrails',
    description: 'PR template exists',
    points: 10,
    check: (ctx) => hasPrTemplate(ctx),
  },
  {
    id: 'automation-guardrails.conventional-commit-config-exists',
    category: 'automation-guardrails',
    description: 'conventional commit config exists',
    points: 10,
    check: (ctx) => hasConventionalCommitConfig(ctx),
  },
  {
    id: 'automation-guardrails.required-checks-hint',
    category: 'automation-guardrails',
    description: 'required checks/branch protection hint',
    points: 10,
    check: (ctx) => requiredChecksHintDetected(ctx),
  },
];
