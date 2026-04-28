import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const res = await fetch(
      "http://localhost:5000/api/admin/bookings",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();
    setBookings(data.data || []);
  };

  const updateStatus = async (id, status) => {
    const res = await fetch(
      `http://localhost:5000/api/bookings/status/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );

    const data = await res.json();

    alert(data.message || status);
    fetchBookings();
  };

  const deliver = async (id) => {
    const res = await fetch(
      `http://localhost:5000/api/admin/deliver/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();

    alert(data.message || "Delivered");
    fetchBookings();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const nextAction = (booking) => {
    switch (booking.status) {
      case "BOOKED":
        return (
          <button
            onClick={() =>
              updateStatus(
                booking._id,
                "ASSIGNED"
              )
            }
          >
            Assign Staff
          </button>
        );

      case "ASSIGNED":
        return (
          <button
            onClick={() =>
              updateStatus(
                booking._id,
                "PICKUP_STARTED"
              )
            }
          >
            Start Pickup
          </button>
        );

      case "PICKUP_STARTED":
        return (
          <button
            onClick={() =>
              updateStatus(
                booking._id,
                "IN_PROGRESS"
              )
            }
          >
            Start Service
          </button>
        );

      case "IN_PROGRESS":
        return (
          <button
            onClick={() =>
              updateStatus(
                booking._id,
                "COMPLETED"
              )
            }
          >
            Complete
          </button>
        );

      case "COMPLETED":
        return (
          <button
            onClick={() =>
              deliver(booking._id)
            }
          >
            Deliver
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <h1>Admin Dashboard</h1>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      <section className="admin-section">
        <h2>All Bookings</h2>

        <div className="booking-grid">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="booking-card"
            >
              <h3>
                {b.vehicle?.vehicleNumber ||
                  "No Vehicle"}
              </h3>

              <p>{b.serviceType}</p>

              <p>
                {new Date(
                  b.bookingDate
                ).toLocaleDateString()}
              </p>

              <p>
                Type: {b.bookingType}
              </p>

              <p>
                Status:
                <span className="status">
                  {b.status}
                </span>
              </p>

              <p>
                Pickup Agent:{" "}
                {b.pickupAgent?.name ||
                  "Not Assigned"}
              </p>

              <p>
                Technician:{" "}
                {b.technician?.name ||
                  "Not Assigned"}
              </p>

              <div className="actions">
                {nextAction(b)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;