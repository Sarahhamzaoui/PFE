import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

// Menu items per role
const menuByRole = {
  admin: [
    { id: 'dashboard',   label: 'Dashboard',      path: '/admin/dashboard' },
    { id: 'missions',    label: 'Missions',        path: '/missions' },
    { id: 'reports',     label: 'Reports',         path: '/reports' },
    { id: 'settings',    label: 'Settings',        path: '/settings' },
  ],
  dml: [
    { id: 'dashboard',   label: 'Dashboard',       path: '/dml/dashboard' },
    { id: 'booking',     label: 'Booking',         path: '/dml/booking' },
  ],
  manager: [
    { id: 'dashboard',   label: 'Dashboard',       path: '/manager/dashboard' },
    { id: 'ManagerPage',    label: 'Missions',        path: '/manager/ManagerPage' },
  ],
  secretary: [
    { id: 'dashboard',      label: 'Dashboard',       path: '/secretary/dashboard' },
    { id: 'create-mission', label: 'Create Mission',  path: '/secretary/create-mission' },
    { id: 'my-mission',      label: 'My Missions',     path: '/secretary/my-missions' }
  ],
  employee: [
    { id: 'dashboard',   label: 'Dashboard',       path: '/employee/dashboard' },
    { id: 'my-missions', label: 'My Missions',     path: '/my-missions' },
    { id: 'reports',     label: 'Reports',         path: '/employee/report' },
  ],
};

const Sidebar = ({ activePage, setActivePage, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "employee";

  // Pick menu items for this role, fallback to empty array
  const menuItems = menuByRole[role] || [];

  const handleLogout = () => {
    localStorage.removeItem("user"); // ✅ fixed: was "users"
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

        {/* Role badge */}
        <div className="sidebar-role-badge">
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => {
                setActivePage(item.id);
                navigate(item.path);
              }}
            >
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