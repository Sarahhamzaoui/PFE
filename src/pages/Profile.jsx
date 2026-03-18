import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {

  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("users") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("users");
    navigate("/");
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? "active" : ""}`}>
        <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <a href="#" onClick={() => navigate("/dashboard")}><span className="icon">⎙</span><span className="text">Dashboard</span></a>
        <a href="#" onClick={() => navigate("/profile")}><span className="icon">👤</span><span className="text">Profile</span></a>
        <a href="#" onClick={() => navigate("/notifications")}><span className="icon">💬</span><span className="text">Notification</span></a>
        <a href="#" onClick={() => navigate("/files")}><span className="icon">🗁</span><span className="text">Files</span></a>
        <a href="#" onClick={() => navigate("/booking")}><span className="icon">📅</span><span className="text">Booking</span></a>
        <a href="#" onClick={() => navigate("/settings")}><span className="icon">⚙</span><span className="text">Settings</span></a>
        <div className="logout-link">
          <a href="#" onClick={handleLogout}><span className="icon">☚</span><span className="text">Logout</span></a>
        </div>
      </div>

      {/* Profile Card */}
      <div className="page-wrapper">
        <div className="profile-container">
          <div className="profile-image"></div>
          <h2>{user.first_name}</h2>
          <p className="role">{user.role}</p>
          <div className="info">
            <p><span className="label">User ID:</span> {user.id}</p>
            <p><span className="label">Email:</span> {user.email}</p>
            <p><span className="label">First Name:</span> {user.first_name}</p>
            <p><span className="label">Role:</span> {user.role}</p>
            <p><span className="label">Phone:</span> {user.phone || "Not provided"}</p>
          </div>
          <div className="buttons">
            <button className="edit-btn" onClick={() => navigate("/EditProfile")}>Edit Profile</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;