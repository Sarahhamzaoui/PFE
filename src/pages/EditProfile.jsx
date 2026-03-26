import { useState, useEffect } from "react";
import "../Styles/EditProfile.css";

export default function EditProfile() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          first_name: data.first_name || "",
          last_name:  data.last_name  || "",
          email:      data.email      || "",
          phone:      data.phone      || "",
          password:   "",
        });
      })
      .catch(() => setMessage({ text: "Failed to load user data.", type: "error" }));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        window.location.href = "/profile";
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

      {/* ── Banner ── */}
      <div className="ep-banner">
        <div className="ep-banner__overlay" />
        <div className="ep-avatar"></div>
      </div>

      {/* ── Title ── */}
      <div className="ep-identity">
        <h1 className="ep-title">Edit Profile</h1>
        <span className="ep-subtitle">Update your account information</span>
      </div>

      {/* ── Message ── */}
      {message.text && (
        <div className={`ep-message ep-message--${message.type}`}>
          {message.text}
        </div>
      )}

      {/* ── Form Card ── */}
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

      {/* ── Actions ── */}
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
          onClick={() => window.location.href = "/profile"}
        >
          Cancel
        </button>
      </div>

    </div>
  );
}