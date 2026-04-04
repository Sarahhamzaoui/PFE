import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Sidebar.css';

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen, userRole }) => {
  
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard',           label: 'Dashboard',      path: '/dashboard',           roles: ['admin', 'employee', 'DML'] },
    { id: 'my-missions',         label: 'My Missions',    path: '/my-missions',         roles: ['admin', 'manager', 'user'] },
    { id: 'reports',             label: 'Reports',        path: '/reports',             roles: ['admin', 'employee'] },
    { id: 'create-mission-page', label: 'Create Mission', path: '/create-mission-page', roles: ['admin', 'manager'] },
    { id: 'profile',             label: 'Profile',        path: '/profile',             roles: ['admin', 'employee', 'user'] }, // ✅ fixed missing quote
    { id: 'missions',            label: 'Missions',       path: '/missions',            roles: ['admin', 'manager'] },
    { id: 'booking',             label: 'Booking',        path: '/booking',             roles: ['admin', 'manager',  'user'] },
    { id: 'settings',            label: 'Settings',       path: '/settings',            roles: ['admin', 'employee'] },
    { id: 'ManagerPage',         label: 'Manager Page',   path: '/ManagerPage',         roles: ['admin', 'manager'] },
  ];

  const visibleItems = menuItems.filter(item => item.roles.includes(userRole));

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
          {visibleItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => {
                setActivePage(item.id);
                navigate(item.path);
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