import React, { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import MissionDetailModal from "../../components/MissionDetailModal";

const BASE_URL = "http://localhost/mission-system/PFE_backend/api";

// draws a donut chart on an html canvas using the Canvas 2D API
function DonutChart({ approved, pending, rejected }) {
  const canvasRef = useRef(null);

  // redraws the chart whenever the stats change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const total = approved + pending + rejected;

    const slices = [
      { value: approved, color: "#4CAF82" },
      { value: pending,  color: "#F5A623" },
      { value: rejected, color: "#E05252" },
    ];

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = 68;
    const innerR = 42;
    let startAngle = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (total > 0) {
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
    } else {
      // empty gray ring when no missions yet
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, 0, 2 * Math.PI);
      ctx.fillStyle = "#eee";
      ctx.fill();
    }

    // white hole in the center
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();

    // total count + label inside the donut
    ctx.fillStyle = "#1a2340";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, cx, cy - 7);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#aab0c0";
    ctx.fillText("missions", cx, cy + 10);
  }, [approved, pending, rejected]);

  return <canvas ref={canvasRef} width={160} height={160} />;
}

function Dashboard() {
  const [missions, setMissions]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedMission, setSelectedMission] = useState(null);

  // get logged-in secretary from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // fetch secretary's missions on mount
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res  = await fetch(
          `${BASE_URL}/missions/missions.php?role=secretary&user_id=${user?.user_id}`
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

  // recent table — all missions (all statuses), newest first, capped at 5
  const recentMissions = [...missions]
    .sort((a, b) => new Date(b.created_at || b.sent_date) - new Date(a.created_at || a.sent_date))
    .slice(0, 5);

  // map status to badge css modifier
  const badgeClass = (status) => {
    if (status === "approved") return "db-badge--active";
    if (status === "rejected") return "db-badge--urgent";
    return "db-badge--pending";
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading dashboard...</div>;

  return (
    <div className="db-page">

      {/* page header */}
      <div className="db-header">
        <div>
          <h1 className="db-greeting">Dashboard Overview</h1>
          <p className="db-sub">Here's what's happening with your missions.</p>
        </div>
        <div className="db-header-right">
          <span className="db-date-badge">This month ▾</span>
        </div>
      </div>

      {/* summary stat cards — all time counts */}
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

      {/* donut chart — this month's breakdown by status */}
      <div className="db-section">
        <div className="db-section__header">
          <p className="db-section__title">This month by status</p>
        </div>
        <div className="db-donut-wrapper">
          <DonutChart
            approved={monthApproved}
            pending={monthPending}
            rejected={monthRejected}
          />
          {/* legend */}
          <div className="db-legend">
            <div className="db-legend__item">
              <span className="db-legend__dot" style={{ background: "#4CAF82" }} />
              <span className="db-legend__label">Approved</span>
              <span className="db-legend__val">{monthApproved}</span>
            </div>
            <div className="db-legend__item">
              <span className="db-legend__dot" style={{ background: "#F5A623" }} />
              <span className="db-legend__label">Pending</span>
              <span className="db-legend__val">{monthPending}</span>
            </div>
            <div className="db-legend__item">
              <span className="db-legend__dot" style={{ background: "#E05252" }} />
              <span className="db-legend__label">Rejected</span>
              <span className="db-legend__val">{monthRejected}</span>
            </div>
          </div>
        </div>
      </div>

      {/* recent missions — all statuses, newest 5 */}
      <div className="db-section" style={{ marginTop: "1rem" }}>
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
                    {/* status badge */}
                    <span className={`db-badge ${badgeClass(m.status)}`}>
                      {m.status?.charAt(0).toUpperCase() + m.status?.slice(1)}
                    </span>
                    {/* urgent flag — shown for pending urgent missions */}
                    {m.is_urgent == 1 && m.status === "pending" && (
                      <span className="mm-badge mm-badge--urgent-flag" style={{ marginLeft: "6px" }}>
                        🔴 Urgent
                      </span>
                    )}
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
        )}
      </div>

      {/* mission detail modal — read-only for secretary */}
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
            attachments:   [],
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
