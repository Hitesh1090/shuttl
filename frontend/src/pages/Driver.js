import React, { useState, useEffect } from "react";
import socket from "../services/socket";

function Driver() {
  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });
  const [driverType, setDriverType] = useState(""); // State for the driver type selection

  const fetchAndSendLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        setCoordinates({ latitude, longitude });
        socket.emit("message", { latitude, longitude, driverType }); // Send driverType along with coordinates
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
  }, [driverType]); // Include driverType in the dependency array to update when it changes

  const handleDriverTypeChange = (event) => {
    setDriverType(event.target.value);
  };

  return (
    <div>
      <h1>Driver Page</h1>
      <div>
        <label>Select Driver Type: </label>
        <select value={driverType} onChange={handleDriverTypeChange}>
          <option value="">Select</option>
          <option value="MensHostel">Men's Hostel</option>
          <option value="LadiesHostel">Ladies' Hostel</option>
        </select>
      </div>
      <p>
        Coordinates sent to server every 5 seconds: Latitude: {coordinates.latitude}, Longitude: {coordinates.longitude}
      </p>
    </div>
  );
}

export default Driver;
