import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from '../axiosConfig';

// Configure dependencies for React component
// Imports React for component creation, useState and useEffect for state and lifecycle management,
// react-router-dom for routing, and axios for API requests

/**
 * EmployeeProfile component for displaying an employee's details
 */
function EmployeeProfile() {
  // Extract employee ID from URL parameters
  const { id } = useParams();

  // State for employee data and error handling
  const [employee, setEmployee] = useState(null); // Store fetched employee data
  const [error, setError] = useState(null); // Store error messages

  /**
   * Fetch employee data on component mount or ID change
   */
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        // Fetch employee data from API
        const response = await axios.get(`/api/employees/${id}`);
        // Update employee state with fetched data
        setEmployee(response.data);
      } catch (err) {
        // Handle fetch errors
        setError('Failed to fetch employee');
        console.error(err);
      }
    };
    fetchEmployee();
  }, [id]); // Re-run when employee ID changes

  // Render error message if fetch fails
  if (error) return React.createElement('div', { className: 'error-text' }, error);

  // Render loading state if employee data is not yet fetched
  if (!employee) return React.createElement('div', null, 'Loading...');

  // Render employee profile modal
  return React.createElement(
    'div',
    { className: 'modal-backdrop' },
    React.createElement(
      'div',
      { className: 'modal view-modal' },
      React.createElement(
        'div',
        { className: 'modal-content' },
        // Modal header with title and close button
        React.createElement(
          'div',
          { className: 'modal-header' },
          React.createElement('h2', null, 'Employee Profile'),
          // Close button redirects to employee list
          React.createElement(Link, { to: '/', className: 'close-btn' }, '×')
        ),
        React.createElement(
          'div',
          null,
          // Employee image or placeholder
          React.createElement('img', {
            src: employee.image
              ? `http://localhost:5000/${employee.image}`
              : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E',
            alt: employee.fullName,
          }),
          // Employee details
          React.createElement(
            'div',
            { className: 'info-group' },
            React.createElement('label', { className: 'info-label' }, 'Full Name'),
            React.createElement('p', { className: 'info-value' }, employee.fullName)
          ),
          React.createElement(
            'div',
            { className: 'info-group' },
            React.createElement('label', { className: 'info-label' }, 'Position'),
            React.createElement('p', { className: 'info-value' }, employee.position)
          ),
          React.createElement(
            'div',
            { className: 'info-group' },
            React.createElement('label', { className: 'info-label' }, 'Department'),
            React.createElement('p', { className: 'info-value' }, employee.department)
          ),
          React.createElement(
            'div',
            { className: 'info-group' },
            React.createElement('label', { className: 'info-label' }, 'Email'),
            React.createElement('p', { className: 'info-value' }, employee.email)
          ),
          // Action buttons
          React.createElement(
            'div',
            { className: 'btn-group' },
            // Close button redirects to employee list
            React.createElement(Link, { to: '/', className: 'btn btn-cancel' }, 'Close'),
            // Edit button redirects to edit page
            React.createElement(Link, { to: `/edit/${employee._id}`, className: 'btn btn-save' }, 'Edit Employee')
          )
        )
      )
    )
  );
}

export default EmployeeProfile;