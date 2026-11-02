import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

if (secret === undefined) {
  throw new Error("JWT_SECRET is not defined");
}

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  req.user = null;
  console.log("received cookie:", req.cookies);

  if (!req.cookies.authToken) {
    return res.status(401).json({ err: "Unauthorized Access" });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  const authToken = req.cookies.authToken;
  let decoded;
  try {
    decoded = jwt.verify(authToken, secret);
  } catch (err) {
    return res.status(401).json({ err: "Unauthorized Access" });
  }

  if (typeof decoded === "string" || !("userId" in decoded)) {
    return res.status(401).json({ err: "Unauthorized Access" });
  }

  const userId = decoded.userId;
  req.user = { userId: userId };
  console.log("req.user", req.user);
  next();
}
