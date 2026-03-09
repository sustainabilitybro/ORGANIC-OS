# Contributing to Organic OS

Thank you for your interest in contributing to Organic OS!

## Development Workflow

### 1. Fork and Clone

```bash
git clone https://github.com/sustainabilitybro/ORGANIC-OS.git
cd ORGANIC-OS
```

### 2. Set Up Development Environment

```bash
# Install all dependencies
bash scripts/setup-full.sh

# Or manually
npm install
cd apps/web && npm install && cd ../..
cd apps/api && pip install -r requirements.txt
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 4. Make Changes

Follow the code style:
- **Python:** Black, flake8, isort
- **TypeScript:** ESLint, Prettier
- **Commit messages:** Conventional commits

```bash
# Lint before committing
npm run lint  # Frontend
flake8 apps/api/  # Backend
```

### 5. Write Tests

```bash
# Frontend tests
cd apps/web
npm run test

# Backend tests
cd apps/api
pytest
```

### 6. Commit Changes

We use Conventional Commits:

```bash
git add .
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update documentation"
git commit -m "refactor: improve code structure"
git commit -m "test: add unit tests"
git commit -m "chore: update dependencies"
```

### 7. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub.

## Code Standards

### Python

```python
# Use type hints
def get_user(user_id: int) -> User:
    """Get user by ID.
    
    Args:
        user_id: The user's unique identifier.
    
    Returns:
        User object if found.
    
    Raises:
        ValueError: If user_id is invalid.
    """
    if user_id <= 0:
        raise ValueError("Invalid user ID")
    return User(id=user_id)
```

### TypeScript

```typescript
// Use interfaces over types for objects
interface User {
  id: string;
  email: string;
  name?: string;
}

// Use arrow functions for callbacks
const getUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/users');
  return response.json();
};
```

## Project Structure

```
ORGANIC-OS/
├── apps/
│   ├── web/          # Next.js frontend
│   ├── api/          # FastAPI backend
│   └── supabase/    # Database migrations
├── packages/         # Shared packages
├── scripts/          # Automation scripts
├── .github/          # GitHub Actions
└── docs/             # Documentation
```

## Testing Guidelines

- Write tests for new features
- Aim for 80% code coverage
- Test edge cases
- Include integration tests for APIs

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

## Pull Request Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] Commits are atomic
- [ ] PR description is clear

## Getting Help

- GitHub Discussions
- Discord community
- Open an issue

## Code of Conduct

Be respectful and inclusive. Follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Recognition

Contributors will be added to the README and acknowledged in releases.

---

Thank you for contributing to Organic OS! 🚀
