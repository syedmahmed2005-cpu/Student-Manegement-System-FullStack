import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async function (event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-slate-50 to-emerald-100 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl shadow-md mb-4">
            <span className="text-3xl">🎓</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-green-900">
            EduCore
          </h1>

          <p className="text-slate-600 mt-2">
            Sign in to access your account
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl border border-white/80 bg-white/85 p-8 shadow-xl shadow-green-950/10 backdrop-blur-xl">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="text-slate-600 mt-1">
              Please enter your credentials to continue.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-slate-700 font-semibold mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none transition"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-slate-700 font-semibold mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none transition"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-700 hover:shadow-lg hover:shadow-green-900/15 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </div>

        <p className="text-center text-sm text-slate-600 mt-6">
          Secure access for students, faculty, and administrators.
        </p>

      </div>

    </main>
  );
}

export default Login;
