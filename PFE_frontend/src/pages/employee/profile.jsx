import { useState, useEffect } from "react";
import "./Profile.css";

// ✅ FIXED BASE URL
const BASE_URL = "http://localhost/mission-system/PFE_backend/api";

const ROLE_COLORS = {
  admin:     { bg: "#fdecea", color: "#c0392b" },
  manager:   { bg: "#e8edf8", color: "#1a2a6c" },
  secretary: { bg: "#fff5e6", color: "#c07b10" },
  employee:  { bg: "#e8f8f1", color: "#2e9b6a" },
  dml:       { bg: "#f0eafd", color: "#6c3483"  },
};

const AVATAR_COLORS = [
  "#4a6cf7", "#2e9b6a", "#c07b10", "#c0392b", "#6c3483"
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [department, setDepartment] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [pwForm, setPwForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwSaving, setPwSaving] = useState(false);

  const [showPw, setShowPw] = useState({
    current: false, newpw: false, confirm: false
  });

  // ✅ LOAD USER
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    console.log("USER:", stored); // DEBUG

    if (stored) {
      setUser(stored);
      setForm({
        first_name: stored.first_name || "",
        last_name: stored.last_name || "",
        email: stored.email || "",
        phone: stored.phone || "",
      });
      fetchDepartment(stored.department_id);
    }
  }, []);

  const fetchDepartment = async (dept_id) => {
    if (!dept_id) {
      setDepartment("Not assigned");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/departments/get_department.php?id=${dept_id}`);
      const data = await res.json();
      setDepartment(data.name || "Not assigned");
    } catch {
      setDepartment("Not assigned");
    }
  };

  // ✅ FIXED USER ID
  const handleSaveInfo = async () => {
    if (!form.first_name || !form.last_name || !form.email) {
      setErrorMsg("Required fields missing");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${BASE_URL}/auth/update_profile.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id, // ✅ FIXED
          ...form
        }),
      });

      const data = await res.json();

      if (data.success) {
        const updated = { ...user, ...form };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setSuccessMsg("Profile updated!");
        setEditing(false);
      } else {
        setErrorMsg(data.message);
      }

    } catch {
      setErrorMsg("Server error");
    } finally {
      setSaving(false);
    }
  };

  // ✅ FIXED USER ID
  const handleChangePassword = async () => {
    setPwError("");
    setPwSuccess("");

    if (!pwForm.current_password || !pwForm.new_password || !pwForm.confirm_password) {
      setPwError("Fill all fields");
      return;
    }

    if (pwForm.new_password !== pwForm.confirm_password) {
      setPwError("Passwords do not match");
      return;
    }

    setPwSaving(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/change_password.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id, // ✅ FIXED
          ...pwForm
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPwSuccess("Password changed!");
        setPwForm({ current_password: "", new_password: "", confirm_password: "" });
      } else {
        setPwError(data.message);
      }

    } catch {
      setPwError("Server error");
    } finally {
      setPwSaving(false);
    }
  };

  if (!user) return <p>Loading...</p>;

  const initials = `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`;
  const avatarColor = getAvatarColor(user.first_name + user.last_name);
  const roleStyle = ROLE_COLORS[user.role] || {};

  // ✅ SAFE DATE
  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "N/A";

  return (
    <div className="prof-page">

      <h2>My Profile</h2>

      <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Department:</strong> {department}</p>
      <p><strong>Member Since:</strong> {memberSince}</p>

      <hr />

      <button onClick={() => setEditing(!editing)}>
        {editing ? "Cancel" : "Edit Profile"}
      </button>

      {editing && (
        <>
          <input
            value={form.first_name}
            onChange={e => setForm({ ...form, first_name: e.target.value })}
          />
          <input
            value={form.last_name}
            onChange={e => setForm({ ...form, last_name: e.target.value })}
          />
          <input
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <button onClick={handleSaveInfo}>
            {saving ? "Saving..." : "Save"}
          </button>
        </>
      )}

    </div>
  );
}