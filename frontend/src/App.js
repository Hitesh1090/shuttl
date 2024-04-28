import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Driver from "./pages/Driver";
import Viewer from "./pages/Viewer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Thingspeak from "./pages/thingspeak";
import "./App.css";


function App() {
  // console.log(process.env.REACT_APP_ENGA)
  // console.log(process.env.REACT_APP_SERVER_URL)
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/thingspeak" element={<Thingspeak />} /> */}
      </Routes>
    </Router>
  );
}

export default App;