import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axios-client-analytics";

const StudentAccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const user_type = params.get("user_type");


    const authenticateAndFetchUser = async () => {
      if (!token || !user_type) {
        // navigate("/login");
        return;
      }

      try {
        // Call backend to validate token
        const response = await axiosClient.get(
          `vpc/me/?token=${token}&user_type=${user_type}`
        );

        console.log("Authenticated user:", response);

     

        // Save credentials to localStorage
        localStorage.setItem("USER_ACCESS_TOKEN", token);
        localStorage.setItem("user_type", user_type);

         window.location.href = "/student";
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Invalid or expired token.");
        // navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    authenticateAndFetchUser();
  }, []);

  if (loading) return <p className="text-center">Authenticating...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return null;
};

export default StudentAccess;
