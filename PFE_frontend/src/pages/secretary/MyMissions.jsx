import React, { useState, useEffect } from "react";
import "./MyMissions.css";
import MissionDetailModal from "../../components/MissionDetailModal";

const BASE_URL = "http://localhost/mission-system/PFE_backend/api";

export default function MyMissions({ setActivePage }) {
  const [allMissions, setAllMissions] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState("All missions");
  const [search, setSearch]           = useState("");
  const [selectedMission, setSelectedMission] = useState(null);

  // get the logged-in secretary from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  // fetch missions on mount
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res  = await fetch(
          `${BASE_URL}/missions/missions.php?role=secretary&user_id=${user?.user_id}`
        );
        const data = await res.json();
        setAllMissions(data.missions || []);

        // keep localStorage in sync for offline fallback
        localStorage.setItem("my_missions", JSON.stringify(data.missions || []));
      } catch (err) {
        console.error(err);
        // fallback: use whatever was saved locally if the api is unreachable
        const local = JSON.parse(localStorage.getItem("my_missions") || "[]");
        setAllMissions(local);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // stat card counts — api returns lowercase statuses
  const total    = allMissions.length;
  const approved = allMissions.filter(m => m.status === "approved").length;
  const pending  = allMissions.filter(m => m.status === "pending").length;
  const urgent   = allMissions.filter(m => m.is_urgent == 1).length;

  // tab + search filtering
  const TABS = ["All missions", "Pending", "Approved", "Rejected"];

  const filtered = allMissions.filter(m => {
    // match the selected tab against the mission status
    const matchTab =
      activeTab === "All missions" ||
      m.status?.toLowerCase() === activeTab.toLowerCase();

    // search across employee name, destination, and mission id
    const matchSearch =
      m.assigned_to_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.destination?.toLowerCase().includes(search.toLowerCase()) ||
      String(m.mission_id).includes(search);

    return matchTab && matchSearch;
  });

  // map api status to the css badge modifier
  const badgeClass = (status) => {
    if (status === "approved") return "mm-badge--active";
    if (status === "rejected") return "mm-badge--urgent";
    return "mm-badge--pending"; // pending is the default
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading your missions...</div>;

  return (
    <div className="mm-page">

      {/* page header with the new mission button */}
      <div className="mm-header">
        <h1 className="mm-title">My Missions</h1>
        <button
          className="mm-btn-primary"
          onClick={() => setActivePage("create-mission-page")}
        >
          + New Mission
        </button>
      </div>

      {/* summary stat cards */}
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

      {/* table card — contains tabs, search bar, and the missions table */}
      <div className="mm-table-card">

        {/* tab switcher */}
        <div className="mm-tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`mm-tab ${activeTab === tab ? "mm-tab--active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* search bar and row count */}
        <div className="mm-toolbar">
          <div className="mm-search-wrap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aab0c0" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              className="mm-search"
              placeholder="Search missions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <span className="mm-count">{filtered.length} missions</span>
          
        </div>

        {/* missions table */}
        <table className="mm-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Mission ID</th>
              <th>Employee</th>
              <th>Destination</th>
              <th>Start date</th>
              <th>Status</th>
             
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.mission_id}>
                <td className="mm-table__num">{i + 1}</td>
                <td className="mm-table__id">{m.mission_id}</td>

                {/* show assigned employee name, fall back to creator if not assigned */}
                <td className="mm-table__name">
                  {m.assigned_to_name || m.created_by_name || "—"}
                </td>

                <td>{m.destination}</td>
                <td>{m.start_date}</td>

                {/* status badge — capitalize first letter for display */}
                <td>
                  <span className={`mm-badge ${badgeClass(m.status)}`}>
                    {m.status?.charAt(0).toUpperCase() + m.status?.slice(1)}
                  </span>
                </td>

                
                <td>
                  {/* opens the read-only detail modal */}
                  <button
                    className="mm-action-btn"
                    onClick={() => setSelectedMission(m)}
                  >
                    View ›
                  </button>
                </td>
              </tr>
            ))}

            {/* empty state when no missions match the filter */}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="mm-empty">No missions found.</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

      {/* mission detail modal — maps api field names to what MissionDetailModal expects */}
      {selectedMission && (
        <MissionDetailModal
          mission={{
            ...selectedMission,
            title:       selectedMission.title,
            secretary:   selectedMission.created_by_name,
            dateLabel:   selectedMission.start_date,
            decision:    selectedMission.status,
            note:        selectedMission.manager_note || "",
            dept:        selectedMission.department_name  || "N/A",
            deadline:    selectedMission.end_date         || "N/A",
            assignedTo:  selectedMission.assigned_to_name || "N/A",
            location:    selectedMission.destination      || "N/A",
            desc:        selectedMission.objectives       || "",
            attachments: [],
             accommodation: selectedMission.accommodation || '',
              transport:      selectedMission.transport     || '',
            needs_driver:   selectedMission.needs_driver  || 0,
            }}
          onClose={() => setSelectedMission(null)}
          role="employee"
        />
      )}

    </div>
  );
}