import React, { useState, useEffect, useRef } from "react";
import socket from "../services/socket";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L, { routing } from 'leaflet';
import 'leaflet-routing-machine';
import { connect } from "socket.io-client";
import userIc from './Images/geo-fill.svg';
import busIc from'./Images/bus-front-fill.svg';

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
    iconUrl: userIc, // Replace with the path to your SVG icon
    iconSize: [30, 30], // Adjust the size of the icon
  });

  const busIcon = L.icon({
    iconUrl: busIc, // Replace with the path to your SVG icon
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
        routingControl.current.spliceWaypoints(0, 2); // Remove waypoints to clear the route
        map.removeControl(routingControl.current);
        routingControl.current = null; // Remove the routing control
      }
  
      console.log("UC : " + userCoordinates + " DC :" + driverCoordinates);
  
      L.Routing.control({
        waypoints: [
          L.latLng(userCoordinates[0], userCoordinates[1]),
          L.latLng(driverCoordinates[0], driverCoordinates[1]),
        ],
        show: false,
        autoRoute: true,
        waypointMode: 'connect',
        collapsible: true, // assuming 'connect' is a string
      }).addTo(map).on('routesfound', function (e) {
        routingControl.current = e.routes[0].route; // Store the routing control
      });
      // To remove the routing control and cleanup
      /* routing.removeFrom(map);
      routing = null; */
    }
  }, [selectedDriver, map, userCoordinates, driverCoordinates]);
  

  return (
    <div>
      <div class="p-5 mb-4 bg-body-tertiary rounded-3">
      <div class="container-fluid py-5">
        <h2 class="display-5 fw-bold">Drivers Online</h2>
        <ol>
        {Object.entries(userValues).map(([socketId, values]) => (
          <li class="col-md-8 fs-4" key={socketId}>
            Driver Type: {values.driverType}
          </li>
        ))}
        </ol>
      </div>
    </div>

      <div id="map" style={{ height: "400px" }}></div>
      {Object.keys(userValues).map(([socketId,values]) => (
        <button class="list-group-item list-group-item-action d-flex gap-3 py-3" key={socketId} onClick={() => handleDriverSelect(socketId)}>
          <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 class="mb-0">Select Driver</h6>
          <p class="mb-0 opacity-75">{values.driverType}</p>
      </div>
      </div>
        </button>
      ))}
    </div>
  );
}

export default Viewer;
