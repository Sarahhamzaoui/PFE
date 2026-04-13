import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <MainLayout activePage="dashboard" />
          </ProtectedRoute>
        }/>

        <Route path="/secretary/dashboard" element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <MainLayout activePage="dashboard" />
          </ProtectedRoute>
        }/>
        <Route path="/secretary/create-mission" element={
          <ProtectedRoute allowedRoles={["secretary"]}>
            <MainLayout activePage="create-mission-page" />
          </ProtectedRoute>
        }/>

        <Route path="/secretary/my-missions" element={
  <ProtectedRoute allowedRoles={["secretary"]}>
    <MainLayout activePage="my-missions" />
  </ProtectedRoute>
}/>

        <Route path="/manager/dashboard" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <MainLayout activePage="dashboard" />
          </ProtectedRoute>
        }/>

         <Route path="/manager/ManagerPage" element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <MainLayout activePage="ManagerPage" />
          </ProtectedRoute>
        }/>


        <Route path="/employee/dashboard" element={
          <ProtectedRoute allowedRoles={["employee"]}>
            <MainLayout activePage="dashboard" />
          </ProtectedRoute>
        }/>

        <Route path="/dml/dashboard" element={
          <ProtectedRoute allowedRoles={["dml"]}>
            <MainLayout activePage="dashboard" />
          </ProtectedRoute>
        }/>
        <Route path="/dml/booking" element={
          <ProtectedRoute allowedRoles={["dml"]}>
            <MainLayout activePage="booking" />
          </ProtectedRoute>
        }/>


        <Route path="/dml/dashboard" element={
          <ProtectedRoute allowedRoles={["dml"]}>
            <MainLayout activePage="dashboard" />
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