import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../axiosConfig';

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
        setError('Failed to fetch employee');
        console.error(err);
      }
    };
    fetchEmployee();
  }, [id]);

  if (error) return React.createElement('div', { className: 'error-text' }, error);
  if (!employee) return React.createElement('div', null, 'Loading...');

  return React.createElement(
    'div',
    { className: 'modal-backdrop' },
    React.createElement(
      'div',
      { className: 'modal view-modal' },
      React.createElement(
        'div',
        { className: 'modal-content' },
        React.createElement(
          'div',
          { className: 'modal-header' },
          React.createElement('h2', null, 'Employee Profile'),
          React.createElement(Link, { to: '/', className: 'close-btn' }, '×')
        ),
        React.createElement(
          'div',
          null,
          React.createElement('img', {
            src: employee.image
              ? `http://localhost:5000/${employee.image}`
              : 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"%3E%3Cpath stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/%3E%3C/svg%3E',
            alt: employee.fullName,
          }),
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
          React.createElement(
            'div',
            { className: 'btn-group' },
            React.createElement(Link, { to: '/', className: 'btn btn-cancel' }, 'Close'),
            React.createElement(Link, { to: `/edit/${employee._id}`, className: 'btn btn-save' }, 'Edit Employee')
          )
        )
      )
    )
  );
}

export default EmployeeProfile;
