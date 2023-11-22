import React, { useState, useEffect } from "react";
import socket from "../services/socket";
import { Link, useNavigate } from "react-router-dom";

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
      
      <div className="container my-5">
      <div className="hero-section bg-dark text-light rounded-3 p-5">
      <div className="container">
        <h1 className="display-4">Welcome to Shuttl Services</h1>
        <p className="lead">Choose your route type to start real-time tracking.</p>
        
        <div className="card mt-5">
          <div className="card-body">
            <label className="form-label">Select Route Type: </label>
            <select className="form-select" value={driverType} onChange={handleDriverTypeChange}>
              <option value="">Select</option>
              <option value="MensHostel">Men's Hostel</option>
              <option value="LadiesHostel">Ladies' Hostel</option>
            </select>
          </div>
        </div>
      </div>
    </div>
    </div>

    <footer className="footer mt-5 py-3 bg-light mt-auto">
        <div className="container">
          <span className="text-muted">
            &copy; 2023 Shuttl. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
    
  );
}

export default Driver;
