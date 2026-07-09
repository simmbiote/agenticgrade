import type { Metric } from './types.js';
import { adrDir, adrIndexExists, hasHeadingMatching, hasPrTemplate } from './helpers.js';

export const documentationMetrics: Metric[] = [
  {
    id: 'documentation.readme-exists',
    category: 'documentation',
    description: 'README exists',
    points: 10,
    check: (ctx) => ctx.hasFile('README.md', 'README'),
  },
  {
    id: 'documentation.readme-sections',
    category: 'documentation',
    description: 'README has setup/run/test sections',
    points: 15,
    check: (ctx) => {
      const content = ctx.readAny(['README.md', 'README']);
      if (!content) return false;
      return (
        hasHeadingMatching(content, ['setup', 'install']) &&
        hasHeadingMatching(content, ['run', 'usage']) &&
        hasHeadingMatching(content, ['test'])
      );
    },
  },
  {
    id: 'documentation.contributing-exists',
    category: 'documentation',
    description: 'CONTRIBUTING.md exists',
    points: 10,
    check: (ctx) => ctx.hasFile('CONTRIBUTING.md'),
  },
  {
    id: 'documentation.docs-specs-exists',
    category: 'documentation',
    description: 'docs/specs/ exists',
    points: 10,
    check: (ctx) => ctx.hasPath('docs/specs'),
  },
  {
    id: 'documentation.docs-plans-exists',
    category: 'documentation',
    description: 'docs/plans/ exists',
    points: 10,
    check: (ctx) => ctx.hasPath('docs/plans'),
  },
  {
    id: 'documentation.docs-research-exists',
    category: 'documentation',
    description: 'docs/research/ exists',
    points: 10,
    check: (ctx) => ctx.hasPath('docs/research'),
  },
  {
    id: 'documentation.docs-adr-exists',
    category: 'documentation',
    description: 'docs/adr/ exists',
    points: 10,
    check: (ctx) => adrDir(ctx) !== null,
  },
  {
    id: 'documentation.adr-index-exists',
    category: 'documentation',
    description: 'ADR index exists',
    points: 10,
    check: (ctx) => adrIndexExists(ctx),
  },
  {
    id: 'documentation.pr-template-exists',
    category: 'documentation',
    description: 'PR template exists',
    points: 10,
    check: (ctx) => hasPrTemplate(ctx),
  },
  {
    id: 'documentation.spec-adr-templates-exist',
    category: 'documentation',
    description: 'Spec/ADR templates exist',
    points: 5,
    check: (ctx) =>
      ctx.files.some((f) => /^docs\/(adr|specs)\/(_?template|TEMPLATE)\.md$/i.test(f)),
  },
];
