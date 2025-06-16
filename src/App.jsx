import React, { useEffect } from 'react';
import { Routes,Route,useLocation} from 'react-router-dom';
import './css/style.css';
import ProtectedRoute from './protectedroute/ProtectedRoute';
import CounsellorLayout from './layout/CounsellorLayout';
import Dashboard from './pages/Dashboard';
import CounselorProfile from './pages/counsellor/CounselorProfile';
import { AuthProvider } from '../src/authcontext/Authcontext';
import Login from "./components/login/Login"
import Home from './components/home/HomePage';
import Register from './components/registrater/Registrater';
import CounsellorsCard from "./pages/users/CounselorsCard"
import ChatList from "../src/CounsellingChat/ChatList"

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); // triggered on route change

  return (
    <>
  
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<p className="p-6 text-red-600">Unauthorized</p>} />
         <Route path="" element={<CounsellorLayout />}>
    <Route path="/student/dashboard" element={<Dashboard />} />
      <Route exact path="/counsellor/card" element={<CounsellorsCard />} />
       <Route path="/chat" element={<ChatList />} />
    <Route path="/" element={<Dashboard />} />
    <Route path="/counsellor/card" element={<CounsellorsCard />} />
    <Route path="/chat" element={<ChatList />} />
    <Route  path="/user/profile" element={<CounselorProfile />} />
    <Route path="/counselor/profile" element={<CounselorProfile />} />
  </Route>

      </Routes>
    </>
  );
}

export default App;
