import { describe, it, expect, afterEach } from 'vitest';
import { createFileIndex } from '../src/context.js';
import { detectProviders } from '../src/providers.js';
import { createFixture, type Fixture } from './helpers/fixture.js';

describe('detectProviders', () => {
  let fixture: Fixture | undefined;

  afterEach(() => {
    fixture?.cleanup();
    fixture = undefined;
  });

  function detect(files: Record<string, string>) {
    fixture = createFixture(files);
    return detectProviders(createFileIndex(fixture.root));
  }

  it('detects openspec from an openspec/ directory', () => {
    const providers = detect({ 'openspec/config.yaml': 'x' });
    expect(providers).toEqual(new Set(['openspec']));
  });

  it('detects claude from a root CLAUDE.md', () => {
    const providers = detect({ 'CLAUDE.md': '# claude' });
    expect(providers).toEqual(new Set(['claude']));
  });

  it('detects claude from a .claude/ directory without CLAUDE.md', () => {
    const providers = detect({ '.claude/settings.json': '{}' });
    expect(providers).toEqual(new Set(['claude']));
  });

  it('detects both openspec and claude when both signals are present', () => {
    const providers = detect({ 'openspec/config.yaml': 'x', 'CLAUDE.md': '# claude' });
    expect(providers).toEqual(new Set(['openspec', 'claude']));
  });

  it('falls back to universal when only AGENTS.md is present', () => {
    const providers = detect({ 'AGENTS.md': '# agents' });
    expect(providers).toEqual(new Set(['universal']));
  });

  it('does not report universal alongside a specific provider', () => {
    const providers = detect({ 'AGENTS.md': '# agents', '.claude/settings.json': '{}' });
    expect(providers).toEqual(new Set(['claude']));
  });

  it('falls back to none when no provider signal is present', () => {
    const providers = detect({ 'README.md': '# hi' });
    expect(providers).toEqual(new Set(['none']));
  });
});
