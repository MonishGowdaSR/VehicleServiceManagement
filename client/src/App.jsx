import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Tracking from "./pages/Tracking";
import AgentSimulator from "./pages/AgentSimulator";

import "leaflet/dist/leaflet.css";

/* =========================
   USER PROTECTED ROUTE
========================= */
function UserRoute({ children }) {
  const token =
    localStorage.getItem(
      "userToken"
    );

  const role =
    localStorage.getItem(
      "role"
    );

  return token &&
    role === "USER"
    ? children
    : (
      <Navigate
        to="/login"
        replace
      />
    );
}

/* =========================
   ADMIN PROTECTED ROUTE
========================= */
function AdminRoute({
  children
}) {
  const token =
    localStorage.getItem(
      "adminToken"
    );

  const role =
    localStorage.getItem(
      "role"
    );

  return token &&
    role === "ADMIN"
    ? children
    : (
      <Navigate
        to="/admin-login"
        replace
      />
    );
}

function App() {
  return (
    <Routes>
      {/* Default */}
      <Route
        path="/"
        element={
          <Navigate
            to="/login"
          />
        }
      />

      {/* ================= USER LOGIN ================= */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* ================= ADMIN LOGIN ================= */}
      <Route
        path="/admin-login"
        element={
          <AdminLogin />
        }
      />

      {/* ================= USER DASHBOARD ================= */}
      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <Dashboard />
          </UserRoute>
        }
      />

      {/* ================= ADMIN DASHBOARD ================= */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />

      {/* ================= TRACKING ================= */}
      <Route
        path="/track/:id"
        element={
          <UserRoute>
            <Tracking />
          </UserRoute>
        }
      />

      {/* ================= AGENT ================= */}
      <Route
        path="/agent"
        element={
          <AgentSimulator />
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
          />
        }
      />
    </Routes>
  );
}

export default App;