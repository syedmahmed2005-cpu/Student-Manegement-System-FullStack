import { useState } from "react";

function Settings({ user, showToast }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(event) {
    event.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password");
      }

      showToast("Password changed successfully", "success");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#f8faf9",
        minHeight: "calc(100vh - 160px)",
        padding: "30px"
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <p
          style={{
            color: "#008f3c",
            fontWeight: "700",
            fontSize: "14px",
            letterSpacing: "1.5px",
            marginBottom: "6px"
          }}
        >
          ACCOUNT
        </p>

        <h1
          style={{
            color: "#17233c",
            fontSize: "34px",
            fontWeight: "700",
            marginBottom: "6px"
          }}
        >
          Settings
        </h1>

        <p
          style={{
            color: "#64748b",
            fontSize: "16px",
            margin: 0
          }}
        >
          Manage your account and security preferences.
        </p>
      </div>

      <div className="row g-4">

        {/* Account Card */}
        <div className="col-12 col-lg-5">
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "22px",
              padding: "30px",
              boxShadow: "0 5px 18px rgba(0, 0, 0, 0.10)",
              height: "100%"
            }}
          >
            {/* Card heading */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "15px",
                  backgroundColor: "#e8f8ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "25px"
                }}
              >
                👤
              </div>

              <div>
                <h4
                  style={{
                    color: "#17233c",
                    fontWeight: "700",
                    margin: 0
                  }}
                >
                  Account
                </h4>

                <p
                  style={{
                    color: "#64748b",
                    margin: "4px 0 0"
                  }}
                >
                  Your account information
                </p>
              </div>
            </div>

            {/* Name */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "14px",
                padding: "16px 18px",
                marginBottom: "14px"
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                  marginBottom: "5px"
                }}
              >
                NAME
              </div>

              <div
                style={{
                  color: "#17233c",
                  fontWeight: "600",
                  fontSize: "16px"
                }}
              >
                {user?.name || "User"}
              </div>
            </div>

            {/* Email */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "14px",
                padding: "16px 18px",
                marginBottom: "14px"
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                  marginBottom: "5px"
                }}
              >
                EMAIL
              </div>

              <div
                style={{
                  color: "#17233c",
                  fontWeight: "600",
                  fontSize: "16px",
                  wordBreak: "break-word"
                }}
              >
                {user?.email || "Not available"}
              </div>
            </div>

            {/* Role */}
            <div
              style={{
                backgroundColor: "#f8fafc",
                borderRadius: "14px",
                padding: "16px 18px"
              }}
            >
              <div
                style={{
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.8px",
                  marginBottom: "8px"
                }}
              >
                ROLE
              </div>

              <span
                style={{
                  display: "inline-block",
                  backgroundColor: "#e8f8ee",
                  color: "#008f3c",
                  padding: "7px 15px",
                  borderRadius: "20px",
                  fontSize: "14px",
                  fontWeight: "700",
                  textTransform: "capitalize"
                }}
              >
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </div>

        {/* Password Card */}
        <div className="col-12 col-lg-7">
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "22px",
              padding: "30px",
              boxShadow: "0 5px 18px rgba(0, 0, 0, 0.10)"
            }}
          >
            {/* Heading */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "28px"
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "15px",
                  backgroundColor: "#e8f8ee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "24px"
                }}
              >
                🔒
              </div>

              <div>
                <h4
                  style={{
                    color: "#17233c",
                    fontWeight: "700",
                    margin: 0
                  }}
                >
                  Change Password
                </h4>

                <p
                  style={{
                    color: "#64748b",
                    margin: "4px 0 0"
                  }}
                >
                  Update your password to keep your account secure.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword}>

              {/* Current Password */}
              <div style={{ marginBottom: "20px" }}>
                <label
                  style={{
                    display: "block",
                    color: "#17233c",
                    fontWeight: "600",
                    marginBottom: "8px"
                  }}
                >
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  placeholder="Enter your current password"
                  required
                  style={{
                    width: "100%",
                    border: "1px solid #dbe4df",
                    borderRadius: "12px",
                    padding: "13px 16px",
                    fontSize: "15px",
                    outline: "none",
                    backgroundColor: "#fbfdfc"
                  }}
                />
              </div>

              <div className="row g-3">

                {/* New Password */}
                <div className="col-12 col-md-6">
                  <label
                    style={{
                      display: "block",
                      color: "#17233c",
                      fontWeight: "600",
                      marginBottom: "8px"
                    }}
                  >
                    New Password
                  </label>

                  <input
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(event.target.value)
                    }
                    placeholder="Enter new password"
                    minLength="6"
                    required
                    style={{
                      width: "100%",
                      border: "1px solid #dbe4df",
                      borderRadius: "12px",
                      padding: "13px 16px",
                      fontSize: "15px",
                      outline: "none",
                      backgroundColor: "#fbfdfc"
                    }}
                  />
                </div>

                {/* Confirm Password */}
                <div className="col-12 col-md-6">
                  <label
                    style={{
                      display: "block",
                      color: "#17233c",
                      fontWeight: "600",
                      marginBottom: "8px"
                    }}
                  >
                    Confirm Password
                  </label>

                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Confirm new password"
                    minLength="6"
                    required
                    style={{
                      width: "100%",
                      border: "1px solid #dbe4df",
                      borderRadius: "12px",
                      padding: "13px 16px",
                      fontSize: "15px",
                      outline: "none",
                      backgroundColor: "#fbfdfc"
                    }}
                  />
                </div>
              </div>

              {/* Password requirement */}
              <div
                style={{
                  marginTop: "20px",
                  backgroundColor: "#f0faf4",
                  border: "1px solid #d7f0df",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  color: "#47705a",
                  fontSize: "14px"
                }}
              >
                🔐 Your new password must contain at least 6 characters.
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: "24px",
                  backgroundColor: loading ? "#8ac7a4" : "#008f3c",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  padding: "13px 24px",
                  fontSize: "16px",
                  fontWeight: "700",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 5px 12px rgba(0, 143, 60, 0.20)"
                }}
              >
                {loading ? "Changing Password..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>

        {/* Appearance Card */}
        <div className="col-12">
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "22px",
              padding: "26px 30px",
              boxShadow: "0 5px 18px rgba(0, 0, 0, 0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                  backgroundColor: "#f1f5f9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "23px"
                }}
              >
                🌙
              </div>

              <div>
                <h5
                  style={{
                    color: "#17233c",
                    fontWeight: "700",
                    marginBottom: "4px"
                  }}
                >
                  Appearance
                </h5>

                <p
                  style={{
                    color: "#64748b",
                    margin: 0
                  }}
                >
                  Dark mode and other appearance preferences.
                </p>
              </div>
            </div>

            <span
              style={{
                backgroundColor: "#f1f5f9",
                color: "#64748b",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "13px",
                fontWeight: "600"
              }}
            >
              Coming soon
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;