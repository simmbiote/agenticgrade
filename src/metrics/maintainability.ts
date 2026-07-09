import type { Metric } from './types.js';
import {
  anySourceFileExceedsLines,
  conventionalCommitRatio,
  CONVENTIONAL_COMMIT_RATIO_THRESHOLD,
  docsUpdatedWithinDays,
  DOCS_FRESHNESS_DAYS,
  findSourceRoot,
  hasGeneratedFilesMixedWithSource,
  LARGE_FILE_LINE_THRESHOLD,
  mentionsAny,
  prTemplateContent,
  todoFixmeDensity,
  TODO_DENSITY_THRESHOLD,
} from './helpers.js';

export const maintainabilityMetrics: Metric[] = [
  {
    id: 'maintainability.pr-template-checklist',
    category: 'maintainability',
    description: 'PR template has checklist',
    points: 15,
    check: (ctx) => {
      const content = prTemplateContent(ctx);
      return content !== null && /- \[ \]/.test(content);
    },
  },
  {
    id: 'maintainability.pr-size-guidance',
    category: 'maintainability',
    description: 'PR size guidance present',
    points: 10,
    check: (ctx) => {
      const content = `${prTemplateContent(ctx) ?? ''}\n${ctx.read('CONTRIBUTING.md') ?? ''}`;
      return mentionsAny(content, [
        'small pr',
        'small pull request',
        'pull requests small',
        'prs small',
        'lines changed',
        'split into smaller',
      ]);
    },
  },
  {
    id: 'maintainability.conventional-commits-recent',
    category: 'maintainability',
    description: 'conventional commits used recently',
    points: 15,
    check: (ctx) =>
      conventionalCommitRatio(ctx.recentCommitSubjects) >= CONVENTIONAL_COMMIT_RATIO_THRESHOLD,
  },
  {
    id: 'maintainability.large-files-below-threshold',
    category: 'maintainability',
    description: 'large files below threshold',
    points: 10,
    check: (ctx) => !anySourceFileExceedsLines(ctx, LARGE_FILE_LINE_THRESHOLD),
  },
  {
    id: 'maintainability.todo-fixme-reasonable',
    category: 'maintainability',
    description: 'TODO/FIXME count reasonable',
    points: 10,
    check: (ctx) => todoFixmeDensity(ctx) < TODO_DENSITY_THRESHOLD,
  },
  {
    id: 'maintainability.dependency-lockfile-exists',
    category: 'maintainability',
    description: 'dependency lockfile exists',
    points: 10,
    check: (ctx) =>
      ctx.hasFile(
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        'poetry.lock',
        'Pipfile.lock',
        'Gemfile.lock',
        'go.sum',
        'Cargo.lock',
        'composer.lock',
      ),
  },
  {
    id: 'maintainability.codeowners-exists',
    category: 'maintainability',
    description: 'CODEOWNERS exists',
    points: 10,
    check: (ctx) => ctx.hasFile('CODEOWNERS', '.github/CODEOWNERS', 'docs/CODEOWNERS'),
  },
  {
    id: 'maintainability.docs-updated-recently',
    category: 'maintainability',
    description: 'docs updated recently',
    points: 10,
    check: (ctx) => docsUpdatedWithinDays(ctx, DOCS_FRESHNESS_DAYS),
  },
  {
    id: 'maintainability.no-generated-files-mixed',
    category: 'maintainability',
    description: 'no generated files mixed with source',
    points: 10,
    check: (ctx) => {
      const root = findSourceRoot(ctx);
      return root === null || !hasGeneratedFilesMixedWithSource(ctx, root);
    },
  },
];
