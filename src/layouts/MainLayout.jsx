import React, { useState } from "react";
import "../styles/Main.css";

import Sidebar from "../components/Sidebar";
import MyMissions from "../pages/MyMissions";
import CreateMissionPage from "../pages/CreateMissionPage";
import Dashboard from "../pages/Dashboard";
import Mission from "../pages/Missions";
import Profile from "../pages/Profile";
import BookingPage from "../pages/BookingPage";
import Reports from "../pages/Reports";
import ManagerPage from "../pages/ManagerPage";
import Settings from "../pages/Settings";

function MainLayout({ activePage: initialPage }) {
  const [activePage, setActivePage] = useState(initialPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':            return <Dashboard />;
      case 'my-missions':          return <MyMissions setActivePage={setActivePage} />;
      case 'create-mission-page':  return <CreateMissionPage />;
      case 'missions':             return <Mission />;
      case 'profile':              return <Profile />;
      case 'booking':              return <BookingPage />;
      case 'reports':              return <Reports />;
      case 'ManagerPage':          return <ManagerPage />;
      case 'settings':             return <Settings darkMode={darkMode} setDarkMode={setDarkMode} />;
      default:                     return <Dashboard />;
    }
  };

  const pageTitles = {
    'dashboard':           'Dashboard',
    'my-missions':         'My Missions',
    'create-mission-page': 'Create Mission',
    'missions':            'Missions',
    'profile':             'Profile',
    'booking':             'Booking',
    'reports':             'Reports',
    'ManagerPage':         'Manager Page',
    'settings':            'Settings',
  };

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
            <h1>{pageTitles[activePage]}</h1>
          </div>
          <div className="topbar-right">
            <span className="user-name">Lyna Lyna</span>
            <div className="user-avatar">LL</div>
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