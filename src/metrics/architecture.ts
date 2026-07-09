import type { Metric } from './types.js';
import {
  adrDir,
  adrFilesExist,
  adrIndexExists,
  anySourceFileExceedsLines,
  findSourceRoot,
  LARGE_FILE_LINE_THRESHOLD,
  moduleBoundariesDetectable,
} from './helpers.js';

export const architectureMetrics: Metric[] = [
  {
    id: 'architecture.docs-adr-exists',
    category: 'architecture',
    description: 'docs/adr/ exists',
    points: 20,
    check: (ctx) => adrDir(ctx) !== null,
  },
  {
    id: 'architecture.adr-files-exist',
    category: 'architecture',
    description: 'ADR files exist',
    points: 15,
    check: (ctx) => adrFilesExist(ctx),
  },
  {
    id: 'architecture.adr-index-exists',
    category: 'architecture',
    description: 'ADR index exists',
    points: 10,
    check: (ctx) => adrIndexExists(ctx),
  },
  {
    id: 'architecture.overview-doc-exists',
    category: 'architecture',
    description: 'architecture overview doc exists',
    points: 15,
    check: (ctx) => ctx.hasFile('ARCHITECTURE.md') || ctx.hasPath('docs/architecture'),
  },
  {
    id: 'architecture.codeowners-exists',
    category: 'architecture',
    description: 'CODEOWNERS exists',
    points: 10,
    check: (ctx) => ctx.hasFile('CODEOWNERS', '.github/CODEOWNERS', 'docs/CODEOWNERS'),
  },
  {
    id: 'architecture.clear-source-root',
    category: 'architecture',
    description: 'clear source root detected',
    points: 10,
    check: (ctx) => findSourceRoot(ctx) !== null,
  },
  {
    id: 'architecture.module-boundaries-detectable',
    category: 'architecture',
    description: 'module/package boundaries detectable',
    points: 10,
    check: (ctx) => {
      const root = findSourceRoot(ctx);
      return root !== null && moduleBoundariesDetectable(ctx, root);
    },
  },
  {
    id: 'architecture.no-very-large-source-files',
    category: 'architecture',
    description: 'no very large source files',
    points: 10,
    check: (ctx) => {
      const root = findSourceRoot(ctx) ?? undefined;
      return !anySourceFileExceedsLines(ctx, LARGE_FILE_LINE_THRESHOLD, root);
    },
  },
];
