# NIGHTLY_BUILD.md - Organic OS Autonomous Development

## Purpose
Run autonomous development tasks while Jesse sleeps, maximizing API value within the 5-hour rolling window constraint.

## Schedule
- **Primary:** 3:00 AM UTC
- **Fallback:** If API quota < 20 prompts, defer to next available window

## Pre-Flight Check

```bash
# 1. Check API quota
curl -X POST "https://www.minimax.io/v1/api/openplatform/coding_plan/remains" \
  -H "Authorization: Bearer $MINIMAX_CODING_KEY"

# 2. Check git status
git status

# 3. Check GitHub issues/PRs
gh issue list --state open --limit 10
```

## Priority Matrix

| Priority | Task Type | Max Prompts | Examples |
|----------|-----------|-------------|----------|
| P0 | Critical bugs | Unlimited | Deployment blockers, security |
| P1 | Core features | 40 | Module implementations |
| P2 | Enhancements | 25 | UI improvements, tests |
| P3 | Nice-to-have | 15 | Refactoring, cleanup |

## Execution Steps

### 1. Pull Latest Changes
```bash
git pull origin main
```

### 2. Check for Critical Issues
```bash
gh issue list --state open --label "critical,P0" --limit 5
```

### 3. Execute Tasks by Priority
```bash
# P0 - Always run
npm run dev:p0

# P1 - If quota > 40 prompts
npm run dev:p1

# P2 - If quota > 25 prompts
npm run dev:p2

# P3 - If quota > 15 prompts
npm run dev:p3
```

### 4. Generate Report
```bash
npm run report:nightly
```

## Post-Execution

- ✅ Push changes to `develop` branch
- ✅ Create PR for review
- ✅ Send report to #dev channel
- ✅ Update `memory/YYYY-MM-DD.md`

## Safety Rules

1. **Never exceed 80% of available quota in one session**
2. **Always test before committing**
3. **Create PRs, don't push directly to main**
4. **Log everything to memory files**

## What Can Break
- API quota exhaustion → Defer to next window
- Git conflicts → Create PR, flag for manual review
- Build failures → Rollback, report in morning

## Success Criteria
- ✅ Code compiles
- ✅ Tests pass
- ✅ No critical bugs
- ✅ < 50% quota used
