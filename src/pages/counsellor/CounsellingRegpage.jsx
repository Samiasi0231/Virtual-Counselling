import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CounselorRegister = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      return setErrorMsg('Passwords do not match.');
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          role: 'counselor',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setErrorMsg(data.message || 'Registration failed');
      }

      setSuccessMsg('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/counselor-login'), 2000);

    } catch (err) {
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-purple-700 text-white">
      {/* Left image section */}
      <div className="w-1/2 flex items-center justify-center bg-purple-800">
        <img 
          src="/images\AcadabooLogo.png" 
          alt="Counselor Visual" 
          className="w-3/4 h-auto object-cover rounded-lg shadow-lg" 
        />
      </div>

      {/* Right form section */}
      <div className="w-1/2 flex items-center justify-center p-10">
        <div className="bg-white text-black p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Register as a Counselor</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required 
              className="w-full px-4 py-2 border border-gray-300 rounded"
            />
            <button 
              type="submit"
              className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
            >
              Register
            </button>
            {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}
            {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CounselorRegister;
