import { createFileIndex, createScanContext } from './context.js';
import { detectProviders } from './providers.js';
import { metricsCatalog } from './metrics/index.js';
import { scoreRepo } from './scoring.js';
import type { ScoringResult } from './scoring.js';

export function runScan(rootDir: string): ScoringResult {
  const fileIndex = createFileIndex(rootDir);
  const providers = detectProviders(fileIndex);
  const ctx = createScanContext(rootDir, providers, fileIndex);
  return scoreRepo(ctx, metricsCatalog);
}

export { metricsCatalog } from './metrics/index.js';
export { scoreRepo, gradeFromPercentage } from './scoring.js';
export type { ScoringResult, CategoryScore, MetricResult } from './scoring.js';
export { detectProviders } from './providers.js';
export type { ProviderId } from './providers.js';
