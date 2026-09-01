import app from "./app";
import http from "node:http";
import { Server } from "socket.io";
import "dotenv/config";
import mongoose from "mongoose";
import Room from "./models/Room.js";

const mongoUri = process.env.MONGODB_URI;
if (mongoUri === undefined) {
  throw new Error("MONGODB_URI is not defined.");
}
mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("MongoDB Atlas connected successfully!");
  })
  .catch((err) => {
    console.error("mongo error: ", err);
  });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("room:join", async (roomId) => {
    socket.join(roomId);
  });

  socket.on("editor:change", async (newCode, roomId) => {
    try {
      const updated = await Room.findOneAndUpdate(
        { roomId },
        { code: newCode },
      );
      if (!updated) {
        console.warn(`editor:change for unknown room ${roomId}`);
        return;
      }
      socket.to(roomId).emit("editor:change", newCode);
    } catch (err) {
      console.error("Failed to persist code change:", err);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
