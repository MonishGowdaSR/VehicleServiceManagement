import { useEffect, useState, useRef } from "react";

function AgentSimulator() {
  const token = localStorage.getItem("token");

  // 🔥 PUT YOUR REAL BOOKING ID
  const bookingId = "69d6054dedbaeaf6bb44a520";

  const customer = [12.9716, 77.5946];
  const garage = [12.9352, 77.6245];

  const [location, setLocation] = useState({
    lat: 12.9616,
    lng: 77.5846
  });

  const phaseRef = useRef("TO_CUSTOMER");

  const moveTowards = (current, target) => {
    const step = 0.001;

    let lat = current.lat;
    let lng = current.lng;

    if (Math.abs(target[0] - lat) > 0.0001) {
      lat += target[0] > lat ? step : -step;
    }

    if (Math.abs(target[1] - lng) > 0.0001) {
      lng += target[1] > lng ? step : -step;
    }

    return { lat, lng };
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      let target;

      if (phaseRef.current === "TO_CUSTOMER") target = customer;
      else if (phaseRef.current === "TO_GARAGE") target = garage;
      else target = customer;

      const newLoc = moveTowards(location, target);

      setLocation(newLoc);

      // 🔥 PHASE SWITCH
      if (
        phaseRef.current === "TO_CUSTOMER" &&
        Math.abs(newLoc.lat - customer[0]) < 0.002 &&
        Math.abs(newLoc.lng - customer[1]) < 0.002
      ) {
        phaseRef.current = "TO_GARAGE";
        console.log("Pickup done → Going to Garage");
      }

      else if (
        phaseRef.current === "TO_GARAGE" &&
        Math.abs(newLoc.lat - garage[0]) < 0.002 &&
        Math.abs(newLoc.lng - garage[1]) < 0.002
      ) {
        phaseRef.current = "RETURN";
        console.log("Garage reached → Returning");
      }

      else if (
        phaseRef.current === "RETURN" &&
        Math.abs(newLoc.lat - customer[0]) < 0.002 &&
        Math.abs(newLoc.lng - customer[1]) < 0.002
      ) {
        console.log("✅ Delivery Completed");
      }

      // 🔥 SEND TO BACKEND
      await fetch(
        `http://localhost:5000/api/tracking/update-location/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(newLoc)
        }
      );

    }, 2000);

    return () => clearInterval(interval);
  }, [location]);

  return (
    <div>
      <h2>🚗 Agent Simulator</h2>
      <p>Lat: {location.lat}</p>
      <p>Lng: {location.lng}</p>
      <p>Phase: {phaseRef.current}</p>
    </div>
  );
}

export default AgentSimulator;