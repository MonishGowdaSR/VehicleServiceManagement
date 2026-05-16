import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <AdminTopbar />

        {/* PAGE CONTENT */}
        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;