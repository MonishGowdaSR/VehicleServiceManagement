import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [profile, setProfile] = useState({
    name: "Customer",
    phone: "",
    email: "",
    profilePhoto: ""
  });

  const [vehicles, setVehicles] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleType: "CAR",
    brand: "",
    model: "",
    fuelType: "PETROL",
    vehiclePhoto: null,
    licenseDocument: null
  });

  const [booking, setBooking] = useState({
    vehicle: "",
    serviceType: "GENERAL_SERVICE",
    bookingDate: "",
    slotKey: "08-09",
    bookingType: "SELF",

    issueDescription: "",
    damageImage: null,

    pickupAddress: {
      houseNo: "",
      street: "",
      area: "",
      landmark: "",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: ""
    }
  });

  useEffect(() => {
    fetchProfile();
    fetchVehicles();
    fetchBookings();
  }, []);

  /* ================= PROFILE ================= */
  const fetchProfile = () => {
    const stored =
      localStorage.getItem("profile");

    if (stored) {
      setProfile(JSON.parse(stored));
    }
  };

  /* ================= VEHICLES ================= */
  const fetchVehicles = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/vehicles",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setVehicles(
        Array.isArray(data) ? data : []
      );
    } catch {}
  };

  /* ================= BOOKINGS ================= */
  const fetchBookings = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/bookings",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setBookings(data.data || []);
    } catch {}
  };

  /* ================= VEHICLE FORM ================= */
  const handleChange = (e) => {
    const {
      name,
      value,
      files
    } = e.target;

    setForm({
      ...form,
      [name]: files
        ? files[0]
        : value
    });
  };

  /* ================= BOOKING FORM ================= */
  const handleBookingChange = (
    e
  ) => {
    const {
      name,
      value,
      files
    } = e.target;

    setBooking({
      ...booking,
      [name]: files
        ? files[0]
        : value
    });
  };

  const handleAddressChange = (
    e
  ) => {
    setBooking({
      ...booking,
      pickupAddress: {
        ...booking.pickupAddress,
        [e.target.name]:
          e.target.value
      }
    });
  };

  /* ================= ADD VEHICLE ================= */
  const handleAdd = async (
    e
  ) => {
    e.preventDefault();

    const formData =
      new FormData();

    Object.keys(form).forEach(
      (key) => {
        formData.append(
          key,
          form[key]
        );
      }
    );

    const res = await fetch(
      "http://localhost:5000/api/vehicles",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    const data =
      await res.json();

    if (res.ok) {
      alert(
        "Vehicle added successfully"
      );

      fetchVehicles();
    } else {
      alert(data.message);
    }
  };

  /* ================= CREATE BOOKING ================= */
  const handleBooking =
    async (e) => {
      e.preventDefault();

      const formData =
        new FormData();

      Object.keys(booking).forEach(
        (key) => {
          if (
            key !==
            "pickupAddress"
          ) {
            formData.append(
              key,
              booking[key]
            );
          }
        }
      );

      formData.append(
        "pickupAddress",
        JSON.stringify(
          booking.pickupAddress
        )
      );

      const res = await fetch(
        "http://localhost:5000/api/bookings",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
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
        alert(data.message);
      }
    };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="topbar">
        <div className="profile-box">
          <img
            src={
              profile.profilePhoto
            }
            alt=""
            className="profile-img"
          />

          <div>
            <h2>
              {profile.name}
            </h2>
            <p>
              {profile.phone}
            </p>
            <p>
              {profile.email}
            </p>
          </div>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>
      </header>

      {/* ADD VEHICLE */}
      <section className="form-card">
        <h3>Add Vehicle</h3>

        <form
          onSubmit={
            handleAdd
          }
        >
          <input
            name="vehicleNumber"
            placeholder="Vehicle Number"
            onChange={
              handleChange
            }
            required
          />

          <select
            name="vehicleType"
            onChange={
              handleChange
            }
          >
            <option value="CAR">
              Car
            </option>
            <option value="BIKE">
              Bike
            </option>
            <option value="E_CAR">
              E-Car
            </option>
            <option value="E_BIKE">
              E-Bike
            </option>
            <option value="RICKSHAW">
              Rickshaw
            </option>
            <option value="E_RICKSHAW">
              E-Rickshaw
            </option>
          </select>

          <input
            name="brand"
            placeholder="Brand"
            onChange={
              handleChange
            }
          />

          <input
            name="model"
            placeholder="Model"
            onChange={
              handleChange
            }
          />

          <select
            name="fuelType"
            onChange={
              handleChange
            }
          >
            <option value="PETROL">
              Petrol
            </option>
            <option value="DIESEL">
              Diesel
            </option>
            <option value="ELECTRIC">
              Electric
            </option>
            <option value="CNG">
              CNG
            </option>
          </select>

          <div>
            <label>
              Vehicle Photo
            </label>
            <input
              type="file"
              name="vehiclePhoto"
              accept="image/*"
              onChange={
                handleChange
              }
            />
          </div>

          <div>
            <label>
              Driving License
            </label>
            <input
              type="file"
              name="licenseDocument"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={
                handleChange
              }
            />
          </div>

          <button type="submit">
            Add Vehicle
          </button>
        </form>
      </section>

      {/* BOOK SERVICE */}
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
                  key={v._id}
                  value={v._id}
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
            <option value="BATTERY">
              Battery
            </option>
            <option value="PUNCTURE">
              Puncture
            </option>
          </select>

          <input
            type="date"
            name="bookingDate"
            onChange={
              handleBookingChange
            }
            required
          />

          <select
            name="bookingType"
            onChange={
              handleBookingChange
            }
          >
            <option value="SELF">
              Self Drop
            </option>
            <option value="PICKUP">
              Pickup
            </option>
          </select>

          <textarea
            name="issueDescription"
            placeholder="Describe vehicle issue"
            onChange={
              handleBookingChange
            }
            required
          />

          <div>
            <label>
              Damage Image
              (Optional)
            </label>

            <input
              type="file"
              name="damageImage"
              accept="image/*"
              onChange={
                handleBookingChange
              }
            />
          </div>

          {booking.bookingType ===
            "PICKUP" && (
            <>
              <input
                name="houseNo"
                placeholder="House No"
                onChange={
                  handleAddressChange
                }
              />

              <input
                name="street"
                placeholder="Street"
                onChange={
                  handleAddressChange
                }
              />

              <input
                name="area"
                placeholder="Area"
                onChange={
                  handleAddressChange
                }
              />

              <input
                name="landmark"
                placeholder="Landmark"
                onChange={
                  handleAddressChange
                }
              />

              <input
                name="city"
                placeholder="City"
                defaultValue="Bengaluru"
                onChange={
                  handleAddressChange
                }
              />

              <input
                name="state"
                placeholder="State"
                defaultValue="Karnataka"
                onChange={
                  handleAddressChange
                }
              />

              <input
                name="pincode"
                placeholder="Pincode"
                onChange={
                  handleAddressChange
                }
              />
            </>
          )}

          <button type="submit">
            Book Now
          </button>
        </form>
      </section>

      {/* BOOKINGS */}
      <section className="vehicles-section">
        <h3>
          My Bookings
        </h3>

        <div className="vehicle-grid">
          {bookings.map(
            (b) => (
              <div
                key={b._id}
                className="vehicle-card"
              >
                <h4>
                  {b.vehicle
                    ?.vehicleNumber}
                </h4>

                <p>
                  {
                    b.serviceType
                  }
                </p>

                <p>
                  {b.status}
                </p>

                <p>
                  {
                    b.issueDescription
                  }
                </p>

                {b.bookingType ===
                  "PICKUP" && (
                  <button
                    onClick={() =>
                      navigate(
                        `/track/${b._id}`
                      )
                    }
                  >
                    Track
                  </button>
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