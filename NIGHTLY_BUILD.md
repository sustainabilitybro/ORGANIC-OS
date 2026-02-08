# NIGHTLY_BUILD.md - Organic OS Autonomous Development

## Purpose
Run autonomous development tasks while Jesse sleeps, maximizing MiniMax API value within the 5-hour rolling window constraint.

## Schedule
- **Primary:** 11:00 PM → 9:00 AM (Europe/Berlin)
- **Duration:** 10 hours
- **Fallback:** If API quota < 20 prompts, defer to next available window

---

## Tool Selection Guidelines

### Use MiniMax API For (BILLABLE)

| Task Type | Examples | Benefit |
|-----------|----------|---------|
| **Code Generation** | New features, module implementations, API endpoints | Speed of creation |
| **Refactoring** | Simplify complex functions, improve readability | Code quality |
| **Debugging** | Analyze error messages, find bugs | Faster fixes |
| **Architecture Decisions** | Design patterns, data models, API structures | Best practices |
| **Test Generation** | Unit tests, integration tests, E2E tests | Coverage |
| **Code Explanation** | Understanding unfamiliar codebases | Context gain |
| **Documentation** | README, API docs, code comments | Clarity |
| **Code Review** | Analyze PRs, suggest improvements | Quality gate |

**MiniMax Usage Pattern:**
```
Write code → Test locally → Fix errors with MiniMax → Commit
```

### Use CLI Tools For (FREE)

| Tool | Purpose | Commands |
|------|---------|----------|
| **File Operations** | Read, write, edit files | `read`, `write`, `edit` |
| **Git** | Version control | `git status`, `git add`, `git commit`, `git push`, `git pull` |
| **Shell Commands** | Build, test, lint | `npm run build`, `npm test`, `npm run lint` |
| **GitHub CLI** | Issues, PRs, releases | `gh issue list`, `gh pr create`, `gh repo view` |
| **Package Managers** | Install dependencies | `npm install`, `pip install` |
| **Docker** | Container management | `docker build`, `docker-compose up` |
| **Database** | Migrations, seeding | `supabase db push`, `npm run db:migrate` |

**CLI Usage Pattern:**
```
Run tests → Check git status → Push changes → Create PR
```

---

## Pre-Flight Check

```bash
# 1. Check MiniMax API quota
curl -X POST "https://www.minimax.io/v1/api/openplatform/coding_plan/remains" \
  -H "Authorization: Bearer $MINIMAX_CODING_KEY"

# 2. Check git status
git status

# 3. Pull latest changes
git pull origin main

# 4. Check GitHub issues
gh issue list --state open --limit 10
```

---

## Priority Matrix

| Priority | Task Type | Max Prompts | Examples |
|----------|-----------|-------------|----------|
| P0 | Critical bugs | Unlimited | Deployment blockers, security issues |
| P1 | Core features | 40 | Module implementations, API endpoints |
| P2 | Enhancements | 25 | UI improvements, tests, documentation |
| P3 | Nice-to-have | 15 | Refactoring, cleanup, polish |

---

## Execution Workflow

### Hour 1: Setup & Assessment
1. Run pre-flight checks (CLI)
2. Pull latest changes (CLI)
3. Review GitHub issues (CLI)
4. Identify priority tasks (CLI)
5. Generate tonight's plan (MiniMax)

### Hours 2-8: Development Sprints
For each task:
1. **Understand requirements** — Read files (CLI)
2. **Generate code** — MiniMax prompt
3. **Write code** — Save files (CLI)
4. **Test locally** — Run tests (CLI)
5. **Fix errors** — MiniMax for debugging
6. **Commit** — Git operations (CLI)

**Repeat sprints until quota exhaustion or time limit**

### Hour 9: Integration & Testing
1. Run full test suite (CLI)
2. Fix integration issues (MiniMax)
3. Update documentation (MiniMax)
4. Create pull request (CLI)

### Hour 10: Report & Handoff
1. Generate progress report (MiniMax)
2. Push to GitHub (CLI)
3. Send report to Telegram (CLI)
4. Update memory files (CLI)
5. Flag incomplete tasks for next night

---

## MiniMax Prompt Patterns

### Code Generation
```
Generate [component/feature] for [module] with:
- Requirements: [list]
- Tech stack: [Next.js/FastAPI/etc.]
- Include: [tests, types, docs]
- Avoid: [anti-patterns]
```

### Debugging
```
Analyze this error:
[error message]
[relevant code]
Fix the issue and explain the root cause.
```

### Refactoring
```
Refactor this [function/module] to:
- Improve readability
- Follow best practices
- Add type safety
- Keep functionality identical
```

### Test Generation
```
Write tests for [component/function]:
- Test cases: [list]
- Use: [Jest/Pytest/etc.]
- Coverage: [edge cases, happy path]
```

---

## CLI Command Reference

### File Operations
```bash
# Read file
read /path/to/file

# Write file
write --path /path/to/file --content "..."

# Edit file
edit --path /path/to/file --oldText "..." --newText "..."
```

### Git Workflow
```bash
# Check status
git status

# Stage changes
git add -A

# Commit
git commit -m "Description"

# Push
git push origin main

# Pull
git pull origin main
```

### NPM Scripts
```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Lint code

# Database
npm run db:migrate   # Run migrations
npm run db:seed     # Seed database
npm run db:generate  # Generate types
```

### GitHub CLI
```bash
# Issues
gh issue list --state open
gh issue view NUMBER
gh issue create --title "..." --body "..."

# Pull Requests
gh pr list
gh pr view NUMBER
gh pr create --title "..." --body "..." --head feature --base main

# Repos
gh repo view
gh repo clone owner/repo
```

---

## Safety Rules

1. **Never exceed 80% of available quota in one session**
2. **Always test before committing** (CLI)
3. **Create PRs, don't push directly to main** (CLI)
4. **Log everything to memory files** (CLI)
5. **Use MiniMax for complex logic, CLI for simple tasks**

---

## What Can Break & Fixes

| Issue | Fix |
|-------|-----|
| API quota exhaustion | Defer to next window |
| Git conflicts | Create PR, flag for manual review |
| Build failures | Rollback, report in morning |
| Test failures | Fix with MiniMax debugging |
| Rate limiting | Slow down, use CLI for breaks |

---

## Success Criteria

- [ ] Code compiles
- [ ] Tests pass
- [ ] No critical bugs
- [ ] < 50% quota used
- [ ] PR created for review
- [ ] Progress report sent
- [ ] Memory updated

---

## Quick Reference

**MiniMax for:**
- Writing code
- Debugging errors
- Refactoring
- Generating tests
- Architecture decisions
- Documentation

**CLI for:**
- Reading files
- Running tests
- Git operations
- Package management
- Build processes
- Deployments
