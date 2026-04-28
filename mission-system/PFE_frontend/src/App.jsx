import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";
import Settings from "./pages/Settings";

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Login />} />

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