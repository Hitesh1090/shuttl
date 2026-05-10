import React, { useState, useEffect, useRef } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Link } from "react-router-dom";
import socket from "../services/socket";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import userIc from './Images/geo-fill.svg';
import busIc from'./Images/bus-front-fill.svg';

const RoutingMachine = ({ userCoordinates, driverCoordinates }) => {
  const map = useMap();
  const routingControl = useRef(null);

  useEffect(() => {
    if (!userCoordinates || !driverCoordinates) {
        if (routingControl.current) {
            map.removeControl(routingControl.current);
            routingControl.current = null;
        }
        return;
    }

    if (!routingControl.current) {
      routingControl.current = L.Routing.control({
        waypoints: [
          L.latLng(userCoordinates[0], userCoordinates[1]),
          L.latLng(driverCoordinates[0], driverCoordinates[1]),
        ],
        show: false,
        autoRoute: true,
        waypointMode: 'connect',
        createMarker: () => null,
        collapsible: true,
      }).addTo(map);
    } else {
      routingControl.current.setWaypoints([
        L.latLng(userCoordinates[0], userCoordinates[1]),
        L.latLng(driverCoordinates[0], driverCoordinates[1]),
      ]);
    }
  }, [map, userCoordinates, driverCoordinates]);

  return null;
};

function Viewer() {
  const [userValues, setUserValues] = useState({});
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [userCoordinates, setUserCoordinates] = useState(null);
  const [driverCoordinates, setDriverCoordinates] = useState(null);

  useEffect(() => {
    socket.on("userValues", (values) => {
      setUserValues(values);
    });

    return () => {
      socket.off("userValues");
    };
  }, []);

  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates([latitude, longitude]);
        },
        (error) => {
          console.error("Error getting user's location:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("Geolocation is not supported by your browser.");
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  const userIcon = L.icon({
    iconUrl: userIc,
    iconSize: [30, 30],
  });

  const busIcon = L.icon({
    iconUrl: busIc,
    iconSize: [30, 30],
  });

  const handleDriverSelect = (socketId) => {
    setSelectedDriver(socketId);
    const selectedDriverData = userValues[socketId];
    if (selectedDriverData) {
      const { latitude, longitude } = selectedDriverData;
      setDriverCoordinates([latitude, longitude]);
    } else {
      console.error(`Driver data for socketID ${socketId} not found.`);
    }
  };
  
  const clearSelection = () => {
    setSelectedDriver(null);
    setDriverCoordinates(null);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-bus-front" viewBox="0 0 16 16">
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

<div className="container my-5">
<div className="row align-items-md-stretch">
      <div className="col-md-6 my-2">
        <div className="h-100 p-5 text-bg-dark rounded-3">
          <h2>Drivers Online</h2>
          <p>{Object.keys(userValues).length}</p>
        </div>
      </div>
      <div className="col-md-6 my-2">
        <div className="h-100 p-5 bg-body-tertiary border rounded-3">
          <p>Any drivers logged in to the server will show up in the map given below and you can select their respective button to start the routing.</p>
        </div>
      </div>
    </div>
    </div>

      <div className="container mb-5">
        <MapContainer center={[12.9725174, 79.1583036]} zoom={15} style={{ height: "400px" }} className="rounded-3 shadow-sm border">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {userCoordinates && (
            <Marker position={userCoordinates} icon={userIcon}>
              <Popup>Your Location</Popup>
            </Marker>
          )}

          {Object.entries(userValues).map(([socketId, data]) => {
            const { latitude, longitude, driverType } = data;
            if (typeof latitude === "number" && typeof longitude === "number") {
              return (
                <Marker key={socketId} position={[latitude, longitude]} icon={busIcon}>
                  <Popup>{`Socket ID: ${socketId}, Driver Type: ${driverType}`}</Popup>
                </Marker>
              );
            }
            return null;
          })}

          <RoutingMachine userCoordinates={userCoordinates} driverCoordinates={driverCoordinates} />
        </MapContainer>
      </div>

      <div className="container my-5">
<div className="row align-items-md-stretch">
      <div className="col-md-6 my-2">
        <div className="h-100 p-5 text-bg-warning rounded-3">
          <p>Please make sure to clear selection if you are changing the driver</p>
        </div>
      </div>
      <div className="col-md-6 my-2">
      <div className="list-group">
      {Object.entries(userValues).map(([socketId,values]) => (
        <button className="list-group-item list-group-item-action d-flex gap-3 py-3" key={socketId} onClick={() => handleDriverSelect(socketId)}>
          <div className="d-flex gap-2 w-100 justify-content-between">
        <div>
          <h6 className="mb-0">Select Driver</h6>
          <p className="mb-0 opacity-75">{values.driverType}</p>
      </div>
      </div>
        </button>
      ))}
      <button onClick={clearSelection} className="btn btn-secondary mt-3">
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
