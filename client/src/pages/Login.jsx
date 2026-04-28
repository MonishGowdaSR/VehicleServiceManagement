import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch("http://localhost:5000/api/auth/login/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMsg("OTP sent successfully");
      } else {
        setMsg(data.message || "Failed to send OTP");
      }
    } catch {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch("http://localhost:5000/api/auth/login/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, otp })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setMsg(data.message || "Invalid OTP");
      }
    } catch {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Vehicle Service</h1>
        <p>Smart maintenance platform</p>

        {step === 1 && (
          <>
            <input
              type="text"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button onClick={sendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              className="secondary-btn"
              onClick={() => setStep(1)}
            >
              Change Number
            </button>
          </>
        )}

        {msg && <div className="msg-box">{msg}</div>}
      </div>
    </div>
  );
}

export default Login;