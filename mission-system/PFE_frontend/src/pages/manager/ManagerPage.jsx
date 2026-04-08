import React, { useState } from 'react';
import './ManagerPage.css';
import MissionDetailModal from '../../components/MissionDetailModal';

// Static Data


const historyData = [
  { id: 1, title: 'Monthly audit — finance division', secretary: 'Sara Malik', date: '2026-03-25', dateLabel: 'Mar 25, 2026', priority: 'high', priLabel: 'High priority', dept: 'Finance', deadline: 'Mar 31, 2026', assignedTo: 'Audit team', location: 'Finance dept', desc: 'Carry out the monthly financial audit. Review all transactions, expense reports, and budget allocations.', attachments: ['audit-template.xlsx'], decision: 'approved', note: '' },
  { id: 2, title: 'Staff training session — HR dept', secretary: 'Lina Boudra', date: '2026-03-25', dateLabel: 'Mar 25, 2026', priority: 'low', priLabel: 'Low priority', dept: 'Human Resources', deadline: 'Apr 10, 2026', assignedTo: 'HR team', location: 'HQ — Room 204', desc: 'Organize and run the quarterly staff training session covering compliance updates and safety procedures.', attachments: ['training-agenda.docx'], decision: 'rejected', note: 'Conflicts with audit week. Please reschedule to April 14.' },
  { id: 3, title: 'Equipment maintenance — warehouse 3', secretary: 'Karim Ouali', date: '2026-03-26', dateLabel: 'Mar 26, 2026', priority: 'med', priLabel: 'Medium priority', dept: 'Logistics', deadline: 'Apr 5, 2026', assignedTo: 'Maintenance team', location: 'Warehouse 3', desc: 'Perform scheduled maintenance on all heavy equipment in warehouse 3.', attachments: ['maintenance-schedule.pdf'], decision: 'approved', note: '' },
  { id: 4, title: 'Site inspection — northern district', secretary: 'Sara Malik', date: '2026-03-26', dateLabel: 'Mar 26, 2026', priority: 'high', priLabel: 'High priority', dept: 'Operations', deadline: 'Apr 2, 2026', assignedTo: 'Field team B', location: 'Northern district', desc: 'Conduct a full site inspection of the northern district facilities.', attachments: ['site-brief.pdf', 'checklist-v2.docx'], decision: 'approved', note: '' },
];

// Missions waiting to be reviewed 
const queueData = [
  { id: 5, title: 'Procurement review — IT supplies', secretary: 'Karim Ouali', date: '2026-03-26', dateLabel: 'Mar 26, 2026', priority: 'med', priLabel: 'Medium priority', dept: 'IT', deadline: 'Apr 8, 2026', assignedTo: 'Procurement team', location: 'HQ', desc: 'Review all pending IT supply procurement requests for Q2. Approve or flag items exceeding the budget threshold.', attachments: ['procurement-list.xlsx'] },
  { id: 6, title: 'Security assessment — main entrance', secretary: 'Sara Malik', date: '2026-03-26', dateLabel: 'Mar 26, 2026', priority: 'high', priLabel: 'High priority', dept: 'Security', deadline: 'Apr 3, 2026', assignedTo: 'Security team', location: 'Main entrance', desc: 'Full security assessment of the main entrance including CCTV review and access logs.', attachments: ['security-report.pdf'] },
  { id: 7, title: 'Budget forecast — Q2 planning', secretary: 'Lina Boudra', date: '2026-03-26', dateLabel: 'Mar 26, 2026', priority: 'med', priLabel: 'Medium priority', dept: 'Finance', deadline: 'Apr 12, 2026', assignedTo: 'Finance team', location: 'HQ', desc: 'Prepare and submit Q2 budget forecast based on Q1 actuals and projected growth targets.', attachments: ['forecast-template.xlsx'] },
];


