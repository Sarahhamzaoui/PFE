import React, { useState } from "react";
import "../Styles/employee.css";
import MissionDetailModal from "../components/MissionDetailModal";
import Sidebar from "../components/Sidebar"; // adjust path if needed

const employeeMissions = [
  {
    id: 1,
    name: "My Mission",
    destination: "Paris",
    start: "2026-02-20",
    status: "Active",
    title: "Finance Meeting",
    desc: "Attend finance meeting in Paris.",
  },
  {
    id: 2,
    name: "My Mission",
    destination: "Spain",
    start: "2026-03-10",
    status: "Pending",
    title: "Training",
    desc: "Employee training session.",
  },
];

function employee() {
  const user = JSON.parse(localStorage.getItem("users")); // match your key

  const total = employeeMissions.length;
  const active = employeeMissions.filter((m) => m.status === "Active").length;
  const pending = employeeMissions.filter((m) => m.status === "Pending").length;

  const [selectedMission, setSelectedMission] = useState(null);
  const [activePage, setActivePage] = useState("dashboard"); // match the id in menuItems
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userRole={user?.role}
      />

      {/* Main Content */}
      <div className="db-page" style={{ flex: 1 }}>

        {/* Header */}
        <div className="db-header">
          {/* Hamburger button to open sidebar */}
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              marginRight: "1rem",
            }}
          >
            ☰
          </button>

          <div>
            <h1 className="db-greeting">Welcome {user?.first_name}</h1>
            <p className="db-sub">Here are your assigned missions.</p>
          </div>
        </div>

        {/* Cards */}
        <div className="db-cards-grid">
          <div className="db-card db-card--blue">
            <div className="db-card__top">
              <span className="db-card__label">My Missions</span>
            </div>
            <p className="db-card__value">{total}</p>
            <p className="db-card__sub">Assigned to you</p>
          </div>

          <div className="db-card">
            <div className="db-card__top">
              <span className="db-card__label">Active</span>
            </div>
            <p className="db-card__value">{active}</p>
            <p className="db-card__sub db-card__sub--green">Ongoing missions</p>
          </div>

          <div className="db-card">
            <div className="db-card__top">
              <span className="db-card__label">Pending</span>
            </div>
            <p className="db-card__value">{pending}</p>
            <p className="db-card__sub db-card__sub--amber">Waiting approval</p>
          </div>
        </div>

        {/* Mission Table */}
        <div className="db-section" style={{ marginTop: "1rem" }}>
          <div className="db-section__header">
            <p className="db-section__title">My Missions</p>
          </div>

          <table className="db-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Destination</th>
                <th>Start Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {employeeMissions.map((m, i) => (
                <tr key={m.id}>
                  <td>{i + 1}</td>
                  <td>{m.destination}</td>
                  <td>{m.start}</td>
                  <td>
                    <span className={`db-badge db-badge--${m.status.toLowerCase()}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="mm-action-btn"
                      onClick={() => setSelectedMission(m)}
                    >
                      View ›
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedMission && (
          <MissionDetailModal
            mission={selectedMission}
            onClose={() => setSelectedMission(null)}
            role="employee"
          />
        )}
      </div>
    </div>
  );
}

export default employee;