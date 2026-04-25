import { useEffect, useRef, useState } from "react";

function AgentSimulator() {
  const token = localStorage.getItem("token");

  // SAME BOOKING ID
  const bookingId = "69d6054dedbaeaf6bb44a520";

  // Fixed locations
  const customer = [12.9716, 77.5946];
  const garage = [12.9352, 77.6245];

  // Random starting point
  const startPoint = [12.9785, 77.6105];

  const [location, setLocation] = useState({
    lat: startPoint[0],
    lng: startPoint[1]
  });

  const [phase, setPhase] = useState("TO_PICKUP");

  const phaseRef = useRef("TO_PICKUP");
  const routeRef = useRef([]);
  const stepIndexRef = useRef(0);

  // keep refs synced
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  // ---------------------------
  // OSRM route loader
  // ---------------------------
  const loadRoute = async (from, to) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.routes?.length) {
        const coords = data.routes[0].geometry.coordinates.map((c) => ({
          lat: c[1],
          lng: c[0]
        }));

        routeRef.current = coords;
        stepIndexRef.current = 0;
      }
    } catch (err) {
      console.log("Route Error:", err);
    }
  };

  // ---------------------------
  // First route load
  // ---------------------------
  useEffect(() => {
    loadRoute(startPoint, customer);
  }, []);

  // ---------------------------
  // Movement engine
  // ---------------------------
  useEffect(() => {
    const interval = setInterval(async () => {
      const route = routeRef.current;

      if (!route.length) return;

      // move next point
      const point = route[stepIndexRef.current];

      if (!point) return;

      setLocation(point);

      // send backend
      try {
        await fetch(
          `http://localhost:5000/api/tracking/update-location/${bookingId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              lat: point.lat,
              lng: point.lng,
              phase: phaseRef.current
            })
          }
        );
      } catch (err) {
        console.log(err);
      }

      stepIndexRef.current++;

      // destination reached
      if (stepIndexRef.current >= route.length) {
        if (phaseRef.current === "TO_PICKUP") {
          setPhase("TO_GARAGE");
          await loadRoute(customer, garage);
        } else if (phaseRef.current === "TO_GARAGE") {
          setPhase("RETURN");
          await loadRoute(garage, customer);
        } else {
          clearInterval(interval);
          console.log("Completed");
        }
      }
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>🚗 Agent Simulator</h1>

      <h2>Lat: {location.lat}</h2>
      <h2>Lng: {location.lng}</h2>
      <h2>Phase: {phase}</h2>
    </div>
  );
}

export default AgentSimulator;