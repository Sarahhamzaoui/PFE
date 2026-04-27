import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/EditProfile.css";

export default function editprofile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name:  user.last_name  || "",
    email:      user.email      || "",
    phone:      user.phone      || "",
    password:   "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/update.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_id: user.user_id }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.message) {
          const updated = { ...user, ...form };
          delete updated.password;
          localStorage.setItem("user", JSON.stringify(updated));
          navigate("/profile");
        } else {
          setMessage({ text: result.error || "Update failed.", type: "error" });
        }
      } else {
        setMessage({ text: "Update failed. Please try again.", type: "error" });
      }
    } catch {
      setMessage({ text: "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "First Name",   name: "first_name", type: "text",     icon: "", placeholder: "e.g. Lyna" },
    { label: "Last Name",    name: "last_name",  type: "text",     icon: "", placeholder: "e.g. Smith" },
    { label: "Email",        name: "email",      type: "email",    icon: "", placeholder: "your@email.com" },
    { label: "Phone Number", name: "phone",      type: "text",     icon: "", placeholder: "+213 xx xx xx xx" },
    { label: "New Password", name: "password",   type: "password", icon: "", placeholder: "Leave blank to keep current" },
  ];

  return (
    <div className="ep-wrap">

      {/* Banner */}
      <div className="ep-banner">
        <div className="ep-banner__overlay" />
        <div className="ep-avatar"></div>
      </div>

      {/* Title */}
      <div className="ep-identity">
        <h1 className="ep-title">Edit Profile</h1>
        <span className="ep-subtitle">Update your account information</span>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`ep-message ep-message--${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Form Card */}
      <div className="ep-card">
        <div className="ep-card-head">
          <span className="ep-card-title">Personal Details</span>
          <span className="ep-card-tag">Editable</span>
        </div>

        <div className="ep-fields">
          {fields.map((f) => (
            <div className="ep-field" key={f.name}>
              <div className="ep-field-icon">{f.icon}</div>
              <div className="ep-field-body">
                <label className="ep-field-label">{f.label}</label>
                <input
                  className="ep-field-input"
                  type={f.type}
                  name={f.name}
                  value={form[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="ep-actions">
        <button
          className="ep-btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving…" : "✓ Save Changes"}
        </button>
        <button
          className="ep-btn-ghost"
          onClick={() => navigate("/profile")}
        >
          Cancel
        </button>
      </div>

    </div>
  );
}