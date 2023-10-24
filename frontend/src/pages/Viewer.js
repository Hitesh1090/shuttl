import React, { useState, useEffect } from "react";
import socket from "../services/socket";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function Viewer() {
  const [userValues, setUserValues] = useState({});
  const [map, setMap] = useState(null); // Store the map instance
  const [userLocation, setUserLocation] = useState(null); // Store the user's location

  useEffect(() => {
    socket.on("userValues", (values) => {
      setUserValues(values);
    });

    return () => {
      socket.off("userValues");
    };
  }, []);

  useEffect(() => {
    try {
      // Initialize the map when the component mounts
      if (!map) {
        const newMap = L.map("map").setView([12.9725174, 79.1583036], 15);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(newMap);
        setMap(newMap);
        console.log("Map initialized");
      }
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  }, [map]);

  useEffect(() => {
    console.log("Entering update markers :)");
    updateMarkers(userValues);
  }, [userValues]);

  // Add a separate marker for the user's location
  useEffect(() => {
    if (map && userLocation) {
      const { latitude, longitude } = userLocation;
      if (typeof latitude === "number" && typeof longitude === "number") {
        const userIcon = L.icon({
          iconUrl: '../Images/geo-fill(1).svg', // Replace with the path to your user icon
          iconSize: [38, 38], // Adjust the size as needed
        });
        const userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        userMarker.bindPopup("Your Location");
      }
    }
  }, [map, userLocation]);

  const updateMarkers = (values) => {
    try {
      if (map) {
        // Clear existing markers
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });
        console.log("Inside update markers :)");
        // Create new markers based on values
        Object.entries(values).forEach(([socketId, data]) => {
          const latitude = data.latitude;
          const longitude = data.longitude;
          const driverType = data.driverType;
          console.log("Lat : " + latitude + " lon : " + longitude + " :)");
          if (typeof latitude === "number" && typeof longitude === "number") {
            const marker = L.marker([latitude, longitude]).addTo(map);
            marker.bindPopup(`Socket ID: ${socketId}, Driver Type: ${driverType}`);
          }
        });
      }
    } catch (error) {
      console.error("Marker update error:", error);
    }
  };

  return (
    <div>
      <h1>Viewer Page</h1>
      <h2>User Values:</h2>
      <ul>
        {Object.entries(userValues).map(([socketId, values]) => (
          <li key={socketId}>
            Socket ID: {socketId}, Latitude: {values.latitude}, Longitude: {values.longitude}, Driver Type: {values.driverType}
          </li>
        ))}
      </ul>
      <div id="map" style={{ height: "400px" }}></div>
    </div>
  );
}

export default Viewer;
