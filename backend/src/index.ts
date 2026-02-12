import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./errors";
import { prisma } from "./lib/prisma";
import { requireAuth } from "./middleware/auth";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";
import { productsRouter } from "./routes/products";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;


if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required. Set it in backend/.env before starting the server.");
}

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/products", productsRouter);

app.get("/auth/me", requireAuth, (req: Request, res: Response) => {
  const authReq = req as Request & { user?: { userId: number; email: string } };

  if (!authReq.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  res.json({ user: authReq.user });
});

app.get("/categories", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (_error) {
    next(new ApiError(500, "Unable to fetch categories. Please try again later."));
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

async function startServer() {
  try {
    await prisma.$connect();
    app.listen(port, () => {
      console.log(`Backend running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
}

void startServer();
