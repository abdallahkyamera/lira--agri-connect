

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    location: '',
    role: 'farmer',
    national_id: '',
    trade_license: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        location: formData.location,
        national_id: formData.national_id,
        trade_license: formData.trade_license
      };

      console.log('Sending:', payload);

      await registerUser(payload);

      alert('Registration successful!');

      navigate('/login');
    } catch (err) {
      console.error(err.response?.data);

      if (err.response?.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #166534 0%, #4ade80 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '550px',
          background: '#fff',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            color: '#166534'
          }}
        >
          Lira Agri-Connect
        </h1>

        <h2
          style={{
            textAlign: 'center',
            marginBottom: '30px'
          }}
        >
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="location"
            placeholder="Location (District)"
            value={formData.location}
            onChange={handleChange}
            style={inputStyle}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>


              {/* National ID — Farmer and Buyer */}
          {(formData.role === 'farmer' || formData.role === 'buyer') && (
            <input
              type="text"
              name="national_id"
              placeholder="National ID"
              value={formData.national_id}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          )}

            {/* Trade License — Farmer only */}
          {formData.role === 'farmer' && (
              <input
                type="text"
                name="trade_license"
                placeholder="Trade License"
                value={formData.trade_license}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            )}

          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {error && (
            <p
              style={{
                color: 'red',
                textAlign: 'center',
                marginBottom: '15px'
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px',
              border: 'none',
              borderRadius: '10px',
              background: '#166534',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px'
          }}
        >
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{
              color: '#166534',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '14px',
  marginBottom: '15px',
  borderRadius: '10px',
  border: '1px solid #ddd',
  fontSize: '15px',
  boxSizing: 'border-box'
};

export default Register;


