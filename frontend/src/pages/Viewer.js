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
    // Initialize the map when the component mounts
    if (!map) {
      const newMap = L.map("map").setView([12.9725174, 79.1583036], 15);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(newMap);
      setMap(newMap);
    }
  }, [map]);

  const updateMarkers = (userValues) => {
    if (map) {
      // Clear existing markers
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Create new markers based on values
      Object.entries(userValues).forEach(([socketId, values]) => {
        const latitude=values.latitude;
        const longitude=values.longitude;
        console.log(" hey der : "+ latitude +" bruv : "+ longitude);
        if (typeof latitude === "number" && typeof longitude === "number") {
          const marker = L.marker([latitude, longitude]).addTo(map);
          console.log("izza numbah hey der : "+ latitude +" bruv : "+ longitude);
          marker.bindPopup(`Socket ID: ${socketId}`);
        }
      });
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
