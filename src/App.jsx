import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AdvertiserRoutes from "./routes/AdvertiserRoutes";

export default function App() {
  const [role, setRole] = useState(localStorage.getItem("role") || "");

  function loginAsAdvertiser() {
    setRole("advertiser");
    localStorage.setItem("role", "advertiser");
  }

  function logout() {
    setRole("");
    localStorage.removeItem("role");
  }

  if (!role) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Sign In</h2>
          <p className="text-sm text-gray-500 mb-6">
            Choose a role to test dashboards
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={loginAsAdvertiser}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Login as Advertiser
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {role === "advertiser" && (
          <Route path="/*" element={<AdvertiserRoutes />} />
        )}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
