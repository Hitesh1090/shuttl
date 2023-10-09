import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const goToDriver = () => {
    navigate("/driver");
  };

  const goToViewer = () => {
    navigate("/viewer");
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={goToDriver}>Go to Driver</button>
      <button onClick={goToViewer}>Go to Viewer</button>
    </div>
  );
};

export default Home;