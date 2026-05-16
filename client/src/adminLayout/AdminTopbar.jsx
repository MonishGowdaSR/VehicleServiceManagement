import { useNavigate } from "react-router-dom";

function AdminTopbar() {

  const navigate = useNavigate();

  const logout = () => {

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "role"
    );

    navigate("/admin-login");
  };

  return (
    <header className="bg-white border-b px-6 py-4 flex items-center justify-between">

      {/* TITLE */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">
          Admin Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Vehicle Service Management
        </p>
      </div>

      {/* BUTTON */}
      <button
        onClick={logout}
        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-semibold transition-all"
      >
        Logout
      </button>

    </header>
  );
}

export default AdminTopbar;