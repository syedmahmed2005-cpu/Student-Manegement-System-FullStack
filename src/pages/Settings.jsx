import { useState } from "react";
import { useTheme } from "../context/ThemeContext.jsx";

const themeOptions = [
  {
    value: "light",
    icon: "☀️",
    label: "Light",
    description: "Always use light mode"
  },
  {
    value: "dark",
    icon: "🌙",
    label: "Dark",
    description: "Always use dark mode"
  },
  {
    value: "system",
    icon: "💻",
    label: "System",
    description: "Match your device theme"
  }
];

function Settings({ user, showToast }) {
  const [currentPassword, setCurrentPassword] =
    useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");
  const [loading, setLoading] = useState(false);

  const {
    theme,
    updateTheme,
    updatingTheme
  } = useTheme();

  async function handleThemeChange(nextTheme) {
    if (nextTheme === theme || updatingTheme) {
      return;
    }

    try {
      await updateTheme(nextTheme);

      showToast(
        "Appearance preference saved successfully",
        "success"
      );
    } catch (error) {
      showToast(error.message, "error");
    }
  }

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
        throw new Error(
          data.message || "Failed to change password"
        );
      }

      showToast(
        "Password changed successfully",
        "success"
      );

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
    <div className="min-h-screen bg-app-background p-4 transition-colors duration-200 md:p-6 lg:p-8">
      <div className="mb-6 md:mb-8">
        <p className="mb-1 text-sm font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
          Account
        </p>

        <h1 className="text-3xl font-bold text-app-text">
          Settings
        </h1>

        <p className="mt-1 text-sm text-app-text-muted md:text-base">
          Manage your account, security and appearance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-md transition-colors duration-200 lg:col-span-2">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl dark:bg-green-950/50">
              👤
            </div>

            <div>
              <h2 className="text-xl font-bold text-app-text">
                Account
              </h2>

              <p className="text-sm text-app-text-muted">
                Your account information
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl bg-app-surface-soft p-4 transition hover:bg-green-50 dark:hover:bg-green-950/40">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-app-text-muted">
                Name
              </p>

              <p className="font-semibold text-app-text">
                {user?.name || "User"}
              </p>
            </div>

            <div className="rounded-2xl bg-app-surface-soft p-4 transition hover:bg-green-50 dark:hover:bg-green-950/40">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-app-text-muted">
                Email
              </p>

              <p className="break-all font-semibold text-app-text">
                {user?.email || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl bg-app-surface-soft p-4 transition hover:bg-green-50 dark:hover:bg-green-950/40">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-app-text-muted">
                Role
              </p>

              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-sm font-semibold capitalize text-green-700 dark:bg-green-950/60 dark:text-green-300">
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-md transition-colors duration-200 lg:col-span-3">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-2xl dark:bg-green-950/50">
              🔒
            </div>

            <div>
              <h2 className="text-xl font-bold text-app-text">
                Change Password
              </h2>

              <p className="text-sm text-app-text-muted">
                Keep your EduCore account secure.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleChangePassword}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-app-text">
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
                className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:bg-app-surface focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-app-text">
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
                  className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:bg-app-surface focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-app-text">
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
                  className="w-full rounded-xl border border-app-border bg-app-surface-soft px-4 py-3 text-sm text-app-text placeholder:text-app-text-muted focus:border-green-500 focus:bg-app-surface focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950/40">
              <span className="text-lg">🔐</span>

              <p className="text-sm text-green-800 dark:text-green-300">
                Your new password must contain at least 6
                characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </div>

        <div className="rounded-3xl border border-app-border bg-app-surface p-6 shadow-md transition-colors duration-200 lg:col-span-5">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-app-surface-soft text-2xl">
              🎨
            </div>

            <div>
              <h2 className="text-xl font-bold text-app-text">
                Appearance
              </h2>

              <p className="text-sm text-app-text-muted">
                Choose how EduCore looks on your devices.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {themeOptions.map(function (option) {
              const isSelected = theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  disabled={updatingTheme}
                  onClick={() =>
                    handleThemeChange(option.value)
                  }
                  className={
                    "rounded-2xl border p-4 text-left transition-all duration-200 disabled:cursor-wait disabled:opacity-70 " +
                    (isSelected
                      ? "border-green-500 bg-green-50 ring-2 ring-green-100 dark:bg-green-950/50 dark:ring-green-900/50"
                      : "border-app-border bg-app-surface-soft hover:border-green-300 dark:hover:border-green-700")
                  }
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-2xl">
                      {option.icon}
                    </span>

                    <span
                      className={
                        "h-4 w-4 rounded-full border-2 " +
                        (isSelected
                          ? "border-green-600 bg-green-600 ring-2 ring-green-200 dark:ring-green-900"
                          : "border-app-text-muted")
                      }
                    />
                  </div>

                  <p className="font-bold text-app-text">
                    {option.label}
                  </p>

                  <p className="mt-1 text-sm text-app-text-muted">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-sm text-app-text-muted">
            {updatingTheme
              ? "Saving your preference..."
              : "Your selection is saved to your account and synchronized across devices."}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;