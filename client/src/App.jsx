import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tracking from "./pages/Tracking";
import AgentSimulator from "./pages/AgentSimulator";
import AdminLogin from "./adminPages/AdminLogin";
import AdminDashboard from "./adminPages/AdminDashboard";
import AdminBookings from "./adminPages/AdminBookings";
import AdminPayments from "./adminPages/AdminPayments";
import AdminAnalytics from "./adminPages/AdminAnalytics";
import AdminUsers from "./adminPages/AdminUsers";

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
/> <Route
  path="/admin/bookings"
  element={
    <AdminRoute>
      <AdminBookings />
    </AdminRoute>
  }
/>

<Route
  path="/admin/payments"
  element={
    <AdminRoute>
      <AdminPayments />
    </AdminRoute>
  }
/>

<Route
  path="/admin/analytics"
  element={
    <AdminRoute>
      <AdminAnalytics />
    </AdminRoute>
  }
/>

<Route
  path="/admin/users"
  element={
    <AdminRoute>
      <AdminUsers />
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