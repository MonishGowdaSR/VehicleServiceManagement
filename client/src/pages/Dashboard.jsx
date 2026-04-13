import { useEffect, useState } from "react";

function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    ownerName: "",
    vehicleNumber: "",
    serviceType: ""
  });

  const token = localStorage.getItem("token");

  // 🔹 Fetch vehicles
  const fetchVehicles = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vehicles", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      console.log("VEHICLES RESPONSE:", data);

      // ✅ FIX: handle different response formats safely
      if (Array.isArray(data)) {
        setVehicles(data);
      } else if (Array.isArray(data.data)) {
        setVehicles(data.data);
      } else if (Array.isArray(data.vehicles)) {
        setVehicles(data.vehicles);
      } else {
        setVehicles([]); // fallback
      }

    } catch (error) {
      console.error("Fetch error:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // 🔹 Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Add vehicle
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/vehicles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        alert("Vehicle added");
        setForm({ ownerName: "", vehicleNumber: "", serviceType: "" });
        fetchVehicles();
      } else {
        const data = await res.json();
        alert(data.message || "Error adding vehicle");
      }
    } catch (error) {
      console.error("Add error:", error);
    }
  };

  // 🔹 Delete vehicle
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        alert("Vehicle deleted");
        fetchVehicles();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  // 🔹 Update status
  const handleStatusUpdate = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/vehicles/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: "Completed" })
      });

      if (res.ok) {
        alert("Status updated");
        fetchVehicles();
      }
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* 🔹 Add Vehicle Form */}
      <form onSubmit={handleAdd}>
        <input
          name="ownerName"
          placeholder="Owner Name"
          value={form.ownerName}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="vehicleNumber"
          placeholder="Vehicle Number"
          value={form.vehicleNumber}
          onChange={handleChange}
        />
        <br /><br />

        <input
          name="serviceType"
          placeholder="Service Type"
          value={form.serviceType}
          onChange={handleChange}
        />
        <br /><br />

        <button type="submit">Add Vehicle</button>
      </form>

      <hr />

      {/* 🔹 Loading */}
      {loading && <p>Loading vehicles...</p>}

      {/* 🔹 Empty state */}
      {!loading && vehicles.length === 0 && (
        <p>No vehicles found</p>
      )}

      {/* 🔹 Vehicle List */}
      {!loading &&
        Array.isArray(vehicles) &&
        vehicles.map((v) => (
          <div key={v._id}>
          <p><b>{v.ownerName || "No Owner Name"}</b></p>
            <p>{v.vehicleNumber}</p>
            <p>{v.serviceType}</p>
            <p>Status: {v.status || "Pending"}</p>

            <button onClick={() => handleStatusUpdate(v._id)}>
              Mark Completed
            </button>

            <button onClick={() => handleDelete(v._id)}>
              Delete
            </button>

            <hr />
          </div>
        ))}
    </div>
  );
}

export default Dashboard;