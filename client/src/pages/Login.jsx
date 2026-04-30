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

  const [mode, setMode] =
    useState("signin");

  const [step, setStep] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [msg, setMsg] =
    useState("");

  /* SIGN IN */
  const [phone, setPhone] =
    useState("");

  /* SIGN UP */
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [signupPhone, setSignupPhone] =
    useState("");

  const [avatar, setAvatar] =
    useState(avatars[0]);

  const [photoPreview, setPhotoPreview] =
    useState("");

  const [otp, setOtp] =
    useState("");

  /* ================= PHOTO PICKER ================= */
  const handlePhotoChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    const reader =
      new FileReader();

    reader.onloadend =
      () => {
        setPhotoPreview(
          reader.result
        );
      };

    reader.readAsDataURL(
      file
    );
  };

  /* ================= SIGN IN SEND OTP ================= */
  const sendLoginOtp =
    async () => {
      try {
        setLoading(true);
        setMsg("");

        const res =
          await fetch(
            "http://localhost:5000/api/auth/login/send-otp",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(
                {
                  phone
                }
              )
            }
          );

        const data =
          await res.json();

        if (res.ok) {
          setStep(2);
          setMsg(
            "OTP sent successfully"
          );
        } else {
          setMsg(
            data.message ||
              "Failed to send OTP"
          );
        }
      } catch {
        setMsg(
          "Server error"
        );
      } finally {
        setLoading(false);
      }
    };

  /* ================= SIGN IN VERIFY ================= */
  const verifyLoginOtp =
    async () => {
      try {
        setLoading(true);
        setMsg("");

        const res =
          await fetch(
            "http://localhost:5000/api/auth/login/verify-otp",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(
                {
                  phone,
                  otp
                }
              )
            }
          );

        const data =
          await res.json();

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
          setMsg(
            data.message ||
              "Invalid OTP"
          );
        }
      } catch {
        setMsg(
          "Server error"
        );
      } finally {
        setLoading(false);
      }
    };

  /* ================= SIGN UP SEND OTP ================= */
  const sendSignupOtp =
    async () => {
      try {
        setLoading(true);
        setMsg("");

        const res =
          await fetch(
            "http://localhost:5000/api/auth/signup/send-otp",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(
                {
                  name,
                  email,
                  phone:
                    signupPhone,
                  profilePhoto:
                    photoPreview ||
                    avatar
                }
              )
            }
          );

        const data =
          await res.json();

        if (res.ok) {
          setStep(2);
          setMsg(
            "Signup OTP sent"
          );
        } else {
          setMsg(
            data.message ||
              "Signup failed"
          );
        }
      } catch {
        setMsg(
          "Server error"
        );
      } finally {
        setLoading(false);
      }
    };

  /* ================= SIGN UP VERIFY ================= */
  const verifySignupOtp =
    async () => {
      try {
        setLoading(true);
        setMsg("");

        const res =
          await fetch(
            "http://localhost:5000/api/auth/signup/verify-otp",
            {
              method:
                "POST",
              headers: {
                "Content-Type":
                  "application/json"
              },
              body: JSON.stringify(
                {
                  phone:
                    signupPhone,
                  otp
                }
              )
            }
          );

        const data =
          await res.json();

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
          setMsg(
            data.message ||
              "Invalid OTP"
          );
        }
      } catch {
        setMsg(
          "Server error"
        );
      } finally {
        setLoading(false);
      }
    };

  /* ================= MAIN ACTION ================= */
  const submitAction =
    () => {
      if (
        mode ===
        "signin"
      ) {
        if (
          step === 1
        ) {
          sendLoginOtp();
        } else {
          verifyLoginOtp();
        }
      } else {
        if (
          step === 1
        ) {
          sendSignupOtp();
        } else {
          verifySignupOtp();
        }
      }
    };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>
          Vehicle Service
        </h1>

        <p>
          Smart Maintenance Platform
        </p>

        {/* Tabs */}
        <div className="tab-row">
          <button
            className={
              mode ===
              "signin"
                ? "active-tab"
                : ""
            }
            onClick={() => {
              setMode(
                "signin"
              );
              setStep(
                1
              );
              setMsg(
                ""
              );
            }}
          >
            Sign In
          </button>

          <button
            className={
              mode ===
              "signup"
                ? "active-tab"
                : ""
            }
            onClick={() => {
              setMode(
                "signup"
              );
              setStep(
                1
              );
              setMsg(
                ""
              );
            }}
          >
            Sign Up
          </button>
        </div>

        {/* SIGN IN */}
        {step === 1 &&
          mode ===
            "signin" && (
            <input
              placeholder="Phone Number"
              value={phone}
              onChange={(
                e
              ) =>
                setPhone(
                  e.target
                    .value
                )
              }
            />
          )}

        {/* SIGN UP */}
        {step === 1 &&
          mode ===
            "signup" && (
            <>
              <input
                placeholder="Full Name"
                value={name}
                onChange={(
                  e
                ) =>
                  setName(
                    e.target
                      .value
                  )
                }
              />

              <input
                placeholder="Email"
                value={email}
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
                  signupPhone
                }
                onChange={(
                  e
                ) =>
                  setSignupPhone(
                    e.target
                      .value
                  )
                }
              />

              <p>
                Profile Photo
              </p>

              <label className="upload-box">
                📷 Upload /
                Camera
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  hidden
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

              <p>
                Or Choose
                Avatar
              </p>

              <div className="avatar-grid">
                {avatars.map(
                  (
                    item,
                    i
                  ) => (
                    <img
                      key={i}
                      src={
                        item
                      }
                      alt=""
                      className={
                        avatar ===
                        item
                          ? "avatar active-avatar"
                          : "avatar"
                      }
                      onClick={() =>
                        setAvatar(
                          item
                        )
                      }
                    />
                  )
                )}
              </div>
            </>
          )}

        {/* OTP STEP */}
        {step === 2 && (
          <>
            <input
              placeholder="Enter OTP"
              value={otp}
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
              className="secondary-btn"
              onClick={() =>
                setStep(
                  1
                )
              }
            >
              Back
            </button>
          </>
        )}

        {/* MAIN BUTTON */}
        <button
          onClick={
            submitAction
          }
          disabled={
            loading
          }
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

        <p
          className="admin-link"
        >
          Admin?{" "}
          <span
            onClick={() =>
              navigate(
                "/admin-login"
              )
            }
          >
            Admin Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;