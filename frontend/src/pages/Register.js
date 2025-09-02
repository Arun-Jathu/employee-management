import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';

// Imports React for component creation, useState for state management,
// react-router-dom for navigation, and axios for API requests

/**
 * Register component for user registration
 */
function Register() {
  // Initialize navigation hook for redirecting after registration
  const navigate = useNavigate();

  // State for form data, error, and success messages
  const [formData, setFormData] = useState({ email: '', password: '' }); // Store form input
  const [error, setError] = useState(''); // Store error messages
  const [success, setSuccess] = useState(''); // Store success messages

  /**
   * Handle changes to form input fields
   */
  const handleChange = (e) => {
    // Update form data state with new input value
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for user registration
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Send POST request to register endpoint
      await axios.post('/api/users/register', formData);
      // Display success message and redirect to login after 2 seconds
      setSuccess('Registration successful! Redirecting to login...');
      setError(''); // Clear any previous errors
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      // Display error from server or generic message
      setError(error.response?.data?.error || 'Failed to register');
      setSuccess(''); // Clear success message
    }
  };

  // Render registration form
  return React.createElement(
    'div',
    { className: 'auth-container' },
    React.createElement(
      'div',
      { className: 'auth-form fade-in' },
      // Form title
      React.createElement('h2', null, 'Sign Up'),
      // Registration form
      React.createElement(
        'form',
        { onSubmit: handleSubmit },
        // Email input field
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', null, 'Email *'),
          React.createElement('input', {
            type: 'email',
            name: 'email',
            value: formData.email,
            onChange: handleChange,
            placeholder: 'Enter email address',
            required: true,
          })
        ),
        // Password input field
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', null, 'Password *'),
          React.createElement('input', {
            type: 'password',
            name: 'password',
            value: formData.password,
            onChange: handleChange,
            placeholder: 'Enter password (min 6 characters)',
            required: true,
          })
        ),
        // Display error message if registration fails
        error &&
          React.createElement('div', { className: 'error-text' }, error),
        // Display success message on successful registration
        success &&
          React.createElement('div', { className: 'success-text' }, success),
        // Submit button
        React.createElement(
          'div',
          { className: 'btn-group' },
          React.createElement(
            'button',
            { type: 'submit', className: 'btn' },
            'Sign Up'
          )
        ),
        // Link to login page
        React.createElement(
          Link,
          { to: '/login', className: 'link' },
          'Already have an account? Sign in'
        )
      )
    )
  );
}

export default Register;