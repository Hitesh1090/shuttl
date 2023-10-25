import React, { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';

function Viewer() {
  const [userValues, setUserValues] = useState({});
  const [map, setMap] = useState(null); // Store the map instance
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [driverCoordinates, setDriverCoordinates] = useState(null);
  const routingControl = useRef(null);

  useEffect(() => {
    socket.on("userValues", (values) => {
      setUserValues(values);
    });

    return () => {
      socket.off("userValues");
    };
  }, []);

  const userIcon = L.icon({
    iconUrl: '/Images/geo-fill.svg', // Replace with the path to your SVG icon
    iconSize: [30, 30], // Adjust the size of the icon
  });

  const busIcon = L.icon({
    iconUrl: 'bus-front-fill.png', // Replace with the path to your SVG icon
    iconSize: [30, 30], // Adjust the size of the icon
  });


  const handleDriverSelect = (socketId) => {
    setSelectedDriver(socketId);
  
    // Retrieve the coordinates for the selected driver
    const selectedDriverData = userValues[socketId];
  
    if (selectedDriverData) {
      const { latitude, longitude } = selectedDriverData;
      setDriverCoordinates([latitude, longitude]);
    } else {
      // Handle the case where the selected socketID doesn't exist in userValues
      console.error(`Driver data for socketID ${socketId} not found.`);
    }
  };
  


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


  const addMarkerForUserLocation = (map) => {
    if (navigator.geolocation) {
      console.log("Bruv inside curr pos bruv :)")
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates([latitude, longitude]); // Set the user coordinates
          const userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
          userMarker.bindPopup("Your Location").openPopup();
        },
        (error) => {
          console.error("Error getting user's location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }
  };


  useEffect(() => {
    console.log("Entering update markers :)");
    updateMarkers(userValues);
    
  }, [userValues]);



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
        addMarkerForUserLocation(map);
        
        Object.entries(values).forEach(([socketId, data]) => {
          const latitude = data.latitude;
          const longitude = data.longitude;
          const driverType = data.driverType; // Get the driver type from data
          console.log("Lat : " + latitude + " lon : " + longitude + " :)");
          if (typeof latitude === "number" && typeof longitude === "number") {
            const marker = L.marker([latitude, longitude], {icon: busIcon}).addTo(map);
            marker.bindPopup(`Socket ID: ${socketId}, Driver Type: ${driverType}`); // Display driver type in the popup
          }
        });
      }
    } catch (error) {
      console.error("Marker update error:", error);
    }
  };

  //Routing
  useEffect(() => {
    console.log("This is the routing useEffect");
    if (selectedDriver && map && userCoordinates && driverCoordinates) {
      if (routingControl.current) {
        map.removeControl(routingControl.current); // Remove any previous routing control
      }

      console.log("UC : "+userCoordinates+" DC :"+driverCoordinates);
      L.Routing.control({
        waypoints: [
          L.latLng(userCoordinates[0], userCoordinates[1]),
          L.latLng(driverCoordinates[0], driverCoordinates[1]),
        ],
        routeWhileDragging: true,
      }).addTo(map);
    }
  }, [selectedDriver, map, userCoordinates, driverCoordinates]);

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
      {Object.keys(userValues).map((socketId) => (
        <button key={socketId} onClick={() => handleDriverSelect(socketId)}>
          Select Driver {socketId}
        </button>
      ))}
    </div>
  );
}

export default Viewer;
