## ADDED Requirements

### Requirement: Category Score Aggregation

The system SHALL compute a category score for each of the six categories as the sum of points earned by all passed _applicable_ metrics within that category, alongside the maximum possible score for that category (sum of all _applicable_ metric points in the category, regardless of pass/fail). A metric is applicable if it has no `provider` tag, or if its `provider` tag is present in the repo's detected provider set (see `provider-detection` and the Provider-Scoped Metrics requirement in `readiness-metrics`). Metrics whose provider is not detected SHALL be excluded from both the earned and max totals.

#### Scenario: Category score sums passed metric points

- **WHEN** two of three Documentation metrics pass, worth 10 and 15 points respectively, and the third (10 points) fails
- **THEN** the Documentation category score is 25 out of a possible 35

#### Scenario: Category with no passing metrics scores zero

- **WHEN** every applicable metric in a category fails
- **THEN** that category's earned score is 0, and its max possible score equals the sum of all its applicable metric points

#### Scenario: Non-applicable provider metrics excluded from category max

- **WHEN** a category contains a `provider: claude` metric worth 10 points and `claude` is not in the detected provider set
- **THEN** that metric contributes 0 to both the earned and max score for the category

### Requirement: Overall Score Aggregation

The system SHALL compute an overall score as the sum of all category earned scores, and an overall maximum as the sum of all category max scores, across all six categories, using each category's applicable-metric totals (see Category Score Aggregation). Categories SHALL NOT be weighted differently from one another. Because provider-scoped metrics are only applicable when their provider is detected, the overall max score is repo-specific and SHALL NOT be compared across repos with different detected providers as if it were a fixed constant.

#### Scenario: Overall score sums all categories

- **WHEN** each of the six categories has an earned score and a max score
- **THEN** the overall earned score equals the sum of all six category earned scores, and the overall max score equals the sum of all six category max scores

#### Scenario: Overall max varies with detected providers

- **WHEN** two repos are scanned, one with `openspec` detected (unlocking extra applicable points) and one with no provider detected
- **THEN** the two repos' overall max scores may differ, reflecting the different sets of applicable metrics

### Requirement: Detected Providers in Scoring Result

The scoring result SHALL include the repo's detected provider set (see `provider-detection`) alongside the per-metric, per-category, and overall totals.

#### Scenario: Scoring result reports detected providers

- **WHEN** a scan detects `{ openspec }` as the provider set
- **THEN** the scoring result includes `providers: ["openspec"]`

### Requirement: Letter Grade Mapping

The system SHALL map the overall score to a letter grade based on the percentage of overall earned score over overall max score, using the scale: A+ (>=97%), A (93-96%), A- (90-92%), B+ (87-89%), B (83-86%), B- (80-82%), C+ (77-79%), C (73-76%), C- (70-72%), D+ (67-69%), D (60-66%), F (<60%).

#### Scenario: Perfect score yields A+

- **WHEN** the overall earned score equals the overall max score (100%)
- **THEN** the reported grade is "A+"

#### Scenario: Zero score yields F

- **WHEN** the overall earned score is 0
- **THEN** the reported grade is "F"

#### Scenario: Boundary percentage maps to correct grade

- **WHEN** the overall percentage is exactly 90%
- **THEN** the reported grade is "A-", consistent with the defined scale boundaries

### Requirement: Scoring Result Structure

The system SHALL produce a scoring result containing, at minimum: per-metric pass/fail status and points, per-category earned/max scores, the overall earned/max score, and the final letter grade.

#### Scenario: Scoring result includes all required fields

- **WHEN** the scoring engine finishes evaluating a repo
- **THEN** the result includes per-metric outcomes, per-category totals, an overall total, and a letter grade
