import { NextFunction, Request, Response, Router } from "express";

import { prisma } from "../lib/prisma";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";

type ProductBody = {
  categoryId?: number;
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  imageUrl?: string;
  showEmail?: boolean;
  showWhatsapp?: boolean;
  showMessenger?: boolean;
};

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryIdParam = req.query.categoryId;
    let categoryId: number | undefined;

    if (typeof categoryIdParam === "string") {
      categoryId = Number(categoryIdParam);
      if (!Number.isInteger(categoryId)) {
        res.status(400).json({ message: "categoryId must be an integer" });
        return;
      }
    }

    const products = await prisma.product.findMany({
      where: categoryId ? { categoryId } : undefined,
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "Invalid product id" });
      return;
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { categoryId, title, description, price, location, imageUrl, showEmail, showWhatsapp, showMessenger } =
      req.body as ProductBody;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!title?.trim()) {
      res.status(400).json({ message: "title is required" });
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      res.status(400).json({ message: "price must be greater than 0" });
      return;
    }

    if (!Number.isInteger(Number(categoryId))) {
      res.status(400).json({ message: "categoryId is required and must be an integer" });
      return;
    }

    const validCategoryId = Number(categoryId);
    const category = await prisma.category.findUnique({ where: { id: validCategoryId } });
    if (!category) {
      res.status(400).json({ message: "categoryId does not exist" });
      return;
    }

    const product = await prisma.product.create({
      data: {
        userId: req.user.userId,
        categoryId: validCategoryId,
        title: title.trim(),
        description,
        price: numericPrice,
        location,
        imageUrl,
        showEmail,
        showWhatsapp,
        showMessenger,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    const { categoryId, title, description, price, location, imageUrl, showEmail, showWhatsapp, showMessenger } =
      req.body as ProductBody;

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "Invalid product id" });
      return;
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (existing.userId !== req.user.userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    if (!title?.trim()) {
      res.status(400).json({ message: "title is required" });
      return;
    }

    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      res.status(400).json({ message: "price must be greater than 0" });
      return;
    }

    if (!Number.isInteger(Number(categoryId))) {
      res.status(400).json({ message: "categoryId is required and must be an integer" });
      return;
    }

    const validCategoryId = Number(categoryId);
    const category = await prisma.category.findUnique({ where: { id: validCategoryId } });
    if (!category) {
      res.status(400).json({ message: "categoryId does not exist" });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        categoryId: validCategoryId,
        title: title.trim(),
        description,
        price: numericPrice,
        location,
        imageUrl,
        showEmail,
        showWhatsapp,
        showMessenger,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/sold", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "Invalid product id" });
      return;
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (existing.userId !== req.user.userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const updated = await prisma.product.update({
      where: { id },
      data: { isSold: true },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    if (!Number.isInteger(id)) {
      res.status(400).json({ message: "Invalid product id" });
      return;
    }

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    if (existing.userId !== req.user.userId) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    await prisma.product.delete({ where: { id } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as productsRouter };
