# agentlint

Scans a repository and scores its agentic-coding readiness — whether the repo has
what an AI coding agent needs to work well unaided — across six categories:
Documentation, Architecture, Testing, Automation Guard Rails, AI Context, and
Maintainability.

The scan also detects which agentic-tooling provider convention a repo uses
(`openspec`, `claude`, a generic `AGENTS.md`-based `universal` setup, or `none`)
and applies provider-specific bonus metrics on top of the base catalog.

See [docs/METRICS.md](docs/METRICS.md) for the full metric reference — every metric's
description, fix instruction, and remediation explanation in one table.

## Setup

```bash
npm install
npm run build
```

## Run

```bash
npx agentlint scan [path]             # human-readable report, defaults to the current directory
npx agentlint scan [path] --json      # structured JSON output
npx agentlint scan [path] --summary   # condensed report: overall, top improvements, providers, category totals — no per-metric detail
npx agentlint scan [path] --detailed  # expanded report: each failing metric is followed by a remediation explanation
```

`--summary` can be combined with `--json` to trim the JSON output the same way: each entry in `categories` omits its `metrics` array.

`--detailed` can be combined with `--json` to add a `remediation` field to each metric result; without `--detailed`, JSON metric results have no `remediation` field. `--detailed` has no effect when `--summary` is also set, since `--summary` already omits per-metric output entirely.

During development, run directly against source without building:

```bash
npm run dev -- scan [path]
```

> **Known issue:** `npx agentlint scan [path]` currently exits silently with no output.
> `dist/cli.js`'s main-module check (`import.meta.url === new URL(process.argv[1], 'file:').href`)
> fails when the CLI is invoked through the `node_modules/.bin/agentlint` symlink that `npx`
> uses, because `import.meta.url` resolves through the symlink to a different path than
> `process.argv[1]`. Until that's fixed, run the built CLI directly instead:
>
> ```bash
> npm run build
> node dist/cli.js scan [path]        # e.g. node dist/cli.js scan . to score this repo
> node dist/cli.js scan [path] --json
> ```

## Test

```bash
npm test
```
