---
name: pr
description: Create a GitHub pull request
disable-model-invocation: true
argument-hint: "[base-branch (default: main)]"
allowed-tools:
  - Bash
  - Glob
  - Grep
  - Read
---

Create a GitHub pull request:

1. Run `git status`, `git log --oneline -10`, and determine the base branch (use `$ARGUMENTS` if provided, otherwise `main`).
2. Run `git diff <base>...HEAD` to understand all changes across commits.
3. Push the current branch to remote with `-u` if not already pushed.
4. Create the PR using `gh pr create` with:
   - A short title (under 70 chars) using a gitmoji prefix matching the primary change type
   - A body with this format:

```
## Summary
<1-3 bullet points describing what changed and why>

## Changes
<bulleted list of specific changes grouped by area>

## Test plan
<how to verify this works>
```

5. Return the PR URL when done.
6. **Do NOT add a `Co-Authored-By` line anywhere.**
