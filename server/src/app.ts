import express from "express";
import cors from "cors";
import roomRouter from "./routes/room.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Devpair server is running",
  });
});

app.use("/rooms", roomRouter);
app.use("/auth", authRouter);

export default app;
