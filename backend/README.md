# Backend Setup (Express + TypeScript + Prisma)

## Prerequisites
- Node.js 18+
- MySQL database

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and set:
   - `PORT`
   - `DATABASE_URL`
   - `JWT_SECRET` (required)
   - optional `UNIVERSITY_EMAIL_DOMAIN` (default: `student.nstu.edu.bd`)
3. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```
4. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
5. Seed default categories:
   ```bash
   npm run prisma:seed
   ```
6. Start development server:
   ```bash
   npm run dev
   ```

## API
### Public
- `GET /health` -> `{ "status": "ok" }`
- `GET /categories` -> all categories sorted by name
- `GET /products` -> all products (newest first)
- `GET /products?categoryId=<id>` -> products filtered by category
- `GET /products/:id` -> single product by id

### Auth
- `POST /auth/signup` -> create user (student domain only) + return JWT
- `POST /auth/login` -> return JWT for valid credentials

### Protected (Bearer token required)
- `GET /auth/me` -> current authenticated user
- `POST /products` -> create product for authenticated user (`userId` is derived from token)
- `PUT /products/:id` -> update product (owner only)
- `PATCH /products/:id/sold` -> mark product sold (owner only)
- `DELETE /products/:id` -> delete product (owner only)

## Smoke test (curl)
Use these examples after `npm run dev`.

```bash
# signup
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@student.nstu.edu.bd","password":"password123"}'

# login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@student.nstu.edu.bd","password":"password123"}'

# categories
curl http://localhost:4000/categories

# create product (replace <TOKEN> and valid categoryId)
curl -X POST http://localhost:4000/products \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Physics Book","price":350,"categoryId":1,"description":"Used, good condition"}'

# list products
curl http://localhost:4000/products

# me
curl http://localhost:4000/auth/me -H "Authorization: Bearer <TOKEN>"
```
