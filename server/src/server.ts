import app from "./app";
import http from "node:http";
import { Server } from "socket.io";
import "dotenv/config";
import mongoose from "mongoose";
import Room from "./models/Room.js";

const debounceTimers = new Map<string, ReturnType<typeof setTimeout>>();

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
    try {
      const room = await Room.findOne({ roomId });
      if (!room) return;
      socket.join(roomId);
    } catch (err) {
      console.error("Failed to join room:", err);
    }
  });

  socket.on("editor:change", (newCode, roomId) => {
    if (!socket.rooms.has(roomId)) return;

    socket.to(roomId).emit("editor:change", newCode);

    if (debounceTimers.has(roomId)) {
      const timerId = debounceTimers.get(roomId);
      clearTimeout(timerId);
    }
    const timerId = setTimeout(async () => {
      try {
        console.log("mongodb write!");
        const updated = await Room.findOneAndUpdate(
          { roomId },
          { code: newCode },
        );
        if (!updated) {
          console.warn(`editor:change for unknown room ${roomId}`);
          return;
        }
      } catch (err) {
        console.error("Failed to persist code change:", err);
      } finally {
        debounceTimers.delete(roomId);
      }
    }, 500);

    debounceTimers.set(roomId, timerId);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
