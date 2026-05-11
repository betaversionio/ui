---
name: db
description: Run database operations (generate, push, migrate, seed, studio, sync)
disable-model-invocation: true
argument-hint: '<generate | push | migrate [name] | seed | studio | sync>'
allowed-tools:
  - Bash
  - Read
  - AskUserQuestion
---

Run a database operation for the monorepo.

All Prisma commands must run from `packages/database/` (where `prisma.config.ts` lives).
The `prisma.config.ts` loads `DATABASE_URL` from the monorepo root `.env` automatically.

## Command mapping

| Argument | What it does |
|----------|-------------|
| `generate` | Regenerate Prisma client after schema changes |
| `push` | Push schema to database without creating a migration file |
| `migrate [name]` | Create and apply a named migration (uses `prisma migrate dev`) |
| `seed` | Seed the database with initial data |
| `studio` | Open Prisma Studio GUI |
| `sync` | Full sync: push schema + generate client + rebuild packages (recommended after schema changes) |

## Execution rules

1. If no argument is provided, show the table above and ask which operation to run.

2. For **`generate`**:
   ```
   pnpm db:generate
   ```
   Then remind: _"Run `pnpm --filter @betaversionio/shared build && pnpm --filter @betaversionio/database build` if the API doesn't pick up new types."_

3. For **`push`**:
   ```
   pnpm db:push
   ```
   Then run `pnpm db:generate` so the client matches the database.

4. For **`migrate`**:
   - If no migration name is given after `migrate`, ask the user for one (e.g. "add-portfolio-templates").
   - Run:
     ```
     pnpm db:migrate --name <migration-name>
     ```
   - **If it fails with "drift detected"**: this means the database was modified outside of migrations (e.g. via `db push`). Inform the user and suggest either:
     - `prisma migrate diff` to inspect what changed, then `prisma migrate resolve` to mark it as applied
     - Or use `db push` instead if they don't need migration files
   - After a successful migration, run `pnpm db:generate`.

5. For **`seed`**:
   ```
   pnpm db:seed
   ```

6. For **`studio`**:
   ```
   pnpm db:studio
   ```

7. For **`sync`** (the recommended flow after any schema change):
   Run these sequentially:
   ```
   pnpm db:push && pnpm db:generate && pnpm --filter @betaversionio/shared build && pnpm --filter @betaversionio/database build
   ```
   This ensures: schema is applied to the database, Prisma client is regenerated, and downstream packages are rebuilt so the API picks up the changes immediately.

## Error handling

- If any command fails, show the full error output.
- If the error mentions "datasource.url", remind the user that Prisma 7 uses `prisma.config.ts` (in `packages/database/`) instead of `url` in the schema file.
- If the error mentions "column does not exist", the schema is out of sync — suggest running `/db sync`.
