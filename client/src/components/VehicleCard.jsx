function VehicleCard({
  vehicle,
  handleQuickBook,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-center mb-5">

        <img
          src={
            vehicle.vehiclePhoto &&
            vehicle.vehiclePhoto !== ""
              ? `http://localhost:5000/${vehicle.vehiclePhoto.replace(
                  "\\",
                  "/"
                )}`
              : "https://cdn-icons-png.flaticon.com/512/854/854878.png"
          }
          alt="vehicle"
          className="w-28 h-28 rounded-full object-cover border-4 border-slate-200 shadow-lg"
        />

      </div>

      <div className="text-center">

        <h3 className="text-2xl font-black text-slate-900">
          {vehicle.vehicleNumber}
        </h3>

        <p className="text-slate-500 mt-2">
          {vehicle.brand} {vehicle.model}
        </p>

        <div className="flex justify-center gap-3 mt-4 flex-wrap">

          <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
            {vehicle.vehicleType}
          </div>

          <div className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
            {vehicle.fuelType}
          </div>

        </div>

        <button
          onClick={() =>
            handleQuickBook(
              vehicle._id
            )
          }
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01] transition-all text-white font-bold py-4 rounded-2xl"
        >
          Book Service
        </button>

      </div>
    </div>
  );
}

export default VehicleCard;