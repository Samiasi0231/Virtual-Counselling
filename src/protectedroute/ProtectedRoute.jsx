
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useStateValue } from "../Context/UseStateValue";
const ProtectedRoute = ({ allowedRoles, children  }) => {
  const [{ student, counsellor, studentToken, counsellorToken }] = useStateValue();

  const user = student || counsellor;
  const token = studentToken || counsellorToken;
  const userType = student ? "student" : counsellor ? "counsellor" : null;

  if (!token || !user) {
   window.location.href = "https://www.acadaboo.com/user-login";
  return null;
  }

if (!allowedRoles.includes(user?.user_type)) {
  return <Navigate to="/unauthorized" replace />;
}
return children ? children : <Outlet />;
};
export default ProtectedRoute




