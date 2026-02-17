# __tests__ Directory

This directory contains all test files organized by type.

## Structure

- **`unit/`** - Unit tests for pure functions and utilities
  - Test individual functions in isolation
  - Mock external dependencies
  - Fast and focused tests

- **`components/`** - Component tests
  - Test React component rendering and behavior
  - Test user interactions
  - Use React Testing Library

- **`integration/`** - Integration tests
  - Test complete workflows (auth flows, database operations)
  - Test interactions between multiple components/functions
  - May test against real or mocked Supabase instance

- **`helpers/`** - Test utilities and mocks
  - Mock Supabase client
  - Test utility functions
  - Custom test fixtures

## Testing Guidelines

- Test file names match source file + `.test.ts(x)` suffix
- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Mock external dependencies (Supabase, APIs)
- Test both happy paths and error cases
- Aim for >80% coverage on critical paths

## Running Tests

```bash
npm run test          # Run all tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```
