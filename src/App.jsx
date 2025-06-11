import React, { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import './css/style.css';
import './charts/ChartjsConfig';

// Import pages
import CounsellorLayout from './layout/CounsellorLayout';
import Dashboard from './pages/Dashboard';
import CounselorProfile from './pages/counsellor/CounselorProfile';
import UserLayout from "./layout/UserLayout"
import UserDashboard from "./pages/UserDashboard"

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
        <Route path='' element= {<CounsellorLayout />}>
        <Route exact path="/" element={<Dashboard />} />
         <Route  path="/counselor/profile" element={<CounselorProfile />} />
         </Route>

          <Route path='' element= {<UserLayout />}>
        <Route exact path="/user" element={<UserDashboard/>} />
         <Route  path="/user/profile" element={<CounselorProfile />} />
         </Route>
      </Routes>
    </>
  );
}

export default App;
