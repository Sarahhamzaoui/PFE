import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile({ setActivePage }) {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user") || "{}");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords]                 = useState({ current: "", newPass: "", confirm: "" });
  const [pwMsg, setPwMsg]                         = useState({ text: "", type: "" });
  const [pwLoading, setPwLoading]                 = useState(false);

  const initials =
    (user.first_name?.[0] || "?").toUpperCase() +
    (user.last_name?.[0]  || "").toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const handlePasswordChange = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setPwMsg({ text: "All fields are required.", type: "error" }); return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPwMsg({ text: "New passwords do not match.", type: "error" }); return;
    }
    if (passwords.newPass.length < 6) {
      setPwMsg({ text: "Password must be at least 6 characters.", type: "error" }); return;
    }
    setPwLoading(true);
    try {
      const res    = await fetch("/api/user/change-password.php", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          user_id:          user.user_id,
          current_password: passwords.current,
          new_password:     passwords.newPass,
        }),
      });
      const result = await res.json();
      if (result.message) {
        setPwMsg({ text: "Password changed successfully!", type: "success" });
        setPasswords({ current: "", newPass: "", confirm: "" });
        setTimeout(() => setShowPasswordModal(false), 1500);
      } else {
        setPwMsg({ text: result.error || "Failed to change password.", type: "error" });
      }
    } catch {
      setPwMsg({ text: "Something went wrong.", type: "error" });
    } finally {
      setPwLoading(false);
    }
  };

  const roleColors = {
    admin:     { bg: "#fce7f3", color: "#9d174d" },
    manager:   { bg: "#ede9fe", color: "#5b21b6" },
    secretary: { bg: "#dbeafe", color: "#1e40af" },
    employee:  { bg: "#d1fae5", color: "#065f46" },
    dml:       { bg: "#ffedd5", color: "#9a3412" },
  };
  const roleStyle = roleColors[user.role] || { bg: "#f3f4f6", color: "#374151" };

  return (
    <div className="pf-page">
      <div className="pf-card">

        <div className="pf-card__header">
          <div className="pf-avatar">{initials}</div>
          <div className="pf-card__header-info">
            <h1 className="pf-name">{user.first_name} {user.last_name}</h1>
            <span className="pf-role-badge" style={{ background: roleStyle.bg, color: roleStyle.color }}>
              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
            </span>
          </div>
        </div>

        <div className="pf-divider" />

        <div className="pf-info-grid">
          <InfoItem label="User ID"     value={`#${user.user_id}`} />
          <InfoItem label="Email"       value={user.email} />
          <InfoItem label="First Name"  value={user.first_name} />
          <InfoItem label="Last Name"   value={user.last_name} />
          <InfoItem label="Phone"       value={user.phone || "Not provided"} />
          <InfoItem label="Department"  value={user.department_id ? `Dept. ${user.department_id}` : "Not assigned"} />
          <InfoItem label="Role"        value={user.role} />
          <InfoItem label="Employee ID" value={user.employee_id || "N/A"} />
        </div>

        <div className="pf-divider" />

        <div className="pf-actions">
          <button className="pf-btn pf-btn--primary" onClick={() => setActivePage("editprofile")}>
            ✎ Edit Profile
          </button>
          <button className="pf-btn pf-btn--secondary" onClick={() => { setShowPasswordModal(true); setPwMsg({ text: "", type: "" }); }}>
            🔒 Change Password
          </button>
          <button className="pf-btn pf-btn--danger" onClick={handleLogout}>
            ⎋ Logout
          </button>
        </div>
      </div>

      {showPasswordModal && (
        <div className="pf-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="pf-modal" onClick={e => e.stopPropagation()}>
            <div className="pf-modal__header">
              <h2>Change Password</h2>
              <button className="pf-modal__close" onClick={() => setShowPasswordModal(false)}>✕</button>
            </div>

            {pwMsg.text && (
              <div className={`pf-msg pf-msg--${pwMsg.type}`}>{pwMsg.text}</div>
            )}

            <div className="pf-modal__fields">
              <div className="pf-modal__field">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwords.current}
                  onChange={e => setPasswords({ ...passwords, current: e.target.value })}
                />
              </div>
              <div className="pf-modal__field">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={passwords.newPass}
                  onChange={e => setPasswords({ ...passwords, newPass: e.target.value })}
                />
              </div>
              <div className="pf-modal__field">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={passwords.confirm}
                  onChange={e => setPasswords({ ...passwords, confirm: e.target.value })}
                />
              </div>
            </div>

            <div className="pf-modal__actions">
              <button className="pf-btn pf-btn--secondary" onClick={() => setShowPasswordModal(false)}>Cancel</button>
              <button className="pf-btn pf-btn--primary" onClick={handlePasswordChange} disabled={pwLoading}>
                {pwLoading ? "Saving..." : "Save Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="pf-info-item">
      <span className="pf-info-label">{label}</span>
      <span className="pf-info-value">{value || "—"}</span>
    </div>
  );
}