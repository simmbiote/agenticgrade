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
    instruction: 'Add a checklist to the pull request template',
    remediation:
      'A checklist reminds contributors and agents of steps that are easy to forget. Add a Markdown checklist (- [ ] items) to your PR template.',
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
    instruction: 'Document PR size guidance',
    remediation:
      'Large PRs are hard to review thoroughly. Document guidance encouraging small, focused pull requests.',
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
    instruction: 'Use conventional commit messages',
    remediation:
      'Inconsistent commit messages make history and changelogs hard to parse. Adopt conventional commit messages (e.g. feat:, fix:) across recent commits.',
    points: 15,
    check: (ctx) =>
      conventionalCommitRatio(ctx.recentCommitSubjects) >= CONVENTIONAL_COMMIT_RATIO_THRESHOLD,
  },
  {
    id: 'maintainability.large-files-below-threshold',
    category: 'maintainability',
    description: 'large files below threshold',
    instruction: 'Split up files exceeding the size threshold',
    remediation:
      'Very large files are hard for agents (and humans) to reason about in one pass. Split files exceeding the line threshold into smaller, focused modules.',
    points: 10,
    check: (ctx) => !anySourceFileExceedsLines(ctx, LARGE_FILE_LINE_THRESHOLD),
  },
  {
    id: 'maintainability.todo-fixme-reasonable',
    category: 'maintainability',
    description: 'TODO/FIXME count reasonable',
    instruction: 'Reduce the number of TODO/FIXME comments',
    remediation:
      'A high density of TODO/FIXME comments signals accumulating unaddressed debt. Resolve or track outstanding TODOs/FIXMEs to bring the count down.',
    points: 10,
    check: (ctx) => todoFixmeDensity(ctx) < TODO_DENSITY_THRESHOLD,
  },
  {
    id: 'maintainability.dependency-lockfile-exists',
    category: 'maintainability',
    description: 'dependency lockfile exists',
    instruction: 'Commit a dependency lockfile',
    remediation:
      "Without a lockfile, dependency versions can drift between installs, causing inconsistent behavior. Commit your package manager's lockfile (e.g. package-lock.json).",
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
    instruction: 'Add a CODEOWNERS file',
    remediation:
      'CODEOWNERS routes review responsibility to the right people or teams automatically. Add a CODEOWNERS file mapping paths to owners.',
    points: 10,
    check: (ctx) => ctx.hasFile('CODEOWNERS', '.github/CODEOWNERS', 'docs/CODEOWNERS'),
  },
  {
    id: 'maintainability.docs-updated-recently',
    category: 'maintainability',
    description: 'docs updated recently',
    instruction: 'Update your documentation',
    remediation:
      'Stale docs mislead agents into acting on outdated information. Review and update documentation to reflect the current state of the code.',
    points: 10,
    check: (ctx) => docsUpdatedWithinDays(ctx, DOCS_FRESHNESS_DAYS),
  },
  {
    id: 'maintainability.no-generated-files-mixed',
    category: 'maintainability',
    description: 'no generated files mixed with source',
    instruction: 'Keep generated files out of the source tree',
    remediation:
      "Generated files mixed with source can confuse agents about what's hand-written versus build output. Move generated files out of the source tree (e.g. into a build/dist directory) and gitignore them.",
    points: 10,
    check: (ctx) => {
      const root = findSourceRoot(ctx);
      return root === null || !hasGeneratedFilesMixedWithSource(ctx, root);
    },
  },
];
