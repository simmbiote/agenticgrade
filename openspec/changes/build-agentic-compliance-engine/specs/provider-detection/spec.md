## ADDED Requirements

### Requirement: Provider Types
The system SHALL recognize four provider values: `openspec`, `claude`, `universal`, and `none`. A single scan SHALL be able to detect zero or more specific providers (`openspec`, `claude`) simultaneously, plus at most one of `universal` or `none` as a fallback tier.

#### Scenario: Provider set includes multiple specific providers
- **WHEN** a repo contains both an `openspec/` directory and a `CLAUDE.md` file
- **THEN** the detected provider set includes both `openspec` and `claude`

### Requirement: OpenSpec Provider Detection
The system SHALL detect the `openspec` provider when the scanned repo contains an `openspec/` directory (e.g. containing `config.yaml`, `specs/`, or `changes/`).

#### Scenario: OpenSpec directory present
- **WHEN** the repo root contains an `openspec/` directory
- **THEN** `openspec` is included in the detected provider set

#### Scenario: OpenSpec directory absent
- **WHEN** the repo root does not contain an `openspec/` directory
- **THEN** `openspec` is not included in the detected provider set

### Requirement: Claude Provider Detection
The system SHALL detect the `claude` provider when the scanned repo contains a `CLAUDE.md` file at its root and/or a `.claude/` directory.

#### Scenario: CLAUDE.md present
- **WHEN** the repo root contains a `CLAUDE.md` file
- **THEN** `claude` is included in the detected provider set

#### Scenario: .claude directory present
- **WHEN** the repo root contains a `.claude/` directory, even without a root `CLAUDE.md` file
- **THEN** `claude` is included in the detected provider set

### Requirement: Universal Provider Fallback
The system SHALL detect the `universal` provider only when the repo contains an `AGENTS.md` file at its root AND no specific provider (`openspec`, `claude`) was detected. `universal` and any specific provider SHALL NOT both appear in the detected set for the same scan.

#### Scenario: AGENTS.md present with no specific provider
- **WHEN** the repo root contains an `AGENTS.md` file and neither `openspec/` nor `CLAUDE.md`/`.claude/` are present
- **THEN** the detected provider set is exactly `{ universal }`

#### Scenario: AGENTS.md present alongside a specific provider
- **WHEN** the repo root contains both `AGENTS.md` and a `.claude/` directory
- **THEN** the detected provider set is `{ claude }` and does not include `universal`

### Requirement: None Provider Fallback
The system SHALL assign the `none` provider only when no specific provider and no `AGENTS.md`-based `universal` signal were detected.

#### Scenario: No provider signals present
- **WHEN** the repo contains none of `openspec/`, `CLAUDE.md`, `.claude/`, or `AGENTS.md`
- **THEN** the detected provider set is exactly `{ none }`

### Requirement: Detected Providers Exposed to Metrics and Scoring
The system SHALL expose the detected provider set to the metrics catalog and scoring engine so that provider-scoped metrics (see `readiness-metrics`) can be selected and scored correctly (see `readiness-scoring`).

#### Scenario: Provider set available before metric evaluation
- **WHEN** a scan runs
- **THEN** the detected provider set is computed before any provider-scoped metric is evaluated
