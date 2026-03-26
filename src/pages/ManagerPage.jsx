import React, { useState } from 'react';
import '../Styles/ManagerPage.css';

const initialMissions = [
  {
    id: 1,
    title: 'Site inspection — northern district',
    secretary: 'Sara Malik',
    date: 'Mar 26, 2026 at 09:14',
    priority: 'High priority',
    department: 'Operations',
    deadline: 'Apr 2, 2026',
    assignedTo: 'Field team B',
    location: 'Northern district',
    description: 'Conduct a full site inspection of the northern district facilities. Check structural integrity, equipment status, and safety compliance. Submit findings report within 48h of completion.',
    attachments: ['site-brief.pdf', 'checklist-v2.docx'],
  },
  {
    id: 2,
    title: 'Equipment maintenance — warehouse 3',
    secretary: 'Karim Ouali',
    date: 'Mar 26, 2026 at 10:00',
    priority: 'Medium priority',
    department: 'Logistics',
    deadline: 'Apr 5, 2026',
    assignedTo: 'Maintenance team',
    location: 'Warehouse 3',
    description: 'Perform scheduled maintenance on all heavy equipment in warehouse 3. Document any issues found and flag critical repairs immediately.',
    attachments: ['maintenance-schedule.pdf'],
  },
  {
    id: 3,
    title: 'Staff training session — HR dept',
    secretary: 'Lina Boudra',
    date: 'Mar 25, 2026 at 14:30',
    priority: 'Low priority',
    department: 'Human Resources',
    deadline: 'Apr 10, 2026',
    assignedTo: 'HR team',
    location: 'HQ — Room 204',
    description: 'Organize and run the quarterly staff training session. Topics include compliance updates, safety procedures, and onboarding refreshers.',
    attachments: ['training-agenda.docx', 'slides-v1.pptx'],
  },
  {
    id: 4,
    title: 'Monthly audit — finance division',
    secretary: 'Sara Malik',
    date: 'Mar 25, 2026 at 08:45',
    priority: 'High priority',
    department: 'Finance',
    deadline: 'Mar 31, 2026',
    assignedTo: 'Audit team',
    location: 'Finance dept',
    description: 'Carry out the monthly financial audit. Review all transactions, expense reports, and budget allocations. Submit audit summary by end of month.',
    attachments: ['audit-template.xlsx'],
  },
];

function ManagerPage() {
  const [missions, setMissions] = useState(initialMissions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [note, setNote] = useState('');
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [done, setDone] = useState(false);

  const current = missions[currentIndex];
  const queue = missions.slice(currentIndex + 1);

  const handleDecision = (decision) => {
    if (decision === 'approve') setApproved(prev => prev + 1);
    if (decision === 'reject') setRejected(prev => prev + 1);
    setNote('');
    if (currentIndex + 1 >= missions.length) {
      setDone(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const getPriorityClass = (priority) => {
    if (priority === 'High priority') return 'priority high';
    if (priority === 'Medium priority') return 'priority medium';
    return 'priority low';
  };

  const reviewed = approved + rejected;
  const total = missions.length;
  const progressPct = Math.round((reviewed / total) * 100);

  if (done) {
    return (
      <div className="manager-wrap">
        <div className="done-state">
          <div className="done-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h2>All missions reviewed</h2>
          <p>You have processed all {total} missions for today.</p>
          <div className="done-stats">
            <div className="done-stat green"><span>{approved}</span> Approved</div>
            <div className="done-stat red"><span>{rejected}</span> Rejected</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="manager-wrap">

      {/* Header */}
      <div className="manager-topbar">
        <div>
          <h1>Mission queue</h1>
          <p>Review and validate incoming missions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="manager-stats">
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-val">{total - reviewed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Approved</div>
          <div className="stat-val green">{approved}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Rejected</div>
          <div className="stat-val red">{rejected}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-row">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPct}%` }}></div>
        </div>
        <span className="progress-label">{reviewed} of {total} reviewed today</span>
      </div>

      {/* Mission card */}
      <div className="mission-card">
        <div className="card-header">
          <div>
            <div className="card-title">{current.title}</div>
            <div className="card-sub">Submitted by {current.secretary} · {current.date}</div>
          </div>
          <span className={getPriorityClass(current.priority)}>{current.priority}</span>
        </div>

        <div className="card-fields">
          <div className="field">
            <div className="field-label">Department</div>
            <div className="field-val">{current.department}</div>
          </div>
          <div className="field">
            <div className="field-label">Deadline</div>
            <div className="field-val">{current.deadline}</div>
          </div>
          <div className="field">
            <div className="field-label">Assigned to</div>
            <div className="field-val">{current.assignedTo}</div>
          </div>
          <div className="field">
            <div className="field-label">Location</div>
            <div className="field-val">{current.location}</div>
          </div>
        </div>

        <div className="card-description">
          <p>{current.description}</p>
        </div>

        {current.attachments.length > 0 && (
          <div className="card-attachments">
            {current.attachments.map((file, i) => (
              <div key={i} className="attach-pill">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {file}
              </div>
            ))}
          </div>
        )}

        <div className="note-area">
          <div className="note-label">Note to secretary (optional)</div>
          <textarea
            placeholder="Add a reason or comment before deciding..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="card-actions">
          <button className="btn-reject" onClick={() => handleDecision('reject')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Reject
          </button>
          <button className="btn-approve" onClick={() => handleDecision('approve')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Approve
          </button>
        </div>
      </div>

      {/* Queue peek */}
      {queue.length > 0 && (
        <div className="queue-peek">
          <div className="peek-label">Up next in queue</div>
          {queue.map((m) => (
            <div key={m.id} className="peek-item">
              <span className="peek-name">{m.title}</span>
              <span className="peek-date">{m.date.split(' at')[0]}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default ManagerPage;