import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function EmployeeProfile() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`/api/employees/${id}`);
        setEmployee(response.data);
      } catch (err) {
        setError("Failed to fetch employee");
        console.error(err);
      }
    };
    fetchEmployee();
  }, [id]);

  if (error) return <div className="error-text">{error}</div>;
  if (!employee) return <div>Loading...</div>;

  return (
    <div className="modal-backdrop">
      <div className="modal view-modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Employee Profile</h2>
            <Link to="/" className="close-btn">
              ×
            </Link>
          </div>
          <div>
            <img
              src={
                employee.image
                  ? `http://localhost:5000/${employee.image}`
                  : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E'
              }
              alt={employee.fullName}
            />
            <div className="info-group">
              <label className="info-label">Full Name</label>
              <p className="info-value">{employee.fullName}</p>
            </div>
            <div className="info-group">
              <label className="info-label">Position</label>
              <p className="info-value">{employee.position}</p>
            </div>
            <div className="info-group">
              <label className="info-label">Department</label>
              <p className="info-value">{employee.department}</p>
            </div>
            <div className="info-group">
              <label className="info-label">Email</label>
              <p className="info-value">{employee.email}</p>
            </div>
            <div className="btn-group">
              <Link to="/" className="btn btn-cancel">
                Close
              </Link>
              <Link to={`/edit/${employee._id}`} className="btn btn-save">
                Edit Employee
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
