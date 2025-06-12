import React, { useState } from 'react';
import { useAuth } from '../../../src/authcontext/Authcontext';
import { useNavigate, useLocation } from 'react-router-dom';

export default function LoginForm() {

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  
  const params = new URLSearchParams(location.search);
  const role = params.get('role'); 

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = login(form);
    if (user) {
      navigate(user.role === 'student' ? '/student/dashboard' : '/dashboard');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
        {/* 👋 Dynamic greeting based on role */}
        <h2 className="text-lg font-semibold text-center text-gray-700 mb-2">
          {role === 'counselor'
            ? 'Welcome, Counselor! Please log in.'
            : role === 'student'
            ? 'Welcome, Student! Please log in.'
            : 'Log in to your account'}
        </h2>

        {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm block mb-1 text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="email"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="text-sm block mb-1 text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder="password"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-sm text-white font-medium py-2 rounded transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-500">
          Don’t have an account?{' '}
          <a href="/register" className="text-purple-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
