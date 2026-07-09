import { execFileSync } from 'node:child_process';

export function initGitRepo(root: string): void {
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: root });
  execFileSync('git', ['config', 'user.name', 'Test'], { cwd: root });
}

export function commitAll(root: string, message: string, dateISO?: string): void {
  execFileSync('git', ['add', '-A'], { cwd: root });
  const env = dateISO
    ? { ...process.env, GIT_AUTHOR_DATE: dateISO, GIT_COMMITTER_DATE: dateISO }
    : process.env;
  execFileSync('git', ['commit', '-q', '-m', message, '--allow-empty'], { cwd: root, env });
}
