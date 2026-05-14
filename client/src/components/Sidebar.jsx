function Sidebar({
  vehicles,
  bookings,
  logout,
}) {
  return (
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
  );
}

export default Sidebar;