import { NavLink } from "react-router-dom";

function AdminSidebar() {

  const navStyle =
    "block px-4 py-3 rounded-xl font-medium transition-all";

  return (
    <aside className="w-72 bg-slate-900 text-white p-5">

      {/* LOGO */}
      <div className="mb-10">
        <h1 className="text-3xl font-black">
          Vehicle Admin
        </h1>

        <p className="text-slate-400 text-sm mt-2">
          Service Management
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="space-y-3">

        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `${navStyle} ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/bookings"
          className={({ isActive }) =>
            `${navStyle} ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Bookings
        </NavLink>

        <NavLink
          to="/admin/payments"
          className={({ isActive }) =>
            `${navStyle} ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Payments
        </NavLink>

        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            `${navStyle} ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Analytics
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `${navStyle} ${
              isActive
                ? "bg-blue-600"
                : "hover:bg-slate-800"
            }`
          }
        >
          Users
        </NavLink>

      </nav>
    </aside>
  );
}

export default AdminSidebar;