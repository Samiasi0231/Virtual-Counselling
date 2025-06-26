import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../utils/axios-client-analytics";

const CounsellorAccess = () => {
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
        navigate("/login");
        return;
      }

      try {
       
        localStorage.setItem("USER_ACCESS_TOKEN", token);
        localStorage.setItem("user_type", user_type);

      
        const response = await axiosClient.get("/vpc/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Authenticated user:", response.data);

     
        window.location.href = "/Counsellor";
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Invalid or expired token.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    authenticateAndFetchUser();
  }, [location.search, navigate]);

  if (loading) return <p className="text-center">Authenticating...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return null;
};

export default CounsellorAccess;
