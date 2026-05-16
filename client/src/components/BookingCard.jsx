import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";

function BookingCard({
  booking,
  handlePayment,
}) {
  const navigate =
    useNavigate();

  const downloadReceipt =
  () => {

    const doc =
      new jsPDF();

    /* HEADER */
    doc.setFontSize(22);

    doc.text(
      "Vehicle Service Receipt",
      20,
      20
    );

    doc.setFontSize(12);

    doc.text(
      `Booking ID: ${booking._id}`,
      20,
      40
    );

    doc.text(
      `Customer: ${
        booking.user?.name ||
        "Customer"
      }`,
      20,
      50
    );

    doc.text(
      `Vehicle: ${
        booking.vehicle
          ?.vehicleNumber
      }`,
      20,
      60
    );

    doc.text(
      `Service Type: ${
        booking.serviceType
      }`,
      20,
      70
    );

    doc.text(
      `Payment ID: ${
        booking.paymentId
      }`,
      20,
      80
    );

    doc.text(
      `Payment Date: ${
        new Date(
          booking.paidAt
        ).toLocaleString()
      }`,
      20,
      90
    );

    /* BREAKDOWN */
    doc.setFontSize(16);

    doc.text(
      "Invoice Breakdown",
      20,
      115
    );

    doc.setFontSize(12);

    doc.text(
      `Base Amount: ₹${booking.invoice?.baseAmount}`,
      20,
      130
    );

    doc.text(
      `Pickup Charge: ₹${booking.invoice?.pickupCharge}`,
      20,
      140
    );

    doc.text(
      `Repair Charge: ₹${booking.invoice?.repairCharge}`,
      20,
      150
    );

    doc.text(
      `Discount: ₹${booking.invoice?.discount}`,
      20,
      160
    );

    /* TOTAL */
    doc.setFontSize(18);

    doc.text(
      `TOTAL: ₹${booking.invoice?.totalAmount}`,
      20,
      185
    );

    /* FOOTER */
    doc.setFontSize(11);

    doc.text(
      "Thank you for choosing Vehicle Service Management",
      20,
      230
    );

    doc.save(
      `Receipt-${booking._id}.pdf`
    );
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* VEHICLE NUMBER */}
      <h3 className="text-3xl font-black text-slate-900">
        {
          booking.vehicle
            ?.vehicleNumber
        }
      </h3>

      {/* SERVICE TYPE */}
      <div className="mt-4 inline-flex px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
        {
          booking.serviceType
        }
      </div>

      {/* STATUS */}
      <div
        className={`mt-3 inline-flex px-4 py-2 rounded-full text-sm font-bold ${
          booking.status ===
          "COMPLETED"
            ? "bg-emerald-100 text-emerald-700"
            : booking.status ===
              "IN_PROGRESS"
            ? "bg-yellow-100 text-yellow-700"
            : booking.status ===
              "DELIVERED"
            ? "bg-purple-100 text-purple-700"
            : "bg-slate-200 text-slate-700"
        }`}
      >
        {booking.status}
      </div>

      {/* ISSUE */}
      <p className="mt-5 text-slate-600 leading-relaxed">
        {
          booking.issueDescription
        }
      </p>

      {/* BOOKING TYPE */}
      <div className="mt-4 text-sm text-slate-500 font-medium">
        Type:
        {" "}
        {
          booking.bookingType
        }
      </div>

      {/* DATE */}
      <div className="mt-2 text-sm text-slate-500 font-medium">
        Date:
        {" "}
        {new Date(
          booking.bookingDate
        ).toLocaleDateString()}
      </div>

      {/* PAYMENT SECTION */}
{booking.status ===
  "PAYMENT_PENDING" && (

  <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-4">

    <p className="text-sm text-slate-500">
      Invoice Ready
    </p>

    <h3 className="text-3xl font-black text-slate-900 mt-2">
      ₹
      {
        booking.invoice
          ?.totalAmount || 0
      }
    </h3>

    <div className="grid grid-cols-2 gap-3 mt-5">

      <button
  onClick={() =>
    setInvoiceBooking(
      booking
    )
  }
  className="bg-slate-900 text-white py-3 rounded-2xl font-bold"
>
  View Invoice
</button>

      <button
        onClick={() =>
          handlePayment(
            booking
          )
        }
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-2xl font-bold"
      >
        Pay Now
      </button>

    </div>

  </div>

)}

{/* PAYMENT SUCCESS */}
{booking.status ===
  "PAID" && (

  <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5">

    <h3 className="text-xl font-black text-emerald-700">
      Payment Successful
    </h3>

    <p className="text-emerald-600 mt-2">
      Transaction Completed
    </p>

    <button
  onClick={
    downloadReceipt
  }
  className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 transition-all text-white py-3 rounded-2xl font-bold"
>
  Download Receipt
</button>

  </div>

)}

      {/* TRACK BUTTON */}
      {booking.bookingType ===
        "PICKUP" &&
        booking.status !==
          "DELIVERED" && (
          <button
            onClick={() =>
              navigate(
                `/track/${booking._id}`
              )
            }
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01] transition-all text-white font-bold py-4 rounded-2xl"
          >
            Track Vehicle
          </button>
      )}

    </div>
  );
}

export default BookingCard;