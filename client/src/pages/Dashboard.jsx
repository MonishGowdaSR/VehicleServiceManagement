import {
  useEffect,
  useState,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
//import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const bookingSectionRef =
  useRef(null);

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
 /* ================= ADD VEHICLE ================= */
const handleAdd = async (
  e
) => {

  e.preventDefault();

  /* =========================
     VALIDATE FILES
  ========================= */

  if (
    !form.vehiclePhoto
  ) {
    alert(
      "Vehicle photo is required"
    );

    return;
  }

  if (
    !form.licenseDocument
  ) {
    alert(
      "Driving license is required"
    );

    return;
  }

  const formData =
    new FormData();

  formData.append(
    "vehicleNumber",
    form.vehicleNumber
  );

  formData.append(
    "vehicleType",
    form.vehicleType
  );

  formData.append(
    "brand",
    form.brand
  );

  formData.append(
    "model",
    form.model
  );

  formData.append(
    "fuelType",
    form.fuelType
  );

  formData.append(
    "vehiclePhoto",
    form.vehiclePhoto
  );

  formData.append(
    "licenseDocument",
    form.licenseDocument
  );

  try {

    const res =
      await fetch(
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

    if (
      res.ok
    ) {

      alert(
        "Vehicle added successfully"
      );

      fetchVehicles();

    } else {

      alert(
        data.message
      );
    }

  } catch (error) {

    alert(
      "Vehicle upload failed"
    );

    console.log(error);
  }
};
  /* ================= CREATE BOOKING ================= */
  const handleBooking =
  async (e) => {
    e.preventDefault();

    /* =========================
       BLOCK SUNDAYS
    ========================= */

    const selectedDate =
      new Date(
        booking.bookingDate
      );

    if (
      selectedDate.getDay() ===
      0
    ) {
      alert(
        "Bookings are not available on Sundays"
      );

      return;
    }

    /* =========================
       PICKUP VALIDATION
    ========================= */

    if (
      booking.bookingType ===
      "PICKUP"
    ) {
      const addr =
        booking.pickupAddress;

      if (
        !addr.houseNo ||
        !addr.street ||
        !addr.area ||
        !addr.city ||
        !addr.state ||
        !addr.pincode
      ) {
        alert(
          "All pickup address fields are required"
        );

        return;
      }

      const pincodeRegex =
        /^\d{6}$/;

      if (
        !pincodeRegex.test(
          addr.pincode
        )
      ) {
        alert(
          "Pincode must be exactly 6 digits"
        );

        return;
      }
    }

    /* =========================
       CREATE FORM DATA
    ========================= */

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

    try {
      const res =
        await fetch(
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
        alert(
          data.message
        );
      }

    } catch {
      alert(
        "Booking failed"
      );
    }
  };

  const handleQuickBook = (
  vehicleId
) => {

  setBooking((prev) => ({
    ...prev,
    vehicle: vehicleId
  }));

  bookingSectionRef.current?.
    scrollIntoView({
      behavior: "smooth"
    });
};
  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
  <div className="min-h-screen bg-slate-100 flex">
    {/* SIDEBAR */}
    <div className="hidden lg:flex w-72 bg-slate-950 text-white flex-col p-8 justify-between">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Vehicle Service
        </h1>
        <p className="text-slate-400 mt-2">
          Smart Service Platform
        </p>
        <div className="mt-12 space-y-4">
          <div className="bg-blue-600/20 border border-blue-500/20 rounded-2xl p-4">
            <h3 className="text-lg font-semibold">
              Vehicles
            </h3>
            <p className="text-3xl font-black mt-2">
              {vehicles.length}
            </p>
          </div>
          <div className="bg-emerald-600/20 border border-emerald-500/20 rounded-2xl p-4">
            <h3 className="text-lg font-semibold">
              Bookings
            </h3>
            <p className="text-3xl font-black mt-2">
              {bookings.length}
            </p>
          </div>
        </div>
      </div>
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 transition-all py-4 rounded-2xl font-bold"
      >
        Logout
      </button>
    </div>

    {/* MAIN CONTENT */}
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="space-y-8">
        {/* HEADER */}
        <header className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={
                profile.profilePhoto && profile.profilePhoto !== ""
                  ? profile.profilePhoto
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-500 shadow-lg"
            />
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                {profile.name}
              </h2>
              <p className="text-slate-500 mt-1">
                {profile.phone}
              </p>
              <p className="text-slate-500">
                {profile.email}
              </p>
              <div className="mt-3 inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
                Active Customer
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold transition-all"
          >
            Logout
          </button>
        </header>
{/* ADD VEHICLE */}
<section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
  <h2 className="text-4xl font-black text-slate-900 mb-8">
    Add Vehicle
  </h2>
  <form
    onSubmit={handleAdd}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    <input
      name="vehicleNumber"
      placeholder="Vehicle Number"
      onChange={handleChange}
      required
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    />
    <select
      name="vehicleType"
      onChange={handleChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    >
      <option value="CAR">Car</option>
      <option value="BIKE">Bike</option>
      <option value="E_CAR">E-Car</option>
      <option value="E_BIKE">E-Bike</option>
      <option value="RICKSHAW">Rickshaw</option>
      <option value="E_RICKSHAW">E-Rickshaw</option>
    </select>
    <input
      name="brand"
      placeholder="Brand"
      onChange={handleChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    />
    <input
      name="model"
      placeholder="Model"
      onChange={handleChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    />
    <select
      name="fuelType"
      onChange={handleChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    >
      <option value="PETROL">Petrol</option>
      <option value="DIESEL">Diesel</option>
      <option value="ELECTRIC">Electric</option>
      <option value="CNG">CNG</option>
    </select>
    <div>
      <label className="block font-semibold mb-1">
        Vehicle Photo
      </label>
      <input
        type="file"
        name="vehiclePhoto"
        accept="image/*"
        required
        onChange={(e) =>
          setForm({
            ...form,
            vehiclePhoto: e.target.files[0]
          })
        }
        className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4"
      />
    </div>
    <div>
      <label className="block font-semibold mb-1">
        Driving License
      </label>
      <input
        type="file"
        name="licenseDocument"
        accept=".jpg,.jpeg,.png,.pdf"
        required
        onChange={(e) =>
          setForm({
            ...form,
            licenseDocument: e.target.files[0]
          })
        }
        className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4"
      />
    </div>
    <button
      type="submit"
      className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.02] hover:shadow-xl transition-all text-white font-bold py-4 px-6 rounded-2xl"
    >
      Add Vehicle
    </button>
  </form>
</section>

        {/* MY VEHICLES */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-2xl font-black text-slate-900 mb-5">
            My Vehicles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((v) => (
              <div
                key={v._id}
                className="border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition"
              >
               <div className="flex justify-center mb-5">

  <img
    src={
      v.vehiclePhoto &&
      v.vehiclePhoto !== ""
        ? `http://localhost:5000/${v.vehiclePhoto.replace(
            "\\",
            "/"
          )}`
        : "https://cdn-icons-png.flaticon.com/512/854/854878.png"
    }
    alt="vehicle"
    className="w-28 h-28 rounded-full object-cover border-4 border-slate-200 shadow-lg"
  />

</div>
                <h4 className="text-xl font-bold">
                  {v.vehicleNumber}
                </h4>
                <p className="text-slate-600">
                  {v.brand} {v.model}
                </p>
                <p className="text-slate-600">
                  {v.vehicleType}
                </p>
                <p className="text-slate-600">
                  {v.fuelType}
                </p>
                <button
                  onClick={() => handleQuickBook(v._id)}
                  className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-xl transition w-full"
                >
                  Book Service
                </button>
              </div>
            ))}
          </div>
        </section>

       {/* BOOK SERVICE */}
<section
  className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8"
  ref={bookingSectionRef}
>
  <h2 className="text-4xl font-black text-slate-900 mb-8">
    Book Service
  </h2>
  <form
    onSubmit={handleBooking}
    className="grid grid-cols-1 md:grid-cols-2 gap-6"
  >
    <select
      name="vehicle"
      value={booking.vehicle}
      onChange={handleBookingChange}
      required
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    >
      <option value="">Select Vehicle</option>
      {vehicles.map((v) => (
        <option key={v._id} value={v._id}>
          {v.vehicleNumber}
        </option>
      ))}
    </select>

    <select
      name="serviceType"
      onChange={handleBookingChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    >
      <option value="GENERAL_SERVICE">General Service</option>
      <option value="REPAIR">Repair</option>
      <option value="CAR_WASH">Car Wash</option>
      <option value="BATTERY">Battery</option>
      <option value="PUNCTURE">Puncture</option>
    </select>

    <input
      type="date"
      name="bookingDate"
      min={new Date().toISOString().split("T")[0]}
      onChange={handleBookingChange}
      required
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    />

    <select
      name="bookingType"
      onChange={handleBookingChange}
      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    >
      <option value="SELF">Self Drop</option>
      <option value="PICKUP">Pickup</option>
    </select>

    <textarea
      name="issueDescription"
      placeholder="Describe vehicle issue"
      onChange={handleBookingChange}
      required
      rows="3"
      className="w-full md:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
    />

    <div className="md:col-span-2">
      <label className="block font-semibold mb-2 text-slate-700">
        Damage Image (Optional)
      </label>
      <input
        type="file"
        name="damageImage"
        accept="image/*"
        onChange={handleBookingChange}
        className="w-full bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-4"
      />
    </div>

    {booking.bookingType === "PICKUP" && (
      <div className="md:col-span-2 space-y-4 pt-2">
        <h3 className="text-xl font-bold text-slate-800 mb-3">
          Pickup Address
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            name="houseNo"
            required
            placeholder="House No"
            onChange={handleAddressChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <input
            name="street"
            required
            placeholder="Street"
            onChange={handleAddressChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <input
            name="area"
            required
            placeholder="Area"
            onChange={handleAddressChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <input
            name="landmark"
            placeholder="Landmark (Optional)"
            onChange={handleAddressChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <input
            name="city"
            placeholder="City"
            defaultValue="Bengaluru"
            onChange={handleAddressChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <input
            name="state"
            placeholder="State"
            defaultValue="Karnataka"
            onChange={handleAddressChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
          <input
            name="pincode"
            placeholder="Pincode"
            maxLength="6"
            inputMode="numeric"
            pattern="\d{6}"
            required
            onChange={handleAddressChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
    )}

    <button
      type="submit"
      className="md:col-span-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:scale-[1.01] hover:shadow-xl transition-all text-white font-bold py-4 rounded-2xl text-lg"
    >
      Book Now
    </button>
  </form>
</section>
        {/* MY BOOKINGS */}
<section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
  <h2 className="text-4xl font-black text-slate-900 mb-8">
    My Bookings
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
    {bookings.map((b) => (
      <div
        key={b._id}
        className="bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <h3 className="text-3xl font-black text-slate-900">
          {b.vehicle?.vehicleNumber}
        </h3>
        
        <div className="mt-4 inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
          {b.serviceType}
        </div>
        
        <div
          className={`mt-3 inline-flex px-4 py-2 rounded-full text-sm font-bold ${
            b.status === "COMPLETED"
              ? "bg-emerald-100 text-emerald-700"
              : b.status === "IN_PROGRESS"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-slate-200 text-slate-700"
          }`}
        >
          {b.status}
        </div>
        
        <p className="mt-5 text-slate-600 leading-relaxed">
          {b.issueDescription}
        </p>
        
        {b.bookingType === "PICKUP" && b.status !== "DELIVERED" && (
          <button
            onClick={() => navigate(`/track/${b._id}`)}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01] transition-all text-white font-bold py-3 px-4 rounded-xl"
          >
            Track Booking
          </button>
        )}
      </div>
    ))}
  </div>
</section>
      </div>
    </div>
  </div>
);
}

export default Dashboard;