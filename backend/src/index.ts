import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";

import { prisma } from "./lib/prisma";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.get("/categories", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    res.json(categories);
  } catch (error) {
    next(error);
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
