import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap
} from "react-leaflet";

function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
  }, [position]);

  return null;
}

function Tracking() {
  const token = localStorage.getItem("token");
  const bookingId = "69d6054dedbaeaf6bb44a520";

  const customer = [12.9716, 77.5946];
  const garage = [12.9352, 77.6245];

  const [location, setLocation] = useState(null);
  const [phase, setPhase] = useState("TO_PICKUP");
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState("--");

  const lastPhase = useRef("");

  // -------------------------
  // Detect phase from live location
  // -------------------------
  const detectPhase = (lat, lng) => {
    const nearCustomer =
      Math.abs(lat - customer[0]) < 0.002 &&
      Math.abs(lng - customer[1]) < 0.002;

    const nearGarage =
      Math.abs(lat - garage[0]) < 0.002 &&
      Math.abs(lng - garage[1]) < 0.002;

    if (nearGarage) return "RETURN";
    if (nearCustomer && lastPhase.current === "TO_PICKUP")
      return "TO_GARAGE";

    if (lastPhase.current === "TO_GARAGE") return "TO_GARAGE";
    if (lastPhase.current === "RETURN") return "RETURN";

    return "TO_PICKUP";
  };

  // -------------------------
  // Poll backend
  // -------------------------
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

        const data = await res.json();

        const loc = data.data.currentLocation;

        setLocation(loc);

        const newPhase = detectPhase(loc.lat, loc.lng);

        setPhase(newPhase);
        lastPhase.current = newPhase;
      } catch (err) {
        console.log(err);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // -------------------------
  // Load route whenever phase/location changes
  // -------------------------
  useEffect(() => {
    if (!location) return;

    let destination = customer;

    if (phase === "TO_GARAGE") destination = garage;
    if (phase === "RETURN") destination = customer;

    const loadRoute = async () => {
      const url = `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes?.length) {
        const coords = data.routes[0].geometry.coordinates.map((c) => [
          c[1],
          c[0]
        ]);

        setRoute(coords);

        setEta(Math.ceil(data.routes[0].duration / 60));
      }
    };

    loadRoute();
  }, [location, phase]);

  if (!location) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>📍 Live Tracking</h1>

      <h2>Status: {phase}</h2>
      <h2>ETA: {eta} mins</h2>

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        style={{ height: "550px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Recenter position={[location.lat, location.lng]} />

        <Marker position={[location.lat, location.lng]} />
        <Marker position={customer} />
        <Marker position={garage} />

        <Polyline positions={route} color="blue" weight={6} />
      </MapContainer>
    </div>
  );
}

export default Tracking;