## ADDED Requirements

### Requirement: Metric Catalog Structure
The system SHALL define a metrics catalog grouped into exactly six categories: Documentation, Architecture, Testing, Automation Guard Rails, AI Context, and Maintainability. Each metric in the catalog SHALL have a unique id, a category, a point value greater than zero, a human-readable description, an optional `provider` tag, and a detection rule that operates on a scanned repo file tree.

#### Scenario: Catalog covers all six categories
- **WHEN** the metrics catalog is loaded
- **THEN** it contains at least one metric for each of Documentation, Architecture, Testing, Automation Guard Rails, AI Context, and Maintainability

#### Scenario: Metric ids are unique
- **WHEN** the metrics catalog is loaded
- **THEN** no two metrics share the same id

### Requirement: Provider-Scoped Metrics
A metric MAY carry a `provider` tag with value `openspec`, `claude`, or `universal`. A metric with no `provider` tag is a base metric that applies to every scan regardless of detected providers (see `provider-detection`). A metric with a `provider` tag SHALL only be applicable — and therefore only counted in scoring — when that provider is present in the repo's detected provider set. Provider-scoped metrics are not restricted to the AI Context category; they MAY appear in any of the six categories.

#### Scenario: Base metric always applies
- **WHEN** a metric has no `provider` tag
- **THEN** it is evaluated and counted in every scan regardless of which providers are detected

#### Scenario: Provider-scoped metric applies when its provider is detected
- **WHEN** a metric is tagged `provider: openspec` and the repo's detected provider set includes `openspec`
- **THEN** the metric is evaluated and counted toward both the earned and max score

#### Scenario: Provider-scoped metric is excluded when its provider is absent
- **WHEN** a metric is tagged `provider: claude` and the repo's detected provider set does not include `claude`
- **THEN** the metric is excluded entirely from scoring — it counts toward neither earned nor max points

#### Scenario: Provider-scoped metrics span multiple categories
- **WHEN** the catalog defines `provider: openspec` metrics in the Architecture, Automation Guard Rails, and Maintainability categories
- **THEN** each is evaluated independently within its own category whenever `openspec` is detected

### Requirement: Documentation Category Metrics
The system SHALL measure whether repo knowledge is explicit and versioned, including at minimum: README existence, README section coverage (Setup, Run, Test), and CONTRIBUTING.md existence.

#### Scenario: README existence detected
- **WHEN** scanning a repo that contains a `README.md` (or `README`) at its root
- **THEN** the "README exists" metric is marked passed and its points are awarded

#### Scenario: README missing
- **WHEN** scanning a repo without a README file at its root
- **THEN** the "README exists" metric is marked failed and awards zero points

#### Scenario: README section coverage detected
- **WHEN** the README contains headings matching Setup, Run, and Test (case-insensitive, any heading level)
- **THEN** the "README has setup/run/test sections" metric is marked passed

#### Scenario: CONTRIBUTING.md existence detected
- **WHEN** scanning a repo that contains a `CONTRIBUTING.md` file at its root
- **THEN** the "CONTRIBUTING.md exists" metric is marked passed

### Requirement: Architecture Category Metrics
The system SHALL measure whether architectural intent is discoverable and protected, including at minimum: presence of architecture documentation (e.g., `ARCHITECTURE.md` or an `/docs/architecture` directory) and presence of recorded architecture decisions (e.g., an `adr/` or `decisions/` directory).

#### Scenario: Architecture documentation detected
- **WHEN** scanning a repo that contains an `ARCHITECTURE.md` file or a directory matching `docs/architecture*`
- **THEN** the "architecture documentation exists" metric is marked passed

#### Scenario: Architecture decision records detected
- **WHEN** scanning a repo that contains a directory matching `adr/` or `decisions/` with at least one file inside
- **THEN** the "architecture decision records exist" metric is marked passed

### Requirement: Testing Category Metrics
The system SHALL measure whether an agent can verify its own work, including at minimum: presence of a test directory or recognizable test framework config, and presence of a CI workflow that runs tests.

#### Scenario: Test suite presence detected
- **WHEN** scanning a repo that contains a `test/`, `tests/`, `spec/`, or `__tests__/` directory, or a recognized test framework config file
- **THEN** the "test suite exists" metric is marked passed

#### Scenario: CI test execution detected
- **WHEN** scanning a repo whose CI workflow files (e.g., `.github/workflows/*.yml`) contain a step that runs a test command
- **THEN** the "CI runs tests" metric is marked passed

### Requirement: Automation Guard Rails Category Metrics
The system SHALL measure whether automated guardrails are in place, including at minimum: a CI pipeline configuration, and a lint/format check enforced in CI.

