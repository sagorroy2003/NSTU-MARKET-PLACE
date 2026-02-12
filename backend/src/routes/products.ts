import { NextFunction, Request, Response, Router } from "express";

import { ApiError } from "../errors";
import { prisma } from "../lib/prisma";
import { AuthenticatedRequest, requireAuth } from "../middleware/auth";

type ProductBody = {
  userId?: number;
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

function parseProductId(idParam: string): number {
  const id = Number(idParam);

  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(400, "Invalid product id");
  }

  return id;
}

async function ensureCategoryExists(categoryId: number): Promise<void> {
  const category = await prisma.category.findUnique({ where: { id: categoryId } });

  if (!category) {
    throw new ApiError(400, "categoryId does not exist");
  }
}

function normalizeProductInput(body: ProductBody): {
  categoryId: number;
  title: string;
  price: number;
  description?: string;
  location?: string;
  imageUrl?: string;
  showEmail?: boolean;
  showWhatsapp?: boolean;
  showMessenger?: boolean;
} {
  if (body.userId !== undefined) {
    throw new ApiError(400, "userId is not allowed in request body");
  }

  if (!body.title?.trim()) {
    throw new ApiError(400, "title is required");
  }

  const price = Number(body.price);
  if (!Number.isFinite(price) || price <= 0) {
    throw new ApiError(400, "price must be greater than 0");
  }

  const categoryId = Number(body.categoryId);
  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new ApiError(400, "categoryId is required and must be a positive integer");
  }

  return {
    categoryId,
    title: body.title.trim(),
    price,
    description: body.description,
    location: body.location,
    imageUrl: body.imageUrl,
    showEmail: body.showEmail,
    showWhatsapp: body.showWhatsapp,
    showMessenger: body.showMessenger,
  };
}

async function getOwnedProductOrThrow(productId: number, userId: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  if (product.userId !== userId) {
    throw new ApiError(403, "Forbidden");
  }

  return product;
}

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryIdParam = req.query.categoryId;
    let categoryIdFilter: number | undefined;

    if (typeof categoryIdParam === "string") {
      const parsed = Number(categoryIdParam);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new ApiError(400, "categoryId must be a positive integer");
      }
      categoryIdFilter = parsed;
    }

    const products = await prisma.product.findMany({
      where: categoryIdFilter !== undefined ? { categoryId: categoryIdFilter } : undefined,
      orderBy: { createdAt: "desc" },
    });

    res.json(products);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = parseProductId(req.params.id);
    const product = await prisma.product.findUnique({ where: { id: productId } });

    if (!product) {
      throw new ApiError(404, "Product not found");
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const normalized = normalizeProductInput(req.body as ProductBody);
    await ensureCategoryExists(normalized.categoryId);

    const product = await prisma.product.create({
      data: {
        userId: req.user.userId,
        categoryId: normalized.categoryId,
        title: normalized.title,
        description: normalized.description,
        price: normalized.price,
        location: normalized.location,
        imageUrl: normalized.imageUrl,
        showEmail: normalized.showEmail,
        showWhatsapp: normalized.showWhatsapp,
        showMessenger: normalized.showMessenger,
      },
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const productId = parseProductId(req.params.id);
    await getOwnedProductOrThrow(productId, req.user.userId);

    const normalized = normalizeProductInput(req.body as ProductBody);
    await ensureCategoryExists(normalized.categoryId);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        categoryId: normalized.categoryId,
        title: normalized.title,
        description: normalized.description,
        price: normalized.price,
        location: normalized.location,
        imageUrl: normalized.imageUrl,
        showEmail: normalized.showEmail,
        showWhatsapp: normalized.showWhatsapp,
        showMessenger: normalized.showMessenger,
      },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/sold", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const productId = parseProductId(req.params.id);
    await getOwnedProductOrThrow(productId, req.user.userId);

    const updated = await prisma.product.update({
      where: { id: productId },
      data: { isSold: true },
    });

    res.json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", requireAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      throw new ApiError(401, "Unauthorized");
    }

    const productId = parseProductId(req.params.id);
    await getOwnedProductOrThrow(productId, req.user.userId);

    await prisma.product.delete({ where: { id: productId } });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export { router as productsRouter };
