import React, { useEffect, useRef, useState } from "react";
import "../Styles/Dashboard.css";
import MissionDetailModal from "../components/MissionDetailModal";


// Static mission data — replace with API call (fetch/axios) when backend is ready
const missions = [
  { id: 1, name: "Hamzaoui Sarah",  destination: "Paris",   start: "2026-02-20", status: "Active",
    title: "Mission to Paris", secretary: "Hamzaoui Sarah", dateLabel: "Feb 20, 2026",
    priority: "med", priLabel: "Medium priority", dept: "Finance",
    deadline: "Mar 1, 2026", assignedTo: "Finance team", location: "Paris",
    desc: "Finance-related mission to Paris.", attachments: [], decision: "approved", note: "" },

  { id: 2, name: "Zeraouti Lyna",   destination: "Spain",   start: "2026-01-05", status: "Pending",
    title: "Mission to Spain", secretary: "Zeraouti Lyna", dateLabel: "Jan 5, 2026",
    priority: "low", priLabel: "Low priority", dept: "HR",
    deadline: "Jan 20, 2026", assignedTo: "HR team", location: "Spain",
    desc: "HR-related mission to Spain.", attachments: [], decision: null, note: "" },

  { id: 3, name: "Roumane Lydia",   destination: "Italy",   start: "2025-12-04", status: "Urgent",
    title: "Mission to Italy", secretary: "Roumane Lydia", dateLabel: "Dec 4, 2025",
    priority: "high", priLabel: "High priority", dept: "Operations",
    deadline: "Dec 15, 2025", assignedTo: "Operations team", location: "Italy",
    desc: "Urgent operations mission to Italy.", attachments: [], decision: null, note: "" },

  { id: 4, name: "Amir Sali",       destination: "Germany", start: "2026-03-01", status: "Active",
    title: "Mission to Germany", secretary: "Amir Sali", dateLabel: "Mar 1, 2026",
    priority: "med", priLabel: "Medium priority", dept: "IT",
    deadline: "Mar 15, 2026", assignedTo: "IT team", location: "Germany",
    desc: "IT infrastructure mission to Germany.", attachments: [], decision: "approved", note: "" },

  { id: 5, name: "Fatima Zohra",    destination: "Dubai",   start: "2026-03-10", status: "Pending",
    title: "Mission to Dubai", secretary: "Fatima Zohra", dateLabel: "Mar 10, 2026",
    priority: "med", priLabel: "Medium priority", dept: "Sales",
    deadline: "Mar 25, 2026", assignedTo: "Sales team", location: "Dubai",
    desc: "Sales outreach mission to Dubai.", attachments: [], decision: null, note: "" },
];

// Draws a donut chart on an HTML canvas using the Canvas 2D API
function DonutChart({ approved, pending, urgent }) {
  
  const canvasRef = useRef(null);

  // Redraws the chart whenever the stats change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const total = approved + pending + urgent;

    // Each slice has a value and a color
    const slices = [
      { value: approved, color: "#4CAF82" },
      { value: pending,  color: "#F5A623" },
      { value: urgent,   color: "#E05252" },
    ];

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = 68; // outer radius of the donut
    const innerR = 42; // inner radius — creates the "hole"
    let startAngle = -Math.PI / 2; // start from top (12 o'clock)

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw each colored slice
    slices.forEach(slice => {
      const angle = (slice.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      startAngle += angle;
    });

    // Draw white circle in the center to create the donut hole
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // Draw total number and label inside the donut
    ctx.fillStyle = "#1a2340";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, cx, cy - 7);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#aab0c0";
    ctx.fillText("missions", cx, cy + 10);
  }, [approved, pending, urgent]);

  return <canvas ref={canvasRef} width={160} height={160} />;
}

function Dashboard() {
  // Count missions by status — drives both stat cards and the donut chart
  const total    = missions.length;
  const approved = missions.filter(m => m.status === "Active").length;
  const pending  = missions.filter(m => m.status === "Pending").length;
  const urgent   = missions.filter(m => m.status === "Urgent").length;

  // Tracks which mission is open in the detail modal (null = closed)
  const [selectedMission, setSelectedMission] = useState(null);

  return (
    <div className="db-page">

      {/* Page header */}
      <div className="db-header">
        <div>
          <h1 className="db-greeting">Dashboard Overview </h1>
          <p className="db-sub">Here's what's happening with your missions.</p>
        </div>
        <div className="db-header-right">
          <span className="db-date-badge">This month ▾</span>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="db-cards-grid">
        <div className="db-card db-card--blue">
          <div className="db-card__top">
            <span className="db-card__label">Total Missions</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{total}</p>
          <p className="db-card__sub">All time</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Approved</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{approved}</p>
          <p className="db-card__sub db-card__sub--green">↑ Currently ongoing</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Pending</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{pending}</p>
          <p className="db-card__sub db-card__sub--amber">↑ Awaiting approval</p>
        </div>

        <div className="db-card">
          <div className="db-card__top">
            <span className="db-card__label">Urgent</span>
            <span className="db-card__arrow">↗</span>
          </div>
          <p className="db-card__value">{urgent}</p>
          <p className="db-card__sub db-card__sub--red">↑ Needs attention</p>
        </div>
      </div>

      {/* Donut chart — visual breakdown of missions by status */}
      <div className="db-section">
        <div className="db-section__header">
          <p className="db-section__title">By status</p>
        </div>
        <div className="db-donut-wrapper">
          <DonutChart approved={approved} pending={pending} urgent={urgent} />
          {/* Legend — maps colors to status labels */}
          <div className="db-legend">
            <div className="db-legend__item">
              <span className="db-legend__dot" style={{ background: "#4CAF82" }} />
              <span className="db-legend__label">Approved</span>
              <span className="db-legend__val">{approved}</span>
            </div>
            <div className="db-legend__item">
              <span className="db-legend__dot" style={{ background: "#F5A623" }} />
              <span className="db-legend__label">Pending</span>
              <span className="db-legend__val">{pending}</span>
            </div>
            <div className="db-legend__item">
              <span className="db-legend__dot" style={{ background: "#E05252" }} />
              <span className="db-legend__label">Urgent</span>
              <span className="db-legend__val">{urgent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent missions table */}
      <div className="db-section" style={{ marginTop: "1rem" }}>
        <div className="db-section__header">
          <p className="db-section__title">Recent missions</p>
          <a className="db-view-all" href="#">View all →</a>
        </div>
        <table className="db-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Destination</th>
              <th>Start date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamically render one row per mission */}
            {missions.map((m, i) => (
              <tr key={m.id}>
                <td className="db-table__num">{i + 1}</td>
                <td className="db-table__name">{m.name}</td>
                <td>{m.destination}</td>
                <td>{m.start}</td>
                <td>
                  {/* Badge color is driven by status value via CSS class */}
                  <span className={`db-badge db-badge--${m.status.toLowerCase()}`}>
                    {m.status}
                  </span>
                </td>
                <td>
                  {/* Opens the read-only detail modal for this mission */}
                  <button className="mm-action-btn" onClick={() => setSelectedMission(m)}>View ›</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mission detail modal — read-only for non-managers */}
      {selectedMission && (
        <MissionDetailModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
          role="employee"
        />
      )}

    </div>
  );
}

export default Dashboard;
