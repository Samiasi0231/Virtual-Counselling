import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useStateValue } from "./StateProvider";

const ContextProvider = ({ children }) => {
 const [state, dispatch] = useStateValue();

  const location = useLocation();

  useEffect(() => {
    // 1. Get token from URL: e.g. ?token=abc123
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    if (token) {
      // 2. Fetch user from your API using Bearer token
      fetch("https://your-api.com/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // 3. Save user to global state
          dispatch({
            type: "SET_USER",
            payload: data,
          });
        })
        .catch((err) => {
          console.error("Failed to fetch user:", err);
        });
    }
  }, [location.search, dispatch]);

  return children;
};

export default ContextProvider;
