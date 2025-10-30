 import { Routes, Route, Navigate } from "react-router-dom";
import { ContestStageProvider } from "./context/ContestStageContext.jsx";

import ContestLandingPage from "./pages/ContestLandingPage.jsx";
import CodingEnvironmentPage from "./pages/CodingEnvironmentPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";

export default function CodingModuleRoutes() {
  return (
    <ContestStageProvider>
      <Routes>
        <Route index element={<Navigate to="waiting" replace />} />
        {/* /coding/waiting → waiting page */}
        <Route path="waiting" element={<ContestLandingPage />} />

        {/* /coding/editor → coding environment */}
        <Route path="editor" element={<CodingEnvironmentPage />} />

        {/* /coding/admin → admin dashboard */}
        <Route path="admin" element={<AdminDashboardPage />} />

        {/* optional: fallback route */}
        <Route path="*" element={<ContestLandingPage />} />
      </Routes>
    </ContestStageProvider>
  );
}
