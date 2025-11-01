// 📂 src/coding/CodingProtectedRoute.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

export const isUserAllowedForCoding = (user) => {
  if (!user) return false;
  const labels = user.labels || [];
  const allowedRoles = ["admin", "mvp", "premium"];
  return labels.some((label) => allowedRoles.includes(label.toLowerCase()));
};

export default function CodingProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect unauthenticated users
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0B1120] text-[#00FFC6] text-lg font-semibold">
        Checking access...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const hasAccess = isUserAllowedForCoding(user);

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0B1120] text-white">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E293B] border border-[#00FFC6]/30 rounded-lg p-8 text-center max-w-lg"
        >
          <h1 className="text-2xl font-bold text-[#00FFC6] mb-3">
            Access Restricted 🚫
          </h1>
          <p className="text-gray-300 mb-4">
            You don’t have permission to access the coding contest area.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-md bg-[#00FFC6] text-black font-semibold hover:bg-[#00e0b0]"
          >
            Return Home
          </button>
        </motion.div>
      </div>
    );
  }

  // ✅ Authorized → render children
  return children;
}
