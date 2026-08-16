import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.connect();

socket.on("connect", () => {
  console.log("New socket connection!", socket.connected);
});
socket.on("disconnect", () => {
  console.log("Socket disconnected!", socket.connected);
});

export default socket;
