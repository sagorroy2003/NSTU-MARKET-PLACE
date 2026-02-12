import { NextFunction, Request, Response } from "express";

import { verifyToken } from "../utils/auth";

export type AuthenticatedRequest = Request & {
  user?: {
    userId: number;
    email: string;
  };
};

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authorization = req.header("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  try {
    const payload = verifyToken(token);
    req.user = {
      userId: payload.userId,
      email: payload.email,
    };
    next();
  } catch (_error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
