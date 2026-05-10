import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.min.js';
import { Link, useNavigate } from "react-router-dom";
import heroImage from './busstand.png';
import * as Icon from 'react-bootstrap-icons';

const Home = () => {
  const navigate = useNavigate();

  const goToDriver = () => {
    navigate("/login");
  };

  const goToViewer = () => {
    navigate("/viewer");
  };

  return (
    <div>
      {/* Navbar */}
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
                <a className="nav-link" href="#about">
                  About
                </a>
              </li>
              
            </ul>
          </div>
        </div>
      </nav>

{/* Bootstrap Hero Section */}
<div className="container col-xxl-8 px-4 py-5 text-bg-tertiary">
    <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div className="col-10 col-sm-8 col-lg-6">
        <img src={heroImage} className="d-block mx-lg-auto img-fluid rounded-3" alt="Bootstrap Themes" width="500" height="500" loading="lazy" />
      </div>
      <div className="col-lg-6">
        <h1 className="display-5 fw-bold text-body-emphasis lh-1 mb-3">Tired of waiting around ?</h1>
        <p className="lead">Never miss a ride, follow your shuttl's stride!</p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-start">
          <button className="btn btn-primary btn-lg px-4 me-md-2" onClick={goToViewer}>Try now</button>
          <button className="btn btn-outline-secondary btn-lg px-4" onClick={goToDriver}>Login as driver</button>
        </div>
      </div>
    </div>
  </div>


      
      

      {/* Buttons to navigate */}
      {/* <div className="container mt-4">
        <div className="row">
          <div className="col-md-6">
            <button className="btn btn-secondary" onClick={goToDriver}>
              Go to Driver
            </button>
          </div>
          <div className="col-md-6">
            <button className="btn btn-secondary" onClick={goToViewer}>
              Go to Viewer
            </button>
          </div>
        </div>
      </div> */}

      {/* About */}
      <div className="container px-4 py-5 text-bg-dark rounded-3" id="about">
    <h2 className="pb-2 border-bottom">Welcome to Shuttl</h2>

    <div className="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
      <div className="col d-flex flex-column align-items-start gap-2">
        <h2 className="fw-bold text-body-emphasis-dark">Streamlining Campus Commutes with Shuttle Tracking</h2>
        <p className="text-body-dark">Your efficient and transparent online service for hassle-free shuttle tracking, transforming campus commutes at VIT University.</p>
      </div>

      <div className="col">
        <div className="row row-cols-1 row-cols-sm-2 g-4">
          <div className="col d-flex flex-column gap-2">
            <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-dark bg-gradient fs-4 rounded-3">
               <Icon.ClockHistory height="2em" />
            </div>
            <h4 className="fw-semibold mb-0 text-body-emphasis-dark">Real-Time Tracking</h4>
            <p className="text-body-dark">Live, accurate tracking of shuttle cabs on an interactive map.</p>
          </div>

          <div className="col d-flex flex-column gap-2">
            <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-dark bg-gradient fs-4 rounded-3">
              
              <Icon.SignTurnLeftFill className="bi" height="2em" />
            </div>
            <h4 className="fw-semibold mb-0 text-body-emphasis-dark">Route Selection</h4>
            <p className="text-body-dark">Users can select specific bus routes based on their destination within the campus.</p>
          </div>

          <div className="col d-flex flex-column gap-2">
            <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-dark bg-gradient fs-4 rounded-3">
            
               <Icon.EyeFill className="bi" height="2em" /> 
            </div>
            <h4 className="fw-semibold mb-0 text-body-emphasis-dark">Transparency</h4>
            <p className="text-body-dark">Aims to eliminate uncertainty in campus commuting by providing transparent shuttle tracking information.</p>
          </div>

          <div className="col d-flex flex-column gap-2">
            <div className="feature-icon-small d-inline-flex align-items-center justify-content-center text-bg-dark bg-gradient fs-4 rounded-3">
            
              <Icon.MapFill className="bi" height="2em" />
            </div>
            <h4 className="fw-semibold mb-0 text-body-emphasis-dark">Interactive Map with ETA</h4>
            <p className="text-body-dark">Visual representation of bus routes and shuttle locations for enhanced understanding</p>
          </div>
        </div>
      </div>
    </div>
  </div>


      {/* Footer */}
      <footer className="footer mt-5 py-3 bg-light bottom">
        <div className="container">
          <span className="text-muted">
            &copy; 2024 Shuttl. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Home;