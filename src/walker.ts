import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const ALWAYS_EXCLUDED_DIRS = new Set(['node_modules', '.git']);
const ROOT_ONLY_EXCLUDED_DIRS = new Set(['dist', 'build']);

/**
 * Recursively lists files under `rootDir`, relative to it, using POSIX separators.
 * `node_modules`/`.git` are skipped at any depth; `dist`/`build` are only skipped
 * at the repo root, so nested generated output can still be flagged by metrics
 * like "no generated files mixed with source".
 */
export function walk(rootDir: string): string[] {
  const files: string[] = [];

  const visit = (dir: string, relDir: string, depth: number): void => {
    let entries;
    try {
      entries = readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const relPath = relDir ? `${relDir}/${entry.name}` : entry.name;

      if (entry.isDirectory()) {
        if (ALWAYS_EXCLUDED_DIRS.has(entry.name)) continue;
        if (depth === 0 && ROOT_ONLY_EXCLUDED_DIRS.has(entry.name)) continue;
        visit(path.join(dir, entry.name), relPath, depth + 1);
      } else if (entry.isFile()) {
        files.push(relPath);
      } else if (entry.isSymbolicLink()) {
        try {
          if (statSync(path.join(dir, entry.name)).isFile()) {
            files.push(relPath);
          }
        } catch {
          // broken symlink, skip
        }
      }
    }
  };

  visit(rootDir, '', 0);
  return files;
}
