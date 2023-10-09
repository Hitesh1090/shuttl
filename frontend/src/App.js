import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Driver from "./pages/Driver";
import Viewer from "./pages/Viewer";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/driver" element={<Driver />} />
        <Route path="/viewer" element={<Viewer />} />
      </Routes>
    </Router>
  );
}

export default App;
