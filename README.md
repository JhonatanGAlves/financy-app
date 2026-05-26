# Financy

A full-stack personal finance management application. Track your income and expenses, organize transactions by custom categories, and get a clear view of your financial health.

---

## Demo

https://github.com/user-attachments/assets/56f884e2-d84a-4d4c-b4fd-3096a9a349ef

---

## Features

- **Authentication** — Register and log in with email and password; JWT-based sessions
- **Dashboard** — Financial overview with income/expense summary
- **Transactions** — Create, edit, and delete income or expense records with date, amount, description, and category
- **Categories** — Organize transactions with fully customizable categories (name, description, icon, color)
- **Profile** — View and update your personal information

---

## Tech Stack

### Backend (`backend`)

| Layer      | Technology                             |
| ---------- | -------------------------------------- |
| Runtime    | Node.js 20                             |
| Framework  | NestJS 10                              |
| API        | GraphQL — Apollo Server 4 (code-first) |
| ORM        | Prisma v7                              |
| Database   | PostgreSQL 16                          |
| Auth       | JWT + Passport.js                      |
| Validation | nestjs-zod + Zod                       |
| Testing    | Jest                                   |
| Language   | TypeScript 5.7                         |

### Frontend (`frontend`)

| Layer          | Technology               |
| -------------- | ------------------------ |
| Framework      | React 19 + TypeScript    |
| Bundler        | Vite 8                   |
| Styling        | TailwindCSS v4           |
| GraphQL Client | Apollo Client 4          |
| Forms          | React Hook Form 7 + Zod  |
| Routing        | React Router v7          |
| UI             | shadcn/ui + Base UI      |
| Icons          | Lucide React             |
| Notifications  | react-hot-toast          |
| Testing        | Vitest + Testing Library |

---

## Project Structure

```
financy-app/
├── backend/      # NestJS GraphQL backend
├── frontend/     # React web interface
├── package.json  # pnpm workspace root
└── pnpm-workspace.yaml
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- Docker (for the PostgreSQL database)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

Fill in the values:

| Variable       | Description                    |
| -------------- | ------------------------------ |
| `DATABASE_URL` | PostgreSQL connection string   |
| `JWT_SECRET`   | Secret used to sign JWT tokens |
| `NODE_ENV`     | `development` or `production`  |

### 3. Configure the frontend

Create `frontend/.env`:

```env
VITE_BACKEND_URL=http://localhost:3000
```

### 4. Start the database

```bash
cd backend
docker compose up -d
```

### 5. Run database migrations

```bash
# from the repo root
pnpm prisma:migrate
pnpm prisma:generate
```

### 6. Start both services

Open two terminals from the repo root:

```bash
# Terminal 1 — Backend (http://localhost:3000/graphql)
pnpm backend

# Terminal 2 — Frontend (http://localhost:5173)
pnpm frontend
```

In development, **Apollo Sandbox** is available at `http://localhost:3000/graphql` to explore and test all GraphQL operations interactively.

---

## API Overview

All operations are served at `http://localhost:3000/graphql`.

| Domain       | Operations                                                                    | Auth     |
| ------------ | ----------------------------------------------------------------------------- | -------- |
| Auth         | `register`, `login`                                                           | Public   |
| Users        | `me`, `updateProfile`                                                         | Required |
| Categories   | `categories`, `createCategory`, `updateCategory`, `deleteCategory`            | Required |
| Transactions | `transactions`, `createTransaction`, `updateTransaction`, `deleteTransaction` | Required |

Protected operations require the header:

```
Authorization: Bearer <accessToken>
```

Tokens are returned by `register` / `login` and expire in **7 days**. See [`backend/README.md`](backend/README.md) for full operation details.

---

## Pages

| Route           | Description                        |
| --------------- | ---------------------------------- |
| `/login`        | Login                              |
| `/register`     | Sign up                            |
| `/`             | Dashboard with financial summary   |
| `/transactions` | Transaction listing and management |
| `/categories`   | Category listing and management    |
| `/profile`      | User profile                       |

---

## Scripts

### From the repo root

| Script                 | Description                      |
| ---------------------- | -------------------------------- |
| `pnpm backend`         | Start the backend dev server     |
| `pnpm frontend`        | Start the frontend dev server    |
| `pnpm prisma:migrate`  | Create and apply a new migration |
| `pnpm prisma:generate` | Generate the Prisma client       |

### Backend (`backend`)

| Script          | Description                |
| --------------- | -------------------------- |
| `pnpm dev`      | Dev server with hot reload |
| `pnpm build`    | Compile TypeScript         |
| `pnpm test`     | Run unit tests             |
| `pnpm test:cov` | Tests with coverage        |
| `pnpm lint`     | Run ESLint                 |

### Frontend (`frontend`)

| Script                         | Description      |
| ------------------------------ | ---------------- |
| `pnpm --filter frontend dev`   | Vite dev server  |
| `pnpm --filter frontend build` | Production build |
| `pnpm --filter frontend test`  | Run Vitest       |
| `pnpm --filter frontend lint`  | Run ESLint       |

---

## Further Reading

- [Backend Documentation](backend/README.md)
- [Frontend Documentation](frontend/README.md)
