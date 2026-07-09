# agentlint

Scans a repository and scores its agentic-coding readiness — whether the repo has
what an AI coding agent needs to work well unaided — across six categories:
Documentation, Architecture, Testing, Automation Guard Rails, AI Context, and
Maintainability.

The scan also detects which agentic-tooling provider convention a repo uses
(`openspec`, `claude`, a generic `AGENTS.md`-based `universal` setup, or `none`)
and applies provider-specific bonus metrics on top of the base catalog.

## Setup

```bash
npm install
npm run build
```

## Run

```bash
npx agentlint [path]        # human-readable report, defaults to the current directory
npx agentlint [path] --json # structured JSON output
```

During development, run directly against source without building:

```bash
npm run dev -- [path]
```

## Test

```bash
npm test
```
