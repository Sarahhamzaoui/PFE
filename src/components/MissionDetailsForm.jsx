import React, { useState, useEffect } from 'react';
import MissionCalendar from './MissionCalendar';

function MissionDetailsForm({ selectedEmployee, onFormDataChange }) {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    employeeDepartment: '',
    destination: '',
    missionTitle: '',
    missionDescription: '',
    duration: '',
    startDate: ''
  });

  // auto fill 
  useEffect(() => {
    if (selectedEmployee) {
      setFormData(prev => ({
        ...prev,
        employeeId: selectedEmployee.employeeId,
        employeeName: selectedEmployee.name,
        employeeDepartment: selectedEmployee.department
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        employeeId: '',
        employeeName: '',
        employeeDepartment: ''
      }));
    }
  }, [selectedEmployee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    onFormDataChange?.(formData); 
  };

  // CANCEL BUTTON - RESET ALL FIELDS TO EMPTY
  const HandleCancel = () => {
    setFormData ({
      employeeId: '',
      employeeName:'',
      employeeDepartment:'',
      destination:'',
      missionTitle:'',
      missionDescription:'',
      startDate:'',
      duration:'',
      startDate:''
    });
  }
  // Clear the selected employee
  if (selectedEmployee) {
    console.log('Form cancelled - all fields cleared');
  }

  return (
    <>
      <div className="section-title">Mission Details</div>
      
      {/* EMPLOYEE INFO - TOP SECTION */}
      <div className="employee-info-section">
        <div className="section-subtitle">Assigned Employee</div>
        <div className="form-row">
          <div className="form-group">
            <label>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              className="form-input readonly"
              value={formData.employeeId}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Employee Name</label>
            <input
              type="text"
              name="employeeName"
              className="form-input readonly"
              value={formData.employeeName}
              readOnly
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="employeeDepartment"
              className="form-input readonly"
              value={formData.employeeDepartment}
              readOnly
            />
          </div>
        </div>
      </div>

      {/* MISSION INFO - BOTTOM SECTION */}
      <div className="mission-info-section">
        <div className="section-subtitle">Mission Information</div>
        <div className="form-row">
          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              className="form-input"
              placeholder="Enter Destination"
              value={formData.destination}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Mission Title</label>
            <input
              type="text"
              name="missionTitle"
              className="form-input"
              placeholder="Enter Mission Title"
              value={formData.missionTitle}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Mission Description</label>
            <textarea
              name="missionDescription"
              className="form-textarea"
              placeholder="Enter mission description..."
              value={formData.missionDescription}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group full-width">
            <MissionCalendar />
          </div>

          <div className="form-group">
            <label>Duration (days)</label>
            <input
              type="number"
              name="duration"
              className="form-input"
              placeholder="15"
              min="1"
              value={formData.duration}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      {/*Buttons Cancel + Submit  */}
      <div className='btn-group'>
        <button type='button' className='btn btn-cancel' onClick={HandleCancel}>
          Cancel
        </button>
        <button type='submit' className='btn btn-submit' >
          Submit Missions
        </button>
        

      </div>
    </>
  );
}

export default MissionDetailsForm;
