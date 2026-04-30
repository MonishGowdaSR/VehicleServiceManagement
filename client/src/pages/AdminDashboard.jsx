import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [bookings, setBookings] =
    useState([]);

  const token =
    localStorage.getItem(
      "adminToken"
    );

  const navigate =
    useNavigate();

  /* ================= IMAGE URL FIX ================= */
  const getImageUrl = (path) => {
  if (!path) return "";

  /* External URL */
  if (path.startsWith("http")) {
    return path;
  }

  /* Base64 image */
  if (path.startsWith("data:image")) {
    return path;
  }

  /* Local uploads folder */
  return `http://localhost:5000/${path.replace(
    /^\/+/,
    ""
  )}`;
};
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings =
    async () => {
      try {
        const res =
          await fetch(
            "http://localhost:5000/api/admin/bookings",
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

        const data =
          await res.json();

        setBookings(
          data.data || []
        );
      } catch (error) {
        console.log(
          error
        );
      }
    };

  const updateStatus =
    async (
      id,
      status
    ) => {
      const res =
        await fetch(
          `http://localhost:5000/api/bookings/status/${id}`,
          {
            method:
              "PATCH",
            headers:
              {
                "Content-Type":
                  "application/json",
                Authorization: `Bearer ${token}`
              },
            body: JSON.stringify(
              {
                status
              }
            )
          }
        );

      const data =
        await res.json();

      alert(
        data.message ||
          status
      );

      fetchBookings();
    };

  const deliver =
    async (id) => {
      const res =
        await fetch(
          `http://localhost:5000/api/admin/deliver/${id}`,
          {
            method:
              "PATCH",
            headers:
              {
                Authorization: `Bearer ${token}`
              }
          }
        );

      const data =
        await res.json();

      alert(
        data.message ||
          "Delivered"
      );

      fetchBookings();
    };

  const logout = () => {
    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "role"
    );

    navigate(
      "/admin-login"
    );
  };

  const nextAction = (
    booking
  ) => {
    const isSelf =
      booking.bookingType ===
      "SELF";

    switch (
      booking.status
    ) {
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
                isSelf
                  ? "IN_PROGRESS"
                  : "PICKUP_STARTED"
              )
            }
          >
            {isSelf
              ? "Start Service"
              : "Start Pickup"}
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
            Vehicle Reached Garage
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
            Complete Service
          </button>
        );

      case "COMPLETED":
        return (
          <button
            onClick={() =>
              deliver(
                booking._id
              )
            }
          >
            Deliver Vehicle
          </button>
        );

      default:
        return null;
    }
  };

  const fullAddress = (
    b
  ) => {
    if (
      b.bookingType !==
      "PICKUP"
    ) {
      return "Self Drop";
    }

    const a =
      b.pickupAddress ||
      {};

    return `${a.houseNo || ""}, ${a.street || ""}, ${a.area || ""}, ${a.landmark || ""}, ${a.city || ""}, ${a.state || ""} - ${a.pincode || ""}`;
  };

  return (
    <div className="admin-page">
      <header className="admin-topbar">
        <h1>
          Admin Dashboard
        </h1>

        <button
          className="logout-btn"
          onClick={
            logout
          }
        >
          Logout
        </button>
      </header>

      <section className="admin-section">
        <h2>
          All Bookings
        </h2>

        <div className="booking-grid">
          {bookings.map(
            (b) => (
              <div
                key={
                  b._id
                }
                className="booking-card"
              >
                {/* CUSTOMER */}
                <div className="customer-row">
                  <img
                    src={
                      b.user
                        ?.profilePhoto
                        ? getImageUrl(
                            b
                              .user
                              .profilePhoto
                          )
                        : `https://ui-avatars.com/api/?name=${b.user?.name || "User"}`
                    }
                    alt=""
                    className="cust-img"
                  />

                  <div>
                    <h3>
                      {b.user
                        ?.name ||
                        "Customer"}
                    </h3>

                    <p>
                      {b.user
                        ?.phone ||
                        "No Phone"}
                    </p>
                  </div>
                </div>

                {/* VEHICLE */}
                <h4>
                  {b.vehicle
                    ?.vehicleNumber ||
                    "No Vehicle"}
                </h4>

                {b.vehicle
                  ?.vehiclePhoto && (
                  <img
                    src={getImageUrl(
                      b
                        .vehicle
                        .vehiclePhoto
                    )}
                    alt=""
                    className="vehicle-img"
                  />
                )}

                <p>
                  Service:{" "}
                  {
                    b.serviceType
                  }
                </p>

                <p>
                  Date:{" "}
                  {new Date(
                    b.bookingDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  Type:{" "}
                  {
                    b.bookingType
                  }
                </p>

                <p>
                  Status:
                  <span className="status">
                    {
                      b.status
                    }
                  </span>
                </p>

                <p>
                  Issue:{" "}
                  {b.issueDescription ||
                    "No Description"}
                </p>

                {/* DAMAGE IMAGE */}
                {b.damageImage && (
                  <div>
                    <p>
                      Damage
                      Image:
                    </p>

                    <img
                      src={getImageUrl(
                        b.damageImage
                      )}
                      alt=""
                      className="damage-img"
                    />
                  </div>
                )}

                <p>
                  Address:{" "}
                  {fullAddress(
                    b
                  )}
                </p>

                <p>
                  Pickup Agent:{" "}
                  {b.bookingType ===
                  "SELF"
                    ? "Not Required"
                    : b
                        .pickupAgent
                        ?.name ||
                      "Not Assigned"}
                </p>

                <p>
                  Technician:{" "}
                  {b
                    .technician
                    ?.name ||
                    "Not Assigned"}
                </p>

                <div className="actions">
                  {nextAction(
                    b
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;