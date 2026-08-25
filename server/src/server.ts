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
    console.log("mongo error: ", err);
  });

// const testRoom = new Room({
//   roomId: "xyz_test",
//   code: "// type your code here",
//   language: "javascript",
// });
// testRoom.save();
// const res = await Room.findOneAndUpdate(
//   { roomId: "xyz_test" },
//   { code: "new code updates successfully!" },
// );
const res = await Room.findOneAndDelete({ roomId: "xyz_test" });
console.log(res);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
const roomCodes = new Map<string, string>();
io.on("connection", (socket) => {
  socket.on("room:join", async (roomId) => {
    socket.join(roomId);

    let currentCode = "// type your code here";
    if (!roomCodes.has(roomId)) {
      roomCodes.set(roomId, currentCode);
    } else {
      currentCode = roomCodes.get(roomId) ?? "";
    }

    socket.emit("editor:change", currentCode);
  });
  socket.on("editor:change", (newCode, roomId) => {
    roomCodes.set(roomId, newCode);
    socket.to(roomId).emit("editor:change", newCode);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
