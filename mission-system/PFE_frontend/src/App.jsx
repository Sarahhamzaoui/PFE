import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";

import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import Report from "./pages/employee/Report";

import SecretaryDashboard from "./pages/secretary/SecretaryDashboard";
import CreateMission from "./pages/secretary/CreateMission";

import ManagerDashboard from "./pages/manager/ManagerDashboard";

import DmlDashboard from "./pages/Dml/DmlDashboard";
import Booking from "./pages/Dml/Booking";

import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }/>

        <Route path="/employee/dashboard" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/employee/report" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <Report />
          </ProtectedRoute>
        }/>

        <Route path="/secretary/dashboard" element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <SecretaryDashboard />
          </ProtectedRoute>
        }/>
        <Route path="/secretary/create-mission" element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <CreateMission />
          </ProtectedRoute>
        }/>

        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerDashboard />
          </ProtectedRoute>
        }/>
// ── DML ──
<Route path="/dml/dashboard" element={
  <ProtectedRoute allowedRoles={["dml"]}>
    <MainLayout activePage="dashboard" />  {/* ✅ uses MainLayout */}
  </ProtectedRoute>
}/>
<Route path="/dml/booking" element={
  <ProtectedRoute allowedRoles={["dml"]}>
    <MainLayout activePage="booking" />
  </ProtectedRoute>
}/>

        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;