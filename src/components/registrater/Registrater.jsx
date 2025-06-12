import React, { useState } from 'react';
import { useAuth } from '../../authcontext/Authcontext';
import { useNavigate } from 'react-router-dom';

export default function RegisterForm() {
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [errors, setErrors] = useState({});
  const { register } = useAuth();
  const navigate = useNavigate();

  // Validate before submission
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email.';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // clear on input
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    register(form);

    if (form.role === 'student') {
      navigate('/login?role=student');
    } else if (form.role === 'counselor') {
      navigate('/login?role=counselor');
    } else {
      navigate('/login');
    }
    
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-100 p-6">
      {/* Image Side */}
      <div className="hidden lg:flex w-full lg:w-1/2 justify-center">
        <img
          src="https://source.unsplash.com/600x600/?university,education"
          alt="register"
          className="rounded-xl shadow-lg max-w-full h-auto"
        />
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>

        {/* Social Sign Up Buttons */}
        <div className="flex flex-col space-y-3 mb-6">
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-medium py-2 rounded-md"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-purple-600 text-white hover:bg-gray-900 py-2 rounded-md"
          >
            <img src="https://www.svgrepo.com/show/349375/github.svg" alt="GitHub" className="w-5 h-5" />
            Sign up with GitHub
          </button>
        </div>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <select
            name="role"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            onChange={handleChange}
            value={form.role}         
         
         
          >
            <option value="student">Select</option>
            <option value="student">Student</option>
            <option value="counselor">Counselor</option>
          </select>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-gray-900 text-white py-3 rounded-md text-lg font-semibold transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
