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
       navigate("/login")
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



//import { useNavigate, useLocation } from "react-router-dom";

// import { useEffect, useState } from "react";
// import axiosClient from "../utils/axios-client-analytics";
// import { useStateValue } from "../Context/UseStateValue";
// import {jwtDecode} from "jwt-decode";

// const StudentAccess = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [, dispatch] = useStateValue();
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const token = params.get("token");

//     if (!token) {
//       console.warn("Missing token");
//       setError("Missing credentials.");
//       navigate("/login");
//       return;
//     }

//     // Decode token to get user_type
//     let userType = "";
//     try {
//       const decoded = jwtDecode(token);
//       userType = decoded.user_type || decoded.role || ""; 
//     } catch (err) {
//       console.error("Token decode failed:", err);
//       setError("Invalid token.");
//       navigate("/login");
//       return;
//     }

//     if (!userType) {
//       setError("User type not found in token.");
//       navigate("/login");
//       return;
//     }

//     localStorage.setItem("USER_ACCESS_TOKEN", token);

//     const fetchUser = async () => {
//       try {
//         const res = await axiosClient.get("/vpc/me/");
//         const user = res.data;
//         console.log("user", user);

//         dispatch({
//           type: userType === "student" ? "SET_STUDENT" : "SET_COUNSELLOR",
//           payload: { user, token, user_type: userType },
//         });

//         localStorage.setItem("user_type", userType);
//         localStorage.setItem("USER_INFO", JSON.stringify(user));
//         localStorage.setItem("USER_ROLE", userType);

//         setLoading(false);
//         navigate(`/${userType}`, { replace: true });

//       } catch (err) {
//         console.error("Auth failed:", err?.response?.data || err.message);
//         setError("Invalid or expired token.");
//         setLoading(false);
//         navigate("/login");
//       }
//     };

//     fetchUser();
//   }, [location.search]);

//   return (
//     <div className="text-center text-gray-700">
//       {loading ? (
//         <p>Authenticating...</p>
//       ) : error ? (
//         <p className="text-red-500">{error}</p>
//       ) : null}
//     </div>
//   );
// };

// export default StudentAccess;
