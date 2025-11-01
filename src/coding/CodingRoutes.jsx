import { Routes, Route, Navigate } from "react-router-dom";
import { ContestStageProvider } from "./context/ContestStageContext.jsx";
import StageRouter from "./pages/StageRouter.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import CodingProtectedRoute from "./CodingProtectedRoute.jsx";

export default function CodingModuleRoutes() {
  return (
    <ContestStageProvider>
      <Routes>
        {/* default redirect */}
        <Route index element={<Navigate to="live" replace />} />

        {/* 🔒 Protected coding routes */}
        <Route
          path="live"
          element={
            <CodingProtectedRoute>
              <StageRouter />
            </CodingProtectedRoute>
          }
        />

        {/* 🔒 Admin dashboard (already protected inside itself) */}
        <Route
          path="admin"
          element={
            <CodingProtectedRoute>
              <AdminDashboardPage />
            </CodingProtectedRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="live" replace />} />
      </Routes>
    </ContestStageProvider>
  );
}
