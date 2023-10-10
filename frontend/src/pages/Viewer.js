import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet/dist/leaflet.js';
import io from 'socket.io-client';

function Viewer() {
  const [driverData, setDriverData] = useState({});
  const socket = io('https://shuttl-server.onrender.com'); // Replace with your server's URL
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map only if it hasn't been initialized already
      const map = L.map('map').setView([12.9725174, 79.1583036], 15);
      const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
      osm.addTo(map);
      
      mapRef.current = map; // Store the map reference in the ref
    }

    socket.on('userValues', (data) => {
      setDriverData(data);
      updateDriverMarkers(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const updateDriverMarkers = (data) => {
    const map = mapRef.current; // Get the map reference

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Create new markers
    Object.keys(data).forEach((socketId) => {
      const { lat, long } = data[socketId];
      const BusIcon = new L.Icon({
        iconUrl: 'truck-front-fill.svg',
        iconSize: [38, 95],
        iconAnchor: [22, 94],
        popupAnchor: [-3, -76],
        shadowSize: [68, 95],
        shadowAnchor: [22, 94],
      });

      L.marker([lat, long], { icon: BusIcon }).addTo(map);
    });
  };

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#"><img src="./bus-front.svg" height="30" alt="" /> Shuttl</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Features</a>
              </li>
            </ul>
            <form className="d-flex" role="search">
              <button className="btn btn-outline-dark" type="submit">Dark Mode</button>
            </form>
          </div>
        </div>
      </nav>

      <div className="row flex-lg-row-reverse align-items-center g-5 py-5 container">
        <div className="col-10 col-sm-8 col-lg-6">
          <div className="card" style={{ width: '30rem' }}>
            <div id="map" style={{ width: '100%', height: '60vh' }}></div>
            <div className="card-body">
              <h5 className="card-title">Map View</h5>
              <div className="dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Legend
                </button>
                <ul className="dropdown-menu">
                  <li><a className="dropdown-item" href="#"><img src="./geo-fill.svg" alt="" /> : Your Location</a></li>
                  <li><a className="dropdown-item" href="#"><img src="./truck-front-fill.svg" alt="" /> : Shuttle's Location</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Tired of waiting around?</h1>
          <p className="lead">Never miss your ride, follow your shuttle's stride!</p>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
