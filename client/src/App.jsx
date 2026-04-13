import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AgentSimulator from "./pages/AgentSimulator";
import Tracking from "./pages/Tracking";
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/agent" element={<AgentSimulator />} />
      <Route path="/track" element={<Tracking />} />
    </Routes>
  );
}

export default App;