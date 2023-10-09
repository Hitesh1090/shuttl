import io from "socket.io-client";

const SOCKET_URL = "https://shuttl-server.onrender.com:10000"
const socket = io(SOCKET_URL);
export default socket;
