import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axios-client-analytics";
import { useStateValue } from "../Context/UseStateValue";

const StudentAccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [, dispatch] = useStateValue();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      console.warn("Missing token");
      setError("Missing credentials.");
window.location.href = `${import.meta.env.VITE_ANALYTIC_BASE_URL}/login`;


      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axiosClient.get("/vpc/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            token,
          },
        });

        const user = res.data;
        console.log("user", user);

       
        const isCounselor = user.is_counselor;
        const userType = isCounselor ? "counsellor" : "student";

        dispatch({
          type: isCounselor ? "SET_COUNSELLOR" : "SET_STUDENT",
          payload: { user, token, user_type: userType,   mentor_id: isCounselor ?  user.item_id : null, },
        });

    
        localStorage.setItem("USER_ACCESS_TOKEN", token);
        localStorage.setItem("user_type", userType); 
        localStorage.setItem("USER_INFO", JSON.stringify(user));
        localStorage.setItem("USER_ROLE", userType);
     if (isCounselor) {
        localStorage.setItem("MENTOR_ID", user.item_id); 
     }


        setLoading(false);
        navigate(`/${userType}`); 
      } catch (err) {
        console.error("Auth failed:", err?.response?.data || err.message);
        setError("Invalid or expired token.");
        setLoading(false);
   window.location.href = `${import.meta.env.VITE_ANALYTIC_BASE_URL}/login`;

      }
    };

    fetchUser();
  }, [location.search]);

  return (
    <div className="text-center text-gray-700">
      {loading ? (
        <p>Authenticating...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : null}
    </div>
  );
};

export default StudentAccess;

























