import { useNavigate } from "react-router-dom";

function BookingCard({
  booking,
}) {
  const navigate =
    useNavigate();

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