import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import  "../Styles/Profile.css";

function Profile() {

  const navigate = useNavigate();
 

  const user = JSON.parse(localStorage.getItem("users") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("users");
    navigate("/");
  };

  return (
    <>
      

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