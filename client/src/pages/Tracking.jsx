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

import {
  ArrowLeft,
  Clock3,
  Bike,
  House,
  Building2,
  CheckCircle2
} from "lucide-react";

import "leaflet/dist/leaflet.css";

/* =========================
   MAP RECENTER
========================= */

function Recenter({ position }) {

  const map = useMap();

  useEffect(() => {

    map.setView(position, 15);

  }, [position, map]);

  return null;
}

/* =========================
   CUSTOM ICONS
========================= */

const agentIcon = L.divIcon({
  html: `
    <div style="
      width:48px;
      height:48px;
      background:#2563eb;
      border-radius:999px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:24px;
      border:4px solid white;
      box-shadow:0 8px 20px rgba(0,0,0,.25);
    ">
      🛵
    </div>
  `,
  className: "",
  iconSize: [48, 48],
  iconAnchor: [24, 48]
});

const homeIcon = L.divIcon({
  html: `
    <div style="
      width:48px;
      height:48px;
      background:#16a34a;
      border-radius:999px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:24px;
      border:4px solid white;
      box-shadow:0 8px 20px rgba(0,0,0,.25);
    ">
      🏠
    </div>
  `,
  className: "",
  iconSize: [48, 48],
  iconAnchor: [24, 48]
});

const garageIcon = L.divIcon({
  html: `
    <div style="
      width:52px;
      height:52px;
      background:#111827;
      border-radius:18px;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:28px;
      border:4px solid white;
      box-shadow:0 8px 20px rgba(0,0,0,.25);
    ">
      🏭
    </div>
  `,
  className: "",
  iconSize: [52, 52],
  iconAnchor: [26, 52]
});

/* =========================
   TRACKING
========================= */

