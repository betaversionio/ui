---
name: fix
description: Investigate and fix a bug or error
disable-model-invocation: true
argument-hint: "[error message, file path, or issue description]"
allowed-tools:
  - Bash
  - Glob
  - Grep
  - Read
  - Edit
  - Write
  - Task
---

Investigate and fix the issue described in `$ARGUMENTS`.

Follow this process:

1. **Reproduce** — Understand the error. If it's an error message, search the codebase for it. If it's a file, read it. If it's a description, find the relevant code.
2. **Root cause** — Trace the issue to its source. Don't just fix symptoms. Read related files, check types, follow the call chain.
3. **Fix** — Apply the minimal change needed. Don't refactor surrounding code. Don't add unrelated improvements.
4. **Verify** — Run `tsc --noEmit` on the affected package to confirm no type errors were introduced.

Before making changes, briefly explain:
- What the bug is
- Why it happens
- What the fix is

Keep the fix focused. One bug, one fix.
