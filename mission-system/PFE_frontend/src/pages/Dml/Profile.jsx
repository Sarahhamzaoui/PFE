import { useNavigate } from "react-router-dom";
import "../Styles/Profile.css";

function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const initials =
    (user.first_name?.slice(0, 1) || "?").toUpperCase() +
    (user.last_name?.slice(0, 1) || "").toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const fields = [
    { label: "User ID",    value: user.user_id,                 icon: "" },
    { label: "Email",      value: user.email,                   icon: "" },
    { label: "First Name", value: user.first_name,              icon: "" },
    { label: "Last Name",  value: user.last_name,               icon: "" },
    { label: "Role",       value: user.role,                    icon: "" },
    { label: "Phone",      value: user.phone || "Not provided", icon: "" },
  ];

  return (
    <div className="pf-wrap">

      {/* Banner */}
      <div className="pf-banner">
        <div className="pf-banner__overlay" />
        <div className="pf-avatar">{initials}</div>
      </div>

      {/* Identity */}
      <div className="pf-identity">
        <h1 className="pf-name">{user.first_name || "—"} {user.last_name || ""}</h1>
        <span className="pf-role-badge">{user.role || "Employee"}</span>
      </div>

      {/* Card */}
      <div className="pf-card">
        <div className="pf-card-head">
          <span className="pf-card-title">Account Information</span>
          <span className="pf-card-tag">Personal</span>
        </div>
        <div className="pf-fields">
          {fields.map((f) => (
            <div className="pf-field" key={f.label}>
              <div className="pf-field-icon">{f.icon}</div>
              <div className="pf-field-body">
                <span className="pf-field-label">{f.label}</span>
                <span className="pf-field-value">{f.value || "—"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="pf-actions">
        <button className="pf-btn-primary" onClick={() => navigate("/editprofile")}>
          Edit Profile
        </button>
        <button className="pf-btn-danger" onClick={handleLogout}>
          ⎋ Logout
        </button>
      </div>

    </div>
  );
}

export default Profile;