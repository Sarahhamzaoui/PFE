import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Sidebar.css';

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard',      label: 'Dashboard',       path: '/dashboard' },
    { id: 'my-missions',    label: 'My Missions',      path: '/my-missions' },
    { id: 'reports',        label: 'Reports',          path: '/reports' },
    { id: 'create-mission', label: 'Create Mission',   path: '/create-mission' },
    { id: 'profile',        label: 'Profile',          path: '/profile' },

    { id: 'missions',  label:' Missions',    path: '/missions'},
    { id: 'booking',        label: 'Booking',           path: '/booking' },
    { id: 'notifications', label: 'Notifications', path: '/notifications' },
{ id: 'settings',      label: 'Settings',      path: '/settings' },
 
  ];

  const handleLogout = () => {
    localStorage.removeItem("users");
    navigate("/");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-text">Mission System</span>
          </div>
          <button className="close-btn" onClick={() => setSidebarOpen(false)}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => {
                setActivePage(item.id);
                navigate(item.path);
                setSidebarOpen(false);
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item help-item" onClick={handleLogout}>
            <span className="nav-label">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;