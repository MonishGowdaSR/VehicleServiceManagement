import { useEffect, useState } from "react";
import AdminLayout from "../adminLayout/AdminLayout";

function AdminPayments() {

  const [bookings, setBookings] =
    useState([]);

  const token =
    localStorage.getItem(
      "adminToken"
    );

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments =
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

  /* ================= FILTER ================= */

  const paymentBookings =
    bookings.filter(
      (b) =>
        b.invoice
    );

  /* ================= TOTALS ================= */

  const totalRevenue =
    paymentBookings
      .filter(
        (b) =>
          b.paymentStatus ===
          "PAID"
      )
      .reduce(
        (acc, b) =>
          acc +
          (
            b.invoice
              ?.totalAmount ||
            0
          ),
        0
      );

  const pendingRevenue =
    paymentBookings
      .filter(
        (b) =>
          b.paymentStatus !==
          "PAID"
      )
      .reduce(
        (acc, b) =>
          acc +
          (
            b.invoice
              ?.totalAmount ||
            0
          ),
        0
      );

  const paidCount =
    paymentBookings.filter(
      (b) =>
        b.paymentStatus ===
        "PAID"
    ).length;

  const pendingCount =
    paymentBookings.filter(
      (b) =>
        b.paymentStatus !==
        "PAID"
    ).length;

  return (

    <AdminLayout>

      <div>

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-5xl font-black text-slate-900">
            Payment Management
          </h1>

          <p className="text-gray-500 mt-2 text-xl">
            Track invoices, revenue and customer payments
          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 border shadow-sm">

            <p className="text-gray-500 text-sm">
              Total Revenue
            </p>

            <h2 className="text-4xl font-black mt-3 text-green-600">
              ₹{totalRevenue}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 border shadow-sm">

            <p className="text-gray-500 text-sm">
              Pending Revenue
            </p>

            <h2 className="text-4xl font-black mt-3 text-orange-500">
              ₹{pendingRevenue}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 border shadow-sm">

            <p className="text-gray-500 text-sm">
              Paid Invoices
            </p>

            <h2 className="text-4xl font-black mt-3 text-blue-600">
              {paidCount}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 border shadow-sm">

            <p className="text-gray-500 text-sm">
              Pending Payments
            </p>

            <h2 className="text-4xl font-black mt-3 text-red-500">
              {pendingCount}
            </h2>

          </div>

        </div>

        {/* TABLE */}

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-3xl font-black">
              Payment Records
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-100">

                <tr className="text-left">

                  <th className="p-5">
                    Customer
                  </th>

                  <th className="p-5">
                    Vehicle
                  </th>

                  <th className="p-5">
                    Amount
                  </th>

                  <th className="p-5">
                    Status
                  </th>

                  <th className="p-5">
                    Payment ID
                  </th>

                  <th className="p-5">
                    Paid Date
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  paymentBookings.map(
                    (b) => (

                      <tr
                        key={b._id}
                        className="border-b hover:bg-slate-50"
                      >

                        <td className="p-5">

                          <div>

                            <h3 className="font-bold text-lg">
                              {
                                b.user
                                  ?.name
                              }
                            </h3>

                            <p className="text-gray-500 text-sm">
                              {
                                b.user
                                  ?.phone
                              }
                            </p>

                          </div>

                        </td>

                        <td className="p-5">

                          <div>

                            <p className="font-bold">
                              {
                                b.vehicle
                                  ?.vehicleNumber
                              }
                            </p>

                            <p className="text-gray-500 text-sm">
                              {
                                b.vehicle
                                  ?.brand
                              }{" "}
                              {
                                b.vehicle
                                  ?.model
                              }
                            </p>

                          </div>

                        </td>

                        <td className="p-5 font-black text-lg">

                          ₹
                          {
                            b.invoice
                              ?.totalAmount
                          }

                        </td>

                        <td className="p-5">

                          <span
                            className={`px-4 py-2 rounded-full text-sm font-bold ${
                              b.paymentStatus ===
                              "PAID"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >

                            {
                              b.paymentStatus
                            }

                          </span>

                        </td>

                        <td className="p-5 text-sm text-gray-600">

                          {
                            b.paymentId ||
                            "-"
                          }

                        </td>

                        <td className="p-5 text-sm text-gray-600">

                          {
                            b.paidAt
                              ? new Date(
                                  b.paidAt
                                ).toLocaleString()
                              : "-"
                          }

                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminPayments;