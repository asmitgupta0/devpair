import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authMiddleware from "./middlewares/auth.js";
import roomRouter from "./routes/room.js";
import authRouter from "./routes/auth.js";
import User from "./models/User.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Devpair server is running",
  });
});
app.get("/auth/me", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user)
    return res.status(401).json({
      authenticated: false,
      err: "Unauthorized Access",
    });
  return res.status(200).json({
    authenticated: true,
    username: user.username,
    email: user.email,
  });
});
app.post("/auth/logout", (req, res) => {
  res.clearCookie("authToken");
  res.send("Cookie cleared successfully!");
});

app.use("/rooms", roomRouter);
app.use("/auth", authRouter);

export default app;
