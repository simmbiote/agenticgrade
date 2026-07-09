import { readFileSync } from 'node:fs';
import path from 'node:path';
import { walk } from './walker.js';
import { getLastCommitTimestamp, getRecentCommitSubjects } from './git.js';
import type { ProviderId } from './providers.js';

export interface FileIndex {
  rootDir: string;
  files: string[];
  hasPath(prefix: string): boolean;
  hasFile(...names: string[]): boolean;
  findFiles(regex: RegExp): string[];
  read(relPath: string): string | null;
  readAny(names: string[]): string | null;
}

export interface ScanContext extends FileIndex {
  providers: Set<ProviderId>;
  recentCommitSubjects: string[];
  lastCommitTimestamp(relPath: string): number | null;
}

/** True if any file is exactly `prefix`, or lives under a `prefix/` directory. */
export function hasPathIn(files: string[], prefix: string): boolean {
  const normalized = prefix.replace(/\/$/, '');
  return files.some((f) => f === normalized || f.startsWith(`${normalized}/`));
}

export function createFileIndex(rootDir: string): FileIndex {
  const files = walk(rootDir);

  return {
    rootDir,
    files,
    hasPath(prefix: string) {
      return hasPathIn(files, prefix);
    },
    hasFile(...names: string[]) {
      return names.some((name) => files.includes(name));
    },
    findFiles(regex: RegExp) {
      return files.filter((f) => regex.test(f));
    },
    read(relPath: string) {
      if (!files.includes(relPath)) return null;
      try {
        return readFileSync(path.join(rootDir, relPath), 'utf8');
      } catch {
        return null;
      }
    },
    readAny(names: string[]) {
      for (const name of names) {
        if (files.includes(name)) {
          try {
            return readFileSync(path.join(rootDir, name), 'utf8');
          } catch {
            // try next candidate
          }
        }
      }
      return null;
    },
  };
}

export function createScanContext(
  rootDir: string,
  providers: Set<ProviderId>,
  fileIndex?: FileIndex,
): ScanContext {
  const index = fileIndex ?? createFileIndex(rootDir);
  const recentCommitSubjects = getRecentCommitSubjects(rootDir);

  return {
    ...index,
    providers,
    recentCommitSubjects,
    lastCommitTimestamp(relPath: string) {
      return getLastCommitTimestamp(rootDir, relPath);
    },
  };
}
