import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const menuByRole = {
  admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile',   label: 'Profile' },
    { id: 'missions',  label: 'Missions' },
    { id: 'reports',   label: 'Reports' },
    { id: 'settings',  label: 'Settings' },
  ],
  dml: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile',   label: 'Profile' },
    { id: 'booking',   label: 'Booking' },
    { id: 'settings',  label: 'Settings' },
  ],
  manager: [
    { id: 'dashboard',   label: 'Dashboard' },
    { id: 'profile',     label: 'Profile' },
    { id: 'ManagerPage', label: 'Missions' },
    { id: 'settings',    label: 'Settings' },
  ],
  secretary: [
    { id: 'dashboard',           label: 'Dashboard' },
    { id: 'profile',             label: 'Profile' },
    { id: 'create-mission-page', label: 'Create Mission' },
    { id: 'my-missions',         label: 'My Missions' },
    { id: 'settings',            label: 'Settings' },
  ],
  employee: [
    { id: 'dashboard',   label: 'Dashboard' },
    { id: 'profile',     label: 'Profile' },
    { id: 'my-missions', label: 'My Missions' },
    { id: 'reports',     label: 'Reports' },
    { id: 'settings',    label: 'Settings' },
  ],
};

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role || "employee";
  const menuItems = menuByRole[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleClick = (item) => {
    setActivePage(item.id);
    setSidebarOpen(false);

    // optional smooth UX
    window.scrollTo(0, 0);
  };

  return (
    <>
      {/* ✅ OVERLAY (FIXED) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ✅ SIDEBAR */}
      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">Mission System</span>
          </div>

          <button
            className="close-btn"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="sidebar-role-badge">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => handleClick(item)}
            >
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout" onClick={handleLogout}>
            <span className="nav-label">Log out</span>
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;