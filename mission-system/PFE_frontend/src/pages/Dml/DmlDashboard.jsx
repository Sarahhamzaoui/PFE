import React, { useEffect, useRef, useState } from "react";
import "./DmlDashboard.css";
import { getAcceptedMissions, saveBooking } from "../../services/api";
import { useNavigate } from "react-router-dom"; // ← ADD THIS

// Donut chart - unchanged
function DonutChart({ booked, notBooked }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const total = booked + notBooked;
    const slices = [
      { value: booked,    color: "#4CAF82" },
      { value: notBooked, color: "#F5A623" },
    ];
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const outerR = 68;
    const innerR = 42;
    let startAngle = -Math.PI / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    slices.forEach(slice => {
      if (slice.value === 0) return;
      const angle = (slice.value / total) * 2 * Math.PI;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, outerR, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      startAngle += angle;
    });
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.fillStyle = "#1a2340";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(total, cx, cy - 7);
    ctx.font = "10px sans-serif";
    ctx.fillStyle = "#aab0c0";
    ctx.fillText("missions", cx, cy + 10);
  }, [booked, notBooked]);
  return <canvas ref={canvasRef} width={160} height={160} />;
}

// Booking modal - unchanged (only used for "View ›" now)
function BookingModal({ mission, onClose, onSave }) {
  const [accomodation, setAccomodation] = useState(mission.accomodation || "");
  const [transport, setTransport]       = useState(mission.transport || "");
  const [food, setFood]                 = useState(mission.food || "");

  return (
    <div className="dml-modal-overlay" onClick={onClose}>
      <div className="dml-modal" onClick={e => e.stopPropagation()}>
        <div className="dml-modal__header">
          <h2 className="dml-modal__title">Booking — {mission.title}</h2>
          <button className="dml-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="dml-modal__info">
          <div className="dml-modal__info-row">
            <span className="dml-modal__info-label">Employee</span>
            <span className="dml-modal__info-val">{mission.assigned_employee}</span>
          </div>
          <div className="dml-modal__info-row">
            <span className="dml-modal__info-label">Created by</span>
            <span className="dml-modal__info-val">{mission.created_by}</span>
          </div>
          <div className="dml-modal__info-row">
            <span className="dml-modal__info-label">Description</span>
            <span className="dml-modal__info-val">{mission.description}</span>
          </div>
        </div>
        <div className="dml-modal__form">
          <div className="dml-modal__field">
            <label>Accomodation</label>
            <input
              type="text"
              placeholder="e.g. Hotel Le Marais"
              value={accomodation}
              onChange={e => setAccomodation(e.target.value)}
            />
          </div>
          <div className="dml-modal__field">
            <label>Transport</label>
            <input
              type="text"
              placeholder="e.g. Air France AF1234"
              value={transport}
              onChange={e => setTransport(e.target.value)}
            />
          </div>
          <div className="dml-modal__field">
            <label>Food</label>
            <input
              type="text"
              placeholder="e.g. Included / Per diem"
              value={food}
              onChange={e => setFood(e.target.value)}
            />
          </div>
        </div>
        <div className="dml-modal__actions">
          <button className="dml-btn dml-btn--cancel" onClick={onClose}>Cancel</button>
          <button
            className="dml-btn dml-btn--confirm"
            onClick={() => onSave(mission.id, accomodation, transport, food)}
          >
            Confirm Booking ✓
          </button>
        </div>
      </div>
    </div>
  );
}

function DmlDashboard() {
  const navigate = useNavigate(); // ← ADD THIS
  const [missionList, setMissionList]         = useState([]);
  const [selectedMission, setSelectedMission] = useState(null);
  const [activeTab, setActiveTab]             = useState("all");
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState("");

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await getAcceptedMissions();
        if (Array.isArray(data)) {
          setMissionList(data);
        } else {
          setError(data.error || "Failed to load missions");
        }
      } catch (err) {
        setError("Server error, please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  const handleSaveBooking = async (id, accomodation, transport, food) => {
    try {
      const data = await saveBooking({ mission_id: id, accomodation, transport, food });
      if (data.message === "Booking saved successfully") {
        setMissionList(prev =>
          prev.map(m =>
            m.id === id ? { ...m, booked: "1", accomodation, transport, food } : m
          )
        );
        setSelectedMission(null);
      } else {
        alert(data.error || "Failed to save booking");
      }
    } catch (err) {
      alert("Server error, please try again");
    }
  };

  const total     = missionList.length;
  const booked    = missionList.filter(m => m.booked === "1" || m.booked === 1).length;
  const notBooked = missionList.filter(m => !m.booked || m.booked === "0").length;

  const filtered =
    activeTab === "booked"  ? missionList.filter(m => m.booked === "1" || m.booked === 1) :
    activeTab === "pending" ? missionList.filter(m => !m.booked || m.booked === "0") :
    missionList;

  if (loading) return <div className="dml-page"><p>Loading missions...</p></div>;
  if (error)   return <div className="dml-page"><p style={{color:"red"}}>{error}</p></div>;

  return (
    <div className="dml-page">
      <div className="dml-header">
        <div>
          <h1 className="dml-greeting">DML Dashboard</h1>
          <p className="dml-sub">Manage bookings for accepted missions.</p>
        </div>
        <span className="dml-date-badge">This month ▾</span>
      </div>

      <div className="dml-cards-grid">
        <div className="dml-card dml-card--blue">
          <div className="dml-card__top">
            <span className="dml-card__label">Total Missions</span>
            <span className="dml-card__arrow">↗</span>
          </div>
          <p className="dml-card__value">{total}</p>
          <p className="dml-card__sub">Accepted missions</p>
        </div>
        <div className="dml-card">
          <div className="dml-card__top">
            <span className="dml-card__label">Booked</span>
            <span className="dml-card__arrow">↗</span>
          </div>
          <p className="dml-card__value">{booked}</p>
          <p className="dml-card__sub dml-card__sub--green">↑ Booking confirmed</p>
        </div>
        <div className="dml-card">
          <div className="dml-card__top">
            <span className="dml-card__label">Not Booked</span>
            <span className="dml-card__arrow">↗</span>
          </div>
          <p className="dml-card__value">{notBooked}</p>
          <p className="dml-card__sub dml-card__sub--amber">↑ Awaiting booking</p>
        </div>
      </div>

      <div className="dml-section">
        <div className="dml-section__header">
          <p className="dml-section__title">Booking status</p>
        </div>
        <div className="dml-donut-wrapper">
          <DonutChart booked={booked} notBooked={notBooked} />
          <div className="dml-legend">
            <div className="dml-legend__item">
              <span className="dml-legend__dot" style={{ background: "#4CAF82" }} />
              <span className="dml-legend__label">Booked</span>
              <span className="dml-legend__val">{booked}</span>
            </div>
            <div className="dml-legend__item">
              <span className="dml-legend__dot" style={{ background: "#F5A623" }} />
              <span className="dml-legend__label">Not Booked</span>
              <span className="dml-legend__val">{notBooked}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dml-section" style={{ marginTop: "1rem" }}>
        <div className="dml-section__header">
          <p className="dml-section__title">Accepted missions</p>
          <div className="dml-tabs">
            <button className={`dml-tab ${activeTab === "all"     ? "dml-tab--active" : ""}`} onClick={() => setActiveTab("all")}>All</button>
            <button className={`dml-tab ${activeTab === "booked"  ? "dml-tab--active" : ""}`} onClick={() => setActiveTab("booked")}>Booked</button>
            <button className={`dml-tab ${activeTab === "pending" ? "dml-tab--active" : ""}`} onClick={() => setActiveTab("pending")}>Not Booked</button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: "#8a93a8", fontSize: "13px", padding: "1rem 0" }}>
            No missions found.
          </p>
        ) : (
          <table className="dml-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Employee</th>
                <th>Created By</th>
                <th>Booking</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id}>
                  <td className="dml-table__num">{i + 1}</td>
                  <td className="dml-table__name">{m.title}</td>
                  <td>{m.assigned_employee}</td>
                  <td>{m.created_by}</td>
                  <td>
                    <span className={`dml-badge ${m.booked === "1" || m.booked === 1 ? "dml-badge--booked" : "dml-badge--pending"}`}>
                      {m.booked === "1" || m.booked === 1 ? "Booked ✓" : "Not Booked"}
                    </span>
                  </td>
                  <td>
                    {m.booked === "1" || m.booked === 1 ? (
                      // View modal for already booked missions
                      <button
                        className="dml-action-btn dml-action-btn--view"
                        onClick={() => setSelectedMission(m)}
                      >
                        View ›
                      </button>
                    ) : (
                      // ← CHANGED: navigate to booking page instead of opening modal
                      <button
                        className="dml-action-btn dml-action-btn--book"
                        onClick={() => navigate("/booking", { state: { mission: m } })}
                      >
                        Book Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedMission && (
        <BookingModal
          mission={selectedMission}
          onClose={() => setSelectedMission(null)}
          onSave={handleSaveBooking}
        />
      )}
    </div>
  );
}

export default DmlDashboard;