import React, { useState, useEffect } from "react";
import socket from "../services/socket";

function Viewer() {
  const [userValues, setUserValues] = useState({});

  useEffect(() => {
    socket.on("userValues", (values) => {
      setUserValues(values);
    });

    return () => {
      socket.off("userValues");
    };
  }, []);

  return (
    <div>
      <h1>Viewer Page</h1>
      <h2>User Values:</h2>
      <ul>
        {Object.entries(userValues).map(([socketId, values]) => (
          <li key={socketId}>
            Socket ID: {socketId}, Latitude: {values.latitude}, Longitude:{" "}
            {values.longitude}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Viewer;