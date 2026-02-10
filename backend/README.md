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
- `GET /health` -> `{ "status": "ok" }`
- `GET /categories` -> all categories sorted by name
- `POST /auth/signup` -> create user (student domain only) + return JWT
- `POST /auth/login` -> return JWT for valid credentials
