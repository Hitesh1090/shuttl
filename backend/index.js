const cors = require("cors"); //cors-policy 
const http = require("http"); //http
const express = require("express"); //framework for node
const socketio = require("socket.io");  //socket connection 
const jwt = require("jsonwebtoken");

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.JWT_SECRET || "shuttl_super_secret_key";
const DRIVER_PASSWORD = process.env.DRIVER_PASSWORD || "VITVLR2024";



// Login endpoint for drivers
app.post("/login", (req, res) => {
  const { password } = req.body;
  

  
  if (password === DRIVER_PASSWORD) {
    const token = jwt.sign({ role: "driver" }, SECRET_KEY, { expiresIn: "12h" });
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ success: false, message: "Invalid password" });
  }
});

let numUsers = 0;
//the entity which we are broadcasting
let userValues = {};  //(driver_id:coor),or store in a db instead of here

//everytime a client the site
io.on("connection", (socket) => {
  numUsers++;
  console.log(`User connected. There are now ${numUsers} ser(s)`);
  console.log("socket.id: " + socket.id); //each socket_id will have unique id
  socket.emit("userValues", userValues);  //as soon as someone joins, broadcast the exisiting userValue
 
  //look at frontend/src/pages/Driver.js
  //it emits message event and u r catching it here
  socket.on("message", (data) => {
    if (!data.token) {
      console.log("Blocked unauthorized socket emit");
      return;
    }

    try {
      // Verify token
      jwt.verify(data.token, SECRET_KEY);

      console.log("Received authenticated message from driver.");
      const message = { latitude: data.latitude, longitude: data.longitude, driverType: data.driverType };
      
      //creating new entry
      userValues[socket.id] = message;

      //emitting latest value
      io.emit("userValues", userValues);
    } catch(err) {
      console.log("Invalid token from driver emit.");
    }
  });

  //like destructor
  socket.on("disconnect", () => {
    numUsers--;
    console.log(`User disconnected. There are now ${numUsers} user(s)`);
    delete userValues[socket.id];
    io.emit("userValues", userValues);
    io.emit("disconnection", { numUsers: numUsers });
    socket.disconnect(true);
  });
});

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
