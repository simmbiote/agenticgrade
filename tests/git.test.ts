import { describe, it, expect, afterEach } from 'vitest';
import { getLastCommitTimestamp, getRecentCommitSubjects } from '../src/git.js';
import { createFixture, type Fixture } from './helpers/fixture.js';
import { commitAll, initGitRepo } from './helpers/gitFixture.js';

describe('git adapter', () => {
  let fixture: Fixture | undefined;

  afterEach(() => {
    fixture?.cleanup();
    fixture = undefined;
  });

  it('returns empty subjects for a non-git directory', () => {
    fixture = createFixture({ 'README.md': '# hi' });
    expect(getRecentCommitSubjects(fixture.root)).toEqual([]);
  });

  it('returns null timestamp for a non-git directory', () => {
    fixture = createFixture({ 'README.md': '# hi' });
    expect(getLastCommitTimestamp(fixture.root, 'README.md')).toBeNull();
  });

  it('reads recent commit subjects newest first', () => {
    fixture = createFixture({ 'README.md': '# hi' });
    initGitRepo(fixture.root);
    commitAll(fixture.root, 'chore: first');
    commitAll(fixture.root, 'feat: second');

    const subjects = getRecentCommitSubjects(fixture.root, 5);

    expect(subjects[0]).toBe('feat: second');
    expect(subjects[1]).toBe('chore: first');
  });

  it('reads the last commit timestamp for a specific path', () => {
    fixture = createFixture({ 'README.md': '# hi', 'docs/notes.md': 'notes' });
    initGitRepo(fixture.root);
    commitAll(fixture.root, 'chore: init', '2020-01-01T00:00:00Z');

    const ts = getLastCommitTimestamp(fixture.root, 'docs/notes.md');

    expect(ts).toBe(Math.floor(new Date('2020-01-01T00:00:00Z').getTime() / 1000));
  });
});
