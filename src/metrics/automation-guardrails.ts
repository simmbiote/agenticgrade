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
    instruction: 'Add a CI workflow',
    remediation:
      'Without CI, nothing verifies changes automatically before merge. Add a CI workflow (e.g. GitHub Actions) that runs on push and PR.',
    points: 20,
    check: (ctx) => hasCiWorkflow(ctx),
  },
  {
    id: 'automation-guardrails.lint-command-detected',
    category: 'automation-guardrails',
    description: 'lint command detected',
    instruction: 'Add a lint command',
    remediation:
      'A lint command catches style and correctness issues before review. Add a lint script (e.g. "lint": "eslint .") to package.json.',
    points: 15,
    check: (ctx) => hasLintCommand(ctx),
  },
  {
    id: 'automation-guardrails.format-command-detected',
    category: 'automation-guardrails',
    description: 'format command detected',
    instruction: 'Add a format command',
    remediation:
      'A format command keeps style consistent without manual nitpicking. Add a format script (e.g. "format": "prettier --write .").',
    points: 10,
    check: (ctx) => hasFormatCommand(ctx),
  },
  {
    id: 'automation-guardrails.typecheck-detected',
    category: 'automation-guardrails',
    description: 'typecheck/static analysis detected',
    instruction: 'Add typecheck or static analysis',
    remediation:
      'Static analysis and typechecking catch type errors before runtime. Add a typecheck script (e.g. "tsc --noEmit") or equivalent static analysis tool.',
    points: 15,
    check: (ctx) => hasTypecheckOrStaticAnalysis(ctx),
  },
  {
    id: 'automation-guardrails.security-scan-exists',
    category: 'automation-guardrails',
    description: 'security/dependency scan exists',
    instruction: 'Add a security/dependency scan',
    remediation:
      'Unscanned dependencies can introduce known vulnerabilities silently. Add a security/dependency scan (e.g. npm audit, Dependabot, Snyk) to your workflow.',
    points: 10,
    check: (ctx) => hasSecurityScan(ctx),
  },
  {
    id: 'automation-guardrails.pr-template-exists',
    category: 'automation-guardrails',
    description: 'PR template exists',
    instruction: 'Add a pull request template',
    remediation:
      'A PR template ensures every change includes the context reviewers need. Add a pull request template under .github/.',
    points: 10,
    check: (ctx) => hasPrTemplate(ctx),
  },
  {
    id: 'automation-guardrails.conventional-commit-config-exists',
    category: 'automation-guardrails',
    description: 'conventional commit config exists',
    instruction: 'Add conventional commit configuration',
    remediation:
      'Conventional commits make history and changelogs machine-parseable. Add commit linting configuration (e.g. commitlint) enforcing the convention.',
    points: 10,
    check: (ctx) => hasConventionalCommitConfig(ctx),
  },
  {
    id: 'automation-guardrails.required-checks-hint',
    category: 'automation-guardrails',
    description: 'required checks/branch protection hint',
    instruction: 'Document required checks or branch protection rules',
    remediation:
      "Without documented required checks, it's unclear what must pass before merge. Document your required checks or branch protection rules (e.g. in CONTRIBUTING.md).",
    points: 10,
    check: (ctx) => requiredChecksHintDetected(ctx),
  },
];
