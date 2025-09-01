import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axiosConfig';

function EmployeeList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [department, setDepartment] = useState('');

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(
          `/api/employees${department ? `?department=${department}` : ''}`
        );
        setEmployees(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('Error fetching employees:', error);
        }
      }
    };
    fetchEmployees();
  }, [department, navigate]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await axios.delete(`/api/employees/${id}`);
        setEmployees(employees.filter((emp) => emp._id !== id));
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          console.error('Error deleting employee:', error);
        }
      }
    }
  };

  return React.createElement(
    React.Fragment,
    null,
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
            React.createElement(Link, { to: '/add', className: 'btn' }, '+ Add Employee'),
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
    React.createElement(
      'main',
      null,
      React.createElement(
        'div',
        { className: 'filter-section' },
        React.createElement(
          'div',
          { className: 'flex' },
          React.createElement('label', null, 'Filter by Department:'),
          React.createElement(
            'select',
            { value: department, onChange: (e) => setDepartment(e.target.value) },
            React.createElement('option', { value: '' }, 'All Departments'),
            ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'].map((dept) =>
              React.createElement('option', { value: dept, key: dept }, dept)
            )
          ),
          React.createElement(
            'div',
            { className: 'employee-count' },
            'Total Employees: ',
            React.createElement('span', null, employees.length)
          )
        )
      ),
      employees.length === 0
        ? React.createElement(
            'div',
            { className: 'empty-state' },
            React.createElement('div', { className: 'icon' }, '👥'),
            React.createElement('h3', null, 'No employees found'),
            React.createElement('p', null, 'Start by adding your first employee to the system'),
            React.createElement(Link, { to: '/add', className: 'btn' }, 'Add First Employee')
          )
        : React.createElement(
            'div',
            { className: 'employee-grid' },
            employees.map((employee) =>
              React.createElement(
                'div',
                { key: employee._id, className: 'employee-card' },
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
                    React.createElement(Link, { to: `/employee/${employee._id}`, className: 'btn btn-view' }, 'View'),
                    React.createElement(Link, { to: `/edit/${employee._id}`, className: 'btn btn-edit' }, 'Edit'),
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
