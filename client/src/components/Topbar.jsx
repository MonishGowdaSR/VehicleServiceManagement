function Topbar({
  profile,
  logout,
}) {
  return (
    <header className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

      <div className="flex items-center gap-5">

        <img
          src={
            profile.profilePhoto &&
            profile.profilePhoto !== ""
              ? profile.profilePhoto
              : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="Profile"
          className="w-24 h-24 rounded-3xl object-cover border-4 border-blue-500 shadow-lg"
        />

        <div>
          <h2 className="text-3xl font-black text-slate-900">
            {profile.name}
          </h2>

          <p className="text-slate-500 mt-1">
            {profile.phone}
          </p>

          <p className="text-slate-500">
            {profile.email}
          </p>

          <div className="mt-3 inline-flex items-center px-4 py-2 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold">
            Active Customer
          </div>
        </div>

      </div>

      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold transition-all"
      >
        Logout
      </button>

    </header>
  );
}

export default Topbar;