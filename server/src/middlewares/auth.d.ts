import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
export default function authMiddleware(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map