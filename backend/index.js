const cors = require("cors"); //cors-policy 
const http = require("http"); //http
const express = require("express"); //framework for node
const socketio = require("socket.io");  //socket connection 
const axios = require("axios");  // for making HTTP requests


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
const fetchDataFromThingSpeak = async () => {
  const url = 'https://api.thingspeak.com/channels/2521937/feeds.json?results=1';
  try {
    const response = await axios.get(url);
    if (response.status === 200) { // Check if the response status is 200 (OK)
      const data = response.data;
      if (data && data.feeds && data.feeds.length > 0) {
        const latitude = parseFloat(data.feeds[0].field1);
        const longitude = parseFloat(data.feeds[0].field2);
        const driverType = "MensHostel";
        message = { latitude, longitude, driverType }
        userValues["dackjaniels"] = message;
        io.emit("userValues", userValues);
        console.log("got data from uno and sent!")
        // io.emit('message', { latitude, longitude, driverType });
      } else {
        console.error('No data found in ThingSpeak response');
      }
    } else {
      console.error(`Unexpected status code ${response.status} while fetching data from ThingSpeak`);
    }
  } catch (error) {
    console.error('Error fetching data from ThingSpeak:', error);
  }
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
