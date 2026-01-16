import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../api/axios";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axiosInstance.get("/api/admin/check_auth/");
        setIsAuth(true);
      } catch {
        setIsAuth(false);
      }
    };
    checkAuth();  
  }, []);
  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
