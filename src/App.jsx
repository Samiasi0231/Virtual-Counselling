import React, { useEffect } from 'react';
import { Routes,Route,useLocation } from 'react-router-dom';
import './css/style.css';
import ProtectedRoute from './protectedroute/ProtectedRoute';
import UserRehydrator from './utils/UserRedrator';
import UserAccess from './Auth/UserAccess';
import Layout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import CounsellorCards from './pages/counsellor/CounsellorProfileCard';
import CounsellorProfile from "./pages/counsellor/CounselorProfile"
import ChatPage from "./CounsellingChat/pages/ChatPage"
import CounselorAvailability from './pages/counsellor/CounsellorAvailbibilty';
import StudentBooking from './CounsellingChat/StudentBooking';
import StudentjoinLive from "./CounsellingChat/UserGoLive"
import Counsellorjoinlive from "./pages/counsellor/CounselorJoinLive"
import CounsellorList from "./pages/counsellor/CounsellorList"
import CounsellorNote from "./pages/counsellor/CounsellorNote"
import StudentNote from "./CounsellingChat/Studentnote"
import EditMyProfile from './pages/users/EditProfile';

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); 

  return (
    <>
<UserRehydrator/>
      <Routes>
       <Route path='/'element={<UserAccess/>}/>
        <Route path="/unauthorized" element={<p className="p-6 text-red-600">Unauthorized</p>} />
         
 {/* counsellor Protected Route */}
    <Route
    path="/counsellor"
    element={
      <ProtectedRoute allowedRoles={["counsellor"]}>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
     < Route  path='joinlive' element={<Counsellorjoinlive/>}/> 
      < Route  path='chat' element={<ChatPage/>}/>
       <Route exact path="counsellor/card" element={<CounsellorCards/>} />
        <Route path="counsellor/list" element={<CounsellorList/>} />
         < Route  path='calendar' element={<CounselorAvailability/>}/>
         < Route  path='note' element={<CounsellorNote/>}/> 
          < Route  path='edit/profile' element={<EditMyProfile/>}/> 
  </Route>

     
    {/* Student Protected Route */}
    <Route
    path="/student"
    element={
      <ProtectedRoute allowedRoles={["student"]}>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="counsellor/list" element={<CounsellorList/>} />
     <Route exact path="counsellor/card" element={<CounsellorCards/>} />
         <Route  path="Counsellor/profile/:id" element={<CounsellorProfile />} /> 
     < Route path='joinlive' element={<StudentjoinLive/>}/> 
      < Route  path='chat' element={<ChatPage/>}/>
         < Route  path='calendar/:mentor_id' element={<StudentBooking/>}/>
            < Route  path='note' element={<StudentNote/>}/>
  </Route>
      </Routes>
    </>
  );
}

export default App;
