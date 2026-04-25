import React, { useState, useEffect } from 'react';
import MissionCalendar from './MissionCalendar';
import '../Styles/MissionDeatilsForm.css';

function MissionDetailsForm({ selectedEmployee, onFormDataChange }) {

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    phoneNumber: '',
    employeeDepartment: '',
    destination: '',
    missionTitle: '',
    missionDescription: '',
    startDate: '',
    endDate: '',
  });

  const [accommodation, setAccommodation] = useState('');
  const [transport, setTransport] = useState('');
  const [needsDriver, setNeedsDriver] = useState(false);
  const [missionurgent, setmissionurgent] = useState(false);

  // auto-fill employee information when an employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      const fullName = `${selectedEmployee.first_name || ''} ${selectedEmployee.last_name || ''}`.trim();

      // use user_id as fallback when employee_id is null/empty
      const displayId = selectedEmployee.employee_id 
        ? selectedEmployee.employee_id 
        : selectedEmployee.user_id || '';

      setFormData(prev => ({
        ...prev,
        employeeId: displayId,
        employeeName: fullName,
        phoneNumber: selectedEmployee.phone || '',
        employeeDepartment: selectedEmployee.department_name || ''
      }));
    } else {
      // clear all employee fields when selection is removed
      setFormData(prev => ({
        ...prev,
        employeeId: '',
        employeeName: '',
        phoneNumber: '',
        employeeDepartment: ''
      }));
    }
  }, [selectedEmployee]);

  // handle changes for editable input fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // submit the complete form data to parent component
  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      accommodation,
      transport,
      needsDriver,
      missionurgent
    };
    onFormDataChange?.(finalData);
  };

  // reset all form fields
  const HandleCancel = () => {
    setFormData({
      employeeId: '',
      employeeName: '',
      phoneNumber: '',
      employeeDepartment: '',
      destination: '',
      missionTitle: '',
      missionDescription: '',
      startDate: '',
      endDate: '',
    });
    setAccommodation('');
    setTransport('');
    setNeedsDriver(false);
    setmissionurgent(false);
  };

  return (
    <form onSubmit={handleSubmit} id="mission-form">
      <div className="section-title">Mission Details</div>

      {/* employee information section */}
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
            <label>Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber" 
              className="form-input readonly"
              value={formData.phoneNumber} 
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

      {/* urgent mission checkbox */}
      <div className="checkbox-group urgent-mission" style={{ marginTop: '8px' }}>
        <label className="checkbox-label">
          Urgent Mission
          <input 
            type="checkbox" 
            checked={missionurgent}
            onChange={(e) => setmissionurgent(e.target.checked)} 
          />
        </label>
      </div>
      <br />

      {/* main mission information */}
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
            <MissionCalendar
              startDate={formData.startDate}
              endDate={formData.endDate}
              onChange={(dates) => setFormData(prev => ({ ...prev, ...dates }))}
            />
          </div>
        </div>
      </div>

      {/* accommodation and transport options */}
      <div className="accommodation-transport-section">
        <div className="section-subtitle">Accommodation & Transport</div>
        <div className="form-row">
          <div className="form-group">
            <label>Accommodation</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="radio" 
                  name="accommodation" 
                  value="hotel"
                  checked={accommodation === 'hotel'}
                  onChange={(e) => setAccommodation(e.target.value)} 
                />
                Hotel
              </label>
              <label className="checkbox-label">
                <input 
                  type="radio" 
                  name="accommodation" 
                  value="residence"
                  checked={accommodation === 'residence'}
                  onChange={(e) => setAccommodation(e.target.value)} 
                />
                Residence
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>Transport</label>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input 
                  type="radio" 
                  name="transport" 
                  value="Plane"
                  checked={transport === 'Plane'}
                  onChange={(e) => { 
                    setTransport(e.target.value); 
                    setNeedsDriver(false); 
                  }} 
                />
                Plane
              </label>
              <label className="checkbox-label">
                <input 
                  type="radio" 
                  name="transport" 
                  value="personal"
                  checked={transport === 'personal'}
                  onChange={(e) => { 
                    setTransport(e.target.value); 
                    setNeedsDriver(false); 
                  }} 
                />
                Personal Car
              </label>
              <label className="checkbox-label">
                <input 
                  type="radio" 
                  name="transport" 
                  value="company"
                  checked={transport === 'company'}
                  onChange={(e) => { 
                    setTransport(e.target.value); 
                    setNeedsDriver(false); 
                  }} 
                />
                Company Car
              </label>
              
            </div>

            {transport === 'company' && (
              <div className="checkbox-group" style={{ marginTop: '8px' }}>
                <label className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={needsDriver}
                    onChange={(e) => setNeedsDriver(e.target.checked)} 
                  />
                  Needs a Driver
                </label>
              </div>
            )}
          </div>
        </div>
      </div>

    </form>
  );
}

export default MissionDetailsForm;