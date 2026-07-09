import type { ScanContext } from '../context.js';

export type Category =
  | 'documentation'
  | 'architecture'
  | 'testing'
  | 'automation-guardrails'
  | 'ai-context'
  | 'maintainability';

export type MetricProvider = 'openspec' | 'claude' | 'universal';

export interface Metric {
  id: string;
  category: Category;
  description: string;
  points: number;
  provider?: MetricProvider;
  check: (ctx: ScanContext) => boolean;
}

export const CATEGORIES: Category[] = [
  'documentation',
  'architecture',
  'testing',
  'automation-guardrails',
  'ai-context',
  'maintainability',
];
