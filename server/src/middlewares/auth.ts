import jwt from "jsonwebtoken";
import "dotenv/config";

const secret = process.env.JWT_SECRET;

if (secret === undefined) {
  throw new Error("JWT_SECRET is not defined");
}

export default function authMiddleware(req, res, next) {
  req.user = null;
  console.log("received cookie:", req.cookies);

  if (!req.cookies.authToken) {
    return res.status(401).json({ err: "Unauthorized Access" });
  }
  const authToken = req.cookies.authToken;
  let decoded;
  try {
    decoded = jwt.verify(authToken, secret);
  } catch (err) {
    return res.status(401).json({ err: "Unauthorized Access" });
  }
  const userId = decoded.userId;
  req.user = { userId: userId };
  console.log("req.user", req.user);
  next();
}
