
import axios from 'axios';1

const api = axios.create({
  baseURL: '',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;





























// // src/App.jsx
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import StudentDashboard from './pages/StudentDashboard';
// import CounselorDashboard from './pages/CounselorDashboard';
// import ProtectedRoute from './components/ProtectedRoute';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<Login />} />

//         <Route
//           path="/student-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['student']}>
//               <StudentDashboard />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/counselor-dashboard"
//           element={
//             <ProtectedRoute allowedRoles={['counselor']}>
//               <CounselorDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
