import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../axiosConfig';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', formData);
      setSuccess('Registration successful! Redirecting to login...');
      setError('');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to register');
      setSuccess('');
    }
  };

  return React.createElement(
    'div',
    { className: 'auth-container' },
    React.createElement(
      'div',
      { className: 'auth-form fade-in' },
      React.createElement('h2', null, 'Sign Up'),
      React.createElement(
        'form',
        { onSubmit: handleSubmit },
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
        error &&
          React.createElement('div', { className: 'error-text' }, error),
        success &&
          React.createElement('div', { className: 'success-text' }, success),
        React.createElement(
          'div',
          { className: 'btn-group' },
          React.createElement(
            'button',
            { type: 'submit', className: 'btn' },
            'Sign Up'
          )
        ),
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