#### Scenario: CI pipeline detected
- **WHEN** scanning a repo that contains at least one CI workflow configuration file (e.g., `.github/workflows/*.yml`, `.gitlab-ci.yml`)
- **THEN** the "CI pipeline configured" metric is marked passed

#### Scenario: Lint enforcement detected
- **WHEN** a CI workflow file contains a step that runs a lint or format-check command
- **THEN** the "lint enforced in CI" metric is marked passed

### Requirement: AI Context Category Metrics
The system SHALL measure whether Claude or other coding agents have explicit repo-level guidance, including at minimum: presence of a `CLAUDE.md` or `AGENTS.md` file (or a shim/import between them) at the repo root.

#### Scenario: AI context file detected
- **WHEN** scanning a repo that contains a `CLAUDE.md` or `AGENTS.md` file at its root
- **THEN** the "AI context file exists" metric is marked passed

#### Scenario: AI context shim detected
- **WHEN** a repo contains both `CLAUDE.md` and `AGENTS.md`, and one imports or references the other
- **THEN** the "AI context shim/import" metric is marked passed

### Requirement: Maintainability Category Metrics
The system SHALL measure whether future changes are reviewable and safe, including at minimum: presence of a `CODEOWNERS` file and presence of a pull request template.

#### Scenario: CODEOWNERS detected
- **WHEN** scanning a repo that contains a `CODEOWNERS` file (at root or under `.github/`)
- **THEN** the "CODEOWNERS exists" metric is marked passed

#### Scenario: PR template detected
- **WHEN** scanning a repo that contains a pull request template under `.github/`
- **THEN** the "PR template exists" metric is marked passed

### Requirement: OpenSpec Provider Metrics
When `openspec` is in the detected provider set, the system SHALL evaluate OpenSpec-specific metrics spanning multiple categories: an Architecture metric for change-level design docs, an Automation Guard Rails metric for CI-enforced validation, and a Maintainability metric for archive hygiene.

#### Scenario: Change design docs detected (Architecture)
- **WHEN** `openspec` is detected and at least one entry under `openspec/changes/*/design.md` exists
- **THEN** the "OpenSpec design docs present" metric is marked passed

#### Scenario: Validate wired into CI (Automation Guard Rails)
- **WHEN** `openspec` is detected and a CI workflow file contains a step running `openspec validate`
- **THEN** the "OpenSpec validate enforced in CI" metric is marked passed

#### Scenario: Archive hygiene detected (Maintainability)
- **WHEN** `openspec` is detected and `openspec/changes/archive/` contains at least one archived change
- **THEN** the "OpenSpec change archive used" metric is marked passed

### Requirement: Claude Provider Metrics
When `claude` is in the detected provider set, the system SHALL evaluate Claude-specific metrics spanning multiple categories: an Automation Guard Rails metric for configured hooks, a Maintainability metric for documented subagents/skills, and a Documentation metric for documented custom commands.

#### Scenario: Hooks configured (Automation Guard Rails)
- **WHEN** `claude` is detected and `.claude/settings.json` (or `.claude/settings.local.json`) defines at least one hook
- **THEN** the "Claude hooks configured" metric is marked passed

#### Scenario: Custom subagents or skills documented (Maintainability)
- **WHEN** `claude` is detected and `.claude/agents/` or `.claude/skills/` contains at least one definition file
- **THEN** the "Claude subagents/skills documented" metric is marked passed

#### Scenario: Custom commands documented (Documentation)
- **WHEN** `claude` is detected and `.claude/commands/` contains at least one command file
- **THEN** the "Claude custom commands documented" metric is marked passed

### Requirement: Universal Provider Metrics
When `universal` is in the detected provider set, the system SHALL evaluate a Universal-specific AI Context metric checking that `AGENTS.md` covers the sections an agent needs to work unaided.

#### Scenario: AGENTS.md section coverage detected
- **WHEN** `universal` is detected and `AGENTS.md` contains headings matching Setup, Conventions, and Testing (case-insensitive, any heading level)
- **THEN** the "AGENTS.md has required sections" metric is marked passed

### Requirement: No-Provider Fallback Behavior
When the detected provider set is exactly `{ none }`, the system SHALL NOT evaluate any provider-scoped metric. Base AI Context metrics (e.g. "AI context file exists") still run and are expected to fail, reflecting that no dedicated agent-context file was found.

#### Scenario: No provider-scoped metrics run
- **WHEN** the detected provider set is `{ none }`
- **THEN** no `provider`-tagged metric is evaluated, and the AI Context category score reflects only base metrics
