## 1. Project Setup

- [ ] 1.1 Initialize Node.js/TypeScript project (`package.json`, `tsconfig.json`) with a CLI bin entry point
- [ ] 1.2 Add lint/format tooling (e.g., ESLint + Prettier) and a test runner (e.g., Vitest)
- [ ] 1.3 Add a basic `README.md` and `.gitignore`, and initialize the git repo

## 2. File Walker

- [ ] 2.1 Implement a repo file-tree walker that recursively lists files/dirs under a given root
- [ ] 2.2 Exclude `node_modules`, `.git`, `dist`, `build` (and similar) directories from the walk
- [ ] 2.3 Add unit tests for the walker, including exclusion behavior

## 3. Provider Detection (provider-detection)

- [ ] 3.1 Implement `openspec` detection (presence of `openspec/` directory)
- [ ] 3.2 Implement `claude` detection (presence of `CLAUDE.md` and/or `.claude/` directory)
- [ ] 3.3 Implement `universal` fallback (`AGENTS.md` present AND no specific provider detected)
- [ ] 3.4 Implement `none` fallback (no specific provider and no `AGENTS.md`)
- [ ] 3.5 Assemble the detected provider set and make it available before metric evaluation
- [ ] 3.6 Add unit tests for each detection rule and for the fallback/co-occurrence edge cases (e.g., `AGENTS.md` + `.claude/` → `{ claude }` only)

## 4. Metrics Catalog (readiness-metrics)

- [ ] 4.1 Define the metric data shape (`id`, `category`, `description`, `points`, `provider?`, `check`)
- [ ] 4.2 Implement Documentation metrics: README exists, README setup/run/test sections, CONTRIBUTING.md exists
- [ ] 4.3 Implement Architecture metrics: architecture docs exist, ADR/decisions directory exists
- [ ] 4.4 Implement Testing metrics: test suite exists, CI runs tests
- [ ] 4.5 Implement Automation Guard Rails metrics: CI pipeline configured, lint enforced in CI
- [ ] 4.6 Implement AI Context metrics: CLAUDE.md/AGENTS.md exists, AI context shim/import detected
- [ ] 4.7 Implement Maintainability metrics: CODEOWNERS exists, PR template exists
- [ ] 4.8 Implement `provider: openspec` metrics: change design docs present (Architecture), `openspec validate` in CI (Automation Guard Rails), change archive used (Maintainability)
- [ ] 4.9 Implement `provider: claude` metrics: hooks configured (Automation Guard Rails), subagents/skills documented (Maintainability), custom commands documented (Documentation)
- [ ] 4.10 Implement `provider: universal` metric: `AGENTS.md` has Setup/Conventions/Testing sections (AI Context)
- [ ] 4.11 Add unit tests for each metric's pass/fail detection using fixture repo trees, including provider-scoped metrics under each detected-provider combination

## 5. Scoring Engine (readiness-scoring)

- [ ] 5.1 Implement applicability filtering: a metric applies if untagged, or if its `provider` tag is in the detected provider set
- [ ] 5.2 Implement category score aggregation (earned/max points per category, applicable metrics only)
- [ ] 5.3 Implement overall score aggregation (earned/max points across all categories, unweighted)
- [ ] 5.4 Implement letter grade mapping from overall percentage to the A+–F scale
- [ ] 5.5 Assemble the full scoring result structure (per-metric, per-category, overall, grade, detected providers)
- [ ] 5.6 Add unit tests covering applicability filtering, category aggregation, overall aggregation, and grade boundary cases

## 6. CLI (readiness-cli)

- [ ] 6.1 Implement argument parsing: optional repo path (default to cwd), `--json` flag
- [ ] 6.2 Validate the target path exists and is a directory; exit non-zero with an error message if not
- [ ] 6.3 Wire the CLI to run the walker, provider detection, metrics catalog, and scoring engine end-to-end
- [ ] 6.4 Implement the human-readable report renderer (detected providers, per-category breakdown, overall score, grade)
- [ ] 6.5 Implement the `--json` output mode (structured result including providers, no other stdout text)
- [ ] 6.6 Ensure exit code is 0 for any successfully completed scan regardless of grade
- [ ] 6.7 Add integration tests running the CLI against fixture repos (one per provider, plus `none`) and asserting both output modes

## 7. Verification

- [ ] 7.1 Run the CLI against `agentlint-poc` itself and confirm the report renders correctly, including provider detection
- [ ] 7.2 Run the full test suite and confirm all provider, metric, scoring, and CLI tests pass
