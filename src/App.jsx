import React, { useEffect } from 'react';
import { Routes,Route,useLocation } from 'react-router-dom';
import './css/style.css';
import Login from "./components/login/Login"
import ProtectedRoute from './protectedroute/ProtectedRoute';
import UserRehydrator from './utils/UserRedrator';
import CounsellorAccess from './Auth/CounsellorAccess';
import StudentAccess from './Auth/StudentAccess';
import CounsellorLayout from './layout/Layout';
import Dashboard from './pages/Dashboard';
import CounsellorCards from './pages/counsellor/CounsellorProfileCard';
import CounsellorProfile from "./pages/counsellor/CounselorProfile"
import ChatPage from "./CounsellingChat/pages/ChatPage"
import ActivityPage from './CounsellingChat/ActivityPage';
import Calendar from './CounsellingChat/Calendar';
import StudentjoinLive from "./CounsellingChat/UserGoLive"
import Counsellorjoinlive from "./pages/counsellor/CounselorJoinLive"
import CounselorList from "./pages/counsellor/CounsellorList"
import CounsellorNote from "./pages/counsellor/CounsellorNote"
import StudentNote from "./CounsellingChat/Studentnote"
import  FeedBack from "./pages/users/FeedBack"

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

  <Route path='/login'element={<Login/>}/>
       <Route path='/counsellor/access'element={<CounsellorAccess/>}/>
       
         <Route path="/student/access" element={<StudentAccess />} />

        <Route path="/unauthorized" element={<p className="p-6 text-red-600">Unauthorized</p>} />
         
          {/* counsellor Protected Route */}
    <Route
    path="/counsellor"
    element={
      <ProtectedRoute allowedRoles={["counsellor"]}>
        <CounsellorLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
     < Route  path='joinlive' element={<Counsellorjoinlive/>}/> 
      < Route  path='chat' element={<ChatPage/>}/>
         < Route  path='calendar' element={<Calendar/>}/>
         < Route  path='counsellornote' element={<CounsellorNote/>}/> 
              < Route  path='activity' element={<ActivityPage/>}/>
               {/* <Route  path="profile" element={<CounselorProfile/>} /> */}
                 < Route  path='feedback' element={<FeedBack/>}/>
  </Route>

     
    {/* Student Protected Route */}
    <Route
    path="/student"
    element={
      <ProtectedRoute allowedRoles={["student"]}>
        <CounsellorLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Dashboard />} />
    <Route path="counsellorlist" element={<CounselorList/>} />
     <Route exact path="counsellor/card" element={<CounsellorCards/>} />
         <Route  path="profile" element={<CounsellorProfile />} /> 
     < Route  path='joinlive' element={<StudentjoinLive/>}/> 
      < Route  path='chat' element={<ChatPage/>}/>
         < Route  path='calendar' element={<Calendar/>}/>
            < Route  path='note' element={<StudentNote/>}/>
              < Route  path='activity' element={<ActivityPage/>}/>
                 < Route  path='feedback' element={<FeedBack/>}/>
  </Route>
       

      </Routes>
    

    </>
  );
}

export default App;
