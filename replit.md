# Workspace

## Overview

npm workspaces monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: npm workspaces
- **Node.js version**: 24
- **Package manager**: npm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `npm run typecheck` - full typecheck across all packages
- `npm run build` - typecheck + build all packages
- `npm run codegen --workspace=@workspace/api-spec` - regenerate API hooks and Zod schemas from OpenAPI spec
- `npm run push --workspace=@workspace/db` - push DB schema changes (dev only)
- `npm run dev --workspace=@workspace/api-server` - run API server locally