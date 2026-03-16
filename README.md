# Expense Tracker API

Simple Expense Tracker API built with **Node.js**, **Express**, **TypeScript**, **Prisma**, and **PostgreSQL**.  
Allows users to **register, authenticate, and manage personal expenses** with filtering and pagination.

---

## Features

* User authentication with **JWT**
* Create, update, and delete expenses
* Filter expenses by **category**
* Filter expenses by **date range**
* Pagination support (`page` and `limit`)
* RESTful API design
* Tested with **Jest + Supertest**

---

## Setup

1. Clone the repo:

```bash
git clone https://github.com/mykytapilec/expense-tracker-api.git
cd expense-tracker-api
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/expense_tracker"
JWT_SECRET=supersecret
```

4. Run database migrations:

```bash
npx prisma migrate dev
```

5. Generate Prisma client:

```bash
npx prisma generate
```

6. Run in development:

```bash
npm run dev
```

Server will be available at: `http://localhost:3000`

---

## API Endpoints

### 1️⃣ Register

**Request**

```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"password123"}'
```

**Response**

```json
{
  "id": "user-id",
  "email": "user@example.com"
}
```

---

### 2️⃣ Login

**Request**

```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"user@example.com","password":"password123"}'
```

**Response**

```json
{
  "token": "jwt_token"
}
```

---

### 3️⃣ Create Expense

**Request**

```bash
curl -X POST http://localhost:3000/expenses \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "amount": 100,
  "category": "GROCERIES",
  "note": "Lunch",
  "date": "2026-03-15"
}'
```

**Response**

```json
{
  "id": "expense-id",
  "amount": 100,
  "category": "GROCERIES",
  "note": "Lunch",
  "date": "2026-03-15"
}
```

---

### 4️⃣ Get Expenses

Supports:

* pagination
* category filtering
* date range filtering

**Request**

```bash
curl "http://localhost:3000/expenses?page=1&limit=10&category=GROCERIES" \
-H "Authorization: Bearer YOUR_TOKEN"
```

**Response**

```json
{
  "data": [
    {
      "id": "expense-id",
      "amount": 100,
      "category": "GROCERIES",
      "note": "Lunch",
      "date": "2026-03-15"
    }
  ],
  "page": 1,
  "limit": 10
}
```

---

### 5️⃣ Update Expense

**Request**

```bash
curl -X PUT http://localhost:3000/expenses/EXPENSE_ID \
-H "Authorization: Bearer YOUR_TOKEN" \
-H "Content-Type: application/json" \
-d '{
  "amount": 150,
  "note": "Updated lunch"
}'
```

---

### 6️⃣ Delete Expense

**Request**

```bash
curl -X DELETE http://localhost:3000/expenses/EXPENSE_ID \
-H "Authorization: Bearer YOUR_TOKEN"
```

---

## Running Tests

Run all tests:

```bash
npm run test
```

Tests are written using **Jest** and **Supertest** and cover:

* expense creation
* expense retrieval
* expense update
* expense deletion

---

## Project Structure

```
src/
├─ controllers/
│  ├─ auth.controller.ts
│  └─ expense.controller.ts
├─ middleware/
│  └─ auth.middleware.ts
├─ routes/
│  ├─ auth.routes.ts
│  └─ expense.routes.ts
├─ tests/
│  └─ expenses.test.ts
├─ utils/
│  └─ jwt.ts
├─ types/
│  └─ express.d.ts
├─ server.ts
└─ index.ts

prisma/
└─ schema.prisma
```

---

## Environment Variables

| Variable | Description | Example |
|--------|--------|--------|
| PORT | Server port | 3000 |
| DATABASE_URL | PostgreSQL connection string | postgres://user:pass@localhost:5432/db |
| JWT_SECRET | Secret used to sign JWT tokens | supersecret |

---

## Notes

* Authentication is handled via **JWT tokens**.
* Each user can only manage **their own expenses**.
* Prisma is used for database access and schema management.
* Pagination is implemented using `page` and `limit` query parameters.

---

## Project link

https://roadmap.sh/projects/expense-tracker-api