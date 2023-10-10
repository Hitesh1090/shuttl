import React, { useState, useEffect } from "react";
import socket from "../services/socket";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

function Viewer() {
  const [userValues, setUserValues] = useState({});
  const [map, setMap] = useState(null); // Store the map instance

  useEffect(() => {
    socket.on("userValues", (values) => {
      setUserValues(values);
      updateMarkers(values);
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

  const updateMarkers = (values) => {
    try {
      if (map) {
        // Clear existing markers
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker) {
            map.removeLayer(layer);
          }
        });

        // Create new markers based on values
        Object.entries(values).forEach(([socketId, data]) => {
          const latitude = data.latitude;
          const longitude = data.longitude;

          if (typeof latitude === "number" && typeof longitude === "number") {
            const marker = L.marker([latitude, longitude]).addTo(map);
            marker.bindPopup(`Socket ID: ${socketId}`);
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
            Socket ID: {socketId}, Latitude: {values.latitude}, Longitude: {values.longitude}
          </li>
        ))}
      </ul>
      <div id="map" style={{ height: "400px" }}></div>
    </div>
  );
}

export default Viewer;
