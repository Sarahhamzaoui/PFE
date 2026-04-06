import React, { useState } from "react";
import "../styles/Main.css";
import Sidebar from "../components/Sidebar";

// Old pages
import MyMissions from "../pages/MyMissions";
import CreateMissionPage from "../pages/CreateMissionPage";
import Mission from "../pages/Missions";
import Profile from "../pages/Profile";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

// Role-based pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerPage from "../pages/ManagerPage";
import SecretaryDashboard from "../pages/secretary/SecretaryDashboard";
import CreateMission from "../pages/secretary/CreateMission";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import DmlDashboard from "../pages/Dml/DmlDashboard";
import BookingPage from "../pages/Dml/Booking";

function MainLayout({ activePage: initialPage }) {
  const [activePage, setActivePage] = useState(initialPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "employee";

  // Pages available per role
  const renderPage = () => {
    switch (activePage) {

      // ── Admin ──
      case 'dashboard':
        if (role === 'admin')      return <AdminDashboard />;
        if (role === 'dml')        return <DmlDashboard />;
        if (role === 'manager')    return <ManagerDashboard />;
        if (role === 'secretary')  return <SecretaryDashboard />;
        if (role === 'employee')   return <EmployeeDashboard />;
        return <AdminDashboard />;

      // ── Shared ──
      case 'missions':             return <Mission />;
      case 'my-missions':          return <MyMissions setActivePage={setActivePage} />;
      case 'profile':              return <Profile />;
      case 'reports':              return <Reports />;
      case 'settings':             return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />;

      // ── Secretary ──
      case 'create-mission':       return <CreateMission />;
      case 'create-mission-page':  return <CreateMissionPage />;

      // ── DML ──
      case 'booking':              return <BookingPage />;

      // ── Manager ──
      case 'ManagerPage':          return <ManagerPage />;

      default:                     return <DmlDashboard />;
    }
  };

  const pageTitles = {
    'dashboard':           'Dashboard',
    'my-missions':         'My Missions',
    'create-mission':      'Create Mission',
    'create-mission-page': 'Create Mission',
    'missions':            'Missions',
    'profile':             'Profile',
    'booking':             'Booking',
    'reports':             'Reports',
    'ManagerPage':         'Manager Page',
    'settings':            'Settings',
  };

  // Show logged-in user's name in topbar
  const displayName = user
    ? `${user.first_name} ${user.last_name}`
    : "User";

  const initials = user
    ? `${user.first_name?.[0]}${user.last_name?.[0]}`
    : "U";

  return (
    <div className="MainLayout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="topbar-title">
            <h1>{pageTitles[activePage] || 'Dashboard'}</h1>
          </div>
          <div className="topbar-right">
            <span className="user-name">{displayName}</span>
            <div className="user-avatar">{initials}</div>
          </div>
        </div>

        <main className="page-content">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;