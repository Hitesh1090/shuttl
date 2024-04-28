import io from "socket.io-client";

// in .env change REACT_APP_ENGA to "DEV" when working locally

const SOCKET_URL = process.env.REACT_APP_ENGA === "PROD"? process.env.REACT_APP_SERVER_URL : "http://localhost:8080"
// const SOCKET_URL = "https://shuttl-server.onrender.com";
const socket = io(SOCKET_URL);
export default socket;