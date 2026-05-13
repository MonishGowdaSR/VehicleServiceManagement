import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
  ];

  const [mode, setMode] = useState("signin");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [avatar] = useState(avatars[0]);
  const [photoPreview, setPhotoPreview] = useState("");
  const [otp, setOtp] = useState("");

  const validatePhone = (num) => {
    return /^[9876]\d{9}$/.test(num);
  };

  const validateEmail = (mail) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(mail);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  /* LOGIN OTP */
  const sendLoginOtp = async () => {
    if (!validatePhone(phone)) {
      setMsg(
        "Enter valid 10 digit phone starting with 9/8/7/6"
      );
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await fetch(
        "http://localhost:5000/api/auth/login/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMsg("OTP sent successfully");
      } else {
        setMsg(data.message);
      }
    } catch {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* SIGNUP OTP */
  const sendSignupOtp = async () => {
    if (!name.trim()) {
      setMsg("Name required");
      return;
    }

    if (!validateEmail(email)) {
      setMsg("Enter valid Gmail address");
      return;
    }

    if (!validatePhone(signupPhone)) {
      setMsg(
        "Enter valid 10 digit phone starting with 9/8/7/6"
      );
      return;
    }

    try {
      setLoading(true);
      setMsg("");

      const res = await fetch(
        "http://localhost:5000/api/auth/signup/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            phone: signupPhone,
            profilePhoto:
              photoPreview || avatar,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMsg("OTP sent successfully");
      } else {
        setMsg(data.message);
      }
    } catch {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* VERIFY OTP */
  const verifyOtp = async () => {
    try {
      setLoading(true);

      const endpoint =
        mode === "signin"
          ? "login/verify-otp"
          : "signup/verify-otp";

      const body =
        mode === "signin"
          ? {
              phone,
              otp,
            }
          : {
              phone: signupPhone,
              otp,
            };

      const res = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "userToken",
          data.token
        );

        localStorage.setItem(
          "role",
          "USER"
        );

        localStorage.setItem(
          "profile",
          JSON.stringify(data.user)
        );

        navigate("/dashboard");
      } else {
        setMsg(data.message);
      }
    } catch {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  const submitAction = () => {
    if (step === 1) {
      mode === "signin"
        ? sendLoginOtp()
        : sendSignupOtp();
    } else {
      verifyOtp();
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* LEFT PANEL */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-950 text-white p-16 flex-col justify-between">
        <div>
          <h1 className="text-5xl font-extrabold leading-tight">
            Vehicle Service
            <br />
            Management
          </h1>

          <p className="mt-6 text-slate-300 text-lg leading-8 max-w-lg">
            Smart vehicle service platform with
            live tracking, pickup management,
            service lifecycle monitoring, and
            premium customer experience.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold">
              Live Tracking
            </h3>

            <p className="text-slate-300 mt-2">
              Real-time pickup and delivery
              tracking system.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10">
            <h3 className="text-xl font-semibold">
              Smart Booking
            </h3>

            <p className="text-slate-300 mt-2">
              Seamless booking experience with
              automated validation.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold text-slate-900">
              {mode === "signin"
                ? "Welcome Back"
                : "Create Account"}
            </h2>

            <p className="text-slate-500 mt-3">
              Vehicle Service Management
            </p>
          </div>

          {/* TABS */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mt-8">
            <button
              onClick={() => {
                setMode("signin");
                setStep(1);
                setMsg("");
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === "signin"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-600"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setMode("signup");
                setStep(1);
                setMsg("");
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === "signup"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-600"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* FORM */}
          <div className="mt-8 space-y-5">
            {step === 1 &&
              mode === "signin" && (
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  maxLength="10"
                  onChange={(e) =>
                    setPhone(
                      e.target.value.replace(
                        /\D/g,
                        ""
                      )
                    )
                  }
                  className="w-full p-4 rounded-2xl border border-slate-300 outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                />
              )}

            {step === 1 &&
              mode === "signup" && (
                <>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    className="w-full p-4 rounded-2xl border border-slate-300 outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    className="w-full p-4 rounded-2xl border border-slate-300 outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  />

                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={signupPhone}
                    maxLength="10"
                    onChange={(e) =>
                      setSignupPhone(
                        e.target.value.replace(
                          /\D/g,
                          ""
                        )
                      )
                    }
                    className="w-full p-4 rounded-2xl border border-slate-300 outline-none focus:ring-4 focus:ring-blue-200 transition-all"
                  />

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Upload Profile Photo
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={
                        handlePhotoChange
                      }
                      className="w-full p-3 rounded-2xl border border-slate-300 bg-slate-50"
                    />
                  </div>

                  {photoPreview && (
                    <div className="flex justify-center">
                      <img
                        src={photoPreview}
                        alt="preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                      />
                    </div>
                  )}
                </>
              )}

            {step === 2 && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  className="w-full p-4 rounded-2xl border border-slate-300 outline-none focus:ring-4 focus:ring-blue-200 transition-all text-center tracking-[10px] text-xl font-bold"
                />

                <button
                  onClick={() =>
                    setStep(1)
                  }
                  className="text-blue-600 font-semibold"
                >
                  ← Back
                </button>
              </>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={submitAction}
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl hover:scale-[1.02]"
            >
              {loading
                ? "Please wait..."
                : step === 1
                ? "Send OTP"
                : "Verify OTP"}
            </button>

            {/* MESSAGE */}
            {msg && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-2xl text-center font-medium">
                {msg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;