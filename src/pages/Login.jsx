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
      const response = await fetch("http://localhost:5000/api/auth/login", {
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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl shadow-md mb-4">
            <span className="text-3xl">🎓</span>
          </div>

          <h1 className="text-3xl font-bold text-green-800">
            Student Management System
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in to access your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-md border border-green-200 p-8">

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h2>

            <p className="text-gray-500 mt-1">
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
              <label className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition"
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Student Management System
        </p>

      </div>

    </main>
  );
}

export default Login;
