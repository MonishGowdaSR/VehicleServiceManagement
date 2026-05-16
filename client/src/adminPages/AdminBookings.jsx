import { useEffect, useState } from "react";
import axios from "axios";

import AdminLayout from "../adminLayout/AdminLayout";

function AdminBookings() {

  const [bookings, setBookings] =
    useState([]);

  const [selectedBooking,
    setSelectedBooking] =
    useState(null);

  const [invoiceData,
    setInvoiceData] =
    useState({
      baseAmount: "",
      pickupCharge: "",
      repairCharge: "",
      discount: "",
      notes: "",
    });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "adminToken"
          );

        const res =
          await axios.get(
            "http://localhost:5000/api/bookings/admin/all",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setBookings(
          res.data.bookings
        );

      } catch (err) {

        console.log(err);
      }
    };

  const getImageUrl = (path) => {

  if (!path) {
    return "";
  }

  /* BASE64 IMAGE */
  if (
    path.startsWith("data:image")
  ) {
    return path;
  }

  /* FULL URL */
  if (
    path.startsWith("http")
  ) {
    return path;
  }

  /* LOCAL UPLOAD */
  return `http://localhost:5000/${path}`;
};
  const fullAddress = (b) => {

    if (!b.pickupAddress)
      return "No Address";

    return `
      ${b.pickupAddress.street},
      ${b.pickupAddress.city},
      ${b.pickupAddress.state}
    `;
  };

  const nextAction = (b) => {

    return (
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all"
      >
        Assign Staff
      </button>
    );
  };

  const generateInvoice = () => {

    console.log(
      invoiceData
    );
  };

  return (
    <AdminLayout>

      <div className="p-6">

        {/* PAGE HEADER */}
        <div className="mb-8">

          <h1 className="text-5xl font-black text-slate-900">
            Booking Management
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Manage customer vehicle
            service bookings
          </p>

        </div>

        {/* BOOKINGS */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border">

          <h2 className="text-3xl font-black mb-6">
            All Bookings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {bookings.map((b) => (

              <div
                key={b._id}
                className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >

                {/* CUSTOMER */}
                <div className="flex items-center gap-4 p-5 border-b">

                  <img
                    src={
                      b.user?.profilePhoto
                        ? getImageUrl(
                            b.user.profilePhoto
                          )
                        : `https://ui-avatars.com/api/?name=${b.user?.name || "User"}`
                    }
                    alt=""
                    className="w-14 h-14 rounded-full object-cover border-2 border-blue-500"
                  />

                  <div>

                    <h3 className="font-bold text-lg">
                      {b.user?.name ||
                        "Customer"}
                    </h3>

                    <p className="text-gray-500 text-sm">
                      {b.user?.phone ||
                        "No Phone"}
                    </p>

                  </div>

                </div>

                {/* VEHICLE */}
                <div className="p-5 space-y-3">

                  <h4 className="text-2xl font-black">
                    {
                      b.vehicle
                        ?.vehicleNumber
                    }
                  </h4>

                  {b.vehicle
                    ?.vehiclePhoto && (
                    <img
                      src={getImageUrl(
                        b.vehicle
                          .vehiclePhoto
                      )}
                      alt=""
                      className="w-full h-52 object-cover rounded-xl"
                    />
                  )}

                  <p>
                    <span className="font-semibold">
                      Service:
                    </span>{" "}
                    {b.serviceType}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Date:
                    </span>{" "}
                    {new Date(
                      b.bookingDate
                    ).toLocaleDateString()}
                  </p>

                  <p>
                    <span className="font-semibold">
                      Type:
                    </span>{" "}
                    {b.bookingType}
                  </p>

                  <p>

                    <span className="font-semibold">
                      Status:
                    </span>

                    <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                      {b.status}
                    </span>

                  </p>

                  <p>
                    <span className="font-semibold">
                      Issue:
                    </span>{" "}
                    {
                      b.issueDescription
                    }
                  </p>

                  {/* DAMAGE IMAGE */}
                  {b.damageImage && (
                    <div>

                      <p className="font-semibold">
                        Damage Image:
                      </p>

                      <img
                        src={getImageUrl(
                          b.damageImage
                        )}
                        alt=""
                        className="w-full h-40 rounded-xl object-cover mt-2 border"
                      />

                    </div>
                  )}

                  <p className="text-sm text-gray-600">
                    {fullAddress(b)}
                  </p>

                  <p>

                    <span className="font-semibold">
                      Pickup Agent:
                    </span>{" "}

                    {b.bookingType ===
                    "SELF"
                      ? "Not Required"
                      : b.pickupAgent
                          ?.name ||
                        "Not Assigned"}

                  </p>

                  <p>

                    <span className="font-semibold">
                      Technician:
                    </span>{" "}

                    {b.technician
                      ?.name ||
                      "Not Assigned"}

                  </p>

                </div>

                {/* ACTIONS */}
                <div className="p-5 border-t">

                  {nextAction(b)}

                </div>

              </div>

            ))}

          </div>

        </section>

        {/* MODAL */}
        {selectedBooking && (

          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white p-8 rounded-3xl w-full max-w-lg space-y-4">

              <h2 className="text-3xl font-black">
                Generate Invoice
              </h2>

              <input
                type="number"
                placeholder="Base Amount"
                className="w-full border rounded-xl p-3"
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    baseAmount:
                      e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Pickup Charge"
                className="w-full border rounded-xl p-3"
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    pickupCharge:
                      e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Repair Charge"
                className="w-full border rounded-xl p-3"
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    repairCharge:
                      e.target.value,
                  })
                }
              />

              <input
                type="number"
                placeholder="Discount"
                className="w-full border rounded-xl p-3"
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    discount:
                      e.target.value,
                  })
                }
              />

              <textarea
                placeholder="Notes"
                className="w-full border rounded-xl p-3"
                onChange={(e) =>
                  setInvoiceData({
                    ...invoiceData,
                    notes:
                      e.target.value,
                  })
                }
              />

              <div className="flex gap-4">

                <button
                  onClick={
                    generateInvoice
                  }
                  className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
                >
                  Generate
                </button>

                <button
                  onClick={() =>
                    setSelectedBooking(
                      null
                    )
                  }
                  className="flex-1 bg-gray-200 py-3 rounded-xl font-bold"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </AdminLayout>
  );
}

export default AdminBookings;