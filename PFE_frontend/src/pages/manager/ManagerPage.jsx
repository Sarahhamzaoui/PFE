import React, { useState, useEffect } from 'react';
import './ManagerPage.css';
import MissionDetailModal from '../../components/MissionDetailModal';

const BASE_URL = "http://localhost/mission-system/PFE_backend/api";

function ManagerMissions() {

  const [tab, setTab] = useState('queue');
  const [history, setHistory] = useState([]);
  const [queue, setQueue] = useState([]);
  const [idx, setIdx] = useState(0);
  const [modal, setModal] = useState(null); // { index, attachments } or null
  const [rejectModal, setRejectModal] = useState(false);
  const [rejNote, setRejNote] = useState('');
  const [histSearch, setHistSearch] = useState('');
  const [histDate, setHistDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Get logged-in manager
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch all missions from the API on mount
  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/missions/missions.php?role=manager`);
      const data = await res.json();

      // Split into queue (pending) and history (approved/rejected)
      const pending  = data.missions.filter(m => m.status === 'pending')
        .sort((a, b) => b.is_urgent - a.is_urgent);
      const reviewed = data.missions.filter(m => m.status !== 'pending');

      setQueue(pending);
      setHistory(reviewed);
    } catch (err) {
      console.error(err);
      alert("Failed to load missions.");
    } finally {
      setLoading(false);
    }
  };

  // Opens the detail modal — fetches attachments first, then sets modal state
  const handleViewMission = async (index) => {
    const mission = filteredHistory[index];
    try {
      // fetch attachments for this specific mission
      const res = await fetch(`${BASE_URL}/missions/attachments.php?mission_id=${mission.mission_id}`);
      const data = await res.json();
      // modal is an object: { index, attachments }
      setModal({ index, attachments: data.attachments || [] });
    } catch (err) {
      console.error(err);
      // still open the modal even if attachments fail
      setModal({ index, attachments: [] });
    }
  };

  // Approve or reject a mission from the queue — calls the PUT endpoint
  const decide = async (decision, note) => {
    const mission = queue[idx];
    try {
      const res = await fetch(`${BASE_URL}/missions/missions.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mission_id:   mission.mission_id,
          status:       decision === 'approved' ? 'approved' : 'rejected',
          validated_by: user?.user_id,
        }),
      });

      const result = await res.json();
      if (res.ok) {
        // Move mission from queue to history locally
        const newEntry = { ...mission, status: decision === 'approved' ? 'approved' : 'rejected', note };
        setHistory(prev => [newEntry, ...prev]);
        const newQueue = [...queue];
        newQueue.splice(idx, 1);
        setQueue(newQueue);
        if (idx >= newQueue.length && idx > 0) setIdx(newQueue.length - 1);
      } else {
        alert(result.message || "Failed to update mission.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, please try again.");
    }
  };

  // Allows the manager to flip a past decision from the history modal
  const updateDecision = async (decision, note) => {
    const mission = history[modal.index]; // ← modal.index not modal
    try {
      const res = await fetch(`${BASE_URL}/missions/missions.php`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mission_id:   mission.mission_id,
          status:       decision,
          validated_by: user?.user_id,
        }),
      });

      if (res.ok) {
        // update the history entry locally with the new decision
        const updated = [...history];
        updated[modal.index] = { ...updated[modal.index], status: decision, note }; // ← modal.index
        setHistory(updated);
        setModal(null); // close modal
      }
    } catch (err) {
      console.error(err);
      alert("Server error, please try again.");
    }
  };

  // filteredHistory applies name search and date filter
  const filteredHistory = history.filter(m => {
    const matchName = m.title.toLowerCase().includes(histSearch.toLowerCase());
    const matchDate = histDate === '' || m.created_at?.startsWith(histDate);
    return matchName && matchDate;
  });

  // Derived values for stat cards and progress bar
  const approved = history.filter(m => m.status === 'approved').length;
  const rejected  = history.filter(m => m.status === 'rejected').length;
  const pending   = queue.length;
  const totalAll  = history.length + queue.length;
  const doneAll   = history.length;
  const pct       = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  // AttachPill renders a single file attachment badge
  const AttachPill = ({ file }) => (
    <div className="attach-pill">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
      {file}
    </div>
  );

  if (loading) return <div style={{ padding: '2rem' }}>Loading missions...</div>;

  return (
    <div className="manager-wrap">

      {/* Tab switcher — Queue and History */}
      <div className="manager-tabs">
        <div className={`tab ${tab === 'queue' ? 'active' : ''}`} onClick={() => setTab('queue')}>
          Queue
        </div>
        <div className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
          History
        </div>
      </div>

      {/* QUEUE TAB */}
      {tab === 'queue' && (
        <>
          {/* Summary stat cards */}
          <div className="manager-stats">
            <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-val">{pending}</div></div>
            <div className="stat-card"><div className="stat-label">Approved</div><div className="stat-val green">{approved}</div></div>
            <div className="stat-card"><div className="stat-label">Rejected</div><div className="stat-val red">{rejected}</div></div>
          </div>

          {/* Progress bar showing how many missions reviewed */}
          <div className="progress-row">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-label">{doneAll} of {totalAll} reviewed</span>
          </div>

          {/* Empty state — shown when all missions are reviewed */}
          {idx >= queue.length ? (
            <div className="done-state">
              <div className="done-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="#27500A" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <h2>All missions reviewed</h2>
              <p>No more missions in the queue.</p>
            </div>
          ) : (
            <>
              {/* Prev / Next navigation */}
              <div className="nav-row">
                <button className="nav-btn" disabled={idx === 0} onClick={() => setIdx(i => i - 1)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Previous
                </button>
                <span className="nav-counter">{idx + 1} / {queue.length}</span>
                <button className="nav-btn" disabled={idx >= queue.length - 1} onClick={() => setIdx(i => i + 1)}>
                  Next
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>

              {/* Current mission card */}
              <div className="mission-card">
                <div className="card-header">
                  <div>
                    <div className="card-title">
                      {/* Urgent badge — only shown if mission is urgent */}
                      {queue[idx].is_urgent == 1 && (
                        <span style={{ background: '#E05252', color: 'white', fontSize: '11px', padding: '2px 8px', borderRadius: '4px', marginRight: '8px' }}>
                          URGENT
                        </span>
                      )}
                      {queue[idx].title}
                    </div>
                    <div className="card-sub">
                      Submitted by {queue[idx].created_by_name} · {queue[idx].sent_date}
                    </div>
                  </div>
                </div>

                <div className="card-fields">
                  <div><div className="field-label">Destination</div><div className="field-val">{queue[idx].destination}</div></div>
                  <div><div className="field-label">Start date</div><div className="field-val">{queue[idx].start_date}</div></div>
                  <div><div className="field-label">End date</div><div className="field-val">{queue[idx].end_date}</div></div>
                  <div><div className="field-label">Assigned to</div><div className="field-val">{queue[idx].assigned_to_name || 'N/A'}</div></div>
                </div>

                <div className="card-desc"><p>{queue[idx].objectives}</p></div>

                {/* Approve / Reject buttons */}
                <div className="card-actions">
                  <button className="btn-reject" onClick={() => { setRejectModal(true); setRejNote(''); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Reject
                  </button>
                  <button className="btn-approve" onClick={() => decide('approved', '')}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Approve
                  </button>
                </div>
              </div>

              {/* Queue peek — shows remaining missions below the current card */}
              {queue.slice(idx + 1).length > 0 && (
                <div className="queue-peek">
                  <div className="peek-label">Up next in queue</div>
                  {queue.slice(idx + 1).map(m => (
                    <div key={m.mission_id} className="peek-item">
                      <span className="peek-name">{m.title}</span>
                      <span className="peek-date">{m.start_date}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* HISTORY TAB */}
      {tab === 'history' && (
        <>
          {/* Search and date filters */}
          <div className="hist-filters">
            <input
              type="text"
              placeholder="Search by mission name..."
              value={histSearch}
              onChange={e => setHistSearch(e.target.value)}
            />
            <input
              type="date"
              value={histDate}
              onChange={e => setHistDate(e.target.value)}
            />
          </div>

          {/* History table */}
          <div className="tbl-wrap">
            {filteredHistory.length === 0 ? (
              <div className="no-results">No missions match your search.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Mission</th>
                    <th>assigned to</th>
                    <th>Date</th>
                    <th>Decision</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((m, i) => (
                    <tr key={m.mission_id}>
                      <td className="td-title">{m.title}</td>
                      <td className="td-muted">{m.created_by_name}</td>
                      <td className="td-muted">{m.start_date}</td>
                      <td>
                        <span className={`decision-badge ${m.status === 'approved' ? 'app' : 'rej'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td>
                        {/* clicking View fetches attachments then opens modal */}
                        <button className="view-btn" onClick={() => handleViewMission(i)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/* REJECT CLARIFICATION MODAL */}
      {rejectModal && (
        <div className="overlay">
          <div className="rej-modal">
            <div className="modal-header">
              <div className="modal-title">Rejection reason</div>
              {/* Close without rejecting */}
              <button className="close-btn" onClick={() => setRejectModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            <p className="rej-sub">
              This will be sent as a notification to the secretary. Please explain why this mission is being rejected.
            </p>

            <textarea
              className="rej-textarea"
              placeholder="e.g. Missing required documents, conflicts with another mission..."
              value={rejNote}
              onChange={e => setRejNote(e.target.value)}
            />

            <div className="rej-actions">
              <button className="btn-cancel" onClick={() => setRejectModal(false)}>Cancel</button>
              <button className="btn-reject" onClick={() => { setRejectModal(false); decide('rejected', rejNote); }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Send rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY DETAIL MODAL */}
      {/* modal is { index, attachments } — use modal.index to get the mission */}
      {modal !== null && filteredHistory[modal.index] && (
        <MissionDetailModal
          mission={{
            ...filteredHistory[modal.index],
            // map DB column names to what MissionDetailModal expects
            title:      filteredHistory[modal.index].title,
            secretary:  filteredHistory[modal.index].created_by_name,
            dateLabel:  filteredHistory[modal.index].sent_date,
            decision:   filteredHistory[modal.index].status,
            note:       filteredHistory[modal.index].note || '',
            attachments: modal.attachments,
            dept:       filteredHistory[modal.index].department_name  || 'N/A',
            deadline:   filteredHistory[modal.index].end_date         || 'N/A',
            assignedTo: filteredHistory[modal.index].assigned_to_name || 'N/A',
            location:   filteredHistory[modal.index].destination      || 'N/A',
            desc:       filteredHistory[modal.index].objectives       || '',
          }}
          onClose={() => setModal(null)}
          role="manager"
          onUpdateDecision={(decision, note) => updateDecision(decision, note)}
        />
      )}

    </div>
  );
}

export default ManagerMissions;