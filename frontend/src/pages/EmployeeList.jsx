import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [department, setDepartment] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `/api/employees${department ? `?department=${department}` : ""}`
        );
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [department]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await axios.delete(`/api/employees/${id}`);
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <div className="flex">
            <div>
              <h1>Employee Management</h1>
              <p>Manage your team with ease</p>
            </div>
            <Link to="/add" className="btn">
              + Add Employee
            </Link>
          </div>
        </div>
      </header>
      <main>
        <div className="filter-section">
          <div className="flex">
            <label>Filter by Department:</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            <div style={{ marginLeft: "auto" }}>
              Total Employees:{" "}
              <span id="employeeCount">{employees.length}</span>
            </div>
          </div>
        </div>
        {employees.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>No employees found</h3>
            <p>Start by adding your first employee to the system</p>
            <Link to="/add" className="btn">
              Add First Employee
            </Link>
          </div>
        ) : (
          <div className="employee-grid">
            {employees.map((employee) => (
              <div key={employee._id} className="employee-card">
                <div>
                  <img
                    src={
                      employee.image
                        ? `http://localhost:5000/${employee.image}`
                        : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E'
                    }
                    alt={employee.fullName}
                  />
                </div>
                <div>
                  <h3>{employee.fullName}</h3>
                  <p className="position">{employee.position}</p>
                  <p className="department">{employee.department}</p>
                  <p className="email">{employee.email}</p>
                  <div className="btn-group">
                    <Link
                      to={`/employee/${employee._id}`}
                      className="btn btn-view"
                    >
                      View
                    </Link>
                    <Link to={`/edit/${employee._id}`} className="btn btn-edit">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(employee._id)}
                      className="btn btn-delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default EmployeeList;
