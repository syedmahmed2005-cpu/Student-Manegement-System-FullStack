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
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <p className="mb-1 text-sm font-bold uppercase tracking-widest text-green-600">
          Account
        </p>

        <h1 className="text-3xl font-bold text-slate-800">
          Settings
        </h1>

        <p className="mt-1 text-sm text-slate-500 md:text-base">
          Manage your account and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

        {/* Account Card */}
        <div className="rounded-3xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg lg:col-span-2">

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl">
              👤
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Account
              </h2>

              <p className="text-sm text-slate-500">
                Your account information
              </p>
            </div>
          </div>

          <div className="space-y-3">

            <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-green-50">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Name
              </p>

              <p className="font-semibold text-slate-800">
                {user?.name || "User"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-green-50">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
                Email
              </p>

              <p className="break-all font-semibold text-slate-800">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 transition hover:bg-green-50">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                Role
              </p>

              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-700">
                {user?.role || "User"}
              </span>
            </div>

          </div>
        </div>

        {/* Change Password Card */}
        <div className="rounded-3xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg lg:col-span-3">

          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl">
              🔒
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Change Password
              </h2>

              <p className="text-sm text-slate-500">
                Keep your EduCore account secure.
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-5">

            {/* Current Password */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
              />
            </div>

            {/* New + Confirm */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-100"
                />
              </div>

            </div>

            {/* Password Info */}
            <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
              <span className="text-lg">🔐</span>

              <p className="text-sm text-green-800">
                Your new password must contain at least 6 characters.
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Changing Password..." : "Change Password"}
            </button>

          </form>
        </div>

        {/* Appearance Card */}
        <div className="rounded-3xl bg-white p-6 shadow-md transition-shadow duration-200 hover:shadow-lg lg:col-span-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                🌙
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Appearance
                </h2>

                <p className="text-sm text-slate-500">
                  Customize how EduCore looks and feels.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-500">
              Coming Soon
            </span>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;