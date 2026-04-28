import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Sidebar.css";

const menuByRole = {
  admin: [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
  ],
  dml: [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile" },
    { id: "booking", label: "Booking" },
    { id: "settings", label: "Settings" },
  ],
  manager: [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile" },
    { id: "ManagerPage", label: "Missions" },
    { id: "settings", label: "Settings" },
  ],
  secretary: [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile" },
    { id: "create-mission-page", label: "Create Mission" },
    { id: "my-missions", label: "My Missions" },
    { id: "settings", label: "Settings" },
  ],
  employee: [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "Profile" },
    { id: "settings", label: "Settings" },
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

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>

      <div className="sidebar-header">
        <span className="logo-text">Mission System</span>

        <button onClick={() => setSidebarOpen(false)}>✕</button>
      </div>

      <div className="sidebar-role-badge">
        {role}
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activePage === item.id ? "active" : ""}`}
            onClick={() => {
              setActivePage(item.id);
              setSidebarOpen(false);
            }}
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
  );
};

export default Sidebar;