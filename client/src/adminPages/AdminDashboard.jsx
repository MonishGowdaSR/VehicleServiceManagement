import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../adminLayout/AdminLayout";

function AdminDashboard() {
  const [bookings, setBookings] =
    useState([]);

  const [invoiceData, setInvoiceData] =
  useState({
    baseAmount: "",
    pickupCharge: "",
    repairCharge: "",
    discount: "",
    notes: ""
  });

const [selectedBooking,
  setSelectedBooking] =
    useState(null);  
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

  const generateInvoice =
  async () => {

    if (!selectedBooking)
      return;

    try {

      const res =
        await fetch(
          `http://localhost:5000/api/admin/generate-invoice/${selectedBooking}`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`
            },

            body:
              JSON.stringify(
                invoiceData
              )
          }
        );

      const data =
        await res.json();

      alert(
        data.message
      );

      setSelectedBooking(
        null
      );

      fetchBookings();

    } catch (error) {

      console.log(
        error
      );

    }
  };      

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
        setSelectedBooking(
          booking._id
        )
      }
    >
      Generate Invoice
    </button>
  );

      case "PAYMENT_PENDING":
  return (
    <button disabled>
      Waiting For Payment
    </button>
  );
  
      case "PAID":
  return (
    <button
      onClick={() =>
        updateStatus(
          booking._id,
          "READY_FOR_DELIVERY"
        )
      }
    >
      Ready For Delivery
    </button>
  );

        case "READY_FOR_DELIVERY":
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

//************************* */  

return (
  <AdminLayout>

    <div>

      <div className="mb-8">

        <h1 className="text-4xl font-black text-slate-900">
          Dashboard Overview
        </h1>

        <p className="text-gray-500 mt-2">
          Vehicle Service Management Admin Panel
        </p>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl p-6 border shadow-sm">
          <p className="text-gray-500 text-sm">
            Total Bookings
          </p>

          <h2 className="text-4xl font-black mt-3">
            {bookings.length}
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border shadow-sm">
          <p className="text-gray-500 text-sm">
            Active Services
          </p>

          <h2 className="text-4xl font-black mt-3 text-blue-600">
            {
              bookings.filter(
                (b) =>
                  b.status !==
                  "DELIVERED"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border shadow-sm">
          <p className="text-gray-500 text-sm">
            Pending Payments
          </p>

          <h2 className="text-4xl font-black mt-3 text-orange-500">
            {
              bookings.filter(
                (b) =>
                  b.paymentStatus !==
                  "PAID"
              ).length
            }
          </h2>
        </div>

        <div className="bg-white rounded-3xl p-6 border shadow-sm">
          <p className="text-gray-500 text-sm">
            Delivered
          </p>

          <h2 className="text-4xl font-black mt-3 text-green-600">
            {
              bookings.filter(
                (b) =>
                  b.status ===
                  "DELIVERED"
              ).length
            }
          </h2>
        </div>

      </div>

    </div>

  </AdminLayout>
);
}

export default AdminDashboard;