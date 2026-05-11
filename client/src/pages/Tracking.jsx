import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function Recenter({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position, 15);
  }, [position, map]);

  return null;
}

const agentIcon = L.divIcon({
  html: `<div style="font-size:34px;">🛵</div>`,
  className: "",
  iconSize: [35, 35],
  iconAnchor: [18, 35]
});

const homeIcon = L.divIcon({
  html: `<div style="font-size:34px;">🏠</div>`,
  className: "",
  iconSize: [35, 35],
  iconAnchor: [18, 35]
});

const garageIcon = L.divIcon({
  html: `<div style="font-size:34px;">🏢</div>`,
  className: "",
  iconSize: [35, 35],
  iconAnchor: [18, 35]
});

function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("userToken");

  const customer = [12.9716, 77.5946];
  const garage = [12.9352, 77.6245];

  const [location, setLocation] = useState(null);
  const [phase, setPhase] = useState("TO_PICKUP");
  const [eta, setEta] = useState("--");
  const [loading, setLoading] = useState(true);
  const [notStarted, setNotStarted] = useState(false);

  const lastPhase = useRef("");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const detectPhase = (lat, lng) => {
    const nearCustomer =
      Math.abs(lat - customer[0]) < 0.002 &&
      Math.abs(lng - customer[1]) < 0.002;

    const nearGarage =
      Math.abs(lat - garage[0]) < 0.002 &&
      Math.abs(lng - garage[1]) < 0.002;

    if (nearGarage && lastPhase.current === "TO_GARAGE")
      return "RETURN";

    if (
      nearCustomer &&
      lastPhase.current === "TO_PICKUP"
    )
      return "TO_GARAGE";

    if (
      nearCustomer &&
      lastPhase.current === "RETURN"
    )
      return "DELIVERED";

    if (lastPhase.current === "TO_GARAGE")
      return "TO_GARAGE";

    if (lastPhase.current === "RETURN")
      return "RETURN";

    return "TO_PICKUP";
  };

  const statusText = {
    TO_PICKUP: "Pickup Agent Coming",
    TO_GARAGE: "Vehicle Going To Garage",
    RETURN: "Vehicle Out For Delivery",
    DELIVERED: "Vehicle Delivered"
  };

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
          setLoading(false);
          return;
        }

        const loc = data?.data?.currentLocation;

        if (!loc?.lat || !loc?.lng) {
          setNotStarted(true);
          setLoading(false);
          return;
        }

        setNotStarted(false);
        setLoading(false);

        setLocation(loc);

        const newPhase = detectPhase(
          loc.lat,
          loc.lng
        );

        setPhase(newPhase);
        lastPhase.current = newPhase;

        const target =
          newPhase === "TO_GARAGE"
            ? garage
            : customer;

        const distance =
          Math.sqrt(
            Math.pow(
              target[0] - loc.lat,
              2
            ) +
              Math.pow(
                target[1] - loc.lng,
                2
              )
          );

        setEta(
          Math.max(
            1,
            Math.round(distance * 700)
          )
        );
      } catch {}
    }, 1500);

    return () =>
      clearInterval(interval);
  }, [id, token]);

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Loading Tracking...</h2>
      </div>
    );
  }

  if (notStarted) {
    return (
      <div style={{ padding: 40 }}>
        <button
          onClick={() =>
            navigate("/dashboard")
          }
        >
          Back
        </button>

        <h1>Tracking Not Started</h1>
        <p>
          Pickup agent has not started
          tracking yet.
        </p>
      </div>
    );
  }

  if (!location) {
    return (
      <div style={{ padding: 40 }}>
        <h2>No Tracking Data</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={() =>
          navigate("/dashboard")
        }
        style={{
          padding: "8px 18px",
          marginBottom: 15
        }}
      >
        Back
      </button>

      <h1>Live Tracking</h1>
      <h2>{statusText[phase]}</h2>
      <h3>ETA: {eta} mins</h3>

      <MapContainer
        center={[
          location.lat,
          location.lng
        ]}
        zoom={15}
        style={{
          height: "560px",
          width: "100%",
          borderRadius: "14px"
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Recenter
          position={[
            location.lat,
            location.lng
          ]}
        />

        <Marker
          position={[
            location.lat,
            location.lng
          ]}
          icon={agentIcon}
        >
          <Tooltip permanent>
            Pickup Agent
          </Tooltip>
        </Marker>

        <Marker
          position={customer}
          icon={homeIcon}
        >
          <Tooltip permanent>
            Customer
          </Tooltip>
        </Marker>

        <Marker
          position={garage}
          icon={garageIcon}
        >
          <Tooltip permanent>
            Garage
          </Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default Tracking;