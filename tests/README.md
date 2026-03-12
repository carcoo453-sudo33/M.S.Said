# Portfolio Application Test Suite

This directory contains comprehensive test suites for the Portfolio application using TestSprite and Jest.

## Prerequisites

- Both applications running:
  - Backend API: `http://localhost:5283/api`
  - Frontend: `http://localhost:4200`
- TestSprite MCP configured with API key in `.kiro/settings/mcp.json`
- Test credentials configured

## Test Files

### 1. `portfolio-api.test.ts`
Jest-based test suite covering all API endpoints:
- **Authentication**: Login with valid/invalid credentials
- **Bio**: Get and update bio information
- **Projects**: CRUD operations on projects
- **Blog**: Blog post management
- **Education**: Education records
- **Skills**: Skills management
- **Services**: Services listing
- **Categories**: Category management
- **Contact**: Contact form submission
- **Notifications**: Notification retrieval

### 2. `testsprite-config.json`
TestSprite configuration file with:
- Base URLs for API and frontend
- Test credentials
- Organized test suites by feature
- Performance thresholds
- Report settings

## Running Tests

### Using Jest
```bash
npm test -- tests/portfolio-api.test.ts
```

### Using TestSprite MCP
TestSprite can be invoked through the MCP interface to run tests with:
- Automated test execution
- Visual test reports
- Performance monitoring
- Screenshot capture
- Detailed logging

## Test Coverage

The test suite covers:

### API Endpoints (14 controllers, 60+ endpoints)
- ✅ Authentication (Login)
- ✅ Bio Management
- ✅ Projects (CRUD)
- ✅ Blog Posts (CRUD)
- ✅ Education Records
- ✅ Skills
- ✅ Services
- ✅ Categories
- ✅ Contact Messages
- ✅ Notifications
- ✅ References
- ✅ Niches
- ✅ Reactions
- ✅ Comments

### Frontend Pages
- ✅ Home page
- ✅ Login page
- ✅ Projects page
- ✅ Blog page
- ✅ Education page
- ✅ Contact page

## Test Credentials

```
Email: m.ssaid356@gmail.com
Password: Memo@3560
```

## Performance Thresholds

- API Response Time: 2000ms
- Frontend Load Time: 5000ms

## Test Results

After running tests, check:
1. Console output for test results
2. Generated HTML report (if enabled)
3. TestSprite dashboard for detailed metrics

## Troubleshooting

### Connection Refused
- Ensure both applications are running
- Check ports: API (5283), Frontend (4200)

### Authentication Failures
- Verify test credentials in `.kiro/settings/mcp.json`
- Check JWT token expiration

### Timeout Errors
- Increase timeout thresholds in test configuration
- Check application performance

## Adding New Tests

1. Add test case to `portfolio-api.test.ts` or `testsprite-config.json`
2. Follow existing test patterns
3. Include assertions for response validation
4. Run tests to verify

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:
```bash
npm test -- tests/portfolio-api.test.ts --coverage
```

## Documentation

For more details on API endpoints, see: `docs/API_INTEGRATION.md`
