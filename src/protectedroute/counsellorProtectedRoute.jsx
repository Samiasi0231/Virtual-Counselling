
import { Navigate } from "react-router-dom";

const StudentProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("USER_ACCESS_TOKEN");
  const userType = localStorage.getItem("user_type");

  if (!token || userType !== "Counsellor") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default StudentProtectedRoute;

