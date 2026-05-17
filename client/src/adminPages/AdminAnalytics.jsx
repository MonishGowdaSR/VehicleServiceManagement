import { useEffect, useState } from "react";
import AdminLayout from "../adminLayout/AdminLayout";

function AdminAnalytics() {

  const [bookings, setBookings] =
    useState([]);

  const token =
    localStorage.getItem(
      "adminToken"
    );

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics =
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

  /* ================= KPI ================= */

  const totalBookings =
    bookings.length;

  const activeServices =
    bookings.filter(
      (b) =>
        b.status !==
          "DELIVERED" &&
        b.status !==
          "CANCELLED"
    ).length;

  const deliveredVehicles =
    bookings.filter(
      (b) =>
        b.status ===
        "DELIVERED"
    ).length;

  const totalRevenue =
    bookings
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

  /* ================= STATUS COUNTS ================= */

  const statusCounts = {};

  bookings.forEach((b) => {

    statusCounts[
      b.status
    ] =
      (
        statusCounts[
          b.status
        ] || 0
      ) + 1;
  });

  /* ================= SERVICE COUNTS ================= */

  const serviceCounts =
    {};

  bookings.forEach((b) => {

    serviceCounts[
      b.serviceType
    ] =
      (
        serviceCounts[
          b.serviceType
        ] || 0
      ) + 1;
  });

  /* ================= PAYMENT COUNTS ================= */

  const paymentCounts =
    {};

  bookings.forEach((b) => {

    paymentCounts[
      b.paymentStatus
    ] =
      (
        paymentCounts[
          b.paymentStatus
        ] || 0
      ) + 1;
  });

  return (

    <AdminLayout>

      <div>

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-5xl font-black text-slate-900">
            Analytics Dashboard
          </h1>

          <p className="text-gray-500 mt-2 text-xl">
            Service, booking and payment analytics
          </p>

        </div>

        {/* KPI CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total Bookings
            </p>

            <h2 className="text-5xl font-black mt-3">
              {totalBookings}
            </h2>

          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Active Services
            </p>

            <h2 className="text-5xl font-black mt-3 text-blue-600">
              {activeServices}
            </h2>

          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Delivered Vehicles
            </p>

            <h2 className="text-5xl font-black mt-3 text-green-600">
              {deliveredVehicles}
            </h2>

          </div>

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <p className="text-gray-500 text-sm">
              Total Revenue
            </p>

            <h2 className="text-5xl font-black mt-3 text-orange-500">
              ₹{totalRevenue}
            </h2>

          </div>

        </div>

        {/* ANALYTICS GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* STATUS */}

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <h2 className="text-3xl font-black mb-6">
              Booking Status
            </h2>

            <div className="space-y-4">

              {
                Object.entries(
                  statusCounts
                ).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className="flex justify-between items-center border-b pb-3"
                    >

                      <span className="font-semibold">
                        {key}
                      </span>

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                        {value}
                      </span>

                    </div>
                  )
                )
              }

            </div>

          </div>

          {/* SERVICES */}

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <h2 className="text-3xl font-black mb-6">
              Service Types
            </h2>

            <div className="space-y-4">

              {
                Object.entries(
                  serviceCounts
                ).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className="flex justify-between items-center border-b pb-3"
                    >

                      <span className="font-semibold">
                        {key}
                      </span>

                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                        {value}
                      </span>

                    </div>
                  )
                )
              }

            </div>

          </div>

          {/* PAYMENTS */}

          <div className="bg-white rounded-3xl border shadow-sm p-6">

            <h2 className="text-3xl font-black mb-6">
              Payment Status
            </h2>

            <div className="space-y-4">

              {
                Object.entries(
                  paymentCounts
                ).map(
                  ([key, value]) => (

                    <div
                      key={key}
                      className="flex justify-between items-center border-b pb-3"
                    >

                      <span className="font-semibold">
                        {key}
                      </span>

                      <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-bold">
                        {value}
                      </span>

                    </div>
                  )
                )
              }

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}

export default AdminAnalytics;