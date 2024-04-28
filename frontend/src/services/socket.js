import io from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_ENV == "PROD"? process.env.REACT_APP_SERVER_URL : "http://localhost:8080"
// const SOCKET_URL = "https://shuttl-server.onrender.com";
const socket = io(SOCKET_URL);
export default socket;