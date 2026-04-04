import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Mission from "./pages/Missions";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import MissionDetails from "./pages/MissionDetails";
import CreateMissionPage from "./pages/CreateMissionPage";
import Dashboard from "./pages/Dashboard";
import MyMissions from "./pages/MyMissions";
import MainLayout from "./layouts/MainLayout";
import ManagerPage from "./pages/ManagerPage";
import Employee from "./pages/employee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         {/* No sidebar */}
        <Route path="/" element={<Login />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/mission/:id" element={<MissionDetails />} />

       {/* With sidebar — all through MainLayout */}
       <Route path="/dashboard"      element={<MainLayout activePage="dashboard" />} />
        <Route path="/missions"       element={<MainLayout activePage="missions" />} />
        <Route path="/my-missions"    element={<MainLayout activePage="my-missions" />} />
        <Route path="/create-mission-page" element={<MainLayout activePage="create-mission-page" />} />
        <Route path="/profile"        element={<MainLayout activePage="profile" />} />
        <Route path="/booking"        element={<MainLayout activePage="booking" />} />
        <Route path="/reports"        element={<MainLayout activePage="reports" />} />
        <Route path ="/ManagerPage" element={<MainLayout activePage="ManagerPage"/>}/>
        <Route path="/settings"       element={<MainLayout activePage="settings" />} />
        <Route path="/employee" element={<Employee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;