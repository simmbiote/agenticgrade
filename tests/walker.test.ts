import { describe, it, expect, afterEach } from 'vitest';
import { walk } from '../src/walker.js';
import { createFixture, type Fixture } from './helpers/fixture.js';

describe('walk', () => {
  let fixture: Fixture | undefined;

  afterEach(() => {
    fixture?.cleanup();
    fixture = undefined;
  });

  it('lists files recursively with posix-relative paths', () => {
    fixture = createFixture({
      'README.md': '# hi',
      'src/index.ts': 'export {}',
      'src/nested/deep.ts': 'export {}',
    });

    const files = walk(fixture.root);

    expect(files).toContain('README.md');
    expect(files).toContain('src/index.ts');
    expect(files).toContain('src/nested/deep.ts');
  });

  it('excludes node_modules and .git at any depth', () => {
    fixture = createFixture({
      'node_modules/pkg/index.js': 'noop',
      '.git/HEAD': 'ref: refs/heads/main',
      'src/node_modules/nested/index.js': 'noop',
      'src/index.ts': 'export {}',
    });

    const files = walk(fixture.root);

    expect(files.some((f) => f.includes('node_modules'))).toBe(false);
    expect(files.some((f) => f.includes('.git/'))).toBe(false);
    expect(files).toContain('src/index.ts');
  });

  it('excludes dist/build only at the repo root, not nested copies', () => {
    fixture = createFixture({
      'dist/bundle.js': 'noop',
      'build/out.js': 'noop',
      'src/dist/generated.js': 'noop',
    });

    const files = walk(fixture.root);

    expect(files).not.toContain('dist/bundle.js');
    expect(files).not.toContain('build/out.js');
    expect(files).toContain('src/dist/generated.js');
  });
});
