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
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          password: "",
        });
      })
      .catch(() => setMessage("Failed to load user data."));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        window.location.href = "/profile";
      } else {
        setMessage("Update failed. Please try again.");
      }
    } catch {
      setMessage("Something went wrong.");
    }
  };

  const handleCancel = () => {
    window.location.href = "/profile";
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h2>Edit Profile</h2>

        {message && <p className="message">{message}</p>}

        <div className="input-group">
          <label>First Name</label>
          <input type="text" name="first_name" value={form.first_name} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Last Name</label>
          <input type="text" name="last_name" value={form.last_name} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Phone Number</label>
          <input type="text" name="phone" value={form.phone} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Enter new password" />
        </div>

        <div className="buttons">
          <button className="update-btn" onClick={handleSubmit}>Save Changes</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}