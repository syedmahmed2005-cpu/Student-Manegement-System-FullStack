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
    <div className="container-fluid py-4 px-3 px-md-4">
      {/* Page Header */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3 mb-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-3"
            style={{
              width: "46px",
              height: "46px",
              backgroundColor: "#e8f5e9"
            }}
          >
            <span
              style={{
                fontSize: "22px",
                color: "#198754"
              }}
            >
              ⚙
            </span>
          </div>

          <div>
            <h2 className="fw-bold mb-0">Settings</h2>
            <p className="text-muted mb-0">
              Manage your account and preferences
            </p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Account Information */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4">
              <div className="mb-4">
                <h5 className="fw-bold mb-1">Account</h5>
                <p className="text-muted small mb-0">
                  Your account information
                </p>
              </div>

              <div className="mb-3">
                <label className="text-muted small fw-semibold">
                  NAME
                </label>
                <div className="fw-semibold mt-1">
                  {user?.name || "User"}
                </div>
              </div>

              <div className="mb-3">
                <label className="text-muted small fw-semibold">
                  EMAIL
                </label>
                <div className="fw-semibold mt-1 text-break">
                  {user?.email || "Not available"}
                </div>
              </div>

              <div>
                <label className="text-muted small fw-semibold">
                  ROLE
                </label>
                <div className="mt-2">
                  <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill text-capitalize">
                    {user?.role || "User"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4 p-md-5">
              <div className="d-flex align-items-start gap-3 mb-4">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
                  style={{
                    width: "44px",
                    height: "44px",
                    backgroundColor: "#e8f5e9"
                  }}
                >
                  <span style={{ fontSize: "20px" }}>🔒</span>
                </div>

                <div>
                  <h5 className="fw-bold mb-1">Change Password</h5>
                  <p className="text-muted small mb-0">
                    Keep your account secure by using a strong password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Current Password
                  </label>

                  <input
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(event.target.value)
                    }
                    required
                  />
                </div>

                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      New Password
                    </label>

                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(event) =>
                        setNewPassword(event.target.value)
                      }
                      minLength="6"
                      required
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label fw-semibold">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      className="form-control form-control-lg"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      minLength="6"
                      required
                    />
                  </div>
                </div>

                <div
                  className="mt-4 p-3 rounded-3"
                  style={{ backgroundColor: "#f8f9fa" }}
                >
                  <small className="text-muted">
                    <strong>Password requirements:</strong> Use at least
                    6 characters for your new password.
                  </small>
                </div>

                <div className="mt-4">
                  <button
                    type="submit"
                    className="btn btn-success px-4 py-2 fw-semibold rounded-3"
                    disabled={loading}
                  >
                    {loading ? "Changing Password..." : "Change Password"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Appearance - Future */}
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h5 className="fw-bold mb-1">Appearance</h5>
                  <p className="text-muted mb-0">
                    Customize how EduCore looks and feels.
                  </p>
                </div>

                <span className="badge bg-light text-muted px-3 py-2 rounded-pill">
                  Coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;