import { useEffect, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Auth/AuthContext"
import axiosClient from "../utils/axoi-client-analytics"

const CounselorAccess = () => {
  const { login } = useContext(AuthContext);
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
   
        login({ token, user_type });

        
        const response = await axiosClient.get("/vpc/me", {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });

       
        console.log("Authenticated user:", response.data);

        navigate("/"); 
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Invalid or expired token.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    authenticateAndFetchUser();
  }, [location.search, login, navigate]);

  if (loading) return <p className="text-center">Authenticating...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return null;
};

export default CounselorAccess;
