import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />

          {/* DASHBOARD */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <MainLayout activePage="dashboard" />
            </ProtectedRoute>
          } />
          <Route path="/employee/dashboard" element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <MainLayout activePage="dashboard" />
            </ProtectedRoute>
          } />
          <Route path="/secretary/dashboard" element={
            <ProtectedRoute allowedRoles={["secretary"]}>
              <MainLayout activePage="dashboard" />
            </ProtectedRoute>
          } />
          <Route path="/manager/dashboard" element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <MainLayout activePage="dashboard" />
            </ProtectedRoute>
          } />
          <Route path="/dml/dashboard" element={
            <ProtectedRoute allowedRoles={["dml"]}>
              <MainLayout activePage="dashboard" />
            </ProtectedRoute>
          } />

          {/* SETTINGS */}
          <Route path="/settings" element={
            <ProtectedRoute allowedRoles={["admin","employee","manager","secretary","dml"]}>
              <MainLayout activePage="settings" />
            </ProtectedRoute>
          } />

          {/* fallback */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;