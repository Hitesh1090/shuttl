import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Driver from "./pages/Driver";
import Viewer from "./pages/Viewer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/viewer" element={<Viewer />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;