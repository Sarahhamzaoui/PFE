import { useState } from "react";
import "../Styles/MissionDetails.css";

const initialMission = {
  mission_id: 3,
  employee: "Hamzaoui Sarah",
  type: "Business Trip",
  destination: "Paris, France",
  start: "2024-07-01",
  end: "2024-07-10",
  status: "Approved",
  notes: "Flight and hotel booked. Awaiting final itinerary.",
};

export default function MissionDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [mission, setMission] = useState(initialMission);
  const [form, setForm] = useState(initialMission);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setMission(form);
    setIsEditing(false);
    // TODO: call your API here to persist changes
    // await fetch("/api/missions/update", { method: "POST", body: JSON.stringify(form) });
  };

  const handleCancel = () => {
    setForm(mission);
    setIsEditing(false);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1>Mission Details</h1>

        <div className="field">
          <strong>Mission ID:</strong> <span>{mission.mission_id}</span>
        </div>

        <div className="field">
          <strong>Employee Name:</strong>
          {isEditing ? (
            <input type="text" name="employee" value={form.employee} onChange={handleChange} />
          ) : (
            <span>{mission.employee}</span>
          )}
        </div>

        <div className="field">
          <strong>Mission Type:</strong>
          {isEditing ? (
            <input type="text" name="type" value={form.type} onChange={handleChange} />
          ) : (
            <span>{mission.type}</span>
          )}
        </div>

        <div className="field">
          <strong>Destination:</strong>
          {isEditing ? (
            <input type="text" name="destination" value={form.destination} onChange={handleChange} />
          ) : (
            <span>{mission.destination}</span>
          )}
        </div>

        <div className="field">
          <strong>Start Date:</strong>
          {isEditing ? (
            <input type="date" name="start" value={form.start} onChange={handleChange} />
          ) : (
            <span>{mission.start}</span>
          )}
        </div>

        <div className="field">
          <strong>End Date:</strong>
          {isEditing ? (
            <input type="date" name="end" value={form.end} onChange={handleChange} />
          ) : (
            <span>{mission.end}</span>
          )}
        </div>

        <div className="field">
          <strong>Status:</strong>
          {isEditing ? (
            <input type="text" name="status" value={form.status} onChange={handleChange} />
          ) : (
            <span>{mission.status}</span>
          )}
        </div>

        <div className="field">
          <strong>Notes:</strong>
          {isEditing ? (
            <textarea name="notes" value={form.notes} onChange={handleChange} />
          ) : (
            <span>{mission.notes}</span>
          )}
        </div>

        <div className="buttons">
          {!isEditing ? (
            <button className="update-btn" onClick={() => setIsEditing(true)}>Update</button>
          ) : (
            <>
              <button className="update-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}