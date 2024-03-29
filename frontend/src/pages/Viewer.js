import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Link, useNavigate } from "react-router-dom";
import socket from "../services/socket";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
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
  const [refreshMap, setRefreshMap] = useState(false);

  
 

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
  
  const clearSelection = () => {
    setSelectedDriver(null);
  
    // Remove the routing control if it exists
    if (routingControl.current) {
      routingControl.current.spliceWaypoints(0, 2);
      map.removeControl(routingControl.current);
      routingControl.current = null;
    }

    window.location.reload();
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

  //v1
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

  //TRASSSSHHHHHHHHH
  // const addMarkerForUserLocation = async (map) => {
  //   console.log("Bruv inside curr pos bruv :)")
  //   if (navigator.geolocation) {
  //     try{
  //       const position = await new Promise((resolve, reject) => {
  //         navigator.geolocation.getCurrentPosition(resolve, reject);
  //       });
        
  //       const { latitude, longitude } = position.coords;
  //         setUserCoordinates([latitude, longitude]); // Set the user coordinates
  //         const userMarker = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
  //         userMarker.bindPopup("Your Location").openPopup();
  //     }
  //     catch(error)
  //     {
  //       console.error("Error getting location:", error);
  //     }
  //   } else {
  //     console.error("Geolocation is not supported by your browser.");
  //   }
  // };


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
        // routingControl.current.spliceWaypoints(0, 2);
        // map.removeControl(routingControl.current); // Remove this line
        routingControl.current.setWaypoints([
          L.latLng(userCoordinates[0], userCoordinates[1]),
          L.latLng(driverCoordinates[0], driverCoordinates[1]),
        ]);
      } else {
        // Create a new routing control
        console.log("GOtha new routing control bahaha");
        routingControl.current = L.Routing.control({
          waypoints: [
            L.latLng(userCoordinates[0], userCoordinates[1]),
            L.latLng(driverCoordinates[0], driverCoordinates[1]),
          ],
          show: false,
          autoRoute: true,
          waypointMode: 'connect',
          collapsible: true,
        }).addTo(map);
        routingControl.current.on('routesfound', function (e) {
          // routingControl.current = e.routes[0].route;
        });
      }
      
    }
  }, [selectedDriver, map, userCoordinates, driverCoordinates]);
  

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-bus-front" viewBox="0 0 16 16">
  <path d="M5 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-6-1a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2H7Zm1-6c-1.876 0-3.426.109-4.552.226A.5.5 0 0 0 3 4.723v3.554a.5.5 0 0 0 .448.497C4.574 8.891 6.124 9 8 9c1.876 0 3.426-.109 4.552-.226A.5.5 0 0 0 13 8.277V4.723a.5.5 0 0 0-.448-.497A44.303 44.303 0 0 0 8 4Zm0-1c-1.837 0-3.353.107-4.448.22a.5.5 0 1 1-.104-.994A44.304 44.304 0 0 1 8 2c1.876 0 3.426.109 4.552.226a.5.5 0 1 1-.104.994A43.306 43.306 0 0 0 8 3Z"/>
  <path d="M15 8a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1V2.64c0-1.188-.845-2.232-2.064-2.372A43.61 43.61 0 0 0 8 0C5.9 0 4.208.136 3.064.268 1.845.408 1 1.452 1 2.64V4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1v3.5c0 .818.393 1.544 1 2v2a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5V14h6v1.5a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-2c.607-.456 1-1.182 1-2V8ZM8 1c2.056 0 3.71.134 4.822.261.676.078 1.178.66 1.178 1.379v8.86a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 11.5V2.64c0-.72.502-1.301 1.178-1.379A42.611 42.611 0 0 1 8 1Z"/>
</svg>  Shuttl
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

<div class="container my-5">
<div class="row align-items-md-stretch">
      <div class="col-md-6 my-2">
        <div class="h-100 p-5 text-bg-dark rounded-3">
          <h2>Drivers Online</h2>
          <p>{Object.keys(userValues).length}</p>
        </div>
      </div>
      <div class="col-md-6 my-2">
        <div class="h-100 p-5 bg-body-tertiary border rounded-3">
          <p>Any drivers logged in to the server will show up in the map given below and you can select their respective button to start the routing.</p>
        </div>
      </div>
    </div>
    </div>

  {/*     <div class="container my-5">
      <div class="h-100 p-5 mb-4 text-bg-dark rounded-3">
      <div class="container">
        <h3 class="display-5 fw-bold">Drivers Online:</h3>
        <p>{Object.keys(userValues).length}</p>
      </div>
    </div>
    </div> */}

          

      <div class="container">
      <div id="map" style={{ height: "400px" }} className="rounded-3"></div>
      </div>

      <div class="container my-5">
<div class="row align-items-md-stretch">
      <div class="col-md-6 my-2">
        <div class="h-100 p-5 text-bg-warning rounded-3">
          <p>Please make sure to clear selection if you are changing the driver</p>
        </div>
      </div>
      <div class="col-md-6 my-2">
      <div class="list-group">
      {Object.entries(userValues).map(([socketId,values]) => (
        <button class="list-group-item list-group-item-action d-flex gap-3 py-3" key={socketId} onClick={() => handleDriverSelect(socketId)}>
          <div class="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 class="mb-0">Select Driver</h6>
          <p class="mb-0 opacity-75">{values.driverType}</p>
      </div>
      </div>
        </button>
      ))}
      <button onClick={clearSelection} className="btn btn-secondary">
    Clear Selection
  </button>
</div>
      </div>
    </div>
    </div>
    <footer className="footer mt-5 py-3 bg-light mt-auto">
        <div className="container">
          <span className="text-muted">
            &copy; 2024 Shuttl. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default Viewer;
