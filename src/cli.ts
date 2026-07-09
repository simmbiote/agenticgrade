#!/usr/bin/env node
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { runScan } from './index.js';
import { renderReport } from './report.js';

interface ParsedArgs {
  targetPath: string;
  json: boolean;
}

export function parseArgs(argv: string[]): ParsedArgs {
  let targetPath = process.cwd();
  let json = false;
  let pathGiven = false;

  for (const arg of argv) {
    if (arg === '--json') {
      json = true;
    } else if (!pathGiven) {
      targetPath = arg;
      pathGiven = true;
    }
  }

  return { targetPath, json };
}

export function main(argv: string[]): number {
  const { targetPath, json } = parseArgs(argv);
  const resolved = path.resolve(targetPath);

  if (!existsSync(resolved) || !statSync(resolved).isDirectory()) {
    console.error(`Error: path does not exist or is not a directory: ${targetPath}`);
    return 1;
  }

  const result = runScan(resolved);
  console.log(json ? JSON.stringify(result, null, 2) : renderReport(result));
  return 0;
}

const isMainModule = process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href;
if (isMainModule) {
  process.exit(main(process.argv.slice(2)));
}
