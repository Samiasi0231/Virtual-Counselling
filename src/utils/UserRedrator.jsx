// src/components/UserRehydrator.jsx
import { useEffect } from "react";
import { useStateValue } from "../Context/UseStateValue";

const UserRehydrator = () => {
  const [, dispatch] = useStateValue();

  useEffect(() => {
    const token = localStorage.getItem("USER_ACCESS_TOKEN");
    const userInfo = localStorage.getItem("USER_INFO");
    const userType = localStorage.getItem("user_type");

    if (token && userInfo && userType) {
      try {
        const user = JSON.parse(userInfo);

        if (userType === "student") {
          dispatch({ type: "SET_STUDENT", payload: { user, token, user_type: userType } });
        } else if (userType === "counsellor") {
          dispatch({ type: "SET_COUNSELLOR", payload: { user, token, user_type: userType } });
        }
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
  }, [dispatch]);

  return null; 
};

export default UserRehydrator;
