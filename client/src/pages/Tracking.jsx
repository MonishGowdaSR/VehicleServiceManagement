import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  }, [position, map]);

  return null;
}

function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  // FIXED TOKEN KEY
  const token = localStorage.getItem("userToken");

  const customer = [12.9716, 77.5946];
  const garage = [12.9352, 77.6245];

  const [location, setLocation] = useState(null);
  const [phase, setPhase] = useState("TO_PICKUP");
  const [route, setRoute] = useState([]);
  const [eta, setEta] = useState("--");
  const [notStarted, setNotStarted] = useState(false);
  const [loading, setLoading] = useState(true);

  const lastPhase = useRef("");

  // Redirect if token missing
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const detectPhase = (lat, lng) => {
    const nearCustomer =
      Math.abs(lat - customer[0]) < 0.002 &&
      Math.abs(lng - customer[1]) < 0.002;

    const nearGarage =
      Math.abs(lat - garage[0]) < 0.002 &&
      Math.abs(lng - garage[1]) < 0.002;

    if (nearGarage && lastPhase.current === "TO_GARAGE") {
      return "RETURN";
    }

    if (
      nearCustomer &&
      lastPhase.current === "TO_PICKUP"
    ) {
      return "TO_GARAGE";
    }

    if (
      nearCustomer &&
      lastPhase.current === "RETURN"
    ) {
      return "DELIVERED";
    }

    if (lastPhase.current === "TO_GARAGE") return "TO_GARAGE";
    if (lastPhase.current === "RETURN") return "RETURN";

    return "TO_PICKUP";
  };

  // Fetch tracking location every 1.5 sec
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/tracking/location/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.log(data);
          setLoading(false);
          return;
        }

        const loc = data?.data?.currentLocation;

        if (!loc || !loc.lat || !loc.lng) {
          setNotStarted(true);
          setLoading(false);
          return;
        }

        setNotStarted(false);
        setLoading(false);
        setLocation(loc);

        const newPhase = detectPhase(loc.lat, loc.lng);

        setPhase(newPhase);
        lastPhase.current = newPhase;
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [id, token]);

  // Load route line
  useEffect(() => {
    if (!location) return;

    let destination = customer;

    if (phase === "TO_GARAGE") destination = garage;
    if (phase === "RETURN") destination = customer;

    const loadRoute = async () => {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${location.lng},${location.lat};${destination[1]},${destination[0]}?overview=full&geometries=geojson`;

        const res = await fetch(url);
        const data = await res.json();

        if (data.routes?.length) {
          const coords =
            data.routes[0].geometry.coordinates.map(
              (c) => [c[1], c[0]]
            );

          setRoute(coords);
          setEta(
            Math.ceil(data.routes[0].duration / 60)
          );
        }
      } catch (error) {
        console.log(error);
      }
    };

    loadRoute();
  }, [location, phase]);

  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Loading Tracking...</h2>
      </div>
    );
  }

  if (notStarted) {
    return (
      <div style={{ padding: "40px" }}>
        <button
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>

        <h1>Tracking Not Started</h1>

        <p>
          Pickup agent has not started live
          tracking for this booking yet.
        </p>
      </div>
    );
  }

  if (!location) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No Tracking Data</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginBottom: "15px",
          padding: "8px 16px"
        }}
      >
        Back
      </button>

      <h1>📍 Live Tracking</h1>
      <h2>Status: {phase}</h2>
      <h2>ETA: {eta} mins</h2>

      <MapContainer
        center={[location.lat, location.lng]}
        zoom={15}
        style={{
          height: "550px",
          width: "100%",
          borderRadius: "12px"
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Recenter
          position={[location.lat, location.lng]}
        />

        <Marker
          position={[location.lat, location.lng]}
        />
        <Marker position={customer} />
        <Marker position={garage} />

        <Polyline
          positions={route}
          color="blue"
          weight={6}
        />
      </MapContainer>
    </div>
  );
}

export default Tracking;