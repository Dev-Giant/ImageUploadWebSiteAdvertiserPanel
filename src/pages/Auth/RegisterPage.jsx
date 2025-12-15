import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/api";

const ROLE_OPTIONS = [
  { value: "ancillary_advertiser", label: "Ancillary Advertiser" },
  { value: "advertiser", label: "Advertiser" },
];

export default function RegisterPage({ onRegistered }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    position: "",
    company: "",
    postalCode: "",
    country: "",
    state: "",
    city: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    role: ROLE_OPTIONS[0].value,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authAPI.register(formData);

      // If backend returns token, use it, otherwise fall back to login
      if (response?.token) {
        onRegistered?.(response);
      } else {
        const loginResponse = await authAPI.login(
          formData.email,
          formData.password,
          formData.role
        );
        onRegistered?.(loginResponse);
      }
      navigate("/advertiser");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A1929] text-white">
      <header className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="text-sm text-gray-200">Create your new account</div>
          <Link
            to="/login"
            className="text-sm text-sky-300 hover:text-sky-200 underline"
          >
            Back to Login
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="bg-[#0F1F36]/80 border border-white/10 rounded-2xl shadow-2xl">
          <div className="px-10 pt-8">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
              <div className="w-8 h-8 rounded-full bg-sky-600/30 border border-sky-400/60 flex items-center justify-center">
                <span>1</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center">
                <span>2</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <span>3</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-300 mt-2">
              Selected Role: {ROLE_OPTIONS.find((r) => r.value === formData.role)?.label}
            </p>
            <div className="flex justify-center mt-3">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="bg-sky-500 hover:bg-sky-600 text-white text-sm px-4 py-2 rounded shadow"
              >
                {ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="mx-10 mt-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-10 py-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Your Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Your Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Position
                </label>
                <input
                  type="text"
                  name="position"
                  placeholder="Your position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  placeholder="Your company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Postal/Zip Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Enter location to find postal code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="Select Country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-gray-200">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  placeholder="Select State"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-200">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Select City"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-gray-200">
                  Phone Number
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={handleChange}
                    className="w-28 rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                    required
                  />
                  <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="flex-1 rounded-lg border border-white/10 bg-[#0A1727] px-4 py-3 text-white placeholder-gray-500 focus:border-sky-500 focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-sky-500 hover:bg-sky-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 transition-colors"
              >
                {loading ? "Creating account..." : "Complete Registration"}
              </button>
              <p className="text-center text-sm text-gray-300 mt-3">
                Already have an account?{" "}
                <Link to="/login" className="text-sky-300 hover:text-sky-200">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

