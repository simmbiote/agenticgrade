import { execFileSync } from 'node:child_process';

function runGit(rootDir: string, args: string[]): string | null {
  try {
    return execFileSync('git', args, {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return null;
  }
}

/** Subject lines of the most recent `count` commits, newest first. Empty if not a git repo. */
export function getRecentCommitSubjects(rootDir: string, count = 20): string[] {
  const output = runGit(rootDir, ['log', `-${count}`, '--format=%s']);
  if (output === null) return [];
  return output.split('\n').filter((line) => line.length > 0);
}

/** Epoch seconds of the last commit touching `relPath`, or null if none/not a git repo. */
export function getLastCommitTimestamp(rootDir: string, relPath: string): number | null {
  const output = runGit(rootDir, ['log', '-1', '--format=%ct', '--', relPath]);
  if (output === null) return null;
  const trimmed = output.trim();
  if (trimmed === '') return null;
  const seconds = Number.parseInt(trimmed, 10);
  return Number.isNaN(seconds) ? null : seconds;
}
