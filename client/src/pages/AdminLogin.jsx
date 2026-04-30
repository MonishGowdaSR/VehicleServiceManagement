import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function AdminLogin() {
  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [step, setStep] =
    useState(1);

  const navigate =
    useNavigate();

  /* ================= SEND OTP ================= */
  const sendOtp =
    async () => {
      try {
        const res =
          await fetch(
            "http://localhost:5000/api/auth/admin/send-otp",
            {
              method:
                "POST",
              headers:
                {
                  "Content-Type":
                    "application/json"
                },
              body: JSON.stringify(
                {
                  email,
                  phone
                }
              )
            }
          );

        const data =
          await res.json();

        alert(
          data.message
        );

        if (res.ok) {
          setStep(2);
        }
      } catch (error) {
        console.log(
          error
        );
      }
    };

  /* ================= VERIFY OTP ================= */
  const verifyOtp =
    async () => {
      try {
        const res =
          await fetch(
            "http://localhost:5000/api/auth/admin/verify-otp",
            {
              method:
                "POST",
              headers:
                {
                  "Content-Type":
                    "application/json"
                },
              body: JSON.stringify(
                {
                  email,
                  phone,
                  otp
                }
              )
            }
          );

        const data =
          await res.json();

        if (res.ok) {
          /* clear user login if exists */
          localStorage.removeItem(
            "userToken"
          );

          /* store admin session */
          localStorage.setItem(
            "adminToken",
            data.token
          );

          localStorage.setItem(
            "role",
            "ADMIN"
          );

          navigate(
            "/admin"
          );
        } else {
          alert(
            data.message
          );
        }
      } catch (error) {
        console.log(
          error
        );
      }
    };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          Admin Login
        </h1>

        {step === 1 ? (
          <>
            <input
              placeholder="Admin Email"
              value={
                email
              }
              onChange={(
                e
              ) =>
                setEmail(
                  e.target
                    .value
                )
              }
            />

            <input
              placeholder="Phone Number"
              value={
                phone
              }
              onChange={(
                e
              ) =>
                setPhone(
                  e.target
                    .value
                )
              }
            />

            <button
              onClick={
                sendOtp
              }
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              placeholder="Enter OTP"
              value={
                otp
              }
              onChange={(
                e
              ) =>
                setOtp(
                  e.target
                    .value
                )
              }
            />

            <button
              onClick={
                verifyOtp
              }
            >
              Verify OTP
            </button>
          </>
        )}

        <p
          style={{
            marginTop:
              "16px",
            textAlign:
              "center"
          }}
        >
          Customer?{" "}
          <span
            style={{
              color:
                "#2563eb",
              cursor:
                "pointer",
              fontWeight:
                "bold"
            }}
            onClick={() =>
              navigate(
                "/login"
              )
            }
          >
            User Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;