import React, { useState } from "react";
import "./createMissionPage.css";
import EmployeeSelection from "../../components/EmployeeSelection";
import MissionDetailsForm from "../../components/MissionDetailsForm";
import AttachmentsDropzone from "../../components/AttachmentsDropzone";

const BASE_URL = "http://localhost/mission-system/PFE_backend/api";

function CreateMissionPage() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [resetKey, setResetKey] = useState(0); //  forces MissionDetailsForm to remount = reset

  // Gets called when the form is submitted
  const handleSubmit = async (data) => {
    // Basic validation
    if (
      !data.missionTitle ||
      !data.destination ||
      !data.startDate ||
      !data.endDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    // Get the logged-in secretary's user_id from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    // Build the payload matching your missions table columns
    const payload = {
      title: data.missionTitle,
      destination: data.destination,
      start_date: data.startDate,
      end_date: data.endDate,
      objectives: data.missionDescription,
      is_urgent: data.missionurgent ? 1 : 0,
      assigned_to: selectedEmployee?.id ?? null,
      created_by: user?.user_id,
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
        // Save the new mission to localStorage so MyMissions can display it
        const savedMissions = JSON.parse(
          localStorage.getItem("my_missions") || "[]",
        );
        savedMissions.unshift({
          mission_id: result.mission_id,
          title: payload.title,
          destination: payload.destination,
          start_date: payload.start_date,
          end_date: payload.end_date,
          status: "pending",
          created_at: new Date().toISOString(),
        });
        localStorage.setItem("my_missions", JSON.stringify(savedMissions));

        setSuccessMessage("Mission submitted successfully! ✓");

        // Reset form after showing the message
        setTimeout(() => {
          setSuccessMessage(""); // clear message after reset
          setSelectedEmployee(null);
          setResetKey((prev) => prev + 1);
        }, 3000); // show banner for 5 seconds
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
    setResetKey((prev) => prev + 1);
    setSuccessMessage("");
  };

  return (
    <div className="form-container">
      <div className="header">
        <h1>Create Mission</h1>
      </div>

      <EmployeeSelection
        key={"emp-" + resetKey}
        onEmployeeSelect={setSelectedEmployee}
      />

      <MissionDetailsForm
        key={resetKey} /*changing key forces full reset */
        selectedEmployee={selectedEmployee}
        onFormDataChange={handleSubmit}
      />
      <AttachmentsDropzone key={"drop-" + resetKey} />
      {/*  success message */}
      {successMessage && <div className="success-banner">{successMessage}</div>}

      {/* BUTTONS */}
      <div className="btn-group">
        <button type="button" className="btn btn-cancel" onClick={handleCancel}>
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-submit"
          form="mission-form"
          disabled={loading}
        >
          {/* form="mission-form" triggers the form in MissionDetailsForm */}
          {loading ? "Submitting..." : "Submit Mission"}
        </button>
      </div>
    </div>
  );
}

export default CreateMissionPage;
