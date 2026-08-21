import app from "./app";
import http from "node:http";
import { Server } from "socket.io";

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
const roomCodes = new Map<string, string>();
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("room:join", async (roomId) => {
    console.log("Client wants to join:", roomId);
    socket.join(roomId);
    const sockets = await io.in(roomId).fetchSockets();
    console.log(sockets.length);

    let currentCode = "// type your code here";
    if (!roomCodes.has(roomId)) {
      roomCodes.set(roomId, currentCode);
    } else {
      currentCode = roomCodes.get(roomId) ?? "";
    }

    socket.emit("editor:change", currentCode);
    console.log("current room code emitted to new client in room.");
  });
  socket.on("editor:change", (newCode, roomId) => {
    console.log("new code being emitted by socket: ", socket.id);
    roomCodes.set(roomId, newCode);
    socket.to(roomId).emit("editor:change", newCode);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
