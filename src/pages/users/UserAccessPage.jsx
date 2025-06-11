import { useEffect, useState } from "react";
import Accesscbt from "./Accesscbt";
import "./Accesscbt.css";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/store/store";
import { authLogin } from "../../Redux/auth/auth";
import { useNavigate } from "react-router-dom";
 
const Accesspage = () => {
  const [cbtUserUser, setCbtUserUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const navigate = useNavigate();
 
  useEffect(() => {
    handleAuthFetch();
  }, [dispatch]);
 
  const handleAuthFetch = () => {
    const token = localStorage.getItem("cbt_user_token");
 
    dispatch(authLogin(token))
      .then((results) => {
        if (results?.payload?.accountStatus) {
          setCbtUserUser(results?.payload);
        } 
      })
      .finally(() => {
        setLoading(false);
      });
  };
 
  useEffect(() => {
    if (!loading && cbtUserUser) {
      navigate("/home");
    }
  }, [loading, cbtUserUser, navigate]);
 
  return (
    <div className="hero-page">
      <Accesscbt />
    </div>
  );
};
 
export default Accesspage;