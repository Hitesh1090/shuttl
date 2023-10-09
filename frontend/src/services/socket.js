import io from "socket.io-client";

const SOCKET_URL = process.env.SERVER_URL || "http://localhost:8080"; //put {ip_addr}:port instead of localhost:8080 if u want to see in mobile also | port is the one in backend/index.js
const socket = io(SOCKET_URL);
export default socket;
