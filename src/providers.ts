import type { FileIndex } from './context.js';

export type ProviderId = 'openspec' | 'claude' | 'universal' | 'none';
export type SpecificProviderId = 'openspec' | 'claude';

export function detectOpenSpec(index: FileIndex): boolean {
  return index.hasPath('openspec');
}

export function detectClaude(index: FileIndex): boolean {
  return index.hasFile('CLAUDE.md') || index.hasPath('.claude');
}

/** Independent per-provider detection, with `universal`/`none` as fallback tiers. */
export function detectProviders(index: FileIndex): Set<ProviderId> {
  const providers = new Set<ProviderId>();

  if (detectOpenSpec(index)) providers.add('openspec');
  if (detectClaude(index)) providers.add('claude');

  if (providers.size === 0) {
    if (index.hasFile('AGENTS.md')) {
      providers.add('universal');
    } else {
      providers.add('none');
    }
  }

  return providers;
}
