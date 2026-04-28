import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

export default function EditProfile({ setActivePage }) {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [form, setForm] = useState({
    first_name: user.first_name || "",
    last_name:  user.last_name  || "",
    email:      user.email      || "",
    phone:      user.phone      || "",
  });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (!form.first_name || !form.email) {
      setMessage({ text: "First name and email are required.", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/update.php", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, user_id: user.user_id }),
      });
      const result = await res.json();
      console.log("status:", res.status);
      console.log("result:", result);
      if (result.message) {
        const updated = { ...user, ...form };
        localStorage.setItem("user", JSON.stringify(updated));
        setMessage({ text: "Profile updated successfully!", type: "success" });
        setTimeout(() => setActivePage("profile"), 1200);
      } else {
        setMessage({ text: result.error || "Update failed.", type: "error" });
      }
    } catch (err) {
      console.error("fetch error:", err);
      setMessage({ text: "Something went wrong.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "First Name",   name: "first_name", type: "text",  placeholder: "e.g. Lyna" },
    { label: "Last Name",    name: "last_name",  type: "text",  placeholder: "e.g. Smith" },
    { label: "Email",        name: "email",      type: "email", placeholder: "your@email.com" },
    { label: "Phone Number", name: "phone",      type: "text",  placeholder: "+213 xx xx xx xx" },
  ];

  return (
    <div className="ep-page">
      <div className="ep-card">

        <div className="ep-card__header">
          <div>
            <h1 className="ep-title">Edit Profile</h1>
            <p className="ep-subtitle">Update your personal information</p>
          </div>
        </div>

        <div className="ep-divider" />

        {message.text && (
          <div className={`ep-msg ep-msg--${message.type}`}>{message.text}</div>
        )}

        <div className="ep-fields">
          {fields.map((f) => (
            <div className="ep-field" key={f.name}>
              <label className="ep-field__label">{f.label}</label>
              <input
                className="ep-field__input"
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
              />
            </div>
          ))}
        </div>

        <div className="ep-divider" />

        <div className="ep-actions">
          <button className="ep-btn ep-btn--ghost" onClick={() => setActivePage("profile")}>
            Cancel
          </button>
          <button className="ep-btn ep-btn--primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}