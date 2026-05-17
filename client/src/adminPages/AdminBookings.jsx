import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../adminLayout/AdminLayout";

function AdminBookings() {

  const [bookings, setBookings] =
    useState([]);

  

  const [search, setSearch] =
  useState("");

const [statusFilter, setStatusFilter] =
  useState("ALL");

  const [invoiceData, setInvoiceData] =
    useState({
      baseAmount: "",
      pickupCharge: "",
      repairCharge: "",
      discount: "",
      notes: ""
    });

  const [
    selectedBooking,
    setSelectedBooking
  ] = useState(null);

  const token =
    localStorage.getItem(
      "adminToken"
    );

  const navigate =
    useNavigate();

  /* ================= IMAGE URL FIX ================= */

  const getImageUrl = (
    path
  ) => {

    if (!path) return "";

    /* External URL */
    if (
      path.startsWith(
        "http"
      )
    ) {
      return path;
    }

    /* Base64 */
    if (
      path.startsWith(
        "data:image"
      )
    ) {
      return path;
    }

    /* Uploads folder */
    return `http://localhost:5000/${path.replace(
      /^\/+/,
      ""
    )}`;
  };

  /* ================= FETCH BOOKINGS ================= */

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
                Authorization:
                  `Bearer ${token}`
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

  /* ================= UPDATE STATUS ================= */

  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        const res =
          await fetch(
            `http://localhost:5000/api/bookings/status/${id}`,
            {
              method:
                "PATCH",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify({
                  status
                })
            }
          );

        const data =
          await res.json();

        alert(
          data.message ||
            status
        );

        fetchBookings();

      } catch (error) {

        console.log(
          error
        );

      }
    };

  /* ================= DELIVER ================= */

  const deliver =
    async (id) => {

      try {

        const res =
          await fetch(
            `http://localhost:5000/api/admin/deliver/${id}`,
            {
              method:
                "PATCH",

              headers: {
                Authorization:
                  `Bearer ${token}`
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

      } catch (error) {

        console.log(
          error
        );

      }
    };

  /* ================= GENERATE INVOICE ================= */

  const generateInvoice =
    async () => {

      if (!selectedBooking)
        return;

      try {

        const res =
          await fetch(
            `http://localhost:5000/api/admin/generate-invoice/${selectedBooking}`,
            {
              method:
                "PATCH",

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

  /* ================= LOGOUT ================= */

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

  /* ================= NEXT ACTION ================= */

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
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl"
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
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl"
          >
            {
              isSelf
                ? "Start Service"
                : "Start Pickup"
            }
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
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl"
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
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl"
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
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl"
          >
            Generate Invoice
          </button>
        );

      case "PAYMENT_PENDING":

        return (
          <button
            disabled
            className="w-full bg-gray-400 text-white font-bold py-3 rounded-xl"
          >
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl"
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
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl"
          >
            Deliver Vehicle
          </button>
        );

      default:
        return null;
    }
  };

  /* ================= ADDRESS ================= */

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

  const filteredBookings =
  bookings.filter((b) => {

    const searchText =
      search.toLowerCase();

    const matchesSearch =

      b.user?.name
        ?.toLowerCase()
        .includes(searchText)

      ||

      b.user?.phone
        ?.toLowerCase()
        .includes(searchText)

      ||

      b.vehicle?.vehicleNumber
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =

      statusFilter ===
        "ALL"

      ||

      b.status ===
      statusFilter;

    return (
      matchesSearch &&
      matchesStatus
    );
  });

  /* ================= RETURN ================= */

  return (

    <AdminLayout>

      <div>

        <div className="mb-8">

          <h1 className="text-5xl font-black text-slate-900">
            Booking Management
          </h1>

          <p className="text-gray-500 mt-2 text-xl">
            Manage customer vehicle service bookings
          </p>

          <div className="flex flex-col md:flex-row gap-4 mb-8 mt-6">

  <input
    type="text"
    placeholder="Search customer, phone or vehicle"
    value={search}
    onChange={(e) =>
      setSearch(
        e.target.value
      )
    }
    className="flex-1 border rounded-2xl px-5 py-4 text-lg"
  />

  <select
    value={statusFilter}
    onChange={(e) =>
      setStatusFilter(
        e.target.value
      )
    }
    className="border rounded-2xl px-5 py-4 text-lg"
  >

    <option value="ALL">
      All Status
    </option>

    <option value="BOOKED">
      BOOKED
    </option>

    <option value="ASSIGNED">
      ASSIGNED
    </option>

    <option value="PICKUP_STARTED">
      PICKUP_STARTED
    </option>

    <option value="IN_PROGRESS">
      IN_PROGRESS
    </option>

    <option value="COMPLETED">
      COMPLETED
    </option>

    <option value="PAYMENT_PENDING">
      PAYMENT_PENDING
    </option>

    <option value="PAID">
      PAID
    </option>

    <option value="READY_FOR_DELIVERY">
      READY_FOR_DELIVERY
    </option>

    <option value="DELIVERED">
      DELIVERED
    </option>

  </select>

</div>


        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filteredBookings.map(
            (b) => (

              <div
                key={b._id}
                className="bg-white rounded-3xl border shadow-sm overflow-hidden"
              >

                {/* CUSTOMER */}

                <div className="flex items-center gap-4 p-6 border-b">

                  <img
                    src={
                      b.user?.profilePhoto
                        ? getImageUrl(
                            b.user
                              .profilePhoto
                          )
                        : `https://ui-avatars.com/api/?name=${b.user?.name || "User"}`
                    }
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />

                  <div>

                    <h2 className="text-2xl font-bold">
                      {
                        b.user
                          ?.name ||
                        "Customer"
                      }
                    </h2>

                    <p className="text-gray-500">
                      {
                        b.user
                          ?.phone ||
                        "No Phone"
                      }
                    </p>

                  </div>

                </div>

                {/* BODY */}

                <div className="p-6 space-y-4">

                  <h3 className="text-2xl font-black">
                    {
                      b.vehicle
                        ?.vehicleNumber
                    }
                  </h3>

                  {
                    b.vehicle
                      ?.vehiclePhoto && (
                      <img
                        src={getImageUrl(
                          b.vehicle
                            .vehiclePhoto
                        )}
                        alt=""
                        className="w-full h-52 object-cover rounded-2xl"
                      />
                    )
                  }

                  <div className="space-y-2 text-[17px]">

                    <p>
                      <strong>
                        Service:
                      </strong>{" "}
                      {
                        b.serviceType
                      }
                    </p>

                    <p>
                      <strong>
                        Date:
                      </strong>{" "}
                      {new Date(
                        b.bookingDate
                      ).toLocaleDateString()}
                    </p>

                    <p>
                      <strong>
                        Type:
                      </strong>{" "}
                      {
                        b.bookingType
                      }
                    </p>

                    <p>
                      <strong>
                        Status:
                      </strong>{" "}

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                        {
                          b.status
                        }
                      </span>
                    </p>

                    <p>
                      <strong>
                        Issue:
                      </strong>{" "}
                      {
                        b.issueDescription ||
                        "No Description"
                      }
                    </p>

                  </div>

                  {/* DAMAGE IMAGE */}

                  {
                    b.damageImage && (
                      <div>

                        <p className="font-bold mb-2">
                          Damage Image
                        </p>

                        <img
                          src={getImageUrl(
                            b.damageImage
                          )}
                          alt=""
                          className="w-full h-52 object-cover rounded-2xl border"
                        />

                      </div>
                    )
                  }

                  <p className="text-gray-700">
                    <strong>
                      Address:
                    </strong>{" "}
                    {
                      fullAddress(
                        b
                      )
                    }
                  </p>

                  <p>
                    <strong>
                      Pickup Agent:
                    </strong>{" "}
                    {
                      b.bookingType ===
                      "SELF"
                        ? "Not Required"
                        : b
                            .pickupAgent
                            ?.name ||
                          "Not Assigned"
                    }
                  </p>

                  <p>
                    <strong>
                      Technician:
                    </strong>{" "}
                    {
                      b.technician
                        ?.name ||
                      "Not Assigned"
                    }
                  </p>

                  {/* ACTION */}

                  <div className="pt-3">

                    {
                      nextAction(
                        b
                      )
                    }

                  </div>

                </div>

              </div>
            )
          )}

        </div>

        
        {/* INVOICE MODAL */}

        {
          selectedBooking && (

            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

              <div className="bg-white p-8 rounded-3xl w-full max-w-lg space-y-4">

                <h2 className="text-3xl font-black">
                  Generate Invoice
                </h2>

                <input
                  type="number"
                  placeholder="Base Amount"
                  className="w-full border p-3 rounded-xl"
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      baseAmount:
                        e.target.value
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Pickup Charge"
                  className="w-full border p-3 rounded-xl"
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      pickupCharge:
                        e.target.value
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Repair Charge"
                  className="w-full border p-3 rounded-xl"
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      repairCharge:
                        e.target.value
                    })
                  }
                />

                <input
                  type="number"
                  placeholder="Discount"
                  className="w-full border p-3 rounded-xl"
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      discount:
                        e.target.value
                    })
                  }
                />

                <textarea
                  placeholder="Notes"
                  className="w-full border p-3 rounded-xl"
                  onChange={(e) =>
                    setInvoiceData({
                      ...invoiceData,
                      notes:
                        e.target.value
                    })
                  }
                />

                <div className="flex gap-4">

                  <button
                    onClick={
                      generateInvoice
                    }
                    className="flex-1 bg-black text-white py-3 rounded-xl font-bold"
                  >
                    Generate
                  </button>

                  <button
                    onClick={() =>
                      setSelectedBooking(
                        null
                      )
                    }
                    className="flex-1 bg-gray-300 py-3 rounded-xl font-bold"
                  >
                    Cancel
                  </button>

                </div>

              </div>

            </div>
          )
        }

      </div>

    </AdminLayout>
  );
}

export default AdminBookings;