import React, { useState, useEffect } from "react";
import socket from "../services/socket";
import { Link, useNavigate } from "react-router-dom";

function Thingspeak() {
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [driverType, setDriverType] = useState(""); // State for the driver type selection


  const fetchDataFromThingSpeak = async () => {
  try {
    const response = await fetch("https://api.thingspeak.com/channels/2521937/feeds.json?results=1");
    const data = await response.json();
    console.log(data);
    // Check if the response contains feeds array
    if (data.feeds && data.feeds.length > 0) {
      const feed = data.feeds[0]; // Get the first feed object
      const latitude = parseFloat(feed.field1); // Extract latitude value and convert to float
      const longitude = parseFloat(feed.field2); // Extract longitude value and convert to float

      // Do something with latitude and longitude values
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      setCoordinates({ latitude, longitude });
      setDriverType("MensHostel");
      socket.emit("message", { latitude, longitude, driverType });
    } else {
      console.error("No feeds found in the response.");
    }
  } catch (error) {
    console.error("Error fetching data from ThingSpeak:", error);
  }
};

  

  useEffect(() => {
    fetchDataFromThingSpeak();
    const interval = setInterval(() => {
      fetchDataFromThingSpeak();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [driverType]); // Include driverType in the dependency array to update when it changes

}

export default Thingspeak;
