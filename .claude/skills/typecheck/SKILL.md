---
name: typecheck
description: Run TypeScript typechecks across the monorepo
disable-model-invocation: true
argument-hint: "[optional: api | web | database | shared | all]"
allowed-tools:
  - Bash
  - Read
---

Run TypeScript typechecks on the specified target. Default is `all`.

Target mapping:
- `api` → `cd apps/api && npx tsc --noEmit`
- `web` → `cd apps/web && npx tsc --noEmit`
- `database` → `cd packages/database && npx tsc --noEmit`
- `shared` → `cd packages/shared && npx tsc --noEmit`
- `all` → `pnpm typecheck` (runs turbo across all packages)

If `$ARGUMENTS` is provided, use that target. Otherwise run `all`.

After running:
- If clean, say so
- If errors, group them by file and summarize. For each error, briefly explain what's wrong and how to fix it.
