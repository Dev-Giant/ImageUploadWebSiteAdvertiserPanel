import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";

const ROLE_OPTIONS = [
  { value: "advertiser", label: "Advertiser" },
  { value: "ancillary_advertiser", label: "Ancillary Advertiser" },
];

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: ROLE_OPTIONS[0].value,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authAPI.login(
        formData.email,
        formData.password,
        formData.role
      );
      if (response?.token) {
        onLogin?.(response);
        navigate("/advertiser");
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1929] to-[#040910] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm text-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sky-400">📞</span>
              <span>0123456789</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sky-400">✉️</span>
              <span>Australia@rule7media.com</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <select className="bg-[#0F1F36] border border-white/10 rounded px-2 py-1">
              <option>🇦🇺 Australia</option>
            </select>
            <select className="bg-[#0F1F36] border border-white/10 rounded px-2 py-1">
              <option>Select Language</option>
            </select>
            <Link
              to="/login"
              className="border border-white/20 rounded px-3 py-1 hover:bg-white/10 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center py-14 px-4">
        <div className="w-full max-w-xl bg-[#0F1F36]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur">
          <div className="px-10 pt-10 pb-4 text-center">
            <div className="w-12 h-12 rounded-full bg-sky-600/30 border border-sky-500/40 mx-auto mb-4 flex items-center justify-center">
              <span className="font-semibold text-sky-300">7</span>
            </div>
            <h1 className="text-xl font-semibold mb-1">Login with your account</h1>
            <p className="text-sm text-gray-300">Welcome back advertiser</p>
          </div>

          {error && (
            <div className="mx-10 mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-10 pb-10 space-y-6">
            <div>
              <label className="block text-sm mb-2 text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-200">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 pr-10 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-200">
                Login as
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white focus:border-sky-500 focus:outline-none"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-sky-300 hover:text-sky-200"
              >
                Forget Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="text-center text-sm text-gray-300">
              Don’t have an account?{" "}
              <Link to="/register" className="text-sky-300 hover:text-sky-200">
                Sign Up.
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

