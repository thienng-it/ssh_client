# Testing Documentation

This document describes the testing infrastructure for the SSH Client project.

## Test Types

### Unit and Component Tests (Vitest + React Testing Library)

We use **Vitest** and **React Testing Library** for unit and component testing. These tests focus on:
- Individual React components
- Component interactions
- User events and state changes
- Component rendering

#### Running Unit Tests

```bash
# Run tests in watch mode (interactive)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

#### Test Files

- `src/test/App.test.jsx` - Tests for main App component
- `src/test/Sidebar.test.jsx` - Tests for Sidebar component (6 tests)
- `src/test/HostManager.test.jsx` - Tests for HostManager form (7 tests)
- `src/test/Layout.test.jsx` - Tests for Layout component (6 tests)
- `src/test/TerminalView.test.jsx` - Tests for TerminalView component (2 tests)

**Total: 22 unit/component tests**

### End-to-End Tests (Playwright)

We use **Playwright** for E2E testing. These tests verify complete user workflows:
- Application loading
- Navigation between views
- Form submissions
- User interactions

#### Running E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

#### Test Files

- `e2e/app.spec.js` - End-to-end tests for main user flows (7 tests)

## Test Coverage

Current test coverage includes:
- ✅ All main React components
- ✅ Form validation and submission
- ✅ User navigation flows
- ✅ State management
- ✅ Component interactions

## Continuous Integration

### GitHub Actions Workflows

Two workflows are configured to run tests automatically:

#### 1. Pull Request Tests (`.github/workflows/test-pr.yml`)

Runs on every pull request to `main` branch:
- Linting with ESLint
- Unit and component tests
- E2E tests with Playwright
- Build verification
- Coverage reporting

#### 2. Main Branch Tests (`.github/workflows/test-main.yml`)

Runs on every push to `main` branch:
- Linting with ESLint
- Unit and component tests
- E2E tests with Playwright
- Coverage reporting

### Artifacts

Test artifacts are uploaded to GitHub Actions:
- Coverage reports (30 days retention)
- Playwright test reports (30 days retention)
- Build artifacts (7 days retention)

## Writing Tests

### Unit/Component Test Example

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from '../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### E2E Test Example

```javascript
import { test, expect } from '@playwright/test';

test('user can navigate', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Button');
  await expect(page.locator('text=Result')).toBeVisible();
});
```

## Configuration Files

- `vitest.config.js` - Vitest configuration
- `playwright.config.js` - Playwright configuration
- `src/test/setup.js` - Test setup and global configurations

## Best Practices

1. **Write tests for new features** - Every new component should have tests
2. **Test user behavior** - Focus on what users do, not implementation details
3. **Keep tests independent** - Tests should not depend on each other
4. **Use meaningful test names** - Describe what the test validates
5. **Mock external dependencies** - Use mocks for APIs and third-party libraries

## Troubleshooting

### Tests failing locally but passing in CI

- Ensure you have the latest dependencies: `npm ci`
- Clear cache: `rm -rf node_modules && npm install`

### Playwright browser issues

- Install browsers: `npx playwright install chromium --with-deps`

### Coverage not generating

- Ensure coverage package is installed: `npm install -D @vitest/coverage-v8`
