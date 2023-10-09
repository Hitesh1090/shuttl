const socketIOClient = require("socket.io-client");
const socket = socketIOClient("http://localhost:8080");

// Event: Connection established with the server
socket.on("connect", () => {
  console.log("Connected to the server");

  // Send a message to the server
  socket.emit("message", "Hello, server!");
});

// Event: Message received from the server
socket.on("message", (message) => {
  console.log("Received message:", message);
});

// Event: Connection closed
socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
