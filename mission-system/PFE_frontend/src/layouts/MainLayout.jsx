import React, { useState, useEffect } from "react";
import "../styles/Main.css";
import Sidebar from "../components/Sidebar";

import MyMissions from "../pages/secretary/MyMissions";
import Mission from "../pages/Missions";
import Profile from "../pages/dml/Profile";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import EditProfile from "../pages/dml/EditProfile";

import AdminDashboard from "../pages/admin/AdminDashboard";
import ManagerDashboard from "../pages/manager/ManagerDashboard";
import ManagerPage from "../pages/manager/ManagerPage";
import Dashboard from "../pages/secretary/Dashboard";
import CreateMissionPage from "../pages/secretary/CreateMissionPage";
import EmployeeDashboard from "../pages/employee/EmployeeDashboard";
import DmlDashboard from "../pages/Dml/DmlDashboard";
import BookingPage from "../pages/Dml/Booking";

function MainLayout({ activePage: initialPage }) {
  const [activePage, setActivePage]         = useState(initialPage);
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [darkMode, setDarkMode]             = useState(false);
  const [bookingMission, setBookingMission] = useState(null);

  useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "employee";

  const renderPage = () => {
    switch (activePage) {

      case 'dashboard':
        if (role === 'admin')     return <AdminDashboard />;
        if (role === 'dml')       return <DmlDashboard setActivePage={setActivePage} setBookingMission={setBookingMission} />;
        if (role === 'manager')   return <ManagerDashboard />;
        if (role === 'secretary') return <Dashboard />;
        if (role === 'employee')  return <EmployeeDashboard />;
        return <AdminDashboard />;

      case 'missions':            return <Mission />;
      case 'editprofile':         return <EditProfile setActivePage={setActivePage} />;
      case 'my-missions':         return <MyMissions setActivePage={setActivePage} />;
      case 'profile':             return <Profile setActivePage={setActivePage} />;
      case 'reports':             return <Reports />;
      case 'settings':            return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />;
      case 'create-mission':      return <CreateMissionPage />;
      case 'create-mission-page': return <CreateMissionPage />;
      case 'booking':             return <BookingPage mission={bookingMission} />;
      case 'ManagerPage':         return <ManagerPage />;

      default:
        if (role === 'admin')     return <AdminDashboard />;
        if (role === 'dml')       return <DmlDashboard setActivePage={setActivePage} setBookingMission={setBookingMission} />;
        if (role === 'manager')   return <ManagerDashboard />;
        if (role === 'secretary') return <Dashboard />;
        if (role === 'employee')  return <EmployeeDashboard />;
        return <AdminDashboard />;
    }
  };

  const pageTitles = {
    'dashboard':           'Dashboard',
    'my-missions':         'My Missions',
    'create-mission':      'Create Mission',
    'create-mission-page': 'Create Mission',
    'missions':            'Missions',
    'profile':             'Profile',
    'editprofile':         'Edit Profile',
    'booking':             'Booking',
    'reports':             'Reports',
    'ManagerPage':         'Manager Page',
    'settings':            'Settings',
  };

  const displayName = user ? `${user.first_name} ${user.last_name}` : "User";
  const initials    = user ? `${user.first_name?.[0]}${user.last_name?.[0]}` : "U";

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