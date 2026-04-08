import React, { useState } from 'react';
import './createMissionPage.css'; 
import EmployeeSelection from '../../components/EmployeeSelection';
import MissionDetailsForm from '../../components/MissionDetailsForm';
import AttachmentsDropzone from '../../components/AttachmentsDropzone';

const BASE_URL = "http://localhost/PFE/mission-system/PFE_backend/api";

function CreateMissionPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Gets called when the form is submitted
  const handleSubmit = async (data) => {
    console.log("Form data received:", data);
    // Get the logged-in secretary's user_id from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Basic validation
    if (!data.missionTitle || !data.destination || !data.startDate || !data.endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    // Build the payload matching your missions table columns
    const payload = {
      title:       data.missionTitle,
      destination: data.destination,
      start_date:  data.startDate,
      end_date:    data.endDate,
      objectives:  data.missionDescription,
      is_urgent: data.missionurgent ? 1 : 0,
      assigned_to: selectedEmployee?.id ?? null,
      created_by:  user?.user_id,
    };

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/missions/missions.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok) {
        alert("Mission created successfully!");
        setSelectedEmployee(null);
      } else {
        alert(result.message || "Failed to create mission.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedEmployee(null);
  };

  return (
    <div className="form-container">
      <div className="header">
        <h1>Create Mission</h1>
      </div>

      <EmployeeSelection onEmployeeSelect={setSelectedEmployee} />

      <MissionDetailsForm 
        selectedEmployee={selectedEmployee}
        onFormDataChange={handleSubmit}
      />
      <AttachmentsDropzone />

      {/* BUTTONS */}
      <div className="btn-group">
        <button type="button" className="btn btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-submit" form='mission-form' disabled={loading}>
          {/* form="mission-form" triggers the form in MissionDetailsForm */}
          {loading ? "Submitting..." : "Submit Mission"}
        </button>
      </div>
    </div>
  );
}

export default CreateMissionPage;