import React, { useState, useEffect } from 'react';
import '../Styles/createMission.css';

const BASE_URL = "http://localhost/mission-system/PFE_backend/api";

function EmployeeSelection({ onEmployeeSelect }) {

  const [employees, setEmployees] = useState([]);           
  const [searchQuery, setSearchQuery] = useState('');       
  const [selectedEmployee, setSelectedEmployee] = useState(null); 
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(true);      // New: loading state
  const [error, setError] = useState(null);          // New: error state

  // Fetch employees from the new safe endpoint
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${BASE_URL}/admin/get_employees.php`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("✅ Employees loaded successfully:", data);
        
        if (!Array.isArray(data)) {
          throw new Error("API did not return an array");
        }

        setEmployees(data);
      })
      .catch(err => {
        console.error("❌ Failed to load employees:", err);
        setError("Failed to load employees. Please check the backend.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Filter employees based on search
  const filteredEmployees = employees.filter(emp => {
    const fullName = `${emp.first_name || ''} ${emp.last_name || ''}`.trim().toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    const empId = (emp.employee_id || '').toString().toLowerCase();

    return fullName.includes(query) || empId.includes(query);
  });

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowSuggestions(query.trim().length > 0);

    if (!query.trim()) {
      setSelectedEmployee(null);
      onEmployeeSelect?.(null);
    }
  };

  const handleEmployeeSelect = (emp) => {
    setSelectedEmployee(emp);
    setSearchQuery(`${emp.employee_id ? emp.employee_id + ' - ' : ''}${emp.first_name} ${emp.last_name}`);
    setShowSuggestions(false);
    onEmployeeSelect?.(emp);
  };

  const clearSelection = () => {
    setSelectedEmployee(null);
    setSearchQuery('');
    setShowSuggestions(false);
    onEmployeeSelect?.(null);
  };

  return (
    <>
      <div className="section-title">Employee Selection</div>
      <div className="employee-selection">

        {/* Loading State */}
        {loading && <div className="loading">Loading employees...</div>}

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Search Input */}
        <input
          type="text"
          className="search-input"
          placeholder="Search name or employee ID"
          value={searchQuery}
          onChange={handleSearchChange}
          disabled={loading}
        />

        {/* Suggestions Dropdown */}
        {showSuggestions && !loading && filteredEmployees.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.user_id}
                className="suggestion-item"
                onClick={() => handleEmployeeSelect(emp)}
              >
                <div className="avatar-suggestion">
                  {(emp.first_name?.[0] || '')}{(emp.last_name?.[0] || '')}
                </div>
                <div>
                  <div className="suggestion-name">
                    {emp.first_name} {emp.last_name}
                  </div>
                  <div className="suggestion-id">
                    {emp.employee_id || emp.email}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {showSuggestions && !loading && filteredEmployees.length === 0 && searchQuery && (
          <div className="no-results">No employees found</div>
        )}

        {/* Selected Employee Card */}
        {selectedEmployee && (
          <div className="employee-card selected">
            <div className="avatar">
              {selectedEmployee.first_name?.[0]}{selectedEmployee.last_name?.[0]}
            </div>
            <div className="employee-details">
              <div className="employee-info">
                <h3>{selectedEmployee.first_name} {selectedEmployee.last_name}</h3>
                <p>{selectedEmployee.email}</p>
                <span className="department">
                  {selectedEmployee.department_name || 'No department'}
                </span>
              </div>
              <button className="clear-btn" type="button" onClick={clearSelection}>
                × Change
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Status when user typed but nothing selected yet */}
      {!selectedEmployee && searchQuery && !loading && (
        <div className="employee-status no-selection">
          Please select an employee from the list
        </div>
      )}
    </>
  );
}

export default EmployeeSelection;