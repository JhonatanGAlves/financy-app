# Financy API

GraphQL API for personal finance management.

**Endpoint:** `http://localhost:3000/graphql`

---

## Running the server

### Prerequisites

- Node.js 20+
- pnpm
- Docker

### Steps

```bash
# 1. Install dependencies (from repo root)
pnpm install

# 2. Copy env file and fill in the values
cp apps/api/.env.example apps/api/.env

# 3. Start the database
cd apps/api
docker compose up -d

# 4. Run migrations
pnpm prisma:migrate

# 5. Start the dev server
pnpm dev
```

The server will be available at `http://localhost:3000/graphql`.

In development, **Apollo Sandbox** is automatically served at that URL — open it in the browser to explore and test all operations interactively.

---

## Authentication

Protected operations require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

The token is returned by `register` and `login` and expires in **7 days**.

---

## Operations

### Auth

#### `register`

Creates a new account and returns a JWT.

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
  }
}
```

**Variables**

```json
{
  "input": {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "123456"
  }
}
```

**Response**

```json
{
  "data": {
    "register": {
      "accessToken": "<jwt>"
    }
  }
}
```

**Errors**

| Code       | Description          |
| ---------- | -------------------- |
| `CONFLICT` | Email already in use |

---

#### `login`

Authenticates an existing user and returns a JWT.

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
  }
}
```

**Variables**

```json
{
  "input": {
    "email": "john@example.com",
    "password": "123456"
  }
}
```

**Response**

```json
{
  "data": {
    "login": {
      "accessToken": "<jwt>"
    }
  }
}
```

**Errors**

| Code           | Description         |
| -------------- | ------------------- |
| `UNAUTHORIZED` | Invalid credentials |

---

### Users

> All user operations require authentication.

#### `me` — query

Returns the authenticated user's profile.

```graphql
query Me {
  me {
    id
    name
    email
  }
}
```

**Response**

```json
{
  "data": {
    "me": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

---

#### `updateProfile`

Updates the authenticated user's name.

```graphql
mutation UpdateProfile($input: UpdateProfileInput!) {
  updateProfile(input: $input) {
    id
    name
    email
  }
}
```

**Variables**

```json
{
  "input": {
    "name": "John Smith"
  }
}
```

---

### Categories

> All category operations require authentication.

#### `categories` — query

Returns all categories belonging to the authenticated user.

```graphql
query Categories {
  categories {
    id
    name
    description
    icon
    color
    userId
    createdAt
    updatedAt
  }
}
```

**Response**

```json
{
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Food",
        "description": null,
        "icon": "briefcase",
        "color": "green",
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### `createCategory`

```graphql
mutation CreateCategory($input: CreateCategoryInput!) {
  createCategory(input: $input) {
    id
    name
    description
    icon
    color
    createdAt
  }
}
```

**Variables**

```json
{
  "input": {
    "name": "Food",
    "description": "Groceries and restaurants",
    "icon": "utensils",
    "color": "green"
  }
}
```

| Field         | Required | Default       |
| ------------- | :------: | ------------- |
| `name`        |    ✓     | —             |
| `description` |    ✗     | `null`        |
| `icon`        |    ✓     | `"briefcase"` |
| `color`       |    ✓     | `"green"`     |

---

#### `updateCategory`

```graphql
mutation UpdateCategory($input: UpdateCategoryInput!) {
  updateCategory(input: $input) {
    id
    name
    description
    icon
    color
    updatedAt
  }
}
```

**Variables**

```json
{
  "input": {
    "id": "uuid",
    "name": "Groceries",
    "description": "Supermarket only",
    "icon": "shopping-cart",
    "color": "blue"
  }
}
```

**Errors**

| Code        | Description                      |
| ----------- | -------------------------------- |
| `NOT_FOUND` | Category does not exist          |
| `FORBIDDEN` | Category belongs to another user |

---

#### `deleteCategory`

Returns `true` on success.

```graphql
mutation DeleteCategory($id: ID!) {
  deleteCategory(id: $id)
}
```

**Variables**

```json
{
  "id": "uuid"
}
```

**Errors**

| Code        | Description                      |
| ----------- | -------------------------------- |
| `NOT_FOUND` | Category does not exist          |
| `FORBIDDEN` | Category belongs to another user |

---

### Transactions

> All transaction operations require authentication.

#### `transactions` — query

Returns all transactions belonging to the authenticated user.

```graphql
query Transactions {
  transactions {
    id
    amount
    description
    type
    categoryId
    userId
    date
    createdAt
    updatedAt
  }
}
```

**Response**

```json
{
  "data": {
    "transactions": [
      {
        "id": "uuid",
        "amount": 5000,
        "description": "Monthly salary",
        "type": "INCOME",
        "categoryId": "uuid",
        "userId": "uuid",
        "date": "2026-01-01T00:00:00.000Z",
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

#### `createTransaction`

```graphql
mutation CreateTransaction($input: CreateTransactionInput!) {
  createTransaction(input: $input) {
    id
    amount
    description
    type
    categoryId
    date
    createdAt
  }
}
```

**Variables**

```json
{
  "input": {
    "amount": 5000,
    "description": "Monthly salary",
    "type": "INCOME",
    "categoryId": "uuid",
    "date": "2026-01-01"
  }
}
```

**`type` values:** `INCOME` | `EXPENSE`

---

#### `updateTransaction`

All fields except `id` are optional.

```graphql
mutation UpdateTransaction($input: UpdateTransactionInput!) {
  updateTransaction(input: $input) {
    id
    amount
    description
    type
    categoryId
    date
    updatedAt
  }
}
```

**Variables**

```json
{
  "input": {
    "id": "uuid",
    "amount": 4500,
    "description": "Adjusted salary"
  }
}
```

**Errors**

| Code        | Description                         |
| ----------- | ----------------------------------- |
| `NOT_FOUND` | Transaction does not exist          |
| `FORBIDDEN` | Transaction belongs to another user |

---

#### `deleteTransaction`

Returns `true` on success.

```graphql
mutation DeleteTransaction($id: ID!) {
  deleteTransaction(id: $id)
}
```

**Variables**

```json
{
  "id": "uuid"
}
```

**Errors**

| Code        | Description                         |
| ----------- | ----------------------------------- |
| `NOT_FOUND` | Transaction does not exist          |
| `FORBIDDEN` | Transaction belongs to another user |

---

## Schema

The full GraphQL schema is auto-generated at `src/schema.gql` and versioned in the repository.
