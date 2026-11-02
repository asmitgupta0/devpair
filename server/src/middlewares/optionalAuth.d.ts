import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
export default function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction): void | Response<any, Record<string, any>>;
//# sourceMappingURL=optionalAuth.d.ts.map