import React, { useEffect, useState } from "react";
import "./DmlDashboard.css";
import { getAcceptedMissions } from "../../services/api";

function DonutChart({ booked, notBooked }) {
  const total = booked + notBooked;
  const RADIUS = 46;
  const CIRC = 2 * Math.PI * RADIUS;
  const bookedDash    = total ? (booked    / total) * CIRC : 0;
  const notBookedDash = total ? (notBooked / total) * CIRC : 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <svg width="140" height="140" viewBox="0 0 120 120">
        <g transform="rotate(-90, 60, 60)">
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#4CAF82" strokeWidth="20"
            strokeDasharray={`${bookedDash} ${CIRC}`} />
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#F5A623" strokeWidth="20"
            strokeDasharray={`${notBookedDash} ${CIRC}`} strokeDashoffset={-bookedDash} />
        </g>
        <text x="60" y="55" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1a2340">{total}</text>
        <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#aab0c0">missions</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#4CAF82", flexShrink: 0 }} />
          Booked ({booked})
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#F5A623", flexShrink: 0 }} />
          Not Booked ({notBooked})
        </div>
      </div>
    </div>
  );
}

function MissionDetail({ mission, onBack, onBook }) {
  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const days = mission.start_date && mission.end_date
    ? Math.ceil((new Date(mission.end_date) - new Date(mission.start_date)) / 86400000)
    : null;

  return (
    <div className="db-detail">
      <button className="db-detail__back" onClick={onBack}>← Back to Dashboard</button>

      <div className="db-detail__header">
        <div>
          <h2 className="db-detail__title">{mission.title}</h2>
          <p className="db-detail__sub">Mission Details</p>
        </div>
        <span className={`db-badge ${mission.booked == 1 ? "db-badge--active" : "db-badge--pending"}`}>
          {mission.booked == 1 ? "Booked" : "Pending"}
        </span>
      </div>

      <div className="db-detail__grid">

        {/* Mission Info */}
        <div className="db-detail__card">
          <p className="db-detail__card-title">Mission Info</p>
          <div className="db-detail__rows">
            <div className="db-detail__row">
              <span className="db-detail__label">Destination</span>
              <span className="db-detail__value">📍 {mission.destination || "—"}</span>
            </div>
            <div className="db-detail__row">
              <span className="db-detail__label">Start Date</span>
              <span className="db-detail__value">{fmt(mission.start_date)}</span>
            </div>
            <div className="db-detail__row">
              <span className="db-detail__label">End Date</span>
              <span className="db-detail__value">{fmt(mission.end_date)}</span>
            </div>
            {days && (
              <div className="db-detail__row">
                <span className="db-detail__label">Duration</span>
                <span className="db-detail__value">{days} day{days !== 1 ? "s" : ""}</span>
              </div>
            )}
            <div className="db-detail__row">
              <span className="db-detail__label">Status</span>
              <span className="db-detail__value" style={{ color: "#22c55e", fontWeight: 600 }}>Approved</span>
            </div>
          </div>
        </div>

        {/* People */}
        <div className="db-detail__card">
          <p className="db-detail__card-title">People</p>
          <div className="db-detail__rows">
            <div className="db-detail__row">
              <span className="db-detail__label">Assigned Employee</span>
              <span className="db-detail__value">👤 {mission.assigned_employee || "—"}</span>
            </div>
            <div className="db-detail__row">
              <span className="db-detail__label">Created By</span>
              <span className="db-detail__value">👤 {mission.created_by || "—"}</span>
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="db-detail__card db-detail__card--full">
          <p className="db-detail__card-title">Objectives</p>
          <p className="db-detail__objectives">{mission.objectives || "No objectives specified."}</p>
        </div>

        {/* Booking Info */}
        <div className="db-detail__card db-detail__card--full">
          <p className="db-detail__card-title">Booking Info</p>
          {mission.booked == 1 ? (
            <div className="db-detail__rows">
              <div className="db-detail__row">
                <span className="db-detail__label">🏨 Accommodation</span>
                <span className="db-detail__value">{mission.accomodation || "—"}</span>
              </div>
              <div className="db-detail__row">
                <span className="db-detail__label">🚗 Transport</span>
                <span className="db-detail__value">{mission.transport || "—"}</span>
              </div>
              <div className="db-detail__row">
                <span className="db-detail__label">🍽️ Food</span>
                <span className="db-detail__value">{mission.food || "—"}</span>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ color: "#94a3b8", fontSize: "13px" }}>No booking made yet.</p>
              <button className="db-action-btn db-action-btn--book" onClick={() => onBook(mission)}>
                Book Now
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function DmlDashboard({ setActivePage, setBookingMission }) {
  const [missions, setMissions]       = useState([]);
  const [activeTab, setActiveTab]     = useState("all");
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAcceptedMissions();
      setMissions(Array.isArray(data) ? data : []);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleBookNow = (mission) => {
    setBookingMission(mission);
    setActivePage("booking");
  };

  const total     = missions.length;
  const booked    = missions.filter(m => m.booked == 1).length;
  const notBooked = missions.filter(m => !m.booked).length;

  const filtered =
    activeTab === "booked"  ? missions.filter(m => m.booked == 1) :
    activeTab === "pending" ? missions.filter(m => !m.booked) :
    missions;

  if (loading) return <div className="db-page">Loading...</div>;

  if (selected) return (
    <MissionDetail
      mission={selected}
      onBack={() => setSelected(null)}
      onBook={handleBookNow}
    />
  );

  return (
    <div className="db-page">

      <div className="db-header">
        <div>
          <h1 className="db-greeting">DML Dashboard</h1>
          <p className="db-sub">Manage bookings for accepted missions.</p>
        </div>
      </div>

      <div className="db-cards-grid">
        <div className="db-card db-card--blue">
          <div className="db-card__top"><span className="db-card__label">Total Missions</span></div>
          <p className="db-card__value">{total}</p>
        </div>
        <div className="db-card">
          <div className="db-card__top"><span className="db-card__label">Booked</span></div>
          <p className="db-card__value">{booked}</p>
          <p className="db-card__sub db-card__sub--green">Confirmed</p>
        </div>
        <div className="db-card">
          <div className="db-card__top"><span className="db-card__label">Not Booked</span></div>
          <p className="db-card__value">{notBooked}</p>
          <p className="db-card__sub db-card__sub--amber">Pending</p>
        </div>
      </div>

      <div className="db-section">
        <p className="db-section__title">Booking Status</p>
        <DonutChart booked={booked} notBooked={notBooked} />
      </div>

      <div className="db-section" style={{ marginTop: "1rem" }}>
        <div className="db-section__header">
          <p className="db-section__title">Accepted Missions</p>
          <div className="db-tabs">
            {["all", "booked", "pending"].map(tab => (
              <button
                key={tab}
                className={`db-tab ${activeTab === tab ? "db-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "all" ? "All" : tab === "booked" ? "Booked" : "Not Booked"}
              </button>
            ))}
          </div>
        </div>

        <table className="db-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Employee</th>
              <th>Destination</th>
              <th>Dates</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.id} className="db-table__row--clickable" onClick={() => setSelected(m)}>
                <td className="db-table__num">{i + 1}</td>
                <td className="db-table__name">{m.title}</td>
                <td>{m.assigned_employee}</td>
                <td>{m.destination || "—"}</td>
                <td style={{ fontSize: "12px", color: "#64748b" }}>
                  {m.start_date ? new Date(m.start_date).toLocaleDateString("en-GB") : "—"}
                  {" → "}
                  {m.end_date   ? new Date(m.end_date).toLocaleDateString("en-GB")   : "—"}
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <span className={`db-badge ${m.booked == 1 ? "db-badge--active" : "db-badge--pending"}`}>
                    {m.booked == 1 ? "Booked" : "Pending"}
                  </span>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  {!m.booked && (
                    <button
                      className="db-action-btn db-action-btn--book"
                      onClick={() => handleBookNow(m)}
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