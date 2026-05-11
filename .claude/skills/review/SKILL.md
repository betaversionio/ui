---
name: review
description: Review code or a PR for issues
disable-model-invocation: true
argument-hint: "[file path or PR number]"
allowed-tools:
  - Bash
  - Glob
  - Grep
  - Read
---

Review the code at `$ARGUMENTS` (a file path, directory, or GitHub PR number).

If it's a PR number, use `gh pr diff $ARGUMENTS` to get the changes.
If it's a file/directory, read the relevant files.

Check for:

1. **Bugs** — logic errors, off-by-one, null/undefined access, race conditions
2. **Security** — injection (SQL, XSS, command), exposed secrets, missing auth checks, OWASP top 10
3. **Performance** — N+1 queries, missing indexes, unnecessary re-renders, large bundle imports
4. **Error handling** — unhandled promises, missing try/catch at boundaries, silent failures
5. **Types** — `any` usage, missing types, incorrect generics
6. **Code quality** — dead code, duplication, unclear naming, overly complex logic

Output format:

```
## Review: <target>

### Critical
- [file:line] description

### Warnings
- [file:line] description

### Suggestions
- [file:line] description

### Looks good
- Brief note on what's well done
```

Skip empty sections. Be specific — always reference file and line number.
