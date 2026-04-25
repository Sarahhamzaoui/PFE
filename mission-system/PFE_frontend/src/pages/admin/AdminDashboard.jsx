import { useState, useEffect } from "react";
import "./AdminDashboard.css";

const BASE_URL = "/api";

const ROLES = ["admin", "manager", "secretary", "employee", "dml"];

const ROLE_COLORS = {
  admin:     { bg: "#fdecea", color: "#c0392b" },
  manager:   { bg: "#e8edf8", color: "#1a2a6c" },
  secretary: { bg: "#fff5e6", color: "#c07b10" },
  employee:  { bg: "#e8f8f1", color: "#2e9b6a" },
  dml:       { bg: "#f0eafd", color: "#6c3483" },
};

const STATUS_COLORS = {
  approved: { bg: "#e8f8f1", color: "#2e9b6a" },
  pending:  { bg: "#fff5e6", color: "#c07b10" },
  rejected: { bg: "#fdecea", color: "#c0392b" },
};

function Modal({ title, onClose, children }) {
  return (
    <div className="adm-modal-overlay" onClick={onClose}>
      <div className="adm-modal" onClick={e => e.stopPropagation()}>
        <div className="adm-modal__header">
          <h2 className="adm-modal__title">{title}</h2>
          <button className="adm-modal__close" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [tab, setTab]                 = useState("users");
  const [users, setUsers]             = useState([]);
  const [missions, setMissions]       = useState([]);
  const [departments, setDepartments] = useState([]);
  const [stats, setStats]             = useState({ users: 0, missions: 0, departments: 0 });
  const [loading, setLoading]         = useState(true);

  // Modals
  const [showCreateModal, setShowCreateModal]   = useState(false);
  const [showDeleteModal, setShowDeleteModal]   = useState(null);
  const [showDetailModal, setShowDetailModal]   = useState(null);
  const [formError, setFormError]               = useState("");
  const [formSuccess, setFormSuccess]           = useState("");

  // Search & filter
  const [userSearch, setUserSearch]     = useState("");
  const [missionFilter, setMissionFilter] = useState("all");

  // Create user form
  const [newUser, setNewUser] = useState({
    first_name: "", last_name: "", email: "",
    password: "", role: "employee", department_id: "",
    employee_id: "", phone: "",
  });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [uRes, mRes, dRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/get_users.php`),
        fetch(`${BASE_URL}/missions/missions.php`),
        fetch(`${BASE_URL}/admin/get_departments.php`),
      ]);
      const uData = await uRes.json();
      const mData = await mRes.json();
      const dData = await dRes.json();

      const userList    = Array.isArray(uData)          ? uData          : [];
      const missionList = Array.isArray(mData.missions) ? mData.missions : [];
      const deptList    = Array.isArray(dData)          ? dData          : [];

      setUsers(userList);
      setMissions(missionList);
      setDepartments(deptList);
      setStats({ users: userList.length, missions: missionList.length, departments: deptList.length });
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setFormError("");
    if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password) {
      setFormError("First name, last name, email and password are required."); return;
    }
    try {
      const res  = await fetch(`${BASE_URL}/admin/create_user.php`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const data = await res.json();
      if (data.success) {
        setFormSuccess("User created successfully!");
        setNewUser({ first_name: "", last_name: "", email: "", password: "", role: "employee", department_id: "", employee_id: "", phone: "" });
        fetchAll();
        setTimeout(() => { setShowCreateModal(false); setFormSuccess(""); }, 1200);
      } else {
        setFormError(data.message || "Failed to create user.");
      }
    } catch { setFormError("Server error, please try again."); }
  };

  const handleToggleActive = async (user) => {
    try {
      const res  = await fetch(`${BASE_URL}/admin/toggle_user.php`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id, active: user.active ? 0 : 1 }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u =>
          u.user_id === user.user_id ? { ...u, active: user.active ? 0 : 1 } : u
        ));
        // Update detail modal if open
        if (showDetailModal?.user_id === user.user_id) {
          setShowDetailModal(prev => ({ ...prev, active: user.active ? 0 : 1 }));
        }
      }
    } catch { alert("Server error, please try again."); }
  };

  const handleDeleteUser = async (user_id) => {
    try {
      const res  = await fetch(`${BASE_URL}/admin/delete_user.php`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.filter(u => u.user_id !== user_id));
        setShowDeleteModal(null);
        setShowDetailModal(null);
      } else {
        alert(data.message || "Failed to delete user.");
      }
    } catch { alert("Server error, please try again."); }
  };

  const filteredUsers = users.filter(u =>
    `${u.first_name} ${u.last_name} ${u.email} ${u.role}`
      .toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredMissions = missionFilter === "all"
    ? missions : missions.filter(m => m.status === missionFilter);

  const approvedCount = missions.filter(m => m.status === "approved").length;
  const pendingCount  = missions.filter(m => m.status === "pending").length;
  const activeUsers   = users.filter(u => u.active).length;

  if (loading) return <div className="adm-page"><p>Loading...</p></div>;

  return (
    <div className="adm-page">

      {/* ── Header ── */}
      <div className="adm-header">
        <div>
          <h1 className="adm-greeting">Admin Dashboard</h1>
          <p className="adm-sub">Manage users, missions and departments.</p>
        </div>
        <span className="adm-date">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* ── Stats ── */}
      <div className="adm-cards">
        <div className="adm-card adm-card--blue">
          <div className="adm-card__top">
            <span className="adm-card__label">Total Users</span>
            <span className="adm-card__arrow">↗</span>
          </div>
          <p className="adm-card__value">{stats.users}</p>
          <p className="adm-card__sub">{activeUsers} active</p>
        </div>
        <div className="adm-card">
          <div className="adm-card__top">
            <span className="adm-card__label">Total Missions</span>
            <span className="adm-card__arrow">↗</span>
          </div>
          <p className="adm-card__value">{stats.missions}</p>
          <p className="adm-card__sub adm-card__sub--green">{approvedCount} approved</p>
        </div>
        <div className="adm-card">
          <div className="adm-card__top">
            <span className="adm-card__label">Pending</span>
            <span className="adm-card__arrow">↗</span>
          </div>
          <p className="adm-card__value">{pendingCount}</p>
          <p className="adm-card__sub adm-card__sub--amber">⏳ Awaiting approval</p>
        </div>
        <div className="adm-card">
          <div className="adm-card__top">
            <span className="adm-card__label">Departments</span>
            <span className="adm-card__arrow">↗</span>
          </div>
          <p className="adm-card__value">{stats.departments}</p>
          <p className="adm-card__sub">Active departments</p>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="adm-tabs-bar">
        <button className={`adm-tab ${tab === "users"    ? "adm-tab--active" : ""}`} onClick={() => setTab("users")}>👥 Users</button>
        <button className={`adm-tab ${tab === "missions" ? "adm-tab--active" : ""}`} onClick={() => setTab("missions")}>📋 Missions</button>
      </div>

      {/* ══════════════ USERS TAB ══════════════ */}
      {tab === "users" && (
        <div className="adm-section">
          <div className="adm-section__header">
            <p className="adm-section__title">All Users</p>
            <div className="adm-section__actions">
              <input
                className="adm-search"
                placeholder="Search users..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
              />
              <button className="adm-btn adm-btn--primary"
                onClick={() => { setShowCreateModal(true); setFormError(""); setFormSuccess(""); }}>
                + New User
              </button>
            </div>
          </div>

          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, i) => (
                <tr
                  key={u.user_id}
                  className="adm-table__row--clickable"
                  onClick={() => setShowDetailModal(u)}
                >
                  <td className="adm-table__num">{i + 1}</td>
                  <td className="adm-table__name">{u.first_name} {u.last_name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className="adm-badge" style={ROLE_COLORS[u.role]}>{u.role}</span>
                  </td>
                  <td>{u.department_name || "—"}</td>
                  <td>
                    <span className={`adm-badge ${u.active ? "adm-badge--active" : "adm-badge--inactive"}`}>
                      {u.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div className="adm-actions">
                      <button
                        className={`adm-btn ${u.active ? "adm-btn--warning" : "adm-btn--success"}`}
                        onClick={() => handleToggleActive(u)}
                      >
                        {u.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        className="adm-btn adm-btn--danger"
                        onClick={() => setShowDeleteModal(u)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════ MISSIONS TAB ══════════════ */}
      {tab === "missions" && (
        <div className="adm-section">
          <div className="adm-section__header">
            <p className="adm-section__title">All Missions</p>
            <div className="adm-tabs">
              {["all", "approved", "pending", "rejected"].map(f => (
                <button key={f}
                  className={`adm-filter-tab ${missionFilter === f ? "adm-filter-tab--active" : ""}`}
                  onClick={() => setMissionFilter(f)}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <table className="adm-table">
            <thead>
              <tr>
                <th>#</th><th>Title</th><th>Destination</th>
                <th>Assigned To</th><th>Created By</th>
                <th>Start</th><th>End</th><th>Status</th><th>Booked</th>
              </tr>
            </thead>
            <tbody>
              {filteredMissions.map((m, i) => (
                <tr key={m.mission_id}>
                  <td className="adm-table__num">{i + 1}</td>
                  <td className="adm-table__name">{m.title}</td>
                  <td>{m.destination}</td>
                  <td>{m.assigned_to_name || "—"}</td>
                  <td>{m.created_by_name  || "—"}</td>
                  <td>{m.start_date}</td>
                  <td>{m.end_date}</td>
                  <td>
                    <span className="adm-badge" style={STATUS_COLORS[m.status]}>{m.status}</span>
                  </td>
                  <td>
                    <span className={`adm-badge ${m.booked ? "adm-badge--active" : "adm-badge--inactive"}`}>
                      {m.booked ? "Booked ✓" : "Not Booked"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════ USER DETAIL MODAL ══════════════ */}
      {showDetailModal && (
        <Modal title="User Details" onClose={() => setShowDetailModal(null)}>
          <div className="adm-modal__body">

            {/* Avatar + name */}
            <div className="adm-detail__top">
              <div className="adm-detail__avatar">
                {showDetailModal.first_name?.[0]}{showDetailModal.last_name?.[0]}
              </div>
              <div>
                <h3 className="adm-detail__name">
                  {showDetailModal.first_name} {showDetailModal.last_name}
                </h3>
                <span className="adm-badge" style={ROLE_COLORS[showDetailModal.role]}>
                  {showDetailModal.role}
                </span>
              </div>
            </div>

            {/* Info rows */}
            <div className="adm-detail__section">
              <div className="adm-detail__row">
                <span>Email</span>
                <span>{showDetailModal.email}</span>
              </div>
              <div className="adm-detail__row">
                <span>Phone</span>
                <span>{showDetailModal.phone || "Not provided"}</span>
              </div>
              <div className="adm-detail__row">
                <span>Employee ID</span>
                <span>{showDetailModal.employee_id || "N/A"}</span>
              </div>
              <div className="adm-detail__row">
                <span>Department</span>
                <span>{showDetailModal.department_name || "Not assigned"}</span>
              </div>
              <div className="adm-detail__row">
                <span>Status</span>
                <span className={`adm-badge ${showDetailModal.active ? "adm-badge--active" : "adm-badge--inactive"}`}>
                  {showDetailModal.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="adm-detail__row">
                <span>Member Since</span>
                <span>
                  {showDetailModal.created_at
                    ? new Date(showDetailModal.created_at).toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Footer actions */}
            <div className="adm-modal__footer">
              <button
                className="adm-btn adm-btn--ghost"
                onClick={() => setShowDetailModal(null)}
              >
                Close
              </button>
              <button
                className={`adm-btn ${showDetailModal.active ? "adm-btn--warning" : "adm-btn--success"}`}
                onClick={() => handleToggleActive(showDetailModal)}
              >
                {showDetailModal.active ? "Deactivate" : "Activate"}
              </button>
              <button
                className="adm-btn adm-btn--danger"
                onClick={() => { setShowDeleteModal(showDetailModal); setShowDetailModal(null); }}
              >
                🗑 Delete Account
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══════════════ CREATE USER MODAL ══════════════ */}
      {showCreateModal && (
        <Modal title="Create New User" onClose={() => setShowCreateModal(false)}>
          <div className="adm-modal__body">
            {formError   && <p className="adm-form-error">{formError}</p>}
            {formSuccess && <p className="adm-form-success">{formSuccess}</p>}
            <div className="adm-form__row">
              <div className="adm-form__field">
                <label>First Name *</label>
                <input placeholder="First name" value={newUser.first_name}
                  onChange={e => setNewUser(p => ({ ...p, first_name: e.target.value }))} />
              </div>
              <div className="adm-form__field">
                <label>Last Name *</label>
                <input placeholder="Last name" value={newUser.last_name}
                  onChange={e => setNewUser(p => ({ ...p, last_name: e.target.value }))} />
              </div>
            </div>
            <div className="adm-form__row">
              <div className="adm-form__field">
                <label>Email *</label>
                <input type="email" placeholder="Email" value={newUser.email}
                  onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} />
              </div>
              <div className="adm-form__field">
                <label>Password *</label>
                <input type="password" placeholder="Password" value={newUser.password}
                  onChange={e => setNewUser(p => ({ ...p, password: e.target.value }))} />
              </div>
            </div>
            <div className="adm-form__row">
              <div className="adm-form__field">
                <label>Role *</label>
                <select value={newUser.role}
                  onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))}>
                  {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div className="adm-form__field">
                <label>Department</label>
                <select value={newUser.department_id}
                  onChange={e => setNewUser(p => ({ ...p, department_id: e.target.value }))}>
                  <option value="">— Select —</option>
                  {departments.map(d => (
                    <option key={d.department_id} value={d.department_id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="adm-form__row">
              <div className="adm-form__field">
                <label>Employee ID</label>
                <input placeholder="e.g. EMP001" value={newUser.employee_id}
                  onChange={e => setNewUser(p => ({ ...p, employee_id: e.target.value }))} />
              </div>
              <div className="adm-form__field">
                <label>Phone</label>
                <input placeholder="Phone number" value={newUser.phone}
                  onChange={e => setNewUser(p => ({ ...p, phone: e.target.value }))} />
              </div>
            </div>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
              <button className="adm-btn adm-btn--primary" onClick={handleCreateUser}>Create User</button>
            </div>
          </div>
        </Modal>
      )}

      {/* ══════════════ DELETE CONFIRM MODAL ══════════════ */}
      {showDeleteModal && (
        <Modal title="Delete User" onClose={() => setShowDeleteModal(null)}>
          <div className="adm-modal__body">
            <p style={{ color: "#3a4260", fontSize: "14px", marginBottom: "1.5rem" }}>
              Are you sure you want to delete <strong>{showDeleteModal.first_name} {showDeleteModal.last_name}</strong>? This action cannot be undone.
            </p>
            <div className="adm-modal__footer">
              <button className="adm-btn adm-btn--ghost" onClick={() => setShowDeleteModal(null)}>Cancel</button>
              <button className="adm-btn adm-btn--danger" onClick={() => handleDeleteUser(showDeleteModal.user_id)}>Delete</button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}