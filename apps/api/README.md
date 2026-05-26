# Financy — API

GraphQL API for personal finance management built with NestJS, Prisma and PostgreSQL.

## Tech Stack

- **Runtime:** Node.js 20
- **Framework:** NestJS
- **API:** GraphQL (Apollo Server) — code-first
- **ORM:** Prisma v7
- **Database:** PostgreSQL
- **Auth:** JWT + Passport
- **Validation:** nestjs-zod + Zod
- **Testing:** Jest

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker

### Setup

```bash
# 1. Install dependencies (run from the repo root)
pnpm install

# 2. Copy the env file and fill in the values
cp apps/api/.env.example apps/api/.env

# 3. Start the database
cd apps/api
docker compose up -d

# 4. Run migrations
pnpm prisma:migrate

# 5. Generate Prisma client
pnpm prisma:generate

# 6. Start the dev server
pnpm dev
```

The API will be available at `http://localhost:3000/graphql`.

In development, **Apollo Sandbox** is served at that URL — open it in the browser to explore and test all operations interactively.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `NODE_ENV` | `development` or `production` |

---

## Scripts

Run from `apps/api/`:

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start dev server with hot reload |
| `pnpm build` | Compile TypeScript |
| `pnpm start` | Run compiled output |
| `pnpm test` | Run unit tests |
| `pnpm test:cov` | Run tests with coverage report |
| `pnpm lint` | Run ESLint |
| `pnpm prisma:migrate` | Create and apply a new migration |
| `pnpm prisma:generate` | Generate Prisma client |

---

## Project Structure

```
src/
├── auth/                   # Register, login, JWT strategy
├── categories/             # Category CRUD
├── transactions/           # Transaction CRUD
├── users/                  # Profile query and update
├── prisma/                 # PrismaService and PrismaModule
├── common/
│   ├── decorators/         # @CurrentUser()
│   └── guards/             # JwtAuthGuard
├── config/
│   └── env.ts              # Zod env validation
└── app.module.ts
```

---

## GraphQL Operations

### Authentication

| Operation | Type | Auth required |
|-----------|------|:---:|
| `register` | Mutation | ✗ |
| `login` | Mutation | ✗ |

### Users

| Operation | Type | Auth required |
|-----------|------|:---:|
| `me` | Query | ✓ |
| `updateProfile` | Mutation | ✓ |

### Categories

| Operation | Type | Auth required |
|-----------|------|:---:|
| `categories` | Query | ✓ |
| `createCategory` | Mutation | ✓ |
| `updateCategory` | Mutation | ✓ |
| `deleteCategory` | Mutation | ✓ |

### Transactions

| Operation | Type | Auth required |
|-----------|------|:---:|
| `transactions` | Query | ✓ |
| `createTransaction` | Mutation | ✓ |
| `updateTransaction` | Mutation | ✓ |
| `deleteTransaction` | Mutation | ✓ |

For full operation details, inputs, outputs and examples, see [`docs/api.md`](./docs/api.md).

The auto-generated GraphQL schema is available at [`src/schema.gql`](./src/schema.gql).

---

## Authentication

Protected operations require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Tokens are returned by `register` and `login` and expire in **7 days**.

---

## Database

Schema is managed by Prisma migrations located at `prisma/migrations/`.

### Models

- **User** — account with email/password
- **Category** — user-owned category with name, description, icon and color
- **Transaction** — financial record with amount, type (`INCOME` | `EXPENSE`), date and category

---

## Testing

```bash
pnpm test         # run all unit tests
pnpm test:watch   # watch mode
pnpm test:cov     # with coverage
```

Services and resolvers are tested in isolation with mocked `PrismaService`.
