# Employee Data Management (Next.js + Prisma + SQLite)

A single‑page CRUD application to manage employees. The UI lists all employees and provides Add, Edit, and Delete actions via dialogs on the same page. The backend exposes a clean REST API with input validation using Zod.

- Frontend: Next.js App Router, TypeScript, SWR, shadcn/ui Dialogs
- Backend: Next.js API routes, TypeScript, Prisma ORM
- Database: SQLite (local development by default)
- Validation: Zod (server and client)

## Features

- Single page interface with search/filter by name
- Add, Edit, and Delete in dialogs (no page navigation)
- Live updates with SWR after mutations
- Strict validation
  - Name: letters, spaces, and basic punctuation only (no numbers)
  - Email: valid email format
  - Position: letters, spaces, and dashes

## Repository Layout (key files)

- `app/page.tsx` — main page with table, search, and dialogs
- `components/employees/employee-table.tsx` — list + actions
- `components/employees/employee-form.tsx` — add/edit form with Zod + react-hook-form
- `app/api/employees/route.ts` — GET (list), POST (create)
- `app/api/employees/[id]/route.ts` — GET by id, PUT (update), DELETE (remove)
- `lib/validations/employee.ts` — Zod schemas used by server and client
- `lib/prisma.ts` — Prisma client singleton
- `prisma/schema.prisma` — Prisma data model (SQLite)

## Prerequisites

- Node.js 18+ (recommended 20+)
- pnpm or npm

## Quick Start

1) Install dependencies

- pnpm
  - `pnpm install`
- npm
  - `npm install`


\`\`\`
DATABASE_URL="file:./prisma/dev.db"
\`\`\`

3) Prisma database setup

- Initialize (if schema not present):  
  `npx prisma init --datasource-provider sqlite`
- Generate Prisma Client (any time schema changes):  
  `npx prisma generate`
- Create initial migration and apply it:
  - pnpm: `pnpm prisma migrate dev --name init`
  - npm: `npx prisma migrate dev --name init`
- Optional: open Prisma Studio  
  `npx prisma studio`

4) Run the app

- pnpm: `pnpm dev`
- npm: `npm run dev`

Open http://localhost:3000

## Useful Scripts (if using package.json defaults)

- Dev server: `pnpm dev` or `npm run dev`
- Build: `pnpm build` or `npm run build`
- Start (prod): `pnpm start` or `npm run start`
- Lint: `pnpm lint` or `npm run lint`

## Prisma Essentials

- Create a new migration:  
  - pnpm: `pnpm prisma migrate dev --name <change-name>`  
  - npm: `npx prisma migrate dev --name <change-name>`
- Apply schema changes locally without migration (not recommended for teams):  
  `npx prisma db push`
- Regenerate client after schema changes:  
  `npx prisma generate`
- Reset DB (drops and re-applies migrations):  
  `npx prisma migrate reset`
- Inspect DB data:  
  `npx prisma studio`

## API

Base URL: `/api/employees`

- GET `/api/employees`  
  Returns all employees, optionally filtered by `?q=<name>`.

- POST `/api/employees`  
  Create a new employee. Body:
  \`\`\`
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "position": "Software Engineer"
  }
  \`\`\`

- GET `/api/employees/:id`  
  Returns a single employee.

- PUT `/api/employees/:id`  
  Updates an employee. Body is same shape as POST.

- DELETE `/api/employees/:id`  
  Deletes an employee.

Responses are JSON. Validation errors return 400 with details.

## Validation (Zod)

Defined in `lib/validations/employee.ts` and shared by server and client.

- Name: letters/spaces/.'- only (no digits)
- Email: standard email format
- Position: letters/spaces/- only

These constraints are enforced on API input and on the dialog form.

## Tailwind and Styling Notes

- This project uses shadcn/ui components and Tailwind design tokens (`bg-background`, `text-foreground`, etc.).
- If your entire page renders black, ensure:
  - You’re not forcing the `dark` class on `<html>` unless intended.
  - Your `app/globals.css` defines the color tokens for both light and dark.
  - If you’re mixing Tailwind v4 and v3 styles, use only one approach consistently. For Tailwind v4, use `@import "tailwindcss";` and `@theme inline { ... }`. For v3, use `@tailwind base; @tailwind components; @tailwind utilities;` and set variables in `@layer base`.

## Deployment

- SQLite is suitable for local/dev. For production, consider a hosted Postgres (e.g., Neon) and update `DATABASE_URL` accordingly. Then:
  - Update `prisma/schema.prisma` provider to `postgresql`
  - Run `npx prisma migrate dev --name init` locally and ensure migrations are committed
- On platforms like Vercel, run migrations during your deployment workflow or via a pre-start step.

## Troubleshooting

- Prisma Client not found  
  Run `npx prisma generate`.
- Dark background or low contrast  
  Remove unintended `dark` class from `<html>` and verify design tokens in `app/globals.css`.

## Assessment Deliverable Notes (Verto ASE)

- Full CRUD across REST endpoints
- UI demonstrates create, read, update, delete via dialogs and a single-page UX
- Validation via Zod on both client and server
- Code quality: Prisma client singleton, clear API separation, typed endpoints and schemas
- Optional bonus: search/filter and input validation already implemented
