# Code Quality Standards

## Overview

This document defines the code quality standards for Organic OS.

## TypeScript Standards

### Naming Conventions

| Pattern | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `DashboardPage` |
| Hooks | camelCase + `use` prefix | `useAuth` |
| Variables | camelCase | `userProgress` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| Files | kebab-case | `wellness-tracker.tsx` |
| Interfaces | PascalCase, no `I` prefix | `UserResponse` |
| Types | PascalCase | `WellnessStats` |

### React Component Rules

1. **Use `'use client'` for components using hooks**
2. **Export components as default**
3. **Use TypeScript interfaces for props**
4. **Destructuring for props with defaults**
5. **Avoid inline function definitions in JSX**

```tsx
// ✅ Good
interface CardProps {
  title: string
  variant?: 'default' | 'gradient'
}

export function Card({ title, variant = 'default' }: CardProps) {
  return <div>{title}</div>
}

// ❌ Avoid
export const Card = (props) => <div>{props.title}</div>
```

### Import Order

```tsx
// 1. React imports
import { useState, useEffect } from 'react'

// 2. Next.js imports
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// 3. Absolute imports (library + custom)
import { format } from 'date-fns'
import { useAuth } from '@/hooks/useAuth'

// 4. Relative imports
import { Card } from '../components/ui'
```

## Python Standards (FastAPI)

### Naming Conventions

| Pattern | Convention | Example |
|---------|------------|---------|
| Functions | snake_case | `get_user_progress` |
| Classes | PascalCase | `WellnessStats` |
| Variables | snake_case | `user_id` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRIES` |
| Private methods | `_internal_method` | `_validate_input` |

### FastAPI Patterns

```python
# ✅ Good - Using Pydantic models
from pydantic import BaseModel
from typing import Optional

class WellnessEntryCreate(BaseModel):
    date: date
    sleep_hours: Optional[float] = None
    mood_score: Optional[float] = None

@router.post("/entries")
async def create_entry(entry: WellnessEntryCreate):
    ...

# ❌ Avoid - Raw dict parameters
@router.post("/entries")
async def create_entry(data: dict):
    ...
```

### Import Order (Python)

```python
# Standard library
from datetime import datetime
from typing import Optional, List

# Third party
from fastapi import APIRouter
from pydantic import BaseModel

# Local
from ..routes import wellness
```

## Code Organization

### Frontend Structure

```
src/
├── app/                    # App Router pages
│   ├── page.tsx            # Home page
│   └── dashboard/
│       ├── page.tsx        # Dashboard
│       └── layout.tsx      # Dashboard layout
├── components/
│   └── ui/                 # Reusable UI components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities & configs
└── types/                   # TypeScript types
```

### Backend Structure

```
api/
├── routes/                  # API endpoints
│   ├── auth.py
│   ├── wellness.py
│   ├── progress.py
│   └── modules.py
├── schemas/                 # Pydantic models
├── services/                # Business logic
└── main.py                  # App factory
```

## Error Handling

### Frontend

```tsx
// ✅ Good - Proper error states
const [error, setError] = useState<string | null>(null)

if (error) {
  return <ErrorMessage message={error} />
}

// ❌ Avoid - Console only errors
console.error('Failed to fetch:', error)
```

### Backend

```python
# ✅ Good - Proper HTTP exceptions
from fastapi import HTTPException, status

if not user:
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User not found"
    )

# ❌ Avoid - Generic exceptions
raise Exception("User not found")
```

## Performance

### React Optimization

1. **Use `useMemo` for expensive computations**
2. **Use `useCallback` for stable function references**
3. **Lazy load routes with `next/dynamic`**
4. **Avoid unnecessary re-renders**

```tsx
// ✅ Good
const memoizedValue = useMemo(() => expensiveComputation(a, b), [a, b])

// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

### Database Queries

```python
# ✅ Good - Specific selects
result = await supabase.from('users').select('id,email').eq('id', user_id).single()

# ❌ Avoid - Select all
result = await supabase.from('users').select().eq('id', user_id).single()
```

## Testing Requirements

| Type | Minimum Coverage | Location |
|------|-----------------|----------|
| Unit tests | 70% | `tests/unit/` |
| Integration tests | 50% | `tests/integration/` |
| API endpoints | 80% | `tests/api/` |

## Documentation

### Comments

- Use JSDoc for functions
- Explain "why", not "what"
- Document complex logic
- Keep comments up to date

```tsx
// ✅ Good
/**
 * Calculates wellness score based on sleep, mood, and activity.
 * Uses weighted average with sleep at 40%, mood at 35%, activity at 25%.
 */
function calculateWellnessScore(data: WellnessData): number {
```

### README Requirements

Each module should have:
- Purpose description
- API endpoints / Component props
- Usage examples
- Dependencies

## Git Commits

### Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting (no code change)
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

### Examples

```
feat(auth): add OAuth login support
fix(wellness): resolve streak calculation bug
docs(readme): update API documentation
refactor(progress): simplify module progress logic
test(api): add wellness endpoint tests
```

## Linting Commands

```bash
# Frontend
npm run lint          # Check for issues
npm run lint:fix      # Auto-fix issues

# Backend  
flake8 apps/api       # Check Python code
black apps/api        # Auto-format code
```

## Pre-commit Hooks

Before committing:

```bash
# Run linting
npm run lint

# Run tests
npm run test:run

# Type checking
npm run type-check
```
