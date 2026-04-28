import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

const menuByRole = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { id: 'profile', label: 'Profile', path: '/profile' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ],
  dml: [
    { id: 'dashboard', label: 'Dashboard', path: '/dml/dashboard' },
    { id: 'profile', label: 'Profile', path: '/profile' },
    { id: 'booking', label: 'Booking', path: '/dml/booking' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ],
  manager: [
    { id: 'dashboard', label: 'Dashboard', path: '/manager/dashboard' },
    { id: 'profile', label: 'Profile', path: '/profile' },
    { id: 'missions', label: 'Missions', path: '/manager/ManagerPage' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ],
  secretary: [
    { id: 'dashboard', label: 'Dashboard', path: '/secretary/dashboard' },
    { id: 'profile', label: 'Profile', path: '/profile' },
    { id: 'create-mission-page', label: 'Create Mission', path: '/secretary/create-mission' },
    { id: 'my-missions', label: 'My Missions', path: '/secretary/my-missions' },
    { id: 'settings', label: 'Settings', path: '/settings' },
  ],
  employee: [
    { id: 'dashboard', label: 'Dashboard', path: '/employee/dashboard' },
    { id: 'profile', label: 'Profile', path: '/profile' },
    { id: 'settings', label: 'Settings', path: '/settings' },
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
    navigate(item.path);   // ✅ THIS FIXES EVERYTHING
  };

  return (
    <>
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>

        <div className="sidebar-header">
          <span className="logo-text">Mission System</span>
          <button onClick={() => setSidebarOpen(false)}>x</button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={"nav-item " + (activePage === item.id ? "active" : "")}
              onClick={() => handleClick(item)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={handleLogout}>
            Log out
          </button>
        </div>

      </div>
    </>
  );
};

export default Sidebar;