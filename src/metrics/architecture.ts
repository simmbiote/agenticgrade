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
    instruction: 'Create a docs/adr/ directory for architecture decision records',
    remediation:
      'Architecture Decision Records document why past design choices were made, so past decisions are discoverable instead of being re-litigated. Create a docs/adr/ directory to hold them.',
    points: 20,
    check: (ctx) => adrDir(ctx) !== null,
  },
  {
    id: 'architecture.adr-files-exist',
    category: 'architecture',
    description: 'ADR files exist',
    instruction: 'Write at least one ADR',
    remediation:
      "An empty ADR directory provides no value on its own. Write at least one ADR documenting a real architectural decision you've made.",
    points: 15,
    check: (ctx) => adrFilesExist(ctx),
  },
  {
    id: 'architecture.adr-index-exists',
    category: 'architecture',
    description: 'ADR index exists',
    instruction: 'Add an ADR index',
    remediation:
      'An index makes ADRs discoverable instead of requiring a directory listing. Add an index file listing all ADRs with short summaries.',
    points: 10,
    check: (ctx) => adrIndexExists(ctx),
  },
  {
    id: 'architecture.overview-doc-exists',
    category: 'architecture',
    description: 'architecture overview doc exists',
    instruction: 'Add an architecture overview document',
    remediation:
      'An architecture overview gives agents a map of the system before they start editing. Add an ARCHITECTURE.md or docs/architecture/ doc describing major components and how they fit together.',
    points: 15,
    check: (ctx) => ctx.hasFile('ARCHITECTURE.md') || ctx.hasPath('docs/architecture'),
  },
  {
    id: 'architecture.codeowners-exists',
    category: 'architecture',
    description: 'CODEOWNERS exists',
    instruction: 'Add a CODEOWNERS file',
    remediation:
      'CODEOWNERS routes review responsibility to the right people or teams automatically. Add a CODEOWNERS file mapping paths to owners.',
    points: 10,
    check: (ctx) => ctx.hasFile('CODEOWNERS', '.github/CODEOWNERS', 'docs/CODEOWNERS'),
  },
  {
    id: 'architecture.clear-source-root',
    category: 'architecture',
    description: 'clear source root detected',
    instruction: 'Establish a clear source root directory (e.g. src/)',
    remediation:
      'A single, obvious source directory helps agents locate code quickly. Consolidate application code under one clearly named root directory.',
    points: 10,
    check: (ctx) => findSourceRoot(ctx) !== null,
  },
  {
    id: 'architecture.module-boundaries-detectable',
    category: 'architecture',
    description: 'module/package boundaries detectable',
    instruction: 'Organize source files into clear module/package boundaries',
    remediation:
      'Clear module/package boundaries help agents reason about where a change belongs. Organize source code into distinct subdirectories representing logical modules.',
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
    instruction: 'Split up very large source files',
    remediation:
      'Very large files are hard for agents (and humans) to reason about in one pass. Split files exceeding the line threshold into smaller, focused modules.',
    points: 10,
    check: (ctx) => {
      const root = findSourceRoot(ctx) ?? undefined;
      return !anySourceFileExceedsLines(ctx, LARGE_FILE_LINE_THRESHOLD, root);
    },
  },
];
