// Shared layout: renders Sidebar + the current active page
import React, { useState } from "react";
import "../styles/Main.css";

import Sidebar from "../components/Sidebar";
import MyMissions from "../pages/MyMissions";
import CreateMissionPage from "../pages/CreateMissionPage";
import Dashboard from "../pages/Dashboard";
import Mission from "../pages/Missions";
import Profile from "../pages/Profile";
import BookingPage from "../pages/BookingPage";

// initialPage is passed from App.jsx
function MainLayout({ activePage: initialPage }) {

  const [activePage, setActivePage] = useState(initialPage); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Returns  page based on activePage
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':      return <Dashboard />;
      case 'notifications': return <div><h1>notif  soon</h1></div>;
      case 'settings': return <div><h1>settingscoming soon</h1></div>;
      case 'my-missions':    return <MyMissions setActivePage={setActivePage} />;
      case 'create-mission-page': return <CreateMissionPage />;
      case 'missions':       return <Mission />;
      case 'profile':        return <Profile />;
      case 'booking':        return <BookingPage />;
      case 'reports':        return <div><h1>Reports coming soon</h1></div>;
      default:               return <Dashboard />;
    }
  };

  // Page ID to display title mapping
  const pageTitles = {
    'dashboard':      'Dashboard',
    'my-missions':    'My Missions',
    'create-mission': 'Create Mission',
    'missions':       'Missions',
    'profile':        'Profile',
    'booking':        'Booking',
    'reports':        'Reports',
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
          {/* Toggles sidebar open/closed */}
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