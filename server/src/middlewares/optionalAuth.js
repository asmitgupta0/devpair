import "dotenv/config";
import jwt, {} from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
if (secret === undefined) {
    throw new Error("JWT_SECRET is not defined");
}
export default function optionalAuthMiddleware(req, res, next) {
    req.user = null;
    console.log("received cookie:", req.cookies);
    if (!req.cookies.authToken) {
        console.log("GUEST MODE");
        return next();
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }
    const authToken = req.cookies.authToken;
    let decoded;
    try {
        decoded = jwt.verify(authToken, secret);
    }
    catch (err) {
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
//# sourceMappingURL=optionalAuth.js.map