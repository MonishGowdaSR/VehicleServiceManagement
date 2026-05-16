import { useState } from "react";
import { useNavigate } from "react-router-dom";


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
//***************************************************** */
 return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

    <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">

      <div className="text-center mb-8">

        <h1 className="text-4xl font-black text-slate-900">
          Admin Login
        </h1>

        <p className="text-gray-500 mt-2">
          Vehicle Service Management
        </p>

      </div>

      <div className="space-y-5">

        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendOtp}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition-all"
        >
          Send OTP
        </button>
        <input
  type="text"
  placeholder="Enter OTP"
  value={otp}
  onChange={(e) =>
    setOtp(e.target.value)
  }
  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
/>

<button
  onClick={verifyOtp}
  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold transition-all"
>
  Verify OTP
</button>

      </div>

      <div className="text-center mt-6">

        <p className="text-gray-600">
          Customer?{" "}

          <span
            onClick={() =>
              navigate("/login")
            }
            className="text-blue-600 font-bold cursor-pointer"
          >
            User Login
          </span>

        </p>

      </div>

    </div>

  </div>
);
}

export default AdminLogin;