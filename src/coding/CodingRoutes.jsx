 import { Routes, Route, Navigate } from "react-router-dom";
import { ContestStageProvider } from "./context/ContestStageContext.jsx";

import StageRouter from "./pages/StageRouter.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";

export default function CodingModuleRoutes() {
  return (
    <ContestStageProvider>
      <Routes>
        {/* default redirect to centralized live router */}
        <Route index element={<Navigate to="live" replace />} />

        {/* centralized stage-based router */}
        <Route path="live" element={<StageRouter />} />

        {/* /coding/admin → admin dashboard */}
        <Route path="admin" element={<AdminDashboardPage />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="live" replace />} />
      </Routes>
    </ContestStageProvider>
  );
}
