---
name: gen-module
description: Generate a new NestJS API module with controller, service, and DTOs
disable-model-invocation: true
argument-hint: "<module-name>"
allowed-tools:
  - Bash
  - Glob
  - Grep
  - Read
  - Edit
  - Write
---

Generate a new NestJS module named `$ARGUMENTS` in `apps/api/src/modules/<name>/`.

1. First, read an existing module (e.g. `apps/api/src/modules/user/`) to match the project's conventions for:
   - File structure
   - Import style
   - Decorator usage
   - Service patterns (PrismaService injection)
   - Controller patterns (guards, pipes, response format)

2. Create the following files:
   - `<name>.module.ts` — NestJS module, imports PrismaModule
   - `<name>.controller.ts` — RESTful controller with standard CRUD endpoints
   - `<name>.service.ts` — Service with PrismaService injection
   - `index.ts` — barrel export

3. Register the new module in `apps/api/src/app.module.ts`.

4. If a Prisma model is needed, mention that the user should add it to `packages/database/prisma/schema/` and run `pnpm db:generate`.

Follow existing project patterns exactly. Don't invent new conventions.
