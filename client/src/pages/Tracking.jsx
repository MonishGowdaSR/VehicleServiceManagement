import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline
} from "react-leaflet";

function Tracking() {
  const token = localStorage.getItem("token");

  // 🔥 SAME BOOKING ID
  const bookingId = "69d6054dedbaeaf6bb44a520";

  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState(null);

  const customer = [12.9716, 77.5946];
  const garage = [12.9352, 77.6245];

  // ✅ CORRECT API CALL (FIXED)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/tracking/location/${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          console.error("API ERROR:", res.status);
          return;
        }

        const data = await res.json();

        if (data?.data?.currentLocation) {
          setLocation(data.data.currentLocation);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 🔥 OSRM ROUTE
  useEffect(() => {
    if (!location) return;

    const fetchRoute = async () => {
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${garage[1]},${garage[0]}?overview=full&geometries=geojson`
        );

        const data = await res.json();

        if (data.routes && data.routes.length > 0) {
          const coords = data.routes[0].geometry.coordinates.map(
            (c) => [c[1], c[0]]
          );

          setRoute(coords);

          const duration = data.routes[0].duration;
          setEta(Math.round(duration / 60));
        }
      } catch (err) {
        console.error("ROUTE ERROR:", err);
      }
    };

    fetchRoute();
  }, [location]);

  if (!location) return <h2>Loading location...</h2>;

  return (
    <div>
      <h2>📍 Live Tracking</h2>
      <p><b>ETA:</b> {eta ? `${eta} mins` : "Calculating..."}</p>

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        style={{ height: "500px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🚗 Agent */}
        <Marker position={[location.lat, location.lng]} />

        {/* 🏠 Customer */}
        <Marker position={customer} />

        {/* 🏢 Garage */}
        <Marker position={garage} />

        {/* 🔵 Route */}
        <Polyline positions={route} color="blue" />
      </MapContainer>
    </div>
  );
}

export default Tracking;