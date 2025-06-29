
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateValue } from "../Context/UseStateValue";
const ProtectedRoute = ({ allowedRoles, children  }) => {
  const [{ student, counsellor, studentToken, counsellorToken }] = useStateValue();

  const user = student || counsellor;
  const token = studentToken || counsellorToken;
  const userType = student ? "student" : counsellor ? "counsellor" : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

if (!allowedRoles.includes(user?.user_type)) {
  return <Navigate to="/unauthorized" replace />;
}
return children ? children : <Outlet />;
};
export default ProtectedRoute








// import { Navigate } from "react-router-dom";

// const StudentProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem("USER_ACCESS_TOKEN");
//   const userType = localStorage.getItem("user_type");

//   if (!token || userType !== "student") {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children;
// };

// export default StudentProtectedRoute;




