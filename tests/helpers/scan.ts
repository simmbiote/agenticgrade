import { createFileIndex, createScanContext, type ScanContext } from '../../src/context.js';
import { detectProviders, type ProviderId } from '../../src/providers.js';
import { createFixture, type Fixture } from './fixture.js';

export interface ScanFixture {
  ctx: ScanContext;
  cleanup(): void;
}

/** Builds a real ScanContext over a temp fixture tree, auto-detecting providers unless overridden. */
export function scanFixture(files: Record<string, string>, providers?: ProviderId[]): ScanFixture {
  const fixture: Fixture = createFixture(files);
  const index = createFileIndex(fixture.root);
  const providerSet = providers ? new Set(providers) : detectProviders(index);
  const ctx = createScanContext(fixture.root, providerSet, index);
  return { ctx, cleanup: fixture.cleanup };
}
