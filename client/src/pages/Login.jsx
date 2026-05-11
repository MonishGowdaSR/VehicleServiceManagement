import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike"
  ];

  const [mode, setMode] = useState("signin");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [avatar, setAvatar] = useState(avatars[0]);
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
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            phone
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMsg("OTP sent");
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
      setMsg(
        "Enter valid Gmail address"
      );
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
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            phone:
              signupPhone,
            profilePhoto:
              photoPreview ||
              avatar
          })
        }
      );

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        setMsg("OTP sent");
      } else {
        setMsg(data.message);
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

      const endpoint =
        mode === "signin"
          ? "login/verify-otp"
          : "signup/verify-otp";

      const body =
        mode === "signin"
          ? {
              phone,
              otp
            }
          : {
              phone:
                signupPhone,
              otp
            };

      const res = await fetch(
        `http://localhost:5000/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json"
          },
          body: JSON.stringify(
            body
          )
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
          JSON.stringify(
            data.user
          )
        );

        navigate(
          "/dashboard"
        );
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
    <div className="login-page">
      <div className="login-card">
        <h1>Vehicle Service</h1>

        <div className="tab-row">
          <button
            className={
              mode === "signin"
                ? "active-tab"
                : ""
            }
            onClick={() => {
              setMode(
                "signin"
              );
              setStep(1);
              setMsg("");
            }}
          >
            Sign In
          </button>

          <button
            className={
              mode === "signup"
                ? "active-tab"
                : ""
            }
            onClick={() => {
              setMode(
                "signup"
              );
              setStep(1);
              setMsg("");
            }}
          >
            Sign Up
          </button>
        </div>

        {step === 1 &&
          mode === "signin" && (
            <input
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
            />
          )}

        {step === 1 &&
          mode === "signup" && (
            <>
              <input
                placeholder="Full Name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(
                    e.target.value
                  )
                }
              />

              <input
                placeholder="Phone Number"
                value={
                  signupPhone
                }
                maxLength="10"
                onChange={(e) =>
                  setSignupPhone(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    )
                  )
                }
              />

              <label className="upload-box">
                Upload Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={
                    handlePhotoChange
                  }
                />
              </label>

              {photoPreview && (
                <img
                  src={
                    photoPreview
                  }
                  alt=""
                  className="preview-img"
                />
              )}
            </>
          )}

        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
            />

            <button
              onClick={() =>
                setStep(1)
              }
            >
              Back
            </button>
          </>
        )}

        <button
          onClick={
            submitAction
          }
          disabled={loading}
        >
          {loading
            ? "Please wait..."
            : step === 1
            ? "Send OTP"
            : "Verify OTP"}
        </button>

        {msg && (
          <div className="msg-box">
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;