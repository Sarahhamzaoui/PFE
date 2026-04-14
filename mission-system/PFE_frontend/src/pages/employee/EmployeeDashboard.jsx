import { useState, useEffect } from "react";
import "./EmployeeDashboard.css";

const BASE_URL = "/api";

export default function EmployeeDashboard() {
  const [missions, setMissions]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState("");
  const [selectedMission, setSelectedMission] = useState(null);
  const [activeTab, setActiveTab]             = useState("all");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/missions/missions.php?role=employee&user_id=${user.user_id}`);
        const data = await res.json();
        if (Array.isArray(data.missions)) {
          setMissions(data.missions);
        } else {
          setError("Failed to load missions");
        }
      } catch (err) {
        setError("Server error, please try again");
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  const handlePrint = (mission) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Mission Order — ${mission.title}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, sans-serif; padding: 50px; color: #1a2340; }

            .doc-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #1a2340;
            }
            .doc-header h1 { font-size: 26px; font-weight: 800; }
            .doc-header p  { font-size: 12px; color: #8a93a8; margin-top: 4px; }
            .doc-header .company { text-align: right; font-size: 13px; color: #4a6cf7; font-weight: 700; }

            .badge {
              display: inline-block;
              padding: 4px 14px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 700;
              text-transform: capitalize;
            }
            .approved { background: #e8f8f1; color: #2e9b6a; }
            .pending  { background: #fff5e6; color: #c07b10; }
            .rejected { background: #fdecea; color: #c0392b; }

            .section {
              margin-bottom: 28px;
            }
            .section-title {
              font-size: 11px;
              font-weight: 700;
              color: #8a93a8;
              text-transform: uppercase;
              letter-spacing: 0.8px;
              margin-bottom: 12px;
              padding-bottom: 6px;
              border-bottom: 1px solid #f0f2f8;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              font-size: 13px;
              border-bottom: 1px solid #f8f9fd;
            }
            .row .label { color: #8a93a8; font-weight: 500; }
            .row .value { font-weight: 600; color: #1a2340; }

            .footer {
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e0e4f0;
              display: flex;
              justify-content: space-between;
            }
            .sign-box { text-align: center; width: 200px; }
            .sign-line { border-top: 1px solid #1a2340; margin: 50px auto 8px; }
            .sign-label { font-size: 12px; color: #8a93a8; }
          </style>
        </head>
        <body>
          <div class="doc-header">
            <div>
              <h1>Mission Order</h1>
              <p>Official document — Generated on ${new Date().toLocaleDateString("en-GB", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>
            <div class="company">Mission Management Platform</div>
          </div>

          <div class="section">
            <div class="section-title">Mission Information</div>
            <div class="row"><span class="label">Title</span><span class="value">${mission.title}</span></div>
            <div class="row"><span class="label">Destination</span><span class="value">${mission.destination}</span></div>
            <div class="row"><span class="label">Start Date</span><span class="value">${mission.start_date}</span></div>
            <div class="row"><span class="label">End Date</span><span class="value">${mission.end_date}</span></div>
            <div class="row"><span class="label">Objectives</span><span class="value">${mission.objectives}</span></div>
            <div class="row"><span class="label">Status</span><span class="value"><span class="badge ${mission.status}">${mission.status}</span></span></div>
            <div class="row"><span class="label">Approved Date</span><span class="value">${mission.approved_date || "N/A"}</span></div>
          </div>

          <div class="section">
            <div class="section-title">Employee Information</div>
            <div class="row"><span class="label">Employee</span><span class="value">${mission.assigned_to_name}</span></div>
            <div class="row"><span class="label">Created By</span><span class="value">${mission.created_by_name}</span></div>
            <div class="row"><span class="label">Department</span><span class="value">${mission.department_name || "N/A"}</span></div>
          </div>

          ${mission.booked ? `
          <div class="section">
            <div class="section-title">Booking Details</div>
            <div class="row"><span class="label">Accommodation</span><span class="value">${mission.accomodation || "N/A"}</span></div>
            <div class="row"><span class="label">Transport</span><span class="value">${mission.transport || "N/A"}</span></div>
            <div class="row"><span class="label">Food</span><span class="value">${mission.food || "N/A"}</span></div>
          </div>
          ` : `
          <div class="section">
            <div class="section-title">Booking Details</div>
            <div class="row"><span class="label">Status</span><span class="value">Not booked yet</span></div>
          </div>
          `}

          <div class="footer">
            <div class="sign-box">
              <div class="sign-line"></div>
              <div class="sign-label">Employee Signature</div>
            </div>
            <div class="sign-box">
              <div class="sign-line"></div>
              <div class="sign-label">Manager Signature</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const total    = missions.length;
  const approved = missions.filter(m => m.status === "approved").length;
  const pending  = missions.filter(m => m.status === "pending").length;
  const rejected = missions.filter(m => m.status === "rejected").length;

  const filtered =
    activeTab === "approved" ? missions.filter(m => m.status === "approved") :
    activeTab === "pending"  ? missions.filter(m => m.status === "pending")  :
    activeTab === "rejected" ? missions.filter(m => m.status === "rejected") :
    missions;

  if (loading) return <div className="emp-page"><p>Loading missions...</p></div>;
  if (error)   return <div className="emp-page"><p style={{ color: "red" }}>{error}</p></div>;

  return (
    <div className="emp-page">

      {/* ── Header ── */}
      <div className="emp-header">
        <div>
          <h1 className="emp-greeting">Welcome, {user?.first_name} 👋</h1>
          <p className="emp-sub">Here are your assigned missions.</p>
        </div>
        <span className="emp-date">
          {new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* ── Stats Cards ── */}
      <div className="emp-cards">
        <div className="emp-card emp-card--blue">
          <div className="emp-card__top">
            <span className="emp-card__label">Total Missions</span>
            <span className="emp-card__arrow">↗</span>
          </div>
          <p className="emp-card__value">{total}</p>
          <p className="emp-card__sub">All assigned</p>
        </div>
        <div className="emp-card">
          <div className="emp-card__top">
            <span className="emp-card__label">Approved</span>
            <span className="emp-card__arrow">↗</span>
          </div>
          <p className="emp-card__value">{approved}</p>
          <p className="emp-card__sub emp-card__sub--green">✓ Ready to go</p>
        </div>
        <div className="emp-card">
          <div className="emp-card__top">
            <span className="emp-card__label">Pending</span>
            <span className="emp-card__arrow">↗</span>
          </div>
          <p className="emp-card__value">{pending}</p>
          <p className="emp-card__sub emp-card__sub--amber">⏳ Awaiting approval</p>
        </div>
        <div className="emp-card">
          <div className="emp-card__top">
            <span className="emp-card__label">Rejected</span>
            <span className="emp-card__arrow">↗</span>
          </div>
          <p className="emp-card__value">{rejected}</p>
          <p className="emp-card__sub emp-card__sub--red">✕ Not approved</p>
        </div>
      </div>

      {/* ── Missions Table ── */}
      <div className="emp-section">
        <div className="emp-section__header">
          <p className="emp-section__title">My Missions</p>
          <div className="emp-tabs">
            {["all", "approved", "pending", "rejected"].map(tab => (
              <button
                key={tab}
                className={`emp-tab ${activeTab === tab ? "emp-tab--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p style={{ color: "#8a93a8", fontSize: "13px", padding: "1rem 0" }}>
            No missions found.
          </p>
        ) : (
          <table className="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Destination</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
                <th>Booked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.mission_id}>
                  <td style={{ color: "#aab0c0", fontSize: "12px" }}>{i + 1}</td>
                  <td className="emp-table__name">{m.title}</td>
                  <td>{m.destination}</td>
                  <td>{m.start_date}</td>
                  <td>{m.end_date}</td>
                  <td>
                    <span className={`emp-badge emp-badge--${m.status}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>
                    <span className={`emp-badge ${m.booked ? "emp-badge--booked" : "emp-badge--notbooked"}`}>
                      {m.booked ? "Booked ✓" : "Not Booked"}
                    </span>
                  </td>
                  <td>
                    <div className="emp-actions">
                      <button
                        className="emp-btn emp-btn--view"
                        onClick={() => setSelectedMission(m)}
                      >
                        View
                      </button>
                      {m.status === "approved" && (
                        <button
                          className="emp-btn emp-btn--print"
                          onClick={() => handlePrint(m)}
                        >
                          🖨 Print
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Mission Detail Modal ── */}
      {selectedMission && (
        <div className="emp-modal-overlay" onClick={() => setSelectedMission(null)}>
          <div className="emp-modal" onClick={e => e.stopPropagation()}>

            <div className="emp-modal__header">
              <h2>{selectedMission.title}</h2>
              <button className="emp-modal__close" onClick={() => setSelectedMission(null)}>✕</button>
            </div>

            <div className="emp-modal__body">
              <div className="emp-modal__section">
                <h3>Mission Details</h3>
                <div className="emp-modal__row"><span>Destination</span><span>{selectedMission.destination}</span></div>
                <div className="emp-modal__row"><span>Start Date</span><span>{selectedMission.start_date}</span></div>
                <div className="emp-modal__row"><span>End Date</span><span>{selectedMission.end_date}</span></div>
                <div className="emp-modal__row"><span>Objectives</span><span>{selectedMission.objectives}</span></div>
                <div className="emp-modal__row"><span>Created By</span><span>{selectedMission.created_by_name}</span></div>
                <div className="emp-modal__row">
                  <span>Status</span>
                  <span className={`emp-badge emp-badge--${selectedMission.status}`}>
                    {selectedMission.status}
                  </span>
                </div>
                <div className="emp-modal__row">
                  <span>Approved Date</span>
                  <span>{selectedMission.approved_date || "N/A"}</span>
                </div>
              </div>

              <div className="emp-modal__section">
                <h3>Booking Details</h3>
                {selectedMission.booked ? (
                  <>
                    <div className="emp-modal__row"><span>Accommodation</span><span>{selectedMission.accomodation || "N/A"}</span></div>
                    <div className="emp-modal__row"><span>Transport</span><span>{selectedMission.transport || "N/A"}</span></div>
                    <div className="emp-modal__row"><span>Food</span><span>{selectedMission.food || "N/A"}</span></div>
                  </>
                ) : (
                  <p style={{ color: "#8a93a8", fontSize: "13px", padding: "8px 0" }}>
                    No booking yet for this mission.
                  </p>
                )}
              </div>
            </div>

            <div className="emp-modal__footer">
              <button
                className="emp-btn emp-btn--view"
                onClick={() => setSelectedMission(null)}
              >
                Close
              </button>
              {selectedMission.status === "approved" && (
                <button
                  className="emp-btn emp-btn--print"
                  onClick={() => handlePrint(selectedMission)}
                >
                  🖨 Print Mission Order
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}