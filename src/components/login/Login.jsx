


// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import axiosClient from '../../utils/axoi-client-analytics'; 

// export default function LoginForm() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const location = useLocation();

//   const params = new URLSearchParams(location.search);
//   const roleParam = params.get('role');

//     const token = localStorage.getItem('token');

//   if (!token) throw new Error('No token found');

//   const res =  axoisClient.get('/vpc/me', {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await axiosClient.post('', form);
//       const { token, role } = res.data;

//       localStorage.setItem('token', token);
//       localStorage.setItem('role', role);

//       if (role === 'student') {
//         navigate('/student-dashboard');
//       } else if (role === 'counselor') {
//         navigate('/counselor-dashboard');
//       } else {
//         setError('Unknown user role.');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Invalid email or password.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow">
//         <h2 className="text-lg font-semibold text-center text-gray-700 mb-2">
//           {roleParam === 'counselor'
//             ? 'Welcome, Counselor! Please log in.'
//             : roleParam === 'student'
//             ? 'Welcome, Student! Please log in.'
//             : 'Log in to your account'}
//         </h2>

//         {error && <p className="text-sm text-red-500 text-center mb-3">{error}</p>}

//         <form className="space-y-3" onSubmit={handleSubmit}>
//           <div>
//             <label className="text-sm block mb-1 text-gray-600">Email</label>
//             <input
//               type="email"
//               name="email"
//               className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
//               placeholder="email"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label className="text-sm block mb-1 text-gray-600">Password</label>
//             <input
//               type="password"
//               name="password"
//               className="w-full text-sm p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
//               placeholder="password"
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-purple-600 hover:bg-purple-700 text-sm text-white font-medium py-2 rounded transition"
//           >
//             Log In
//           </button>
//         </form>

//         <p className="mt-4 text-center text-xs text-gray-500">
//           Don’t have an account?{' '}
//           <a href="/register" className="text-purple-600 hover:underline">
//             Register
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


/////// src/pages/Login.jsx

// import React, { useState } from 'react';
// import axiosClient from "../../utils/axoi-client-analytics"
// import { useNavigate } from 'react-router-dom';


// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axiosClient.post('/vpc/me', { email, password });
//       const { token, role } = res.data;

//       localStorage.setItem('token', token);
//       localStorage.setItem('role', role);

//       if (role === 'student') {
//         navigate('/student-dashboard');
//       } else if (role === 'counselor') {
//         navigate('/counselor-dashboard');
//       }
//     } catch (err) {
//       setError('Invalid credentials');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-full max-w-sm"
//       >
//         <h2 className="text-2xl mb-4 font-bold text-center">Login</h2>
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full mb-3 p-2 border rounded"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full mb-4 p-2 border rounded"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;

