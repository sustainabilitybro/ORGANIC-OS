# Organic OS Autonomous Development System

## API Usage Constraints

- **Coding Plan:** Resets every 5 hours (rolling window)
- **1 Prompt ≈ 15 model calls** (bundled for billing)
- **Coding Plan API Key:** Separate from standard Open Platform API Key

## Nightly Build Protocol

### When to Run
- Every night at 3:00 AM (configurable)
- During low-usage hours to maximize API budget

### Before Each Session
```bash
# Check remaining API quota
curl https://www.minimax.io/v1/api/openplatform/coding_plan/remains

# If quota < 10 prompts, defer non-essential work
```

### Priority Queue (High → Low)

1. **Critical** (Always run if quota > 5)
   - Security fixes
   - Bug fixes blocking deployment
   - Database schema changes

2. **High** (Run if quota > 15)
   - Core feature development
   - Module implementations
   - API integrations

3. **Medium** (Run if quota > 25)
   - UI improvements
   - Component enhancements
   - Documentation updates

4. **Low** (Run if quota > 40)
   - Refactoring
   - Code cleanup
   - Tests

### Autonomous Workflow

```typescript
// Auto-run workflow
async function nightlyBuild() {
  // 1. Check API quota
  const quota = await checkCodingPlanQuota()
  
  // 2. Fetch recent GitHub issues/prs
  const tasks = await fetchTasks()
  
  // 3. Prioritize by urgency
  const sorted = prioritize(tasks, quota)
  
  // 4. Execute within quota
  for (const task of sorted) {
    if (quota < 10) break
    await execute(task)
    quota -= task.promptCost
  }
  
  // 5. Generate nightly report
  await generateReport()
}
```

### Estimated Costs

| Task Type | Prompts |
|-----------|---------|
| Write new component | 3-5 |
| Refactor existing code | 2-4 |
| Debug issue | 1-3 |
| Write tests | 2-3 |
| Documentation | 1-2 |

### Daily Budget Management

- **Max sessions:** 4-5 per day (every 5 hours)
- **Prompts per session:** ~50-100 (varies by plan)
- **Safety buffer:** Stop at 20% remaining

### Morning Report Format

```
🌅 Organic OS Nightly Build Report
Date: YYYY-MM-DD
Time: HH:MM

Completed:
- ✅ Task 1
- ✅ Task 2

In Progress:
- 🔄 Task 3

API Usage:
- Prompts used: XX
- Remaining: XX

Next Steps:
→ Continue current tasks
→ Review PRs
→ Deploy if ready
```

## Files Modified
- `memory/YYYY-MM-DD.md` - Session log
- `docs/nightly-build.md` - Running history
