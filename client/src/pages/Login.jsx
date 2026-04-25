import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate(); // ✅ IMPORTANT

  // STEP 1 → SEND OTP
  const sendOtp = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone })
    });

    const data = await res.json();
    console.log("OTP RESPONSE:", data);

    if (res.ok) {
      setStep(2);
    }
  };

  // STEP 2 → VERIFY OTP
  const verifyOtp = async () => {
    const res = await fetch("http://localhost:5000/api/auth/login/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ phone, otp })
    });

    const data = await res.json();
    console.log("VERIFY RESPONSE:", data);

    if (res.ok) {
      localStorage.setItem("token", data.token);

      // ✅ REDIRECT instead of render
      navigate("/dashboard");
    }
  };

  return (
    <div>
      <h2>Login (OTP)</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Enter phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <br /><br />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br /><br />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
}

export default Login;