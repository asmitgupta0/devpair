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

io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);
  socket.on("room:join", async (roomId) => {
    console.log("Client wants to join:", roomId);
    socket.join(roomId);
    console.log(socket.rooms);
    const sockets = await io.in(roomId).fetchSockets();
    console.log(sockets.length);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
