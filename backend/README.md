# Backend Setup (Express + TypeScript + Prisma)

## Prerequisites
- Node.js 18+
- MySQL database

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and set `DATABASE_URL`.
3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
4. Seed default categories:
   ```bash
   npm run prisma:seed
   ```
5. Start development server:
   ```bash
   npm run dev
   ```

## API
- `GET /health` -> `{ "status": "ok" }`
- `GET /categories` -> all categories sorted by name
