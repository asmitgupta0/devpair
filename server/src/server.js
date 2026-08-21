"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const node_http_1 = __importDefault(require("node:http"));
const socket_io_1 = require("socket.io");
const server = node_http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    },
});
const roomCodes = new Map();
io.on("connection", (socket) => {
    socket.on("room:join", async (roomId) => {
        socket.join(roomId);
        let currentCode = "// type your code here";
        if (!roomCodes.has(roomId)) {
            roomCodes.set(roomId, currentCode);
        }
        else {
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
//# sourceMappingURL=server.js.map