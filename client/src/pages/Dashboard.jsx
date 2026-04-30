import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const [vehicles, setVehicles] =
    useState([]);

  const [bookings, setBookings] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [form, setForm] =
    useState({
      vehicleNumber: "",
      vehicleType: ""
    });

  const [booking, setBooking] =
    useState({
      vehicle: "",
      serviceType:
        "GENERAL_SERVICE",
      bookingDate: "",
      slotKey: "08-09",
      bookingType: "SELF",
      pickupAddress: {
        address: ""
      }
    });

  const token =
    localStorage.getItem(
      "userToken"
    );

  const navigate =
    useNavigate();

  useEffect(() => {
    fetchVehicles();
    fetchBookings();
  }, []);

  /* ================= FETCH VEHICLES ================= */
  const fetchVehicles =
    async () => {
      try {
        const res =
          await fetch(
            "http://localhost:5000/api/vehicles",
            {
              headers:
                {
                  Authorization: `Bearer ${token}`
                }
            }
          );

        const data =
          await res.json();

        setVehicles(
          Array.isArray(
            data
          )
            ? data
            : []
        );

        setLoading(
          false
        );
      } catch (error) {
        console.log(
          error
        );
      }
    };

  /* ================= FETCH BOOKINGS ================= */
  const fetchBookings =
    async () => {
      try {
        const res =
          await fetch(
            "http://localhost:5000/api/bookings",
            {
              headers:
                {
                  Authorization: `Bearer ${token}`
                }
            }
          );

        const data =
          await res.json();

        setBookings(
          data.data ||
            []
        );
      } catch (error) {
        console.log(
          error
        );
      }
    };

  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value
    });
  };

  const handleBookingChange =
    (e) => {
      setBooking({
        ...booking,
        [e.target.name]:
          e.target.value
      });
    };

  const handlePickupAddress =
    (e) => {
      setBooking({
        ...booking,
        pickupAddress:
          {
            address:
              e.target
                .value
          }
      });
    };

  /* ================= ADD VEHICLE ================= */
  const handleAdd =
    async (e) => {
      e.preventDefault();

      try {
        const res =
          await fetch(
            "http://localhost:5000/api/vehicles",
            {
              method:
                "POST",
              headers:
                {
                  "Content-Type":
                    "application/json",
                  Authorization: `Bearer ${token}`
                },
              body: JSON.stringify(
                form
              )
            }
          );

        const data =
          await res.json();

        if (res.ok) {
          alert(
            "Vehicle added"
          );

          setForm({
            vehicleNumber:
              "",
            vehicleType:
              ""
          });

          fetchVehicles();
        } else {
          alert(
            data.message
          );
        }
      } catch (error) {
        console.log(
          error
        );
      }
    };

  /* ================= BOOK SERVICE ================= */
  const handleBooking =
    async (e) => {
      e.preventDefault();

      try {
        const res =
          await fetch(
            "http://localhost:5000/api/bookings",
            {
              method:
                "POST",
              headers:
                {
                  "Content-Type":
                    "application/json",
                  Authorization: `Bearer ${token}`
                },
              body: JSON.stringify(
                booking
              )
            }
          );

        const data =
          await res.json();

        if (
          res.ok &&
          data.success
        ) {
          alert(
            "Booking successful"
          );

          fetchBookings();
        } else {
          alert(
            data.message
          );
        }
      } catch (error) {
        console.log(
          error
        );
      }
    };

  /* ================= USER LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem(
      "userToken"
    );

    localStorage.removeItem(
      "role"
    );

    navigate(
      "/login"
    );
  };

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <h1>
          Vehicle Dashboard
        </h1>

        <div className="top-actions">
          <button
            className="logout-btn"
            onClick={
              logout
            }
          >
            Logout
          </button>
        </div>
      </header>

      {/* Add Vehicle */}
      <section className="form-card">
        <h3>
          Add Vehicle
        </h3>

        <form
          onSubmit={
            handleAdd
          }
        >
          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            value={
              form.vehicleNumber
            }
            onChange={
              handleChange
            }
            required
          />

          <input
            name="vehicleType"
            placeholder="Vehicle Type"
            value={
              form.vehicleType
            }
            onChange={
              handleChange
            }
            required
          />

          <button type="submit">
            Add Vehicle
          </button>
        </form>
      </section>

      {/* Book Service */}
      <section className="form-card">
        <h3>
          Book Service
        </h3>

        <form
          onSubmit={
            handleBooking
          }
        >
          <select
            name="vehicle"
            value={
              booking.vehicle
            }
            onChange={
              handleBookingChange
            }
            required
          >
            <option value="">
              Select Vehicle
            </option>

            {vehicles.map(
              (v) => (
                <option
                  key={
                    v._id
                  }
                  value={
                    v._id
                  }
                >
                  {
                    v.vehicleNumber
                  }
                </option>
              )
            )}
          </select>

          <select
            name="serviceType"
            value={
              booking.serviceType
            }
            onChange={
              handleBookingChange
            }
          >
            <option value="GENERAL_SERVICE">
              General Service
            </option>

            <option value="REPAIR">
              Repair
            </option>

            <option value="CAR_WASH">
              Car Wash
            </option>
          </select>

          <input
            type="date"
            name="bookingDate"
            value={
              booking.bookingDate
            }
            onChange={
              handleBookingChange
            }
            required
          />

          <select
            name="slotKey"
            value={
              booking.slotKey
            }
            onChange={
              handleBookingChange
            }
          >
            <option value="08-09">
              08:00 - 09:00
            </option>

            <option value="09-10">
              09:00 - 10:00
            </option>

            <option value="10-1130">
              10:00 - 11:30
            </option>
          </select>

          <select
            name="bookingType"
            value={
              booking.bookingType
            }
            onChange={
              handleBookingChange
            }
          >
            <option value="SELF">
              Self Drop
            </option>

            <option value="PICKUP">
              Pickup Needed
            </option>
          </select>

          {booking.bookingType ===
            "PICKUP" && (
            <input
              placeholder="Pickup Address"
              value={
                booking
                  .pickupAddress
                  .address
              }
              onChange={
                handlePickupAddress
              }
              required
            />
          )}

          <button type="submit">
            Book Now
          </button>
        </form>
      </section>

      {/* My Bookings */}
      <section className="vehicles-section">
        <h3>
          My Bookings
        </h3>

        {loading && (
          <p>
            Loading...
          </p>
        )}

        <div className="vehicle-grid">
          {bookings.map(
            (b) => (
              <div
                className="vehicle-card"
                key={
                  b._id
                }
              >
                <h4>
                  {b
                    .vehicle
                    ?.vehicleNumber}
                </h4>

                <p>
                  {
                    b.serviceType
                  }
                </p>

                <p>
                  {new Date(
                    b.bookingDate
                  ).toLocaleDateString()}
                </p>

                <p>
                  {b.slotKey}
                </p>

                <span className="status">
                  {b.status}
                </span>

                {b.bookingType ===
                  "PICKUP" && (
                  <div className="card-actions">
                    <button
                      onClick={() =>
                        navigate(
                          `/track/${b._id}`
                        )
                      }
                    >
                      Track
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;