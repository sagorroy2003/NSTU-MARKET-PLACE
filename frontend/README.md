# Frontend (Next.js App Router)

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create env file from example:
   ```bash
   cp .env.example .env.local
   ```
3. Set API base URL in `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL="http://localhost:4000"
   ```
4. Run development server:
   ```bash
   npm run dev
   ```

## MVP Features
- Signup (`/signup`)
- Login (`/login`)
- JWT persisted in `localStorage`
- Products list with category filter (`/`)
- Product details (`/products/[id]`)
- Protected create product page (`/products/new`)
- Owner actions on details page: mark sold + delete
- Logout from navbar

## Smoke flow
1. Signup with `name@student.nstu.edu.bd` and password (8+ chars).
2. Login and confirm navbar shows your email.
3. Open **New Product**, create a listing, verify redirect to product details.
4. Click **Mark Sold** and verify sold badge/status updates.
5. Click **Delete** and verify redirect to products list.
