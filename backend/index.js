const cors = require("cors"); //cors-policy 
const http = require("http"); //http
const express = require("express"); //framework for node
const socketio = require("socket.io");  //socket connection 
const request = require('request');

//should do dk why
const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

let numUsers = 0;
//the entity which we are broadcasting
let userValues = {};  //(driver_id:coor),or store in a db instead of here

//.on("eventName",func(params){}) -> do func on eventName
//.emit("eventName",params) -> emit an event of eventName with params
const fetchDataFromThingSpeak = () => {
  // Make a request to the ThingSpeak API to get the latest data
  const url = 'https://api.thingspeak.com/channels/2521937/feeds.json?results=1';
  request(url, (error, response, body) => {
      if (!error && response.statusCode === 200) {
          // Parse the JSON response
          const data = JSON.parse(body);
          if (data && data.feeds && data.feeds.length > 0) {
              // Extract latitude and longitude from the response
              const latitude = parseFloat(data.feeds[0].field1);
              const longitude = parseFloat(data.feeds[0].field2);
              const driverType= "MensHostel";
              // Emit the message to all clients
              io.emit('message', { latitude, longitude, driverType });
          }
      } else {
          console.error('Error fetching data from ThingSpeak:', error);
      }
  });
};

// Emit message even if no clients are connected
setInterval(fetchDataFromThingSpeak, 5000);

//everytime a client the site
io.on("connection", (socket) => {
  numUsers++;
  console.log(`User connected. There are now ${numUsers} ser(s)`);
  console.log("socket.id: " + socket.id); //each socket_id will have unique id
  socket.emit("userValues", userValues);  //as soon as someone joins, broadcast the exisiting userValue
 
  //look at frontend/src/pages/Driver.js
  //it emits message event and u r catching it here
  socket.on("message", (message) => {
    console.log("Received message:", message);
    console.log("Uservalues: ", userValues);

    //creating new entry
    userValues[socket.id] = message;

    //emitting latest value
    io.emit("userValues", userValues);
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
