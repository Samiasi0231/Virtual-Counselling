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
import Register from './components/register/Register';
import CounsellorsCard from "./pages/users/CounselorsCard"
import Activity from "./CounsellingChat/pages/ActivityPage"
import ChatPage from "./CounsellingChat/pages/ChatPage"
import ActivityPage from './CounsellingChat/pages/ActivityPage';
import Calendar from './CounsellingChat/Calendar';
import UserGolive from "./CounsellingChat/UserGoLive"
import CounselorGolive from "./CounsellingChat/CounselorGolive"
import StudentList from './CounsellingChat/StudentList';
import CounselorList from "./CounsellingChat/counselorList"
import StudentNote from "./CounsellingChat/Studentnote"

function App() {

  const location = useLocation();

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto'
    window.scroll({ top: 0 })
    document.querySelector('html').style.scrollBehavior = ''
  }, [location.pathname]); 

  return (
    <>
  
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<p className="p-6 text-red-600">Unauthorized</p>} />
         <Route path="" element={<CounsellorLayout />}>
         < Route  path='chat' element={<ChatPage/>}/>
                {/* < Route  path='joinlive' element={<CounselorGolive/>}/>  */}
                    < Route  path='joinlive' element={<UserGolive/>}/>
                     < Route  path='studentlist' element={<StudentList/>}/>
                       < Route  path='studentlist' element={<CounselorList/>}/>
                            {/* < Route  path='counselornote' element={<CounselorNote/>}/> */}
                               < Route  path='counselornote' element={<StudentNote/>}/>
         < Route  path='activity' element={<ActivityPage/>}/>
          < Route  path='calendar' element={<Calendar/>}/>
      <Route exact path="/counsellor/card" element={<CounsellorsCard />} />
    <Route path="/" element={<Dashboard />} />
    <Route path="/counsellor/card" element={<CounsellorsCard />} />
   
    <Route  path="/user/profile" element={<CounselorProfile />} />
    <Route path="/counselor/profile" element={<CounselorProfile />} />
  </Route>

      </Routes>
    </>
  );
}

export default App;