function ManagerMissions() {

  // Which tab is active  'queue' or 'history'
  const [tab, setTab] = useState('queue');

  // History list starts reversed so newest appears first
  const [history, setHistory] = useState([...historyData].reverse());

  // Queue list  missions waiting to be reviewed
  const [queue, setQueue] = useState([...queueData]);

  // Index of the currently displayed mission in the queue
  // prev/next buttons increment or decrement this
  const [idx, setIdx] = useState(0);

  // Running counts of approved and rejected decisions
  const [approved, setApproved] = useState(historyData.filter(m => m.decision === 'approved').length);
  const [rejected, setRejected] = useState(historyData.filter(m => m.decision === 'rejected').length);

  // Index of the mission currently open in the history detail modal (null = closed)
  const [modal, setModal] = useState(null);



  // Controls visibility of the reject clarification modal
  const [rejectModal, setRejectModal] = useState(false);

  // The rejection reason the manager types before confirming rejection
  const [rejNote, setRejNote] = useState('');

  // History search filter — filters by mission name
  const [histSearch, setHistSearch] = useState('');

  // History date filter — filters by exact date string (YYYY-MM-DD)
  const [histDate, setHistDate] = useState('');

  // Handlers 

  // 
  // Moves the mission from the queue into history, updates counters
  const decide = (decision, note) => {
    const m = queue[idx];

    // Add the mission to the top of history with the decision and note attached
    const newEntry = { ...m, decision, note };
    setHistory(prev => [newEntry, ...prev]);

    // Remove the mission from the queue
    const newQueue = [...queue];
    newQueue.splice(idx, 1);
    setQueue(newQueue);

    // Update the relevant counter
    if (decision === 'approved') setApproved(prev => prev + 1);
    else setRejected(prev => prev + 1);

    // If we were on the last item and the queue shrunk, clamp the index
    if (idx >= newQueue.length && idx > 0) setIdx(newQueue.length);
  };

  // updateDecision 
  // Allows the manager to flip a past decision between approved and rejected
 const updateDecision = (decision, note) => {
    const old = history[modal].decision;
    if (old === 'approved' && decision === 'rejected') { setApproved(a => a - 1); setRejected(r => r + 1); }
    if (old === 'rejected' && decision === 'approved') { setRejected(r => r - 1); setApproved(a => a + 1); }
    const updated = [...history];
    updated[modal] = { ...updated[modal], decision, note };
    setHistory(updated);
    setModal(null);
};
  // filteredHistory applies name search and date filter to the history list
  const filteredHistory = history.filter(m => {
    const matchName = m.title.toLowerCase().includes(histSearch.toLowerCase());
    const matchDate = histDate === '' || m.date === histDate;
    return matchName && matchDate;
  });

  //  Derived values

  // Total missions across both queue and history
  const totalAll = history.length + queue.length;

  // How many have been reviewed so far (history + how far into queue we are)
  const doneAll = history.length + idx;

  // Progress bar percentage
  const pct = Math.round((doneAll / totalAll) * 100);

  // How many missions are still pending in the queue
  const pending = Math.max(0, queue.length - idx);

  // Sub components

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

 

  return (
    <div className="manager-wrap">

     

      {/* Tab switcher  Queue and History */}
      <div className="manager-tabs">
        <div className={`tab ${tab === 'queue' ? 'active' : ''}`} onClick={() => setTab('queue')}>
          Queue 
        </div>
        <div className={`tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}>
          History 
        </div>
      </div>

      {/*  QUEUE TAB  */}
      {tab === 'queue' && (
        <>
          {/* Summary stat cards */}
          <div className="manager-stats">
            <div className="stat-card"><div className="stat-label">Pending</div><div className="stat-val">{pending}</div></div>
            <div className="stat-card"><div className="stat-label">Approved</div><div className="stat-val green">{approved}</div></div>
            <div className="stat-card"><div className="stat-label">Rejected</div><div className="stat-val red">{rejected}</div></div>
          </div>

          {/* Progress bar showing how many missions reviewed today */}
          <div className="progress-row">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-label">{doneAll} of {totalAll} reviewed</span>
          </div>

          {/* Empty state — shown when the manager finishes all missions */}
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
              {/* Prev / Next navigation — lets the manager skip missions */}
              <div className="nav-row">
                <button
                  className="nav-btn"
                  disabled={idx === 0}
                  onClick={() => setIdx(i => i - 1)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Previous
                </button>

                {/* Shows current position in the queue  */}
                <span className="nav-counter">{idx + 1} / {queue.length}</span>

                <button
                  className="nav-btn"
                  disabled={idx >= queue.length - 1}
                  onClick={() => setIdx(i => i + 1)}
                >
                  Next
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>

              {/* Current mission card */}
              <div className="mission-card">

                {/* Mission title, submitter info and priority badge */}
                <div className="card-header">
                  <div>
                    <div className="card-title">{queue[idx].title}</div>
                    <div className="card-sub">Submitted by {queue[idx].secretary} · {queue[idx].dateLabel}</div>
                  </div>
                  <span className={`priority ${queue[idx].priority}`}>{queue[idx].priLabel}</span>
                </div>

                {/* Mission metadata in a 2-column grid */}
                <div className="card-fields">
                  <div><div className="field-label">Department</div><div className="field-val">{queue[idx].dept}</div></div>
                  <div><div className="field-label">Deadline</div><div className="field-val">{queue[idx].deadline}</div></div>
                  <div><div className="field-label">Assigned to</div><div className="field-val">{queue[idx].assignedTo}</div></div>
                  <div><div className="field-label">Location</div><div className="field-val">{queue[idx].location}</div></div>
                </div>

                {/* Mission description */}
                <div className="card-desc"><p>{queue[idx].desc}</p></div>

                {/* Attached files */}
                <div className="card-attachments">
                  {queue[idx].attachments.map((f, i) => <AttachPill key={i} file={f} />)}
                </div>

                {/* Approve , Reject buttons
                     Approve calls decide immediately
                     Reject  opens the reject clarification modal first */}
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

              {/* Queue peek — shows the remaining missions below the current card */}
              {queue.slice(idx + 1).length > 0 && (
                <div className="queue-peek">
                  <div className="peek-label">Up next in queue</div>
                  {queue.slice(idx + 1).map(m => (
                    <div key={m.id} className="peek-item">
                      <span className="peek-name">{m.title}</span>
                      <span className="peek-date">{m.dateLabel}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/*  HISTORY TAB */}
      {tab === 'history' && (
        <>
          {/* Search and date filters */}
          <div className="hist-filters">
            {/* Name search — filters history by mission title */}
            <input
              type="text"
              placeholder="Search by mission name..."
              value={histSearch}
              onChange={e => setHistSearch(e.target.value)}
            />
            {/* Date filter — filters history by exact date */}
            <input
              type="date"
              value={histDate}
              onChange={e => setHistDate(e.target.value)}
            />
          </div>

          {/* History table */}
          <div className="tbl-wrap">
            {filteredHistory.length === 0 ? (
              // Empty state when no results match the filters
              <div className="no-results">No missions match your search.</div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Mission</th>
                    <th>Secretary</th>
                    <th>Date</th>
                    <th>Decision</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((m) => {
                    // Get the real index in history array for modal reference
                    const realIdx = history.indexOf(m);
                    return (
                      <tr key={m.id}>
                        <td className="td-title">{m.title}</td>
                        <td className="td-muted">{m.secretary}</td>
                        <td className="td-muted">{m.dateLabel}</td>
                        <td>
                          {/* Green for approved, red for rejected */}
                          <span className={`decision-badge ${m.decision === 'approved' ? 'app' : 'rej'}`}>
                            {m.decision}
                          </span>
                        </td>
                        <td>
                          {/* View button — opens the detail modal for this mission */}
                          <button
                            className="view-btn"
                           onClick={() => setModal(realIdx)}
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {/*  REJECT CLARIFICATION MODAL  */}
      {/* Opens when the manager clicks Reject on a queue mission*/}
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

            {/* Rejection reason textarea */}
            <textarea
              className="rej-textarea"
              placeholder="e.g. Missing required documents, conflicts with another mission, budget not approved..."
              value={rejNote}
              onChange={e => setRejNote(e.target.value)}
            />

            <div className="rej-actions">
              {/* Cancel — closes the modal without doing anything */}
              <button className="btn-cancel" onClick={() => setRejectModal(false)}>Cancel</button>

              {/* Confirm rejection — closes modal and calls decide() with the reason */}
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

      {/*  HISTORY DETAIL MODAL */}
      {modal !== null && history[modal] && (
        <MissionDetailModal
        mission={history[modal]}
        onClose={() => setModal (null)}
        role="manager"
        onUpdateDecision={(decision , note) => updateDecision(decision, note)}
        />
      )
      }

    </div>
  );
}

export default ManagerMissions;