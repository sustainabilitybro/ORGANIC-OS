# Testing Guide

## Overview

Organic OS uses a comprehensive testing strategy:
- **Frontend**: Vitest + React Testing Library
- **Backend**: Pytest + FastAPI TestClient
- **CI/CD**: GitHub Actions

## Quick Start

```bash
# Install dependencies
make install

# Run all tests
make test

# Run frontend tests
make test-web

# Run backend tests
make test-api
```

## Frontend Testing

### Setup

```bash
cd apps/web
npm install
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Run with coverage
npm run test:coverage
```

### Test Structure

```
apps/web/
├── tests/
│   ├── setup.ts          # Vitest setup (mocks, globals)
│   ├── utils.tsx         # Test utilities and helpers
│   └── hooks/
│       ├── useAuth.test.ts
│       └── useProgress.test.ts
├── vitest.config.ts
└── package.json
```

### Writing Tests

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useMyHook } from '../src/hooks/useMyHook'

describe('useMyHook', () => {
  it('should return expected values', () => {
    const { result } = renderHook(() => useMyHook())
    expect(result.current.value).toBe('expected')
  })
})
```

## Backend Testing

### Setup

```bash
cd apps/api
pip install -r requirements.txt
pip install pytest pytest-asyncio httpx
```

### Running Tests

```bash
# Run all tests
pytest

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=. --cov-report=term-missing
```

### Test Structure

```
apps/api/
├── tests/
│   └── test_api.py       # API endpoint tests
├── conftest.py          # Pytest fixtures
├── pytest.ini
└── requirements.txt
```

### Writing Tests

```python
from fastapi.testclient import TestClient
from apps.api.main import create_app

def test_health_endpoint():
    app = create_app()
    client = TestClient(app)
    
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
```

## CI/CD Pipeline

GitHub Actions runs on every push:

1. **Frontend Test** - Runs Vitest with coverage
2. **Backend Test** - Runs Pytest with coverage  
3. **Build Check** - Verifies Next.js build
4. **Security Scan** - npm audit + pip audit

## Coverage Reports

- **Frontend**: `apps/web/coverage/` (HTML)
- **Backend**: Terminal output or `coverage.xml`

## Best Practices

1. **Write tests for new features**
2. **Maintain >80% coverage on critical paths**
3. **Use meaningful test names**
4. **Mock external services (Supabase, APIs)**
5. **Test edge cases and error conditions**
6. **Keep tests fast (aim for <1s each)**