function Tracking() {

  const { id } = useParams();

  const navigate =
    useNavigate();

  const token =
    localStorage.getItem(
      "userToken"
    );

  const customer = [
    12.9716,
    77.5946
  ];

  const garage = [
    12.9352,
    77.6245
  ];

  const [location, setLocation] =
    useState(null);

  const [phase, setPhase] =
    useState("TO_PICKUP");

  const [eta, setEta] =
    useState("--");

  const [loading, setLoading] =
    useState(true);

  const [notStarted, setNotStarted] =
    useState(false);

  const lastPhase =
    useRef("");

  /* =========================
     AUTH CHECK
  ========================= */

  useEffect(() => {

    if (!token) {

      navigate("/login");

    }

  }, [token, navigate]);

  /* =========================
     PHASE DETECTION
  ========================= */

  const detectPhase = (
    lat,
    lng
  ) => {

    const nearCustomer =
      Math.abs(
        lat - customer[0]
      ) < 0.002 &&
      Math.abs(
        lng - customer[1]
      ) < 0.002;

    const nearGarage =
      Math.abs(
        lat - garage[0]
      ) < 0.002 &&
      Math.abs(
        lng - garage[1]
      ) < 0.002;

    if (
      nearGarage &&
      lastPhase.current ===
        "TO_GARAGE"
    )
      return "RETURN";

    if (
      nearCustomer &&
      lastPhase.current ===
        "TO_PICKUP"
    )
      return "TO_GARAGE";

    if (
      nearCustomer &&
      lastPhase.current ===
        "RETURN"
    )
      return "DELIVERED";

    if (
      lastPhase.current ===
      "TO_GARAGE"
    )
      return "TO_GARAGE";

    if (
      lastPhase.current ===
      "RETURN"
    )
      return "RETURN";

    return "TO_PICKUP";
  };

  /* =========================
     STATUS TEXT
  ========================= */

  const statusText = {

    TO_PICKUP:
      "Pickup Agent Coming",

    TO_GARAGE:
      "Vehicle Going To Garage",

    RETURN:
      "Vehicle Out For Delivery",

    DELIVERED:
      "Vehicle Delivered"

  };

  /* =========================
     TRACKING FETCH
  ========================= */

  useEffect(() => {

    if (!token) return;

    const interval =
      setInterval(async () => {

        try {

          const res =
            await fetch(
              `http://localhost:5000/api/tracking/location/${id}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`
                }
              }
            );

          const data =
            await res.json();

          if (!res.ok) {

            setLoading(false);

            return;
          }

          const loc =
            data?.data
              ?.currentLocation;

          if (
            !loc?.lat ||
            !loc?.lng
          ) {

            setNotStarted(true);

            setLoading(false);

            return;
          }

          setNotStarted(false);

          setLoading(false);

          setLocation(loc);

          const newPhase =
            detectPhase(
              loc.lat,
              loc.lng
            );

          setPhase(newPhase);

          lastPhase.current =
            newPhase;

          const target =
            newPhase ===
            "TO_GARAGE"
              ? garage
              : customer;

          const distance =
            Math.sqrt(
              Math.pow(
                target[0] -
                  loc.lat,
                2
              ) +
                Math.pow(
                  target[1] -
                    loc.lng,
                  2
                )
            );

          setEta(
            Math.max(
              1,
              Math.round(
                distance * 700
              )
            )
          );

        } catch {}

      }, 1500);

    return () =>
      clearInterval(
        interval
      );

  }, [id, token]);

  /* =========================
     LOADING
  ========================= */

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-100 flex items-center justify-center">

        <div className="bg-white rounded-3xl p-10 shadow-xl">

          <h1 className="text-3xl font-black">
            Loading Tracking...
          </h1>

        </div>

      </div>
    );
  }

  /* =========================
     NOT STARTED
  ========================= */

  if (notStarted) {

    return (

      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="bg-white rounded-3xl p-10 shadow-xl max-w-xl w-full text-center">

          <Bike
            size={80}
            className="mx-auto text-blue-600 mb-5"
          />

          <h1 className="text-4xl font-black text-slate-900">
            Tracking Not Started
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Pickup agent has not started
            the trip yet.
          </p>

          <button
            onClick={() =>
              navigate(
                "/dashboard"
              )
            }
            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold"
          >
            Back To Dashboard
          </button>

        </div>

      </div>
    );
  }

  /* =========================
     NO LOCATION
  ========================= */

  if (!location) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-100">

        <h1 className="text-3xl font-black">
          No Tracking Data
        </h1>

      </div>
    );
  }

  /* =========================
     MAIN UI
  ========================= */

  return (

    <div className="min-h-screen bg-slate-100 p-6">

      {/* TOPBAR */}

      <div className="flex items-center justify-between mb-6">

        <button
          onClick={() =>
            navigate(
              "/dashboard"
            )
          }
          className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border font-bold hover:bg-slate-50"
        >

          <ArrowLeft size={20} />

          Back

        </button>

        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border">

          <p className="text-sm text-gray-500">
            Live Vehicle Tracking
          </p>

          <h2 className="text-xl font-black text-slate-900">
            Vehicle Service Management
          </h2>

        </div>

      </div>

      {/* STATUS CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

        {/* STATUS */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="flex items-center gap-4">

            <div className="bg-blue-100 p-4 rounded-2xl">

              <Bike
                size={30}
                className="text-blue-600"
              />

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Current Status
              </p>

              <h2 className="text-2xl font-black text-slate-900">
                {
                  statusText[
                    phase
                  ]
                }
              </h2>

            </div>

          </div>

        </div>

        {/* ETA */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="flex items-center gap-4">

            <div className="bg-orange-100 p-4 rounded-2xl">

              <Clock3
                size={30}
                className="text-orange-600"
              />

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Estimated Arrival
              </p>

              <h2 className="text-2xl font-black text-slate-900">
                {eta} mins
              </h2>

            </div>

          </div>

        </div>

        {/* DELIVERY */}

        <div className="bg-white rounded-3xl p-6 shadow-sm border">

          <div className="flex items-center gap-4">

            <div className="bg-green-100 p-4 rounded-2xl">

              <CheckCircle2
                size={30}
                className="text-green-600"
              />

            </div>

            <div>

              <p className="text-gray-500 text-sm">
                Delivery Phase
              </p>

              <h2 className="text-2xl font-black text-slate-900">
                {phase}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* MAP */}

      <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border">

        <div className="px-8 py-6 border-b bg-slate-50">

          <h2 className="text-3xl font-black text-slate-900">
            Live Route Map
          </h2>

          <p className="text-gray-500 mt-1">
            Real-time vehicle movement and delivery tracking
          </p>

        </div>

        <div className="p-6">

          <MapContainer
  center={[
    location.lat,
    location.lng
  ]}
  zoom={15}
  style={{
    height: "500px",
    width: "100%",
    borderRadius:
      "24px"
  }}
>

            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <Recenter
              position={[
                location.lat,
                location.lng
              ]}
            />

            {/* AGENT */}

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

            {/* CUSTOMER */}

            <Marker
              position={
                customer
              }
              icon={homeIcon}
            >

              <Tooltip permanent>
                Customer Home
              </Tooltip>

            </Marker>

            {/* GARAGE */}

            <Marker
              position={
                garage
              }
              icon={garageIcon}
            >

              <Tooltip permanent>
                Service Garage
              </Tooltip>

            </Marker>

          </MapContainer>

        </div>

      </div>

      {/* TIMELINE */}

      <div className="bg-white rounded-[32px] shadow-xl border mt-8 p-8">

        <h2 className="text-3xl font-black text-slate-900 mb-8">
          Service Timeline
        </h2>

        <div className="space-y-8">

          {/* STEP */}

          <div className="flex items-start gap-5">

            <div className="w-6 h-6 rounded-full bg-green-500 mt-1"></div>

            <div>

              <h3 className="font-black text-lg text-slate-900">
                Booking Confirmed
              </h3>

              <p className="text-gray-500">
                Your booking has been successfully created
              </p>

            </div>

          </div>

          {/* STEP */}

          <div className="flex items-start gap-5">

            <div
              className={`w-6 h-6 rounded-full mt-1 ${
                phase !== "TO_PICKUP"
                  ? "bg-green-500"
                  : "bg-blue-500 animate-pulse"
              }`}
            ></div>

            <div>

              <h3 className="font-black text-lg text-slate-900">
                Pickup Agent Assigned
              </h3>

              <p className="text-gray-500">
                Agent has been assigned for pickup
              </p>

            </div>

          </div>

          {/* STEP */}

          <div className="flex items-start gap-5">

            <div
              className={`w-6 h-6 rounded-full mt-1 ${
                phase === "TO_GARAGE" ||
                phase === "RETURN" ||
                phase === "DELIVERED"
                  ? "bg-green-500"
                  : phase === "TO_PICKUP"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-300"
              }`}
            ></div>

            <div>

              <h3 className="font-black text-lg text-slate-900">
                Vehicle Picked Up
              </h3>

              <p className="text-gray-500">
                Vehicle is on the way to service garage
              </p>

            </div>

          </div>

          {/* STEP */}

          <div className="flex items-start gap-5">

            <div
              className={`w-6 h-6 rounded-full mt-1 ${
                phase === "RETURN" ||
                phase === "DELIVERED"
                  ? "bg-green-500"
                  : phase === "TO_GARAGE"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-300"
              }`}
            ></div>

            <div>

              <h3 className="font-black text-lg text-slate-900">
                Service Completed
              </h3>

              <p className="text-gray-500">
                Vehicle servicing completed successfully
              </p>

            </div>

          </div>

          {/* STEP */}

          <div className="flex items-start gap-5">

            <div
              className={`w-6 h-6 rounded-full mt-1 ${
                phase === "DELIVERED"
                  ? "bg-green-500"
                  : phase === "RETURN"
                  ? "bg-blue-500 animate-pulse"
                  : "bg-gray-300"
              }`}
            ></div>

            <div>

              <h3 className="font-black text-lg text-slate-900">
                Vehicle Delivered
              </h3>

              <p className="text-gray-500">
                Vehicle delivered back to customer
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Tracking;