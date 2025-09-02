import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';

// Imports React for component creation, useState for state management,
// react-router-dom for navigation, and axios for API requests

/**
 * Login component for user authentication
 */
function Login() {
  // Initialize navigation hook for redirecting after login
  const navigate = useNavigate();

  // State for form data, error messages, and password visibility
  const [formData, setFormData] = useState({ email: '', password: '' }); // Store form input
  const [error, setError] = useState(''); // Store error messages
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility

  /**
   * Handle changes to form input fields
   */
  const handleChange = (e) => {
    // Update form data state with new input value
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /**
   * Handle form submission for user login
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Send POST request to login endpoint
      const response = await axios.post('/api/users/login', formData);
      // Store JWT token in localStorage
      localStorage.setItem('token', response.data.token);
      setError(''); // Clear any previous errors
      // Redirect to employee list on success
      navigate('/');
    } catch (err) {
      // Display error from server or generic message
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  /**
   * Toggle password visibility
   */
  const togglePassword = () => {
    // Switch between showing and hiding password
    setShowPassword(!showPassword);
  };

  // Render login form
  return React.createElement(
    'div',
    { className: 'min-h-screen auth-container flex items-center justify-center p-4' },
    React.createElement(
      'div',
      { className: 'max-w-md w-full' },
      React.createElement(
        'div',
        { className: 'bg-white rounded-2xl shadow-2xl p-8 fade-in' },
        // Header with icon, title, and description
        React.createElement(
          'div',
          { className: 'text-center mb-8' },
          React.createElement(
            'div',
            { className: 'bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4' },
            // User icon for login
            React.createElement(
              'svg',
              { className: 'w-8 h-8 text-indigo-600', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
              React.createElement('path', {
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: '2',
                d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
              })
            )
          ),
          React.createElement('h2', { className: 'text-3xl font-bold text-gray-900 mb-2' }, 'Welcome Back'),
          React.createElement('p', { className: 'text-gray-600' }, 'Sign in to your account to continue')
        ),
        // Login form
        React.createElement(
          'form',
          { onSubmit: handleSubmit, className: 'space-y-6' },
          // Email input field
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Email Address'),
            React.createElement('input', {
              type: 'email',
              name: 'email',
              value: formData.email,
              onChange: handleChange,
              required: true,
              className: 'w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
              placeholder: 'Enter your email'
            })
          ),
          // Password input field with visibility toggle
          React.createElement(
            'div',
            null,
            React.createElement('label', { className: 'block text-sm font-semibold text-gray-700 mb-2' }, 'Password'),
            React.createElement(
              'div',
              { className: 'relative' },
              React.createElement('input', {
                type: showPassword ? 'text' : 'password',
                name: 'password',
                value: formData.password,
                onChange: handleChange,
                required: true,
                className: 'w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors',
                placeholder: 'Enter your password'
              }),
              // Button to toggle password visibility
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: togglePassword,
                  className: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                },
                // Eye icon for visibility toggle
                React.createElement(
                  'svg',
                  { className: 'w-5 h-5', fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' },
                  React.createElement('path', {
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '2',
                    d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                  }),
                  React.createElement('path', {
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '2',
                    d: 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                  })
                )
              )
            )
          ),
          // Display error message if login fails
          error && React.createElement('div', { className: 'text-red-600 text-sm' }, error),
          // Remember me checkbox and forgot password link
          React.createElement(
            'div',
            { className: 'flex items-center justify-between' },
            React.createElement(
              'label',
              { className: 'flex items-center' },
              React.createElement('input', {
                type: 'checkbox',
                className: 'rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              }),
              React.createElement('span', { className: 'ml-2 text-sm text-gray-600' }, 'Remember me')
            ),
            React.createElement(
              'a',
              { href: '#', className: 'text-sm text-indigo-600 hover:text-indigo-500 font-semibold' },
              'Forgot password?'
            )
          ),
          // Submit button
          React.createElement(
            'button',
            {
              type: 'submit',
              className: 'w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors transform hover:scale-105 duration-200'
            },
            'Sign In'
          )
        ),
        // Link to registration page
        React.createElement(
          'div',
          { className: 'mt-8 text-center' },
          React.createElement(
            'p',
            { className: 'text-gray-600' },
            'Don\'t have an account? ',
            React.createElement(
              Link,
              { to: '/register', className: 'text-indigo-600 hover:text-indigo-500 font-semibold' },
              'Sign up'
            )
          )
        )
      )
    )
  );
}

export default Login;