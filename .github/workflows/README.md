# GitHub Actions Workflows

This directory contains the CI/CD workflows for the GearMeshing AI Web project.

## Workflows Overview

### `ci.yml` - Main CI Pipeline
The primary continuous integration workflow that runs on every push to `master` and pull requests.

**Jobs:**
1. **lint** - Runs ESLint with zero warnings
2. **format** - Checks code formatting with Prettier
3. **type-check** - Validates TypeScript types
4. **build** - Builds the Next.js project
5. **test-unit** - Runs unit tests (via `run-tests.yml`)
6. **test-component** - Runs component tests (via `run-tests.yml`)
7. **test-integration** - Runs integration tests (via `run-tests.yml`)
8. **test-all** - Runs all tests and verifies coverage threshold (70%)
9. **upload-codecov** - Uploads coverage reports to CodeCov
10. **upload-sonarqube** - Uploads coverage to SonarQube

### `run-tests.yml` - Reusable Test Workflow
A reusable workflow that eliminates duplicated test job logic.

**Purpose:** Parameterized test execution for different test types (unit, component, integration, e2e)

**Inputs:**
- `test-type` (required): Type of tests to run
  - Valid values: `unit`, `component`, `integration`, `e2e`
  - These correspond to npm scripts: `pnpm test:{test-type}:coverage`
- `artifact-name` (required): Name of the coverage artifact to upload
  - Examples: `coverage-unit`, `coverage-component`, `coverage-integration`, `coverage-e2e`

**Steps:**
1. Checkout code with full history
2. Setup environment (Node.js, pnpm)
3. Cache node_modules
4. Cache vitest cache
5. Run tests with coverage: `pnpm test:{test-type}:coverage`
6. Upload coverage artifact

## Usage Examples

### Using the Reusable Workflow in CI

```yaml
test-unit:
  uses: ./.github/workflows/run-tests.yml
  needs: build
  with:
    test-type: unit
    artifact-name: coverage-unit
```

### Adding E2E Tests

To enable E2E tests, uncomment the `test-e2e` job in `ci.yml` and update it to use the reusable workflow:

```yaml
test-e2e:
  uses: ./.github/workflows/run-tests.yml
  needs: build
  with:
    test-type: e2e
    artifact-name: coverage-e2e
```

Then add `test-e2e` to the `needs` array in the `test-all` job.

## Test Types and Scripts

The following test types are supported (based on `package.json` scripts):

| Test Type | Script | Coverage Script |
|-----------|--------|-----------------|
| unit | `pnpm test:unit` | `pnpm test:unit:coverage` |
| component | `pnpm test:component` | `pnpm test:component:coverage` |
| integration | `pnpm test:integration` | `pnpm test:integration:coverage` |
| e2e | `pnpm test:e2e` | `pnpm test:e2e:coverage` |

## Coverage Artifacts

Each test job uploads a coverage artifact:

- `coverage-unit` - Unit test coverage
- `coverage-component` - Component test coverage
- `coverage-integration` - Integration test coverage
- `coverage-e2e` - E2E test coverage
- `coverage-total` - Combined coverage from all tests

These artifacts are downloaded in the `upload-codecov` and `upload-sonarqube` jobs.

## Coverage Threshold

The `test-all` job verifies that total coverage meets the **70% threshold**. If coverage falls below this, the CI pipeline fails.

To adjust the threshold, edit the `THRESHOLD` variable in the `test-all` job in `ci.yml`.

## Caching Strategy

Both workflows use GitHub Actions caching to speed up CI runs:

1. **node_modules cache** - Cached by `pnpm-lock.yaml` hash
   - Key: `${{ runner.os }}-node-${{ hashFiles('**/pnpm-lock.yaml') }}`
   - Restored if lock file hasn't changed

2. **vitest cache** - Cached by commit SHA
   - Key: `${{ runner.os }}-vitest-${{ github.sha }}`
   - Provides faster test runs on the same commit

3. **.next build cache** - Cached by lock file hash
   - Key: `${{ runner.os }}-nextjs-${{ hashFiles('**/pnpm-lock.yaml') }}-${{ github.sha }}`
   - Speeds up Next.js builds

## Benefits of the Reusable Workflow

✅ **DRY Principle** - Eliminates duplicated checkout, setup, and caching steps
✅ **Maintainability** - Single source of truth for test job configuration
✅ **Extensibility** - Easy to add new test types (e.g., e2e) without duplication
✅ **Consistency** - All test jobs follow the same pattern and caching strategy
✅ **Clarity** - Main CI workflow is more readable and focused on orchestration

## Adding a New Test Type

To add a new test type (e.g., `e2e`):

1. Ensure the npm script exists in `package.json`:
   ```json
   "test:e2e:coverage": "vitest run tests/e2e --coverage"
   ```

2. Add the job to `ci.yml`:
   ```yaml
   test-e2e:
     uses: ./.github/workflows/run-tests.yml
     needs: build
     with:
       test-type: e2e
       artifact-name: coverage-e2e
   ```

3. Update the `test-all` job's `needs` array:
   ```yaml
   needs: [test-unit, test-component, test-integration, test-e2e]
   ```

4. Update the `upload-codecov` job to download the new artifact:
   ```yaml
   - name: Download E2E coverage artifacts
     uses: actions/download-artifact@v6
     with:
       name: coverage-e2e
       path: coverage-e2e/
   ```

That's it! The reusable workflow handles all the test execution logic.
