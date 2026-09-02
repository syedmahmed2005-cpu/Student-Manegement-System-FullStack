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
    <div className="container-fluid py-4">
      <div className="mb-4">
        <p className="text-success fw-semibold mb-1">Account</p>
        <h2 className="fw-bold mb-1">Settings</h2>
        <p className="text-muted mb-0">
          Manage your account settings.
        </p>
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <h4 className="fw-bold mb-1">Change Password</h4>
          <p className="text-muted mb-4">
            Update the password for your account.
          </p>

          <form onSubmit={handleChangePassword}>
            <div className="mb-3">
              <label className="form-label fw-semibold">
                Current Password
              </label>

              <input
                type="password"
                className="form-control"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(event.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">
                New Password
              </label>

              <input
                type="password"
                className="form-control"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(event.target.value)
                }
                minLength="6"
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold">
                Confirm New Password
              </label>

              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                minLength="6"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success px-4"
              disabled={loading}
            >
              {loading ? "Changing..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;