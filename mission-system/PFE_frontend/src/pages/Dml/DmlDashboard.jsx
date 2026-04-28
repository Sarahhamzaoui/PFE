import React, { useEffect, useState } from "react";
import "./DmlDashboard.css";
import { getAcceptedMissions, saveBooking } from "../../services/api";

// ─────────────────────────────────────────────
// Donut Chart (same style as secretary)
// ─────────────────────────────────────────────
function DonutChart({ booked, notBooked }) {
  const total = booked + notBooked;
  const RADIUS = 46;
  const CIRC = 2 * Math.PI * RADIUS;

  const bookedDash = total ? (booked / total) * CIRC : 0;
  const notBookedDash = total ? (notBooked / total) * CIRC : 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <svg width="140" height="140" viewBox="0 0 120 120">
        <g transform="rotate(-90, 60, 60)">
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="#4CAF82"
            strokeWidth="20"
            strokeDasharray={`${bookedDash} ${CIRC}`}
          />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="#F5A623"
            strokeWidth="20"
            strokeDasharray={`${notBookedDash} ${CIRC}`}
            strokeDashoffset={-bookedDash}
          />
        </g>

        <text x="60" y="55" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1a2340">
          {total}
        </text>
        <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#aab0c0">
          missions
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4CAF82" }} />
          Booked ({booked})
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F5A623" }} />
          Not Booked ({notBooked})
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────
function DmlDashboard() {
  const [missions, setMissions] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAcceptedMissions();
      setMissions(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ─────────────────────────────────────────────
  // BOOKING ACTION
  // ─────────────────────────────────────────────
  const handleSave = async (id) => {
    try {
      await saveBooking({ mission_id: id });

      setMissions(prev =>
        prev.map(m =>
          m.id === id ? { ...m, booked: 1 } : m
        )
      );
    } catch (err) {
      console.error("Booking error:", err);
    }
  };

  // ─────────────────────────────────────────────
  // STATS
  // ─────────────────────────────────────────────
  const total = missions.length;
  const booked = missions.filter(m => m.booked == 1).length;
  const notBooked = missions.filter(m => !m.booked).length;

  // ─────────────────────────────────────────────
  // FILTER
  // ─────────────────────────────────────────────
  const filtered =
    activeTab === "booked"
      ? missions.filter(m => m.booked == 1)
      : activeTab === "pending"
      ? missions.filter(m => !m.booked)
      : missions;

  if (loading) return <div className="db-page">Loading...</div>;

  return (
    <div className="db-page">

      {/* ── HEADER ── */}
      <div className="db-header">
        <div>
          <h1 className="db-greeting">DML Dashboard</h1>
          <p className="db-sub">Manage bookings for accepted missions.</p>
        </div>
      </div>

      {/* ── CARDS ── */}
      <div className="db-cards-grid">
        <div className="db-card db-card--blue">
          <div className="db-card__top">
            <span className="db-card__label">Total Missions</span>
          </div>
          <p className="db-card__value">{total}</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Booked</span>
          </div>
          <p className="db-card__value">{booked}</p>
          <p className="db-card__sub db-card__sub--green">Confirmed</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Not Booked</span>
          </div>
          <p className="db-card__value">{notBooked}</p>
          <p className="db-card__sub db-card__sub--amber">Pending</p>
        </div>
      </div>

      {/* ── CHART ── */}
      <div className="db-section">
        <p className="db-section__title">Booking Status</p>
        <DonutChart booked={booked} notBooked={notBooked} />
      </div>

      {/* ── TABLE ── */}
      <div className="db-section" style={{ marginTop: "1rem" }}>
        <div className="db-section__header">
          <p className="db-section__title">Accepted Missions</p>

          {/* CLEAN TABS */}
          <div className="db-tabs">
            <button
              className={`db-tab ${activeTab === "all" ? "db-tab--active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All
            </button>

            <button
              className={`db-tab ${activeTab === "booked" ? "db-tab--active" : ""}`}
              onClick={() => setActiveTab("booked")}
            >
              Booked
            </button>

            <button
              className={`db-tab ${activeTab === "pending" ? "db-tab--active" : ""}`}
              onClick={() => setActiveTab("pending")}
            >
              Not Booked
            </button>
          </div>
        </div>

        <table className="db-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Employee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id}>
                <td className="db-table__num">{i + 1}</td>
                <td className="db-table__name">{m.title}</td>
                <td>{m.assigned_employee}</td>

                <td>
                  <span
                    className={`db-badge ${
                      m.booked == 1 ? "db-badge--active" : "db-badge--pending"
                    }`}
                  >
                    {m.booked == 1 ? "Booked" : "Pending"}
                  </span>
                </td>

                <td>
                  {!m.booked && (
                    <button
                      className="db-action-btn db-action-btn--book"
                      onClick={() => handleSave(m.id)}
                    >
                      Book Now
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default DmlDashboard;