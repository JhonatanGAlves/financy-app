# Financy — Frontend

Web interface for Financy, a personal finance management application.

## Tech Stack

- **React 19** + **TypeScript**
- **Vite** — bundler and dev server
- **TailwindCSS v4** — utility-first styling
- **Apollo Client v4** — GraphQL communication
- **React Hook Form** + **Zod** — forms with validation
- **React Router v7** — client-side routing
- **shadcn/ui** with **Base UI** — UI components
- **Lucide React** — icons
- **react-hot-toast** — toast notifications
- **Vitest** + **Testing Library** — testing

## Prerequisites

- Node.js 20+
- pnpm 10+
- Financy API running (see `apps/api`)

## Installation

From the monorepo root:

```bash
pnpm install
```

## Scripts

```bash
# Development server
pnpm --filter frontend dev

# Production build
pnpm --filter frontend build

# Preview production build
pnpm --filter frontend preview

# Run tests
pnpm --filter frontend test

# Run tests in watch mode
pnpm --filter frontend test:watch

# Lint
pnpm --filter frontend lint

# Type check
pnpm --filter frontend tsc -b --noEmit
```

## Project Structure

```
src/
├── components/       # Reusable components (UI, auth-guard, etc.)
├── graphql/
│   ├── mutations/    # GraphQL mutations
│   └── queries/      # GraphQL queries
├── hooks/            # Custom hooks (useAuth)
├── lib/              # General utilities (cn)
├── pages/
│   ├── auth/         # Login and register
│   └── dashboard/    # Authenticated pages
│       ├── categories/
│       ├── profile/
│       └── transactions/
├── test/             # Test setup
├── types/            # Global TypeScript types
└── utils/            # Utility functions (icons, palettes)
```

## Pages

| Route           | Description                        |
| --------------- | ---------------------------------- |
| `/login`        | Login                              |
| `/register`     | Sign up                            |
| `/`             | Dashboard with financial summary   |
| `/transactions` | Transaction listing and management |
| `/categories`   | Category listing and management    |
| `/profile`      | User profile                       |

## Environment Variables

Create a `.env` file at the package root:

```env
VITE_API_URL=http://localhost:3000/graphql
```

> By default, Apollo Client points to `http://localhost:3000/graphql`.
