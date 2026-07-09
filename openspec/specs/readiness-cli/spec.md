# readiness-cli Specification

## Purpose

Provide the command-line interface for scanning a repository, driving the full metric catalog against it, and reporting the resulting readiness score either as a human-readable report or as structured JSON.

## Requirements

### Requirement: Scan Target Repo Path

The system SHALL accept a local filesystem path to a repository as a command-line argument and run the full metric catalog against that path. If no path is given, it SHALL default to the current working directory.

#### Scenario: Explicit path scanned

- **WHEN** the CLI is invoked with a path argument pointing to a valid directory
- **THEN** the scanner walks that directory and evaluates all metrics against it

#### Scenario: Default to current directory

- **WHEN** the CLI is invoked with no path argument
- **THEN** the scanner walks the current working directory

#### Scenario: Invalid path rejected

- **WHEN** the CLI is invoked with a path that does not exist or is not a directory
- **THEN** the CLI exits with a non-zero status and prints an error message, without attempting to score

### Requirement: Excluded Directories

The system SHALL exclude common vendored/generated directories (at minimum `node_modules`, `.git`, `dist`, `build`) from the filesystem walk used for metric detection.

#### Scenario: Vendored directory contents ignored

- **WHEN** a repo contains a `node_modules/` directory with files that would otherwise match a metric's detection rule
- **THEN** those files are not considered when evaluating metrics

### Requirement: Human-Readable Report Output

The system SHALL, by default, print a human-readable report to stdout showing each category's earned/max score, the metrics within it and their pass/fail status, and the overall score and letter grade.

#### Scenario: Report shows category and metric breakdown

- **WHEN** a scan completes
- **THEN** the printed report lists each of the six categories with its earned/max score, and lists each metric under its category with pass/fail status

#### Scenario: Report shows overall grade

- **WHEN** a scan completes
- **THEN** the printed report includes the overall earned/max score and the final letter grade

#### Scenario: Report shows detected providers

- **WHEN** a scan completes with a non-empty detected provider set (e.g. `{ openspec, claude }`)
- **THEN** the printed report states which provider(s) were detected before the category breakdown

#### Scenario: Report flags no provider detected

- **WHEN** a scan completes with the detected provider set `{ none }`
- **THEN** the printed report states that no agentic provider was detected and that AI Context scoring reflects base metrics only

### Requirement: JSON Output Mode

The system SHALL support a `--json` flag that, when passed, emits the scoring result as structured JSON to stdout instead of the human-readable report, and suppresses other non-JSON output.

#### Scenario: JSON flag emits structured result

- **WHEN** the CLI is invoked with `--json`
- **THEN** stdout contains a single JSON document representing the scoring result (per-metric, per-category, overall, grade, and detected providers) and no other text

### Requirement: Process Exit Code

The system SHALL exit with status code 0 after successfully producing a report, regardless of the grade achieved. It SHALL exit with a non-zero status only when the scan itself fails to run (e.g., invalid path).

#### Scenario: Low grade still exits zero

- **WHEN** a scan completes successfully and the resulting grade is "F"
- **THEN** the CLI process exits with status code 0
