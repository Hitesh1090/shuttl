import React, { useState, useEffect } from "react";
import socket from "../services/socket";

function Driver() {
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const fetchAndSendLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        socket.emit("message", { latitude, longitude });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    } else {
      console.error("Geolocation not supported by the browser.");
    }
  };

  useEffect(() => {
    fetchAndSendLocation();
    const interval = setInterval(() => {
      fetchAndSendLocation();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <h1>Driver Page</h1>
      <p>
        Coordinates sent to server every 5 seconds: Latitude:{" "}
        {coordinates.latitude}, Longitude: {coordinates.longitude}
      </p>
    </div>
  );
}

export default Driver;