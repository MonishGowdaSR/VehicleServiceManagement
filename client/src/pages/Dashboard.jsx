import {
  useEffect,
  useState,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
//import "./Dashboard.css";
import DatePicker from "react-datepicker";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import VehicleCard from "../components/VehicleCard";
import BookingCard from "../components/BookingCard";
import AddVehicleForm from "../components/AddVehicleForm";
import BookingForm from "../components/BookingForm";

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

  const [
  invoiceBooking,
  setInvoiceBooking
] = useState(null);

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

  const bookedDates =
  bookings.map(
    (b) =>
      new Date(
        b.bookingDate
      )
  );
const handlePayment =
  async (booking) => {

    try {

      /* CREATE ORDER */
      const res =
        await fetch(
          "http://localhost:5000/api/payment/create-order",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify({
                bookingId:
                  booking._id
              })
          }
        );

      const data =
        await res.json();

      if (!data.success) {
        return alert(
          data.message
        );
      }

      const options = {

        key:
          "rzp_test_SpiKth9Bex3hU5",

        amount:
          data.order.amount,

        currency:
          data.order.currency,

        name:
          "Vehicle Service Management",

        description:
          "Service Payment",

        order_id:
          data.order.id,

        handler:
          async function (
            response
          ) {

            const verifyRes =
              await fetch(
                "http://localhost:5000/api/payment/verify",
                {
                  method:
                    "POST",

                  headers: {
                    "Content-Type":
                      "application/json",

                    Authorization:
                      `Bearer ${token}`
                  },

                  body:
                    JSON.stringify({
                      ...response,

                      bookingId:
                        booking._id
                    })
                }
              );

            const verifyData =
              await verifyRes.json();

            alert(
              verifyData.message
            );

            fetchBookings();
          },

        theme: {
          color:
            "#2563eb"
        }

      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();

    } catch (error) {

      console.log(
        error
      );

    }
  };

  return (
  <div className="min-h-screen bg-slate-100 flex">
    {/* SIDEBAR */}
    <Sidebar
  vehicles={vehicles}
  bookings={bookings}
  logout={logout}
/>

    {/* MAIN CONTENT */}
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="space-y-8">
        {/* HEADER */}
        <Topbar
  profile={profile}
  logout={logout}
/>
{/* ADD VEHICLE */}
<AddVehicleForm
  handleAdd={handleAdd}
  handleChange={handleChange}
  setForm={setForm}
  form={form}
/>
{/* MY VEHICLES */}
<section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">

  <h2 className="text-4xl font-black text-slate-900 mb-8">
    My Vehicles
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

    {vehicles.map((v) => (
      <VehicleCard
        key={v._id}
        vehicle={v}
        handleQuickBook={
          handleQuickBook
        }
      />
    ))}

  </div>

</section>
       {/* BOOK SERVICE */}
<BookingForm
  booking={booking}
  setBooking={setBooking}
  vehicles={vehicles}
  handleBooking={handleBooking}
  handleBookingChange={
    handleBookingChange
  }
  handleAddressChange={
    handleAddressChange
  }
  bookingSectionRef={
    bookingSectionRef
  }
  bookings={bookings}
/>
        {/* MY BOOKINGS */}
<section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">

  <h2 className="text-4xl font-black text-slate-900 mb-8">
    My Bookings
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

    {bookings.map((b) => (
      <BookingCard
  key={b._id}
  booking={b}
  handlePayment={
    handlePayment
  }
  setInvoiceBooking={
    setInvoiceBooking
  }
/>
    ))}

  </div>

</section>

      </div>
    </div>
    {invoiceBooking && (

  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

    <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl">

      {/* HEADER */}
      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-4xl font-black text-slate-900">
            Vehicle Service Invoice
          </h2>

          <p className="text-slate-500 mt-2">
            Booking ID:
            {" "}
            {invoiceBooking._id}
          </p>

        </div>

        <button
          onClick={() =>
            setInvoiceBooking(
              null
            )
          }
          className="text-slate-500 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>

      </div>

      {/* CUSTOMER */}
      <div className="mt-8 grid grid-cols-2 gap-6">

        <div>
          <p className="text-slate-500 text-sm">
            Customer
          </p>

          <h3 className="text-xl font-bold mt-1">
            {
              invoiceBooking.user
                ?.name
            }
          </h3>
        </div>

        <div>
          <p className="text-slate-500 text-sm">
            Vehicle
          </p>

          <h3 className="text-xl font-bold mt-1">
            {
              invoiceBooking.vehicle
                ?.vehicleNumber
            }
          </h3>
        </div>

      </div>

      {/* BREAKDOWN */}
      <div className="mt-10 space-y-4">

        <div className="flex justify-between">
          <span>
            Base Service
          </span>

          <span>
            ₹
            {
              invoiceBooking
                .invoice
                ?.baseAmount
            }
          </span>
        </div>

        <div className="flex justify-between">
          <span>
            Pickup Charge
          </span>

          <span>
            ₹
            {
              invoiceBooking
                .invoice
                ?.pickupCharge
            }
          </span>
        </div>

        <div className="flex justify-between">
          <span>
            Repair Charge
          </span>

          <span>
            ₹
            {
              invoiceBooking
                .invoice
                ?.repairCharge
            }
          </span>
        </div>

        <div className="flex justify-between text-red-500">
          <span>
            Discount
          </span>

          <span>
            - ₹
            {
              invoiceBooking
                .invoice
                ?.discount
            }
          </span>
        </div>

      </div>

      {/* NOTES */}
      <div className="mt-8 bg-slate-50 rounded-2xl p-5">

        <p className="text-sm text-slate-500">
          Service Notes
        </p>

        <p className="mt-2 text-slate-700">
          {
            invoiceBooking
              .invoice
              ?.notes ||
            "No Notes"
          }
        </p>

      </div>

      {/* TOTAL */}
      <div className="mt-10 flex justify-between items-center border-t pt-6">

        <h2 className="text-3xl font-black">
          Total Amount
        </h2>

        <h2 className="text-4xl font-black text-blue-600">
          ₹
          {
            invoiceBooking
              .invoice
              ?.totalAmount
          }
        </h2>

      </div>

    </div>

  </div>

)}
  </div>
);
}

export default Dashboard;