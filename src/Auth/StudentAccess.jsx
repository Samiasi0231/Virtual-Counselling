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
    const userType = params.get("user_type");

    if (!token || !userType) {
      console.warn("Missing token or user_type");
      setError("Missing credentials.");
    navigate("/login")
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
            user_type: userType,
          },
        });

        const user = res.data;
        console.log("user", res.data);

        if (userType === "student") {
          dispatch({
            type: "SET_STUDENT",
            payload: { user, token, user_type: userType },
          });
        } else if (userType === "counsellor") {
          dispatch({
            type: "SET_COUNSELLOR",
            payload: { user, token, user_type: userType },
          });
        }

        localStorage.setItem("USER_ACCESS_TOKEN", token);
        localStorage.setItem("user_type", userType);
        localStorage.setItem("USER_INFO", JSON.stringify(user));
        localStorage.setItem("USER_ROLE", userType);

        setLoading(false);
        if (userType === "student") {
          navigate("/student");
        } else if (userType === "counsellor") {
          navigate("/counsellor");
        } else {
          navigate("/login");
        }
        

      } catch (err) {
        console.error("Auth failed:", err?.response?.data || err.message);
        setError("Invalid or expired token.");
        setLoading(false);
       navigate("/student")
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
