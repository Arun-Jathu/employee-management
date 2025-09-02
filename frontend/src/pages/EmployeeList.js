import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

// Imports React for component creation, useState and useEffect for state and lifecycle management,
// react-router-dom for navigation, and axios for API requests

/**
 * EmployeeList component for displaying and managing employees
 */
function EmployeeList() {
  // Initialize navigation hook for redirecting on logout or unauthorized access
  const navigate = useNavigate();

  // State for employee list and department filter
  const [employees, setEmployees] = useState([]); // Store fetched employees
  const [department, setDepartment] = useState(''); // Store selected department filter

  /**
   * Fetch employees on component mount or department change
   */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Fetch employees from API, with optional department filter
        const response = await axios.get(
          `/api/employees${department ? `?department=${department}` : ''}`
        );
        // Update employee list state
        setEmployees(response.data);
      } catch (error) {
        // Handle unauthorized access (e.g., invalid/expired token)
        if (error.response?.status === 401) {
          localStorage.removeItem('token'); // Clear token
          navigate('/login'); // Redirect to login
        } else {
          // Log other errors
          console.error('Error fetching employees:', error);
        }
      }
    };
    fetchEmployees();
  }, [department, navigate]); // Re-run when department or navigate changes

  /**
   * Handle employee deletion
   */
  const handleDelete = async (id) => {
    // Confirm deletion with user
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        // Send DELETE request to remove employee
        await axios.delete(`/api/employees/${id}`);
        // Remove employee from state
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (error) {
        // Handle unauthorized access
        if (error.response?.status === 401) {
          localStorage.removeItem('token'); // Clear token
          navigate('/login'); // Redirect to login
        } else {
          // Log other errors
          console.error('Error deleting employee:', error);
        }
      }
    }
  };

  // Render header and employee list
  return React.createElement(
    React.Fragment,
    null,
    // Header with title, description, and action buttons
    React.createElement(
      'header',
      null,
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'div',
          { className: 'flex' },
          React.createElement(
            'div',
            null,
            React.createElement('h1', null, 'Employee Management'),
            React.createElement('p', null, 'Manage your team with ease')
          ),
          React.createElement(
            'div',
            null,
            // Link to add employee page
            React.createElement(Link, { to: '/add', className: 'btn' }, '+ Add Employee'),
            // Logout button to clear token and redirect
            React.createElement(
              'button',
              {
                onClick: () => {
                  localStorage.removeItem('token');
                  navigate('/login');
                },
                className: 'btn',
                style: { marginLeft: '1rem' },
              },
              'Logout'
            )
          )
        )
      )
    ),
    // Main content with filter and employee grid
    React.createElement(
      'main',
      null,
      React.createElement(
        'div',
        { className: 'filter-section' },
        React.createElement(
          'div',
          { className: 'flex' },
          // Department filter dropdown
          React.createElement('label', null, 'Filter by Department:'),
          React.createElement(
            'select',
            { value: department, onChange: (e) => setDepartment(e.target.value) },
            React.createElement('option', { value: '' }, 'All Departments'),
            ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'].map((dept) =>
              React.createElement('option', { value: dept, key: dept }, dept)
            )
          ),
          // Display total employee count
          React.createElement(
            'div',
            { className: 'employee-count' },
            'Total Employees: ',
            React.createElement('span', null, employees.length)
          )
        )
      ),
      // Conditional rendering based on employee list
      employees.length === 0
        ? // Empty state for no employees
          React.createElement(
            'div',
            { className: 'empty-state' },
            React.createElement('div', { className: 'icon' }, '👥'),
            React.createElement('h3', null, 'No employees found'),
            React.createElement('p', null, 'Start by adding your first employee to the system'),
            React.createElement(Link, { to: '/add', className: 'btn' }, 'Add First Employee')
          )
        : // Employee grid for non-empty list
          React.createElement(
            'div',
            { className: 'employee-grid' },
            employees.map((employee) =>
              React.createElement(
                'div',
                { key: employee._id, className: 'employee-card' },
                // Employee image placeholder
                React.createElement(
                  'div',
                  null,
                  React.createElement('img', {
                    src: employee.image
                      ? `http://localhost:5000/${employee.image}`
                      : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E',
                    alt: employee.fullName,
                    className: employee.image ? '' : 'placeholder',
                  })
                ),
                // Employee details and action buttons
                React.createElement(
                  'div',
                  null,
                  React.createElement('h3', null, employee.fullName),
                  React.createElement('p', { className: 'position' }, employee.position),
                  React.createElement('p', { className: 'department' }, employee.department),
                  React.createElement('p', { className: 'email' }, employee.email),
                  React.createElement(
                    'div',
                    { className: 'btn-group' },
                    // Links to view or edit employee details
                    React.createElement(Link, { to: `/employee/${employee._id}`, className: 'btn btn-view' }, 'View'),
                    React.createElement(Link, { to: `/edit/${employee._id}`, className: 'btn btn-edit' }, 'Edit'),
                    // Delete button with confirmation message
                    React.createElement(
                      'button',
                      { onClick: () => handleDelete(employee._id), className: 'btn btn-delete' },
                      'Delete'
                    )
                  )
                )
              )
            )
          )
    )
  );
}

export default EmployeeList;