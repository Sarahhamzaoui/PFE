import React, { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import MissionDetailModal from "../../components/MissionDetailModal";

const BASE_URL = "http://localhost/mission-system/PFE_backend/api";


// donut ring chart 
// uses svg stroke-dasharray trick instead of canvas arcs

function DonutChart({ approved, pending, rejected }) {
  const total = approved + pending + rejected;

  // circumference of the circle: 2 * π * r = 2 * π * 46 ≈ 289
  const RADIUS = 46;
  const CIRC   = 2 * Math.PI * RADIUS; // ~289

  // each slice = its share of the circumference
  const approvedDash = total > 0 ? (approved / total) * CIRC : 0;
  const pendingDash  = total > 0 ? (pending  / total) * CIRC : 0;
  const rejectedDash = total > 0 ? (rejected / total) * CIRC : 0;

  // stroke-dashoffset shifts each slice so they sit next to each other
  // svg arcs start at 3 o'clock; we rotate -90° via the group transform
  const approvedOffset = 0;
  const pendingOffset  = -(approvedDash);
  const rejectedOffset = -(approvedDash + pendingDash);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
      <svg
        width="140"
        height="140"
        viewBox="0 0 120 120"
        style={{ flexShrink: 0 }}
      >
        {/* rotate so the first slice starts at the top */}
        <g transform="rotate(-90, 60, 60)">
          {total > 0 ? (
            <>
              {/* approved — green */}
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke="#4CAF82"
                strokeWidth="20"
                strokeDasharray={`${approvedDash} ${CIRC}`}
                strokeDashoffset={approvedOffset}
              />
              {/* pending — amber */}
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke="#F5A623"
                strokeWidth="20"
                strokeDasharray={`${pendingDash} ${CIRC}`}
                strokeDashoffset={pendingOffset}
              />
              {/* rejected — red */}
              <circle
                cx="60" cy="60" r={RADIUS}
                fill="none"
                stroke="#E05252"
                strokeWidth="20"
                strokeDasharray={`${rejectedDash} ${CIRC}`}
                strokeDashoffset={rejectedOffset}
              />
            </>
          ) : (
            // empty gray ring when there are no missions yet
            <circle
              cx="60" cy="60" r={RADIUS}
              fill="none"
              stroke="#eee"
              strokeWidth="20"
            />
          )}
        </g>

        {/* center label — total count + "missions" */}
        <text x="60" y="55" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1a2340">
          {total}
        </text>
        <text x="60" y="70" textAnchor="middle" fontSize="9" fill="#aab0c0">
          missions
        </text>
      </svg>

      {/* legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {[
          { label: "Approved", value: approved, color: "#4CAF82" },
          { label: "Pending",  value: pending,  color: "#F5A623" },
          { label: "Rejected", value: rejected, color: "#E05252" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555" }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
            <span>{label}</span>
            <span style={{ fontWeight: 600, color: "#1a2340", marginLeft: "auto", paddingLeft: "12px" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// bar chart — monthly missions for the last 6 months
// each bar shows approved / pending / rejected as stacked segments
// ─────────────────────────────────────────────
function BarChart({ missions }) {
  // build an array of the last 6 months: ["2025-11", "2025-12", ..., "2026-04"]
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);           // avoid day-overflow when subtracting months
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7)); // "YYYY-MM"
  }

  // short label for the x-axis: "Apr", "Mar", etc.
  const shortLabel = (ym) => {
    const [year, month] = ym.split("-");
    return new Date(year, month - 1).toLocaleString("default", { month: "short" });
  };

  // count missions per month per status
  const data = months.map((ym) => {
    const inMonth = missions.filter(m =>
      (m.sent_date || m.created_at || "").startsWith(ym)
    );
    return {
      month:    ym,
      label:    shortLabel(ym),
      approved: inMonth.filter(m => m.status === "approved").length,
      pending:  inMonth.filter(m => m.status === "pending").length,
      rejected: inMonth.filter(m => m.status === "rejected").length,
      total:    inMonth.length,
    };
  });

  // tallest bar sets the scale so all bars are relative to it
  const maxTotal = Math.max(...data.map(d => d.total), 1);

  // current month string — used to fade the current (partial) month
  const currentMonth = new Date().toISOString().slice(0, 7);

  const CHART_HEIGHT = 130; // px — height of the bar area

  return (
    <div>
      {/* bars */}
      <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: CHART_HEIGHT, borderBottom: "1px solid #eee", paddingBottom: 0 }}>
        {data.map((d) => {
          const isCurrent = d.month === currentMonth;
          // pixel heights for each stacked segment
          const approvedH = (d.approved / maxTotal) * CHART_HEIGHT;
          const pendingH  = (d.pending  / maxTotal) * CHART_HEIGHT;
          const rejectedH = (d.rejected / maxTotal) * CHART_HEIGHT;

          return (
            <div
              key={d.month}
              style={{
                flex:           1,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "flex-end",
                height:         "100%",
                // fade current month to signal it's not complete yet
                opacity: isCurrent ? 0.5 : 1,
              }}
            >
              {/* stacked bar — rejected on top, then pending, then approved at bottom */}
              <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 0 }}>
                {d.rejected > 0 && (
                  <div style={{ height: rejectedH, background: "#E05252", borderRadius: "3px 3px 0 0" }} />
                )}
                {d.pending > 0 && (
                  <div style={{
                    height:       pendingH,
                    background:   "#F5A623",
                    borderRadius: d.rejected === 0 ? "3px 3px 0 0" : 0,
                  }} />
                )}
                {d.approved > 0 && (
                  <div style={{
                    height:       approvedH,
                    background:   "#4CAF82",
                    borderRadius: (d.rejected === 0 && d.pending === 0) ? "3px 3px 0 0" : 0,
                  }} />
                )}
                {/* empty placeholder so the column still shows when total = 0 */}
                {d.total === 0 && (
                  <div style={{ height: 4, background: "#eee", borderRadius: "3px 3px 0 0" }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* x-axis month labels */}
      <div style={{ display: "flex", gap: "8px", marginTop: "6px" }}>
        {data.map((d) => (
          <div
            key={d.month}
            style={{
              flex:       1,
              textAlign:  "center",
              fontSize:   "11px",
              color:      d.month === currentMonth ? "#1a2340" : "#aab0c0",
              fontWeight: d.month === currentMonth ? 600 : 400,
            }}
          >
            {d.label}
          </div>
        ))}
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: "14px", marginTop: "12px", flexWrap: "wrap" }}>
        {[
          { label: "Approved", color: "#4CAF82" },
          { label: "Pending",  color: "#F5A623" },
          { label: "Rejected", color: "#E05252" },
        ].map(({ label, color }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11px", color: "#888" }}>
            <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
            {label}
          </div>
        ))}
        <div style={{ fontSize: "11px", color: "#bbb", marginLeft: "auto" }}>
          Faded = current month (partial)
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// main dashboard component
// ─────────────────────────────────────────────
function Dashboard({ role = "secretary" }) {
  const [missions, setMissions]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedMission, setSelectedMission] = useState(null);

  // get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // fetch missions on mount
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res  = await fetch(
          `${BASE_URL}/missions/missions.php?role=${role}&user_id=${user?.user_id}`
        );
        const data = await res.json();
        setMissions(data.missions || []);
      } catch (err) {
        console.error("dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  // fetch attachments then open the detail modal
  const handleViewMission = async (mission) => {
    try {
      const res  = await fetch(`${BASE_URL}/missions/attachments.php?mission_id=${mission.mission_id}`);
      const data = await res.json();
      setSelectedMission({ ...mission, fetchedAttachments: data.attachments || [] });
    } catch {
      setSelectedMission({ ...mission, fetchedAttachments: [] });
    }
  };

  // current month string e.g. "2026-04" — used to filter this month's missions
  const currentMonth = new Date().toISOString().slice(0, 7);

  // this month's missions — drives the donut chart
  const thisMonth = missions.filter(m =>
    (m.sent_date || m.created_at || "").startsWith(currentMonth)
  );

  // all-time counts — drive the stat cards
  const total    = missions.length;
  const approved = missions.filter(m => m.status === "approved").length;
  const pending  = missions.filter(m => m.status === "pending").length;
  const urgent   = missions.filter(m => m.is_urgent == 1).length;

  // this month counts — drive the donut chart
  const monthApproved = thisMonth.filter(m => m.status === "approved").length;
  const monthPending  = thisMonth.filter(m => m.status === "pending").length;
  const monthRejected = thisMonth.filter(m => m.status === "rejected").length;

  // recent table — all missions, newest first, capped at 5
  const recentMissions = [...missions]
    .sort((a, b) => new Date(b.created_at || b.sent_date) - new Date(a.created_at || a.sent_date))
    .slice(0, 5);

  // map status to badge css modifier
  const badgeClass = (status) => {
    if (status === "approved") return "db-badge--active";
    if (status === "rejected") return "db-badge--rejected";
    return "db-badge--pending";
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading dashboard...</div>;

  return (
    <div className="db-page">

      {/* ── page header ── */}
      <div className="db-header">
        <div>
          <h1 className="db-greeting">Dashboard Overview</h1>
          <p className="db-sub">Here's what's happening with your missions.</p>
        </div>
      </div>

      {/* ── summary stat cards — all-time counts ── */}
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

      {/* ── charts row — donut (left) + bar (right) ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1rem", marginBottom: "1rem" }}>

        {/* donut chart — this month's breakdown */}
        <div className="db-section">
          <div className="db-section__header">
            <p className="db-section__title">This month by status</p>
          </div>
          <DonutChart
            approved={monthApproved}
            pending={monthPending}
            rejected={monthRejected}
          />
        </div>

        {/* bar chart — last 6 months, stacked by status */}
        <div className="db-section">
          <div className="db-section__header">
            <p className="db-section__title">Monthly missions — last 6 months</p>
          </div>
          {/* pass all missions; the BarChart component handles the grouping */}
          <BarChart missions={missions} />
        </div>

      </div>

      {/* ── recent missions table — all statuses, newest 5 ── */}
      <div className="db-section">
        <div className="db-section__header">
          <p className="db-section__title">Recent missions</p>
        </div>

        {recentMissions.length === 0 ? (
          <p style={{ color: "#aaa", padding: "1rem 0" }}>No missions yet.</p>
        ) : (
          <table className="db-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Destination</th>
                <th>Start date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentMissions.map((m, i) => (
                <tr key={m.mission_id}>
                  <td className="db-table__num">{i + 1}</td>
                  <td className="db-table__name">
                    {m.assigned_to_name || m.created_by_name || "—"}
                  </td>
                  <td>{m.destination}</td>
                  <td>{m.start_date}</td>
                  <td>
                    {/* status badge — approved green, rejected red, pending amber */}
                    <span className={`db-badge ${badgeClass(m.status)}`}>
                      {m.status?.charAt(0).toUpperCase() + m.status?.slice(1)}
                    </span>
                    {/* urgent flag — shown only for pending urgent missions */}
                    {m.is_urgent == 1 && m.status === "pending" && (
                      <span className="mm-badge mm-badge--urgent-flag" style={{ marginLeft: "6px" }}>
                        Urgent
                      </span>
                    )}
                  </td>
                  <td>
                    {/* clicking view fetches attachments then opens the modal */}
                    <button
                      className="mm-action-btn"
                      onClick={() => handleViewMission(m)}
                    >
                      View ›
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── mission detail modal — read-only for secretary/employee ── */}
      {selectedMission && (
        <MissionDetailModal
          mission={{
            ...selectedMission,
            title:         selectedMission.title,
            secretary:     selectedMission.created_by_name,
            dateLabel:     selectedMission.start_date,
            decision:      selectedMission.status,
            note:          selectedMission.manager_note || "",
            dept:          selectedMission.department_name  || "N/A",
            deadline:      selectedMission.end_date         || "N/A",
            assignedTo:    selectedMission.assigned_to_name || "N/A",
            location:      selectedMission.destination      || "N/A",
            desc:          selectedMission.objectives       || "",
            // use fetched attachments instead of hardcoded empty array
            attachments:   selectedMission.fetchedAttachments || [],
            accommodation: selectedMission.accommodation    || "",
            transport:     selectedMission.transport        || "",
            needs_driver:  selectedMission.needs_driver     || 0,
          }}
          onClose={() => setSelectedMission(null)}
          role="employee"
        />
      )}

    </div>
  );
}

export default Dashboard;