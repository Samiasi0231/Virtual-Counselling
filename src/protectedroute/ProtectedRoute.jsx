import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext";

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { token, userType } = useContext(AuthContext);

  if (!token) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(userType)) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default RoleProtectedRoute;
